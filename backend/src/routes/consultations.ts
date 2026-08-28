import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { lawyerId, title, description, scheduledDate, duration, mode, services } = req.body;
    
    const consultation = await prisma.consultation.create({
      data: {
        clientId: req.user.id,
        lawyerId,
        title,
        description,
        scheduledDate: new Date(scheduledDate),
        duration,
        mode,
        amount: 0,
        services: {
          create: services?.map((serviceId: string) => ({ serviceId })) || []
        }
      },
      include: { services: true }
    });
    
    res.status(201).json(consultation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const consultations = await prisma.consultation.findMany({
      where: { clientId: req.user.id },
      include: { lawyer: true, services: true }
    });
    res.json(consultations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
