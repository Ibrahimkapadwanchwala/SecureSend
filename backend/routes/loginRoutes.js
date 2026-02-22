import express from "express";
import login from "../controllers/loginController.js";
import loginRateLimiter from "../middlewares/loginRateLimiter.js";
const router=express.Router();
router.post("/login",loginRateLimiter,login);
export default router;