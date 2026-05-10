import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db";
import { requireAuth, requireRole, type AuthRequest } from "../middlewares/auth";

const router = Router();

const verifyReasonSchema = z.object({
  reason: z.string().trim().max(500).optional()
});

router.get("/landlord", requireAuth, requireRole(["LANDLORD"]), async (req: AuthRequest, res, next) => {
  try {
    const landlordId = req.user!.userId;

    const [summaryResult, hostelsResult, bookingsResult] = await Promise.all([
      pool.query(
        `
          SELECT
            COUNT(*)::int AS "totalHostels",
            COUNT(*) FILTER (WHERE is_verified) ::int AS "verifiedHostels",
            COUNT(*) FILTER (WHERE NOT is_verified) ::int AS "pendingHostels"
          FROM hostels
          WHERE landlord_id = $1 AND deleted_at IS NULL
        `,
        [landlordId]
      ),
      pool.query(
        `
          SELECT
            h.id,
            h.name,
            h.address,
            h.is_verified AS "isVerified",
            h.hostel_status AS "hostelStatus",
            h.created_at AS "createdAt",
            (
              SELECT COUNT(*)::int
              FROM rooms r
              WHERE r.hostel_id = h.id AND r.deleted_at IS NULL
            ) AS "roomCount",
            (
              SELECT COUNT(*)::int
              FROM rooms r
              WHERE r.hostel_id = h.id AND r.deleted_at IS NULL AND r.verified_by IS NULL
            ) AS "pendingRoomCount",
            (
              SELECT COALESCE(MIN(price_per_semester), 0)::text
              FROM rooms r
              WHERE r.hostel_id = h.id AND r.deleted_at IS NULL
            ) AS "minPrice",
            (
              SELECT COUNT(*)::int
              FROM bookings b
              WHERE b.hostel_id = h.id AND b.deleted_at IS NULL
            ) AS "bookingCount"
          FROM hostels h
          WHERE h.landlord_id = $1 AND h.deleted_at IS NULL
          ORDER BY h.created_at DESC
        `,
        [landlordId]
      ),
      pool.query(
        `
          SELECT
            b.id,
            b.booking_reference AS "bookingReference",
            b.booking_status AS "bookingStatus",
            b.payment_status AS "paymentStatus",
            b.total_amount AS "totalAmount",
            b.currency,
            b.created_at AS "createdAt",
            u.name AS "studentName",
            h.name AS "hostelName"
          FROM bookings b
          JOIN hostels h ON h.id = b.hostel_id
          JOIN users u ON u.id = b.student_id
          WHERE h.landlord_id = $1 AND b.deleted_at IS NULL
          ORDER BY b.created_at DESC
          LIMIT 10
        `,
        [landlordId]
      )
    ]);

    const revenueResult = await pool.query(
      `
        SELECT COALESCE(SUM(b.total_amount), 0)::numeric(12,2) AS revenue
        FROM bookings b
        JOIN hostels h ON h.id = b.hostel_id
        WHERE h.landlord_id = $1 AND b.deleted_at IS NULL AND b.payment_status = 'PAID'
      `,
      [landlordId]
    );

    const roomCountResult = await pool.query(
      `
        SELECT COUNT(*)::int AS "totalRooms"
        FROM rooms r
        JOIN hostels h ON h.id = r.hostel_id
        WHERE h.landlord_id = $1 AND r.deleted_at IS NULL
      `,
      [landlordId]
    );

    const pendingRoomCountResult = await pool.query(
      `
        SELECT COUNT(*)::int AS "pendingRooms"
        FROM rooms r
        JOIN hostels h ON h.id = r.hostel_id
        WHERE h.landlord_id = $1 AND r.deleted_at IS NULL AND r.verified_by IS NULL
      `,
      [landlordId]
    );

    const bookingStatsResult = await pool.query(
      `
        SELECT
          COUNT(*)::int AS "totalBookings",
          COUNT(*) FILTER (WHERE booking_status IN ('PENDING', 'AWAITING_PAYMENT'))::int AS "pendingBookings"
        FROM bookings b
        JOIN hostels h ON h.id = b.hostel_id
        WHERE h.landlord_id = $1 AND b.deleted_at IS NULL
      `,
      [landlordId]
    );

    res.status(200).json({
      data: {
        summary: {
          ...summaryResult.rows[0],
          ...roomCountResult.rows[0],
          ...pendingRoomCountResult.rows[0],
          ...bookingStatsResult.rows[0],
          revenue: revenueResult.rows[0].revenue
        },
        hostels: hostelsResult.rows,
        bookings: bookingsResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/admin", requireAuth, requireRole(["ADMIN"]), async (_req, res, next) => {
  try {
    const [summaryResult, hostelsResult, roomsResult, bookingsResult, usersResult] = await Promise.all([
      pool.query(
        `
          SELECT
            COUNT(*)::int AS "totalHostels",
            COUNT(*) FILTER (WHERE hostel_status = 'PENDING_APPROVAL')::int AS "pendingHostels",
            COUNT(*) FILTER (WHERE is_verified)::int AS "verifiedHostels"
          FROM hostels
          WHERE deleted_at IS NULL
        `
      ),
      pool.query(
        `
          SELECT
            h.id,
            h.name,
            h.address,
            h.hostel_status AS "hostelStatus",
            h.is_verified AS "isVerified",
            h.created_at AS "createdAt",
            u.name AS "landlordName",
            (
              SELECT COUNT(*)::int
              FROM rooms r
              WHERE r.hostel_id = h.id AND r.deleted_at IS NULL
            ) AS "roomCount",
            (
              SELECT COALESCE(MIN(price_per_semester), 0)::text
              FROM rooms r
              WHERE r.hostel_id = h.id AND r.deleted_at IS NULL
            ) AS "minPrice"
          FROM hostels h
          JOIN users u ON u.id = h.landlord_id
          WHERE h.deleted_at IS NULL AND h.hostel_status = 'PENDING_APPROVAL'
          ORDER BY h.created_at ASC
          LIMIT 12
        `
      ),
      pool.query(
        `
          SELECT
            r.id,
            r.room_number AS "roomNumber",
            r.type,
            r.price_per_semester::text AS "pricePerSemester",
            r.available_beds AS "availableBeds",
            h.id AS "hostelId",
            h.name AS "hostelName",
            u.name AS "landlordName"
          FROM rooms r
          JOIN hostels h ON h.id = r.hostel_id
          JOIN users u ON u.id = h.landlord_id
          WHERE r.deleted_at IS NULL AND r.verified_by IS NULL
          ORDER BY r.created_at ASC
          LIMIT 12
        `
      ),
      pool.query(
        `
          SELECT
            COUNT(*)::int AS "totalBookings",
            COUNT(*) FILTER (WHERE booking_status IN ('PENDING', 'AWAITING_PAYMENT'))::int AS "pendingBookings"
          FROM bookings
          WHERE deleted_at IS NULL
        `
      ),
      pool.query(
        `
          SELECT
            COUNT(*)::int AS "totalUsers",
            COUNT(*) FILTER (WHERE role = 'STUDENT')::int AS "students",
            COUNT(*) FILTER (WHERE role = 'LANDLORD')::int AS "landlords",
            COUNT(*) FILTER (WHERE role = 'ADMIN')::int AS "admins"
          FROM users
          WHERE deleted_at IS NULL
        `
      )
    ]);

    res.status(200).json({
      data: {
        summary: {
          ...summaryResult.rows[0],
          ...bookingsResult.rows[0],
          ...usersResult.rows[0]
        },
        pendingHostels: hostelsResult.rows,
        pendingRooms: roomsResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

router.put("/admin/hostels/:id/verify", requireAuth, requireRole(["ADMIN"]), async (req: AuthRequest, res, next) => {
  try {
    const hostelId = req.params.id;

    const updated = await pool.query(
      `
        UPDATE hostels
        SET is_verified = true,
            hostel_status = 'ACTIVE',
            approved_by = $2,
            approved_at = now(),
            rejection_reason = NULL,
            updated_at = now()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id
      `,
      [hostelId, req.user!.userId]
    );

    if (updated.rows.length === 0) {
      res.status(404).json({ message: "Hostel not found" });
      return;
    }

    res.status(200).json({ message: "Hostel verified" });
  } catch (error) {
    next(error);
  }
});

router.put("/admin/hostels/:id/reject", requireAuth, requireRole(["ADMIN"]), async (req: AuthRequest, res, next) => {
  try {
    const hostelId = req.params.id;
    const body = verifyReasonSchema.parse(req.body);

    const updated = await pool.query(
      `
        UPDATE hostels
        SET is_verified = false,
            hostel_status = 'REJECTED',
            approved_by = $2,
            approved_at = now(),
            rejection_reason = $3,
            updated_at = now()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id
      `,
      [hostelId, req.user!.userId, body.reason ?? null]
    );

    if (updated.rows.length === 0) {
      res.status(404).json({ message: "Hostel not found" });
      return;
    }

    res.status(200).json({ message: "Hostel rejected" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    next(error);
  }
});

router.put("/admin/rooms/:id/verify", requireAuth, requireRole(["ADMIN"]), async (req: AuthRequest, res, next) => {
  try {
    const roomId = req.params.id;

    const updated = await pool.query(
      `
        UPDATE rooms
        SET verified_by = $2,
            verified_at = now(),
            updated_at = now()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id
      `,
      [roomId, req.user!.userId]
    );

    if (updated.rows.length === 0) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    res.status(200).json({ message: "Room verified" });
  } catch (error) {
    next(error);
  }
});

export default router;