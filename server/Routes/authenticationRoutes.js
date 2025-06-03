import express from "express";
import { login } from "../Controllers/Authentication/login.js";
import { forgotPwd, verifyOtp } from "../Controllers/Authentication/forgotPwd.js";
import { changePwd } from "../Controllers/Authentication/changePwd.js";

const router = express.Router();

router.post('/login', login);
router.post('/forgotPwd', forgotPwd); 
router.post('/verify-otp', verifyOtp);
router.post('/changepwd', changePwd);

export default router;