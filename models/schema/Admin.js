import mongoose from "mongoose";

const { Schema } = mongoose;

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logo_name: {
    type:String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  courseCommission: [{
    // Define the structure of each object in the array s
    courseId:String,
    course: String,
    college: String,
    courseFee : Number,
    commission: Number,
  }],
  commissionEarned: {
    type: Number,
    default: 0,
  },
  commissionPending: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: "admin",
  },
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

const Admin = mongoose.model("admin", adminSchema);

export default Admin;
