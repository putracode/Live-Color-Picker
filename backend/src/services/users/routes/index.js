import { Router } from "express";
import {
  create,
  getAll,
  getMe,
  getById,
  update,
  deleteById,
} from "../controllers/UserController.js";
import validate from "../../../middlewares/validate.js";
import { authenticate, authorizeAdmin } from "../../../middlewares/auth.js";
import { registerSchema, updateUserSchema } from "../validator/schema.js";

const router = Router();

// User: lihat profil sendiri
router.get("/me", authenticate, getMe);

// Admin: CRUD user
router.get("/", authenticate, authorizeAdmin, getAll);
router.post("/", authenticate, authorizeAdmin, validate(registerSchema), create);
router.get("/:id", authenticate, authorizeAdmin, getById);
router.put("/:id", authenticate, authorizeAdmin, validate(updateUserSchema), update);
router.delete("/:id", authenticate, authorizeAdmin, deleteById);

export default router;