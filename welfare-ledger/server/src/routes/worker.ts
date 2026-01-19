import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.ts';
import { LabourEvent } from '../models/LabourEvent.ts';

const router = express.Router();

router.get('/credits', authenticate, requireRole(['citizen']), async (req, res) => {
  try {
    const credits = await LabourEvent.find({ userId: req.user._id });
    res.json({ credits });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
