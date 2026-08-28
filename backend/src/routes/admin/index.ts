import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const stats = {
      totalUsers: await prisma.user.count(),
      totalLawyers: await prisma.lawyerProfile.count(),
      totalConsultations: await prisma.consultation.count(),
      totalRevenue: 0
    };
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
