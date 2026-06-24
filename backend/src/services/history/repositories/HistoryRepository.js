import pool from "../../../config/database.js";
import { nanoid } from "nanoid";

class HistoryRepository {
  constructor() {
    this._pool = pool;
  }

  async create({ userId, colorName, hex, rgb, hsl, hsv }) {
    const id = nanoid(16);
    const query = {
      text: `INSERT INTO history (id, user_id, color_name, hex, rgb, hsl, hsv)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
      values: [id, userId, colorName, hex, rgb, hsl, hsv],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  /**
   * Ambil semua history (untuk admin)
   */
  async findAll() {
    const query = {
      text: `SELECT h.*, u.name AS user_name, u.email AS user_email
             FROM history h
             JOIN users u ON h.user_id = u.id
             ORDER BY h.created_at DESC`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  /**
   * Ambil history milik user tertentu
   */
  async findByUserId(userId) {
    const query = {
      text: "SELECT * FROM history WHERE user_id = $1 ORDER BY created_at DESC",
      values: [userId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: "SELECT * FROM history WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0] || null;
  }

  async delete(id) {
    const query = {
      text: "DELETE FROM history WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0] || null;
  }

  async deleteByIdAndUserId(id, userId) {
    const query = {
      text: "DELETE FROM history WHERE id = $1 AND user_id = $2 RETURNING id",
      values: [id, userId],
    };
    const result = await this._pool.query(query);
    return result.rows[0] || null;
  }
}

export default new HistoryRepository();
