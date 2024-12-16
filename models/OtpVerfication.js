import mongoose from 'mongoose';

const otpVerificationSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true },
});

const OtpVerification = mongoose.model('OtpVerification', otpVerificationSchema);

export default OtpVerification;
