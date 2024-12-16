import mongoose from 'mongoose';

const smsUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
    },
  },
  {
    timestamps: true, 
  }
);

const SmsUser = mongoose.model('SmsUser', smsUserSchema);

export default SmsUser;
