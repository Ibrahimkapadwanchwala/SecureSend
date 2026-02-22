import {getBalance,getTransactions} from "../controllers/walletController.js"

import verifyToken from "../middlewares/authMiddleware.js"
import transfer from "../controllers/transferController.js";
import express from "express"
const router=express.Router();
router.get("/balance",verifyToken,getBalance);
router.post('/transfer',verifyToken,transfer);
router.get('/transactions',verifyToken,getTransactions);

export default router;