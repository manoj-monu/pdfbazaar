// Vercel Serverless Function — api/remove-bg.js
// Image ko RunPod Serverless pe forward karta hai with auth

export const config = {
  api: { bodyParser: false, sizeLimit: '10mb' },
  maxDuration: 60,
};

const RUNPOD_ENDPOINT = 'https://9bak6x4vaiphn6.api.runpod.ai';
// Set RUNPOD_API_KEY in Vercel Dashboard > Project Settings > Environment Variables
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!RUNPOD_API_KEY) return res.status(500).json({ error: 'RUNPOD_API_KEY env var not set' });

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const contentType = req.headers['content-type'];
    const enhance = req.query.enhance || 'false';

    const runpodRes = await fetch(
      `${RUNPOD_ENDPOINT}/api/process-all?enhance=${enhance}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
          'Authorization': `Bearer ${RUNPOD_API_KEY}`,
          'x-api-key': 'SUPER_SECRET_KEY_998877',
        },
        body: body,
      }
    );

    if (!runpodRes.ok) {
      const errText = await runpodRes.text();
      return res.status(runpodRes.status).json({ error: errText });
    }

    const imageBuffer = await runpodRes.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    return res.send(Buffer.from(imageBuffer));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}