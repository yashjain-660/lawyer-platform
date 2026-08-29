import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, lawyerMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { specialization, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const lawyers = await prisma.lawyerProfile.findMany({
      skip,
      take: Number(limit),
      where: { isVerified: true },
      include: { user: true }
    });
    
    const total = await prisma.lawyerProfile.count({ where: { isVerified: true } });
    res.json({ data: lawyers, total, page, limit });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const lawyer = await prisma.lawyerProfile.findUnique({
      where: { id: req.params.id },
      include: { user: true, reviews: true, credentials: true, availability: true }
    });
    res.json(lawyer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/profile', authMiddleware, lawyerMiddleware, async (req: any, res) => {
  try {
    const { specializations, experience, bio, hourlyRate } = req.body;
    const profile = await prisma.lawyerProfile.create({
      data: {
        userId: req.user.id,
        specializations: JSON.stringify(specializations),
        experience,
        bio,
        hourlyRate
      }
    });
    res.status(201).json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
