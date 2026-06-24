import pool from "../config/database.js";

class History {
  constructor() {
    this._pool = pool;
  }

  async create({
    userId,
    colorName,
    hex,
    rgb,
    hsl,
    hsv,
    timestamp,
  }) {
    const query = {
      text: "INSERT INTO history (user_id, colorName, hex, rgb, hsl, hsv, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      values: [userId, colorName, hex, rgb, hsl, hsv, timestamp],
    };
    await this._pool.query(query);
  }

  async findAll() {
    const query = {
      text: "SELECT * FROM history",
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}
