require('dotenv').config();
require('dotenv').config();
const localQueue = require('./localQueue');
const aiPipeline = require('./aiPipeline');
const rulesEngine = require('./rulesEngine');

console.log(`🤖 Starting AI Worker (Local In-Memory Mode)...`);

localQueue.setWorkerCallback(async (job) => {
  console.log(`\n[JOB START] Processing Job ID: ${job.id}`);
  const { imageUrl, documentId, tasks } = job.data;
  
  await job.updateProgress(10); // Uploaded

  // 1. Run AI Pipeline (Phase 3: Advanced AI)
  console.log(`[JOB ${job.id}] Running AI Pipeline...`);
  const aiResults = await aiPipeline.runFullPipeline(imageUrl, tasks);
  await job.updateProgress(60);

  // 2. Validate Compliance (Phase 3: Worldwide Rules Engine)
  console.log(`[JOB ${job.id}] Validating Compliance for ${documentId}...`);
  
  // Mock image metadata for testing
  const simulatedMetadata = { width: 1200, height: 1600, backgroundDetected: 'white' };
  
  const complianceResult = rulesEngine.validateCompliance(
    simulatedMetadata, 
    aiResults.faceData, 
    documentId
  );
  
  await job.updateProgress(90);

  console.log(`[JOB END] Job ${job.id} Score: ${complianceResult.score}/100 (${complianceResult.status})`);
  await job.updateProgress(100);
  
  console.log(`✅ Job ${job.id} completed! Final Score: ${complianceResult.score}`);

  return {
    success: true,
    aiData: aiResults,
    compliance: complianceResult
  };
});

