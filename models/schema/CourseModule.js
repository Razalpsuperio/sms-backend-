import mongoose from 'mongoose';

const courseModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  moduleCode: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },
  documents: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'ending', 'cancelled'], 
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category', 
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
  instructor: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  prerequisites: {
    type: String,
  },
}, {
  timestamps: true,
});

const CourseModule = mongoose.model('CourseModule', courseModuleSchema);

export default CourseModule;
