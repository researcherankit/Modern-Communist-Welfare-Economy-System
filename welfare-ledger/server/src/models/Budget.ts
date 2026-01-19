import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  category: String,
  amount: Number,
  period: String,
  createdBy: mongoose.Schema.Types.ObjectId,
  payloadHash: String,
  ledgerIndex: Number,
  status: { type: String, default: 'published' },
  createdAt: { type: Date, default: Date.now }
});

export const Budget = mongoose.model('Budget', budgetSchema);
