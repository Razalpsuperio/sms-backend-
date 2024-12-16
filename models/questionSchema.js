import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: String,
}, {
  timestamps: true
});


export default mongoose.model('Question', questionSchema);



