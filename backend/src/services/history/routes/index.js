import { Router } from "express";
import { create, getAll, deleteById } from "../controllers/HistoryController.js";
import validate from "../../../middlewares/validate.js";
import { authenticate } from "../../../middlewares/auth.js";
import { createHistorySchema } from "../validator/schema.js";

const router = Router();

router.get("/", authenticate, getAll);
router.post("/", authenticate, validate(createHistorySchema), create);
router.delete("/:id", authenticate, deleteById);

export default router;
