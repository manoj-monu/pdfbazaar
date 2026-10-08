require('dotenv').config();
const express = require('express');
const cors = require('cors');
const localQueue = require('./localQueue');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Initialize Local In-Memory Queue for AI Jobs
const photoProcessingQueue = localQueue;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- API ENDPOINTS ---

// 0. Auto-Login Guest User (For testing database credits)
app.post('/api/v1/auth/guest', async (req, res) => {
  try {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'guest@pdfbazaar.local',
          passwordHash: 'dummy',
          name: 'Guest User',
          credits: 5
        }
      });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1. Upload & Create Job (Phase 2 + DB)
app.post('/api/v1/photo/jobs', async (req, res) => {
  try {
    const { imageUrl, documentId, countryId } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // 1. Get User and Check Credits
    const user = await prisma.user.findFirst();
    if (!user || user.credits <= 0) {
      return res.status(402).json({ error: 'Insufficient credits. Please upgrade.' });
    }

    // 2. Create Project and Job in DB
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        // Since we don't have all documents in DB yet, we mock a relation if needed,
        // but for now let's bypass strict foreign keys or mock it.
        // Actually, SQLite might complain if documentId doesn't exist.
        status: 'QUEUED'
      }
    });

    const dbJob = await prisma.processingJob.create({
      data: {
        projectId: project.id,
        jobType: 'PHOTO_PROCESS',
        status: 'QUEUED',
        inputUrl: 'base64_data_hidden'
      }
    });

    // Deduct 1 credit
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: user.credits - 1 }
    });

    // 3. Add to In-Memory Queue
    const queueJob = await photoProcessingQueue.add('process-photo', {
      imageUrl,
      documentId,
      dbJobId: dbJob.id,
      tasks: ['face-detect', 'background-remove', 'compliance-check']
    });

    res.json({
      jobId: queueJob.id, // Using queue job ID for easy polling
      dbJobId: dbJob.id,
      creditsLeft: user.credits - 1,
      status: 'QUEUED',
      message: 'Photo added to processing queue'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// 2. Check Job Status (Polling / SSE)
app.get('/api/v1/photo/jobs/:id/status', async (req, res) => {
  try {
    const job = await photoProcessingQueue.getJob(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const state = await job.getState();
    const progress = job.progress;
    const result = job.returnvalue;

    res.json({
      jobId: job.id,
      state,
      progress,
      result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get job status' });
  }
});

// 3. Document Compliance Rules Engine
app.post('/api/v1/compliance/check', async (req, res) => {
  // Simulate AI compliance checking
  res.json({
    score: 96,
    status: 'PASS',
    checks: [
      { name: 'background', status: 'PASS' },
      { name: 'face_position', status: 'PASS' },
      { name: 'lighting', status: 'WARNING', message: 'Lighting slightly uneven' }
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Global ID Photo Studio API is running' });
});

app.listen(port, () => {
  console.log(`🚀 Global ID Photo Studio Backend running on http://localhost:${port}`);
  console.log(`📦 Local In-Memory Queue initialized (SQLite mode)`);
  
  // Start the worker logic in the same process for local dev
  require('./worker');
});
