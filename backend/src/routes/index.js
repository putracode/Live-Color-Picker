import { Router } from "express";

import authRoutes from "../services/authentications/routes/index.js";
import historyRoutes from "../services/history/routes/index.js";
import userRoutes from "../services/users/routes/index.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/history", historyRoutes);
router.use("/users", userRoutes);

export default router;
