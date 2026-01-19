import express from 'express';
import { LabourEvent } from '../models/LabourEvent.ts';

const router = express.Router();

router.get('/data', async (req, res) => {
  try {
    const totalHours = await LabourEvent.aggregate([
      { $group: { _id: null, total: { $sum: '$hours' } } }
    ]);

    const totalWages = await LabourEvent.aggregate([
      { $group: { _id: null, total: { $sum: '$credit' } } }
    ]);

    res.json({
      data: {
        totalHours: totalHours[0]?.total || 0,
        totalWages: totalWages[0]?.total || 0
      }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
