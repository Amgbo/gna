import { Router } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../config/db";
import { z } from "zod";
import { requireAuth, type AuthRequest } from "../middlewares/auth";

const router = Router();

const createBookingSchema = z.object({
  academic_term_id: z.string().uuid("Invalid academic_term_id"),
  hostel_id: z.string().uuid("Invalid hostel_id"),
  room_id: z.string().uuid("Invalid room_id"),
  bed_id: z.string().uuid("Invalid bed_id").optional(),
  check_in_date: z.string().date("Invalid check_in_date"),
  check_out_date: z.string().date("Invalid check_out_date")
});

router.post("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const body = createBookingSchema.parse(req.body);

    const checkIn = new Date(body.check_in_date);
    const checkOut = new Date(body.check_out_date);
    if (checkOut <= checkIn) {
      res.status(400).json({ message: "check_out_date must be after check_in_date" });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const termRes = await client.query<{ id: string }>(
        `SELECT id FROM academic_terms WHERE id = $1 AND is_active = true AND deleted_at IS NULL`,
        [body.academic_term_id]
      );
      if (termRes.rows.length === 0) {
        await client.query("ROLLBACK");
        res.status(404).json({ message: "Academic term not found or inactive" });
        return;
      }

      const duplicateRes = await client.query<{ id: string }>(
        `
          SELECT id
          FROM bookings
          WHERE student_id = $1
            AND academic_term_id = $2
            AND deleted_at IS NULL
            AND booking_status NOT IN ('CANCELLED', 'REJECTED')
          LIMIT 1
        `,
        [req.user!.userId, body.academic_term_id]
      );
      if (duplicateRes.rows.length > 0) {
        await client.query("ROLLBACK");
        res.status(409).json({ message: "Student already has an active booking for this academic term" });
        return;
      }

      const roomRes = await client.query<{
        id: string;
        hostel_id: string;
        available_beds: number;
        price_per_semester: string;
      }>(
        `
          SELECT id, hostel_id, available_beds, price_per_semester
          FROM rooms
          WHERE id = $1 AND hostel_id = $2 AND deleted_at IS NULL
          FOR UPDATE
        `,
        [body.room_id, body.hostel_id]
      );

      const room = roomRes.rows[0];
      if (!room) {
        await client.query("ROLLBACK");
        res.status(404).json({ message: "Room not found in specified hostel" });
        return;
      }

      let bedPriceOverride: number | null = null;
      if (body.bed_id) {
        const bedRes = await client.query<{ id: string; price_override: string | null }>(
          `
            SELECT id, price_override
            FROM beds
            WHERE id = $1 AND room_id = $2 AND bed_status = 'AVAILABLE' AND deleted_at IS NULL
            FOR UPDATE
          `,
          [body.bed_id, body.room_id]
        );

        const bed = bedRes.rows[0];
        if (!bed) {
          await client.query("ROLLBACK");
          res.status(400).json({ message: "Bed not available or not found" });
          return;
        }

        bedPriceOverride = bed.price_override ? Number(bed.price_override) : null;
        await client.query(`UPDATE beds SET bed_status = 'RESERVED' WHERE id = $1`, [body.bed_id]);
      } else {
        if (room.available_beds <= 0) {
          await client.query("ROLLBACK");
          res.status(400).json({ message: "No available beds in this room" });
          return;
        }

        await client.query(`UPDATE rooms SET available_beds = available_beds - 1 WHERE id = $1`, [body.room_id]);
      }

      const bookingId = randomUUID();
      const itemId = randomUUID();
      const unitPrice = bedPriceOverride ?? Number(room.price_per_semester);
      const subtotalAmount = unitPrice;

      await client.query(
        `
          INSERT INTO bookings (
            id,
            booking_reference,
            student_id,
            academic_term_id,
            hostel_id,
            booking_status,
            payment_status,
            check_in_date,
            check_out_date,
            reservation_expires_at,
            subtotal_amount,
            discount_amount,
            total_amount,
            currency
          ) VALUES (
            $1,
            generate_reference('BKG-'),
            $2,
            $3,
            $4,
            'PENDING',
            'PENDING',
            $5,
            $6,
            now() + interval '24 hours',
            $7,
            0,
            $7,
            'GHS'
          )
        `,
        [
          bookingId,
          req.user!.userId,
          body.academic_term_id,
          body.hostel_id,
          body.check_in_date,
          body.check_out_date,
          subtotalAmount
        ]
      );

      await client.query(
        `
          INSERT INTO booking_items (
            id,
            booking_id,
            item_type,
            room_id,
            bed_id,
            quantity,
            unit_price,
            subtotal
          ) VALUES ($1, $2, $3, $4, $5, 1, $6, $7)
        `,
        [itemId, bookingId, body.bed_id ? "BED" : "ROOM", body.room_id, body.bed_id ?? null, unitPrice, subtotalAmount]
      );

      await client.query("COMMIT");

      res.status(201).json({
        data: {
          id: bookingId,
          student_id: req.user!.userId,
          academic_term_id: body.academic_term_id,
          hostel_id: body.hostel_id,
          room_id: body.room_id,
          bed_id: body.bed_id ?? null,
          booking_status: "PENDING",
          payment_status: "PENDING",
          check_in_date: body.check_in_date,
          check_out_date: body.check_out_date,
          subtotal_amount: subtotalAmount,
          total_amount: subtotalAmount,
          currency: "GHS"
        }
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.errors[0].message });
      return;
    }
    next(err);
  }
});

router.get("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const bookings = await pool.query(
      `
        SELECT
          b.id,
          b.booking_reference,
          b.academic_term_id,
          b.hostel_id,
          b.booking_status,
          b.payment_status,
          b.check_in_date,
          b.check_out_date,
          b.subtotal_amount,
          b.discount_amount,
          b.total_amount,
          b.currency,
          h.name AS hostel_name,
          at.year AS academic_year,
          at.term AS semester
        FROM bookings b
        JOIN hostels h ON h.id = b.hostel_id
        JOIN academic_terms at ON at.id = b.academic_term_id
        WHERE b.student_id = $1 AND b.deleted_at IS NULL
        ORDER BY b.created_at DESC
      `,
      [req.user!.userId]
    );

    res.status(200).json({ data: bookings.rows });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const bookingId = req.params.id;

    const booking = await pool.query(
      `
        SELECT
          b.id,
          b.booking_reference,
          b.student_id,
          b.academic_term_id,
          b.hostel_id,
          b.booking_status,
          b.payment_status,
          b.check_in_date,
          b.check_out_date,
          b.subtotal_amount,
          b.discount_amount,
          b.total_amount,
          b.currency,
          b.notes,
          b.created_at,
          b.updated_at,
          h.name AS hostel_name,
          h.address AS hostel_address,
          at.year AS academic_year,
          at.term AS semester
        FROM bookings b
        JOIN hostels h ON h.id = b.hostel_id
        JOIN academic_terms at ON at.id = b.academic_term_id
        WHERE b.id = $1 AND b.deleted_at IS NULL
      `,
      [bookingId]
    );

    if (booking.rows.length === 0) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    const bookingData = booking.rows[0] as { student_id: string } & Record<string, unknown>;
    if (bookingData.student_id !== req.user!.userId) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    const items = await pool.query(
      `
        SELECT
          id,
          item_type,
          room_id,
          bed_id,
          quantity,
          unit_price,
          subtotal
        FROM booking_items
        WHERE booking_id = $1 AND deleted_at IS NULL
      `,
      [bookingId]
    );

    res.status(200).json({
      data: {
        ...booking.rows[0],
        items: items.rows
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
