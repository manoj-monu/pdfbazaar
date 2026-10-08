import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});

const prisma = new PrismaClient();

const worker = new Worker('photoProcessingQueue', async (job) => {
  const { jobId, inputUrl, documentId } = job.data;
  console.log(`Processing Job ${jobId}...`);
  
  const updateStatus = async (status, progress) => {
    await prisma.job.update({ where: { id: jobId }, data: { status, progress } });
    job.updateProgress(progress);
  };
  
  try {
    await updateStatus('detecting_face', 10);
    // TODO: Send task to GPU worker (Phase 2)
    await new Promise(r => setTimeout(r, 2000)); // Simulate work
    
    await updateStatus('segmenting', 30);
    await new Promise(r => setTimeout(r, 2000)); 
    
    await updateStatus('removing_background', 50);
    await new Promise(r => setTimeout(r, 2000));
    
    await updateStatus('enhancing', 70);
    await new Promise(r => setTimeout(r, 2000));
    
    await updateStatus('cropping', 85);
    await new Promise(r => setTimeout(r, 1000));
    
    await updateStatus('completed', 100);
    console.log(`Job ${jobId} Completed!`);
    
    return { success: true };
  } catch (error) {
    console.error(`Job ${jobId} Failed:`, error);
    await prisma.job.update({ where: { id: jobId }, data: { status: 'failed', error: error.message } });
    throw error;
  }
}, { connection });

worker.on('failed', (job, err) => {
  console.error(`${job.id} has failed with ${err.message}`);
});

console.log("BullMQ Worker is running and waiting for jobs...");
