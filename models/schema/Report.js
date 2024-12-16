import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students',
    required: true,
  },
  date: {
    type: Date,
  },
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;
