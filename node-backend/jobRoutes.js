import express from 'express';
import { PrismaClient } from '@prisma/client';
import { photoJobQueue } from './queue.js';
import multer from 'multer';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

// Create a new photo processing job
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }
    
    // Validate MIME type & sizes (Phase 1 basic validation)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only JPG, PNG, WEBP allowed.' });
    }
    
    // In production, upload this to S3 here. For now, use local path.
    const inputUrl = req.file.path;
    const documentId = req.body.documentId || 'india-passport';
    
    // 1. Create Job in DB
    const job = await prisma.job.create({
      data: {
        inputUrl,
        documentId,
        status: 'queued',
        progress: 0
      }
    });
    
    // 2. Push to Redis BullMQ
    await photoJobQueue.add('processPhoto', {
      jobId: job.id,
      inputUrl,
      documentId
    });
    
    res.json({ jobId: job.id, status: 'queued', message: 'Job added successfully' });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Check job status
router.get('/jobs/:id', async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id }
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
