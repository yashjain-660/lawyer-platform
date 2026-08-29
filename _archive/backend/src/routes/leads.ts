import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { email, firstName, lastName, phone, caseType, message, source } = req.body;
    
    const lead = await prisma.lead.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        caseType,
        message,
        source,
        status: 'NEW'
      }
    });
    
    res.status(201).json(lead);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
