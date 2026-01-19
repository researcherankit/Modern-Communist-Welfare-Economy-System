import express from 'express';
import { authenticate } from '../middleware/auth.ts';

const router = express.Router();

router.post('/report', authenticate, async (req, res) => {
  try {
    const { payload, signature, keyId } = req.body;
    // Simplified: just acknowledge
    res.json({ receiptId: 'ENT-' + Date.now(), status: 'submitted' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
