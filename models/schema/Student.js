import mongoose from "mongoose";

const { Schema } = mongoose;

const addressSchema = new Schema({
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
});




const studentSchema = new Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    passport: {
      type: String,
    },
    year: {
      type: Number,
      required: true,
    },
    intake: {
      type: String,
    },
    representative: {
      type: String,
      ref: 'representatives'
    },
    college: {
      type: String,
      ref: 'college'
    },
    course: {
      type: String,
      ref: 'courses'
    },
    agents: {
      type: String,
      ref: 'agent'
    },
    address: {
      type: addressSchema,
    },
    fees: {
      type: Number,
    },
    balancedFees: {
      type: Number,
    },
    installment: {
      type: String,
    },
    tenure: {
      type: String,
    },
    completedModules: {

    },
    isBatch: {
      type: Boolean,
      default: false, 
    },
    attendanceReport: [
      {
        date: { type: Date },
        status: { type: String, enum: ["medical", "present", "absent"] },
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("students", studentSchema);
export default Student;