import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createVerify, randomUUID } from "node:crypto";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import { pool } from "../config/db";
import { env } from "../config/env";
import { USER_ROLES, type UserRole } from "../types/user";
import { requireAuth, type AuthRequest } from "../middlewares/auth";
import { authLimiter, oauthLimiter } from "../middlewares/rateLimiter";

const router = Router();

// Password validation: at least 8 chars, 1 uppercase, 1 number, 1 special char
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRegex,
      "Password must contain 1 uppercase letter, 1 number, and 1 special character"
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(USER_ROLES).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password required"),
});

const googleOAuthSchema = z.object({
  token: z.string().min(1, "Google token required"),
});

const GOOGLE_TOKEN_CLOCK_SKEW_SECS = 600;
const GOOGLE_TOKEN_MAX_FUTURE_EXP_SECS = 60 * 60 * 24;

// Google OAuth client (used only for ID token verification)
const googleClient = env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(env.GOOGLE_CLIENT_ID)
  : null;

const safeClientIdPreview = (id: string) => {
  const trimmed = id?.trim();
  if (!trimmed) return "(empty)";
  if (trimmed.length <= 8) return trimmed;
  return `${trimmed.slice(0, 4)}…${trimmed.slice(-4)}`;
};

const base64UrlDecodeJson = (input: string): any | null => {
  try {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad =
      normalized.length % 4 === 0
        ? ""
        : "=".repeat(4 - (normalized.length % 4));
    const str = Buffer.from(normalized + pad, "base64").toString("utf8");
    return JSON.parse(str);
  } catch {
    return null;
  }
};

const base64UrlToBuffer = (input: string) => {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, "base64");
};

