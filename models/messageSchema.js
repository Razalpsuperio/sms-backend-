import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userMessage: String,
  botResponse: String,
  timestamp: { type: Date, default: Date.now },
}, {
  timestamps: true
});

export default mongoose.model('Message', messageSchema);
