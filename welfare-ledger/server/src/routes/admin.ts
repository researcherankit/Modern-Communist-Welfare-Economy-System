import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.ts';
import { Budget } from '../models/Budget.ts';
import { LabourEvent } from '../models/LabourEvent.ts';
import { User } from '../models/User.ts';
import { appendLedgerEntry } from '../services/ledger.ts';
import { canonical } from '../crypto/signatures.ts';

const router = express.Router();

router.get('/budgets', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json({ budgets });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/budgets', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { category, amount, period } = req.body;

    const budget = new Budget({
      category,
      amount,
      period,
      createdBy: req.user._id,
      status: 'published'
    });
    await budget.save();

    // Append to ledger
    await appendLedgerEntry(
      { type: 'budget', category, amount, period },
      req.user._id,
      'admin_signature'
    );

    res.json({ budget });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/labour-analytics', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const totalHours = await LabourEvent.aggregate([
      { $group: { _id: null, total: { $sum: '$hours' } } }
    ]);

    const totalWages = await LabourEvent.aggregate([
      { $group: { _id: null, total: { $sum: '$credit' } } }
    ]);

    const workerCount = await User.countDocuments({ role: 'citizen' });

    res.json({
      analytics: {
        totalHours: totalHours[0]?.total || 0,
        totalWages: totalWages[0]?.total || 0,
        workerCount
      }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/enterprises', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const enterprises = await User.find({ role: { $in: ['government_enterprise', 'domestic_private', 'foreign_enterprise'] } });
    res.json({ enterprises });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
