import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "college",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "students",
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  totalFees: {
    type: Number,
    required: true,
  },
  tenure: {
    type: String,
    // required: true,
  },
  tenureDates: {
    type: Array,
  },
  outstandingAmount: {
    type: Number,
    required: true,
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "agent",
  },
  repId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "representatives",
  },
  // adminId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "admin",
  //   required: true,
  // },
  agentCommission: {
    type: Number,
  },
  repCommission: {
    type: Number,
  },
  adminCommission: {
    type: Number,
  },
  college: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  applicationFees: {
    type: Number,
    required: true,
  },
  paymentLogId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentLog",
    },
  ],
});

const Payment = mongoose.model("payment", paymentSchema);

export default Payment;
