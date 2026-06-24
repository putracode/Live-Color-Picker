import response from "../../../utils/response.js";
import HistoryRepository from "../repositories/HistoryRepository.js";
import { NotFoundError, AuthorizationError } from "../../../exceptions/index.js";

/**
 * POST /history — User: simpan history warna
 */
export const create = async (req, res, next) => {
  try {
    const { colorName, hex, rgb, hsl, hsv } = req.validated;
    const userId = req.user.id;

    const history = await HistoryRepository.create({ userId, colorName, hex, rgb, hsl, hsv });
    return response(res, 201, "History warna berhasil disimpan", history);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /history — Admin: semua history | User: history milik sendiri
 */
export const getAll = async (req, res, next) => {
  try {
    let histories;

    if (req.user.role === "admin") {
      histories = await HistoryRepository.findAll();
    } else {
      histories = await HistoryRepository.findByUserId(req.user.id);
    }

    return response(res, 200, "History berhasil diambil", histories);
  } catch (error) {
    return next(error);
  }
};

/**
 * DELETE /history/:id — User: hapus history milik sendiri | Admin: hapus history siapapun
 */
export const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const history = await HistoryRepository.findById(id);
    if (!history) {
      return next(new NotFoundError("History tidak ditemukan"));
    }

    // User hanya bisa hapus history miliknya sendiri
    if (req.user.role !== "admin" && history.user_id !== req.user.id) {
      return next(new AuthorizationError("Anda tidak berhak menghapus history ini"));
    }

    await HistoryRepository.delete(id);
    return response(res, 200, "History berhasil dihapus");
  } catch (error) {
    return next(error);
  }
};
