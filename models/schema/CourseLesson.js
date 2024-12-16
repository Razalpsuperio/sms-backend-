import mongoose from "mongoose";

const courseLessonSchema = new mongoose.Schema({
  moduleId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseModule", 
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category', 
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'pending', 'ending', 'cancelled'], 
  },
  title: {
    type: String,
    required: true,
  },
  code:{
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  description: { 
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
}, {
  timestamps: true 
});

const Lesson = mongoose.model("Lesson", courseLessonSchema);

export default Lesson;
