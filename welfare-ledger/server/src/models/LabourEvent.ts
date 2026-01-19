import mongoose from 'mongoose';

const labourEventSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    hours: Number,
    skillLevel: Number,
    enterpriseId: String,
    startTime: Date,
    endTime: Date,
    payloadHash: String,
    signature: String,
    ledgerIndex: Number,
    credit: Number,
    status: { type: String, default: 'verified' },
    createdAt: { type: Date, default: Date.now }
});

export const LabourEvent = mongoose.model('LabourEvent', labourEventSchema);