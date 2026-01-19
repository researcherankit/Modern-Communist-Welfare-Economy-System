import mongoose from 'mongoose';

const nonceSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  nonce: { type: String, unique: true },
  purpose: String,
  expiresAt: Date,
  usedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export const Nonce = mongoose.model('Nonce', nonceSchema);
