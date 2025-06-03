import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    joinedAt: {
        type: Date,
        required: true
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpiresAt: {
        type: Date,
        default: null,
    },
});

export default mongoose.model('Admin', adminSchema);