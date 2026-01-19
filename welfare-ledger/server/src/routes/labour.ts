import express from 'express';
import { authenticate } from '../middleware/auth.ts';
import { Nonce } from '../models/Nonce.ts';
import { LabourEvent } from '../models/LabourEvent.ts';
import { generateNonce, canonical, sha256, verifySignature } from '../crypto/signatures.ts';
import { appendLedgerEntry } from '../services/ledger.ts';

const router = express.Router();

router.post('/start', authenticate, async (req, res) => {
  try {
    const nonce = generateNonce();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    const nonceDoc = new Nonce({
      userId: req.user._id,
      nonce,
      purpose: 'shift_end',
      expiresAt
    });
    await nonceDoc.save();

    res.json({ nonce, expiresAt });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/end', authenticate, async (req, res) => {
  try {
    const { payload, signature, keyId } = req.body;

    // Check nonce
    const nonceDoc = await Nonce.findOne({ nonce: payload.nonce, userId: req.user._id, usedAt: null });
    if (!nonceDoc) return res.status(400).json({ error: 'Invalid or used nonce' });

    // Mark nonce as used
    await Nonce.updateOne({ _id: nonceDoc._id }, { usedAt: new Date() });

    // Verify signature (simplified for MVP)
    const verified = verifySignature(canonical(payload), signature, keyId);
    if (!verified) return res.status(400).json({ error: 'Invalid signature' });

    // Compute credit
    const skillRates: any = { 1: 5.5, 2: 7.5, 3: 10.5 };
    const credit = payload.hours * skillRates[payload.skillLevel];

    // Save labour event
    const labourEvent = new LabourEvent({
      userId: req.user._id,
      hours: payload.hours,
      skillLevel: payload.skillLevel,
      enterpriseId: payload.enterpriseId,
      startTime: new Date(payload.startTime),
      endTime: new Date(payload.endTime),
      payloadHash: sha256(canonical(payload)),
      signature,
      credit,
      status: 'verified'
    });
    await labourEvent.save();

    // Append to ledger
    const ledgerResult = await appendLedgerEntry(payload, req.user._id, signature);
    labourEvent.ledgerIndex = ledgerResult.ledgerIndex;
    await labourEvent.save();

    res.json({ receiptId: labourEvent._id, ...ledgerResult, credit });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
