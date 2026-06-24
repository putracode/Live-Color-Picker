import UserRepository from "../repositories/UserRepository.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";
import response from "../../../utils/response.js";

/**
 * POST /users — Admin: buat user baru
 */
export const create = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.validated;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return next(new InvariantError("Email sudah terdaftar"));
    }

    const user = await UserRepository.create({ name, email, password, role });
    return response(res, 201, "User berhasil dibuat", user);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /users — Admin: lihat semua user
 */
export const getAll = async (req, res, next) => {
  try {
    const users = await UserRepository.findAll();
    return response(res, 200, "Daftar user berhasil diambil", users);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /users/me — User: lihat profil sendiri
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await UserRepository.findById(req.user.id);
    if (!user) {
      return next(new NotFoundError("User tidak ditemukan"));
    }
    return response(res, 200, "Profil user berhasil diambil", user);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /users/:id — Admin: lihat user by id
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UserRepository.findById(id);
    if (!user) {
      return next(new NotFoundError("User tidak ditemukan"));
    }

    return response(res, 200, "User berhasil ditemukan", user);
  } catch (error) {
    return next(error);
  }
};

/**
 * PUT /users/:id — Admin: update user
 */
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.validated;

    const existing = await UserRepository.findById(id);
    if (!existing) {
      return next(new NotFoundError("User tidak ditemukan"));
    }

    // Cek apakah email sudah dipakai user lain
    if (email && email !== existing.email) {
      const emailTaken = await UserRepository.findByEmail(email);
      if (emailTaken) {
        return next(new InvariantError("Email sudah digunakan"));
      }
    }

    const updated = await UserRepository.update(id, { name, email, role });
    return response(res, 200, "User berhasil diperbarui", updated);
  } catch (error) {
    return next(error);
  }
};

/**
 * DELETE /users/:id — Admin: hapus user
 */
export const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await UserRepository.findById(id);
    if (!existing) {
      return next(new NotFoundError("User tidak ditemukan"));
    }

    await UserRepository.delete(id);
    return response(res, 200, "User berhasil dihapus");
  } catch (error) {
    return next(error);
  }
};
