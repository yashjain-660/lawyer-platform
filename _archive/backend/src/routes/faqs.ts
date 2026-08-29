import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
