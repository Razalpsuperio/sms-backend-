import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

export default mongoose.model('Answer', answerSchema);





