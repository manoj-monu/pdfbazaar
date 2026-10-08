const crypto = require('crypto');

const jobs = new Map();
const queue = [];
let isProcessing = false;
let workerCallback = null;

// Mock job object with methods similar to BullMQ
class Job {
  constructor(id, name, data) {
    this.id = id;
    this.name = name;
    this.data = data;
    this.progress = 0;
    this.state = 'QUEUED'; // QUEUED, ACTIVE, COMPLETED, FAILED
    this.returnvalue = null;
    this.error = null;
  }

  async updateProgress(progress) {
    this.progress = progress;
  }

  async getState() {
    return this.state;
  }
}

async function processNext() {
  if (isProcessing || queue.length === 0 || !workerCallback) return;
  
  isProcessing = true;
  const jobId = queue.shift();
  const job = jobs.get(jobId);
  
  if (job) {
    job.state = 'ACTIVE';
    try {
      const result = await workerCallback(job);
      job.returnvalue = result;
      job.state = 'COMPLETED';
    } catch (err) {
      job.error = err.message;
      job.state = 'FAILED';
    }
  }
  
  isProcessing = false;
  
  // Process next job if any
  if (queue.length > 0) {
    setTimeout(processNext, 100);
  }
}

module.exports = {
  add: async (name, data) => {
    const id = crypto.randomUUID();
    const job = new Job(id, name, data);
    jobs.set(id, job);
    queue.push(id);
    
    // Trigger processing
    setTimeout(processNext, 100);
    return job;
  },
  getJob: async (id) => {
    return jobs.get(id);
  },
  setWorkerCallback: (cb) => {
    workerCallback = cb;
    setTimeout(processNext, 100);
  }
};
