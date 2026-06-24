import pool from "../../../config/database.js";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

class UserRepository {
  constructor() {
    this._pool = pool;
  }

  async create({ name, email, password, role = "user" }) {
    const id = nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: `INSERT INTO users (id, name, email, password, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, role, created_at`,
      values: [id, name, email, hashedPassword, role],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async findAll() {
    const query = {
      text: "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC",
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0] || null;
  }

  async findByEmail(email) {
    const query = {
      text: "SELECT id, name, email, role FROM users WHERE email = $1",
      values: [email],
    };
    const result = await this._pool.query(query);
    return result.rows[0] || null;
  }

  async update(id, { name, email, role }) {
    const fields = [];
    const values = [];
    let index = 1;

    if (name !== undefined) { fields.push(`name = $${index++}`); values.push(name); }
    if (email !== undefined) { fields.push(`email = $${index++}`); values.push(email); }
    if (role !== undefined) { fields.push(`role = $${index++}`); values.push(role); }

    if (fields.length === 0) return null;

    fields.push(`updated_at = current_timestamp`);
    values.push(id);

    const query = {
      text: `UPDATE users SET ${fields.join(", ")} WHERE id = $${index} RETURNING id, name, email, role, updated_at`,
      values,
    };

    const result = await this._pool.query(query);
    return result.rows[0] || null;
  }

  async delete(id) {
    const query = {
      text: "DELETE FROM users WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0] || null;
  }

  async verifyCredentials(email, password) {
    const query = {
      text: "SELECT id, password, role FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(query);
    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    return isPasswordValid ? { id: user.id, role: user.role } : null;
  }
}

export default new UserRepository();
