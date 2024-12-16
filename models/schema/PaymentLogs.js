import mongoose from "mongoose";

const paymentLogSchema = new mongoose.Schema({
  paidAmount: {
    type: Number,
    required: true,
  },
  tenureTime: {
    type: Number,
    required: true,
  },
  amountPart: {
    type: Number,
    required: true,
  },
  // splittedCommissionAdmin: {
  //   type: Number,
  // },
  splittedCommissionAgent: {
    type: Number,
  },
  splittedCommissionRep: {
    type: Number,
  },
  totalCommission: {
    type: Number,
  },
  splittedForCollege: {
    type: Number,
  },
  transactionId: {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "students",
    required: true,
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
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payment",
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["remaining", "completed"],
    // default: "pending",
  },
  applicationFees: {
    type: Number,
    required: true,
  },
});

const PaymentLog = mongoose.model("PaymentLog", paymentLogSchema);

export default PaymentLog;
