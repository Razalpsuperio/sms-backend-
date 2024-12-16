import mongoose from "mongoose";

const representativeSchema = new mongoose.Schema(
  {
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
    password: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    type: {
      type: String,
      default: "representative",
    },
    colleges: [
      {
        type: String,
        ref: "college",
      },
    ],
    courseCommission: [{
      // Define the structure of each object in the array
      courseId: String,
      course: String,
      courseFee: Number,
      commission: Number,
    }],
    commissionEarned: {
      type: Number,
      default: 0
    },
    commissionPending: {
      type: Number,
      default: 0
    },
    agents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agent",
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
  },
  {
    timestamps: true,
  }
);

const Representative = mongoose.model("representatives", representativeSchema);

export default Representative;
