import express from "express";
import registerRouter from "./routes/registerRoute.js";
import loginRouter from "./routes/loginRoutes.js";
import walletRouter from "./routes/walletRoutes.js";
import cookieParser from "cookie-parser";
import authRouter from './routes/authRoutes.js';
import logoutRouter from "./routes/logoutRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true
}))
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use("/api/auth", registerRouter);
app.use("/api/auth", loginRouter);
app.use("/api/wallet", walletRouter);
app.use('/api/auth',authRouter);
app.use('/api/auth',logoutRouter);
app.use('/api/admin',adminRouter);

app.get("/", (req, res) => {
  return res.send("API started");
});

export default app;
