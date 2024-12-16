import mongoose from "mongoose";

const { Schema } = mongoose;

const sessionSchema = new Schema(
  {
    sessionName: {
      type: String,
      enum: ["early morning", "morning", "afternoon", "evening", "night"],
    },
    sessionStartTime: {
      type: String,
    },
    sessionEndTime: {
      type: String,
    },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    }],
    batchId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
   
    },
    quantity: {
      type: Number,
    },
    capacity: {
      type: Number,
    },
    assignStudents:{
      type: Array,
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;   