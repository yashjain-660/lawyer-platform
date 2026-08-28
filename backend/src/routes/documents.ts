import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { name, type, fileUrl, fileSize, mimeType } = req.body;
    
    const document = await prisma.document.create({
      data: {
        userId: req.user.id,
        name,
        type,
        fileUrl,
        fileSize,
        mimeType
      }
    });
    
    res.status(201).json(document);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user.id }
    });
    res.json(documents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
