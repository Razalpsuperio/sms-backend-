import mongoose from "mongoose";
const { Schema } = mongoose;

const attendanceSchema = new Schema(
    {
      sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
      },
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
        required: true,
      },
      status: {
        type: String,
        enum: ["medical", "present", "absent"],
        required: true,
      },
    },
    { timestamps: true }
  );
  
  const MarkAttendance = mongoose.model("MarkAttendance", attendanceSchema);
  export default MarkAttendance;
  