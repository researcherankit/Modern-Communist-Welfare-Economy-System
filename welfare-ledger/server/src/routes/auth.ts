import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.ts';
import { authenticate } from '../middleware/auth.ts';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, skillLevel } = req.body;
    const passwordHash = bcryptjs.hashSync(password, 10);

    const user = new User({ name, email, passwordHash, role, skillLevel, hasKeyFile: false });
    await user.save();

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: user.toObject() });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !bcryptjs.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: user.toObject() });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/register-key', authenticate, async (req, res) => {
  try {
    const { publicKeyHex } = req.body;
    await User.findByIdAndUpdate(req.user._id, { publicKeyHex, hasKeyFile: true });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
