import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  logo_name: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  currency: {
    type: String,
    required: true,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      default:[]
    },
  ],
  representatives: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "representatives",
      default: []
    },
  ],
  agents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "agent",
      default: []
    },
  ],
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
    },
  ],
  address: {
    addressLine1: {
      type: String,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    country: {
      type: String,
    },
  },
});

const College = mongoose.model("college", collegeSchema);

export default College;
