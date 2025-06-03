import Admin from "../../Models/Admin.js";
import Cashier from "../../Models/Cashier.js";
import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const email_user = process.env.EMAIL_USER;
const email_pass = process.env.EMAIL_PASS;

const sendAndStoreOtp = async (user, role, res) => {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: email_user,
            pass: email_pass
        }
    });

    const pin = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {
        user.otp = pin.toString();
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        const mailOptions = {
            from: email_user,
            to: user.email,
            subject: 'Your Password Reset OTP for BreadBilling',
            text: `Your One-Time Password (OTP) for BreadBilling password reset is: ${pin}. This OTP is valid for 10 minutes.`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("Nodemailer error:", error);
                return res.json({ success: false, message: "Failed to send OTP email. Please try again." });
            } else {
                console.log('Email sent: ' + info.response);
                return res.json({ success: true, message: `OTP sent to ${user.email}. Please check your inbox (and spam folder).` });
            }
        });

    } catch (error) {
        console.error("Error storing OTP or sending email:", error);
        res.status(500).json({ success: false, message: "Internal server error during OTP generation." });
    }
};

export const forgotPwd = async (req, res) => {
    const { email, role } = req.body;

    try {
        let userFound;
        if (role === "Admin") {
            userFound = await Admin.findOne({ email: email });
        } else if (role === "Cashier") {
            userFound = await Cashier.findOne({ email: email });
        } else {
            return res.json({ success: false, message: "Invalid role specified." });
        }

        if (!userFound) {
            return res.json({ success: true, message: "If your email is registered, an OTP has been sent." });
        }

        await sendAndStoreOtp(userFound, role, res);
    } catch (error) {
        console.error("Error in forgotPwd:", error.message);
        res.status(500).json({ success: false, message: "Internal server error. Please try again." });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, role, otp } = req.body;

    try {
        let user;
        if (role === "Admin") {
            user = await Admin.findOne({ email: email });
        } else if (role === "Cashier") {
            user = await Cashier.findOne({ email: email });
        } else {
            return res.status(400).json({ success: false, message: "Invalid role." });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.otp === otp && user.otpExpiresAt && user.otpExpiresAt > new Date()) {
            user.otp = null;
            user.otpExpiresAt = null;
            await user.save();
            return res.json({ success: true, message: "OTP verified successfully." });
        } else {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }

    } catch (error) {
        console.error("Error in verifyOtp:", error.message);
        res.status(500).json({ success: false, message: "Internal server error during OTP verification." });
    }
};
