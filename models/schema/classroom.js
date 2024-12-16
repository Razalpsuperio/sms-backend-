import mongoose from "mongoose";

const { Schema } = mongoose;

const classSchema = new Schema(
  {
    className: {
      type: String,
      trim: true,
    },
    classCode: {
      type: String,
      trim: true,
    },
    fromCapacity: {
      type: Number,
      min: 1,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    toCapacity: {
      type: Number,
      min: 1,
    },
    uploadFile: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    classStatus: {
      type: String,
      enum: ["active", "pending", "ending", "cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

const Classroom = mongoose.model("Classroom", classSchema);

export default Classroom;