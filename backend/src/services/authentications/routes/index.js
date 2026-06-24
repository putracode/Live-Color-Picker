import { Router } from "express";
import { login, refresh, logout } from "../controllers/authentication-controller.js";
import { authenticate } from "../../../middlewares/auth.js";
import validate from "../../../middlewares/validate.js";
import { loginSchema, refreshSchema, logoutSchema } from "../validator/schema.js";

const router = Router();

router.post("/", validate(loginSchema), login);
router.put("/", validate(refreshSchema), refresh);
router.delete("/", authenticate, validate(logoutSchema), logout);

export default router;
