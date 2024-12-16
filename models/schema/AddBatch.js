import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  batchName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
  },
});

const BatchesClass = mongoose.model("Batch", batchSchema);

export default BatchesClass;