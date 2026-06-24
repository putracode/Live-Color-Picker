import pool from "../config/database.js";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { text } from "express";

class User {
  constructor() {
    this._pool = pool;
  }

  async create({ name, email, password, role }) {
    const id = nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: "INSERT INTO users(id, name, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, email, hashedPassword, role],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async findById(id) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyEmail(email) {
    const query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
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
    
    return isPasswordValid ? user : null;
  }
}

export default new User();
