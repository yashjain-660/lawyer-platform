import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { amount, consultationId, paymentMethod } = req.body;
    
    const payment = await prisma.payment.create({
      data: {
        userId: req.user.id,
        consultationId,
        amount,
        paymentMethod,
        status: 'PENDING'
      }
    });
    
    res.status(201).json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authMiddleware, async (req: any, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: { invoice: true }
    });
    res.json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
