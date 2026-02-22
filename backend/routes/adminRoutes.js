import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import requireAdmin from "../middlewares/adminMiddleware.js";
import {
  getAllUsers,
  walletFreeze,
  walletUnfreeze,
} from "../controllers/adminController.js";
import getAuditLogs from "../controllers/auditController.js"
const router = express.Router();
router.get("/get-users", verifyToken, requireAdmin, getAllUsers);
router.get("/audit-logs", verifyToken, requireAdmin, getAuditLogs);
router.post("/freeze/:userID", verifyToken, requireAdmin, walletFreeze);
router.post("/unfreeze/:userID", verifyToken, requireAdmin, walletUnfreeze);

export default router;