const verifyGoogleIdToken = async (token: string, audience: string) => {
  if (!googleClient) {
    throw new Error("Google OAuth client not configured");
  }

  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const [headerB64, payloadB64, signatureB64] = tokenParts;
  const header = base64UrlDecodeJson(headerB64);
  const payload = base64UrlDecodeJson(payloadB64);

  if (!header || !payload) {
    throw new Error("Invalid Google token payload");
  }

  if (header.alg !== "RS256") {
    throw new Error(`Unsupported token algorithm: ${header.alg ?? "unknown"}`);
  }

  const { certs } = await googleClient.getFederatedSignonCertsAsync();
  const certMap = certs as Record<string, string>;
  const cert = certMap[String(header.kid)];

  if (!cert) {
    throw new Error("No certificate found for token key id");
  }

  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${headerB64}.${payloadB64}`);
  verifier.end();

  if (!verifier.verify(cert as string, base64UrlToBuffer(signatureB64))) {
    throw new Error("Invalid token signature");
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const issuedAt = Number(payload.iat);
  const expiresAt = Number(payload.exp);

  if (!Number.isFinite(issuedAt)) {
    throw new Error("Token missing valid issue time");
  }

  if (!Number.isFinite(expiresAt)) {
    throw new Error("Token missing valid expiration time");
  }

  if (expiresAt >= nowSeconds + GOOGLE_TOKEN_MAX_FUTURE_EXP_SECS) {
    throw new Error("Token expiration time is too far in the future");
  }

  const allowedStart = issuedAt - GOOGLE_TOKEN_CLOCK_SKEW_SECS;
  const allowedEnd = expiresAt + GOOGLE_TOKEN_CLOCK_SKEW_SECS;

  if (nowSeconds < allowedStart) {
    throw new Error(`Token used too early, ${nowSeconds} < ${allowedStart}`);
  }

  if (nowSeconds > allowedEnd) {
    throw new Error(`Token used too late, ${nowSeconds} > ${allowedEnd}`);
  }

  if (payload.iss !== "https://accounts.google.com" && payload.iss !== "accounts.google.com") {
    throw new Error(`Invalid issuer: ${payload.iss ?? "unknown"}`);
  }

  if (payload.aud !== audience) {
    throw new Error("Wrong recipient, payload audience != requiredAudience");
  }

  return payload;
};

// POST /register - Create new account with email/password
router.post("/register", authLimiter, async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);

    const existingUser = await pool.query<{ id: string }>(
      `SELECT id FROM users WHERE lower(email) = lower($1) LIMIT 1`,
      [body.email]
    );

    if (existingUser.rows.length > 0) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const userId = randomUUID();
    const role: UserRole = body.role ?? "STUDENT";

    const createdUser = await pool.query<{
      id: string;
      email: string;
      name: string;
      role: UserRole;
    }>(
      `
        INSERT INTO users (id, email, password, name, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, name, role
      `,
      [userId, body.email, hashedPassword, body.name, role]
    );

    const user = createdUser.rows[0];

    const userJwt = jwt.sign(
      { userId: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token: userJwt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// POST /login - Login with email/password
router.post("/login", authLimiter, async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);

    const userResult = await pool.query<{
      id: string;
      email: string;
      password: string | null;
      name: string;
      role: UserRole;
    }>(
      `
        SELECT id, email, password, name, role
        FROM users
        WHERE lower(email) = lower($1)
        LIMIT 1
      `,
      [body.email]
    );

    const user = userResult.rows[0];

    if (!user || !user.password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const userJwt = jwt.sign(
      { userId: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token: userJwt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// GET /me - Return the currently authenticated user
router.get("/me", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const userResult = await pool.query<{
      id: string;
      email: string;
      name: string;
      role: UserRole;
    }>(
      `
        SELECT id, email, name, role
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [req.user?.userId]
    );

    const user = userResult.rows[0];

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /google - Google OAuth login/register (ID token verification)
router.post("/google", oauthLimiter, async (req, res, next) => {
  try {
    const googleClientId = env.GOOGLE_CLIENT_ID;
    if (!googleClient || !googleClientId) {
      res.status(501).json({ message: "Google OAuth not configured" });
      return;
    }

    const body = googleOAuthSchema.parse(req.body);
    const token = body.token;
    const tokenParts = token.split(".");

    console.info("[auth/google] received token", {
      present: token.length > 0,
      tokenLength: token.length,
      tokenDotParts: tokenParts.length,
      tokenPreview: `${token.slice(0, 20)}…${token.slice(-20)}`,
      backendGoogleClientId: safeClientIdPreview(googleClientId),
    });

    if (tokenParts.length !== 3) {
      res.status(400).json({ message: "Invalid token format (expected Google ID token JWT)" });
      return;
    }

    const decodedHeader = base64UrlDecodeJson(tokenParts[0]);
    const decodedPayload = base64UrlDecodeJson(tokenParts[1]);

    console.info("[auth/google] decoded JWT claims (UNVERIFIED)", {
      decodedHeader,
      decodedPayload,
      decodedAud: decodedPayload?.aud,
      decodedIss: decodedPayload?.iss,
      decodedEmail: decodedPayload?.email,
      decodedSub: decodedPayload?.sub,
    });

    try {
      const payload = await verifyGoogleIdToken(token, googleClientId);
      const { sub: googleUserId, email, name: googleName } = payload;

      if (!email) {
        res.status(400).json({ message: "Google account must have an email" });
        return;
      }

      const existingIdentity = await pool.query<{ user_id: string }>(
        `SELECT user_id FROM oauth_identities WHERE provider = 'google' AND provider_user_id = $1`,
        [googleUserId]
      );

      if (existingIdentity.rows.length > 0) {
        const userId = existingIdentity.rows[0].user_id;
        const user = await pool.query<{
          id: string;
          email: string;
          name: string;
          role: UserRole;
        }>(`SELECT id, email, name, role FROM users WHERE id = $1`, [userId]);

        if (user.rows.length === 0) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        const userRecord = user.rows[0];
        const userJwt = jwt.sign(
          { userId: userRecord.id, role: userRecord.role },
          env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.status(200).json({
          token: userJwt,
          user: {
            id: userRecord.id,
            email: userRecord.email,
            name: userRecord.name,
            role: userRecord.role,
          },
        });
        return;
      }

      const existingUser = await pool.query<{
        id: string;
        name: string;
        role: UserRole;
      }>(`SELECT id, name, role FROM users WHERE lower(email) = lower($1)`, [email]);

      let userId: string;
      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id;
      } else {
        userId = randomUUID();
        const displayName = googleName || email.split("@")[0];

        await pool.query(`INSERT INTO users (id, email, name, role) VALUES ($1, $2, $3, $4)`, [
          userId,
          email,
          displayName,
          "STUDENT"
        ]);
      }

      await pool.query(
        `
          INSERT INTO oauth_identities (id, user_id, provider, provider_user_id, provider_email)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (provider, provider_user_id) DO UPDATE
          SET provider_email = $5, updated_at = now()
        `,
        [randomUUID(), userId, "google", googleUserId, email]
      );

      const finalUser = await pool.query<{
        id: string;
        email: string;
        name: string;
        role: UserRole;
      }>(`SELECT id, email, name, role FROM users WHERE id = $1`, [userId]);

      if (finalUser.rows.length === 0) {
        res.status(404).json({ message: "User not found after OAuth linking" });
        return;
      }

      const userRecord = finalUser.rows[0];
      const userJwt = jwt.sign(
        { userId: userRecord.id, role: userRecord.role },
        env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        token: userJwt,
        user: {
          id: userRecord.id,
          email: userRecord.email,
          name: userRecord.name,
          role: userRecord.role,
        },
      });
      return;
    } catch (verifyErr) {
      const err = verifyErr as any;
      console.error("[auth/google] verifyGoogleIdToken failed", {
        errName: err?.name,
        errMessage: err?.message,
        errCode: err?.code,
        errors: err?.errors,
        attemptedAudience: googleClientId,
        decodedAudFromToken: decodedPayload?.aud,
        decodedIssFromToken: decodedPayload?.iss,
      });

      res.status(401).json({ message: "Invalid Google token" });
      return;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    next(error);
  }
});

export default router;

