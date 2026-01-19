import mongoose from 'mongoose';

const ledgerEntrySchema = new mongoose.Schema({
  index: { type: Number, unique: true },
  prevHash: String,
  payload: mongoose.Schema.Types.Mixed,
  payloadHash: String,
  entryHash: String,
  actorId: mongoose.Schema.Types.ObjectId,
  actorSignature: String,
  createdAt: { type: Date, default: Date.now }
});

export const LedgerEntry = mongoose.model('LedgerEntry', ledgerEntrySchema);
