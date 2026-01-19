import express from 'express';
import { authenticate } from '../middleware/auth.ts';
import { LabourEvent } from '../models/LabourEvent.ts';
import { LedgerEntry } from '../models/LedgerEntry.ts';
import { verifyChainIntegrity, getHeadHash } from '../services/ledger.ts';

const router = express.Router();

router.get('/:recordId', authenticate, async (req, res) => {
  try {
    const labourEvent = await LabourEvent.findById(req.params.recordId);
    if (!labourEvent) return res.status(404).json({ error: 'Record not found' });

    const ledgerEntry = await LedgerEntry.findOne({ index: labourEvent.ledgerIndex });
    const chainValid = await verifyChainIntegrity();

    res.json({
      recordId: labourEvent._id,
      payloadHash: labourEvent.payloadHash,
      ledgerIndex: labourEvent.ledgerIndex,
      entryHash: ledgerEntry?.entryHash,
      chainValid,
      status: chainValid ? 'intact' : 'compromised'
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
