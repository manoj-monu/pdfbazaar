// Vercel Serverless Function — api/remove-bg.js
export const config = {
  api: { bodyParser: false, sizeLimit: '10mb' },
  maxDuration: 60,
};

const RUNPOD_ENDPOINT = 'https://9bak6x4vaiphn6.api.runpod.ai';
const HF_FALLBACK_ENDPOINT = 'https://manojkumarsh-allbgremove-api.hf.space';
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const contentType = req.headers['content-type'] || 'multipart/form-data';
    const enhance = req.query.enhance || 'false';

    let runpodRes = null;
    if (RUNPOD_API_KEY) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        runpodRes = await fetch(
          ${RUNPOD_ENDPOINT}/api/process-all?enhance=,
          {
            method: 'POST',
            headers: {
              'Content-Type': contentType,
              'Authorization': Bearer ,
              'x-api-key': 'SUPER_SECRET_KEY_998877',
            },
            body: body,
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);
      } catch (err) {
        console.warn('RunPod unavailable/timed out, switching to fallback:', err.message);
      }
    }

    if (runpodRes && runpodRes.ok) {
      const imageBuffer = await runpodRes.arrayBuffer();
      res.setHeader('Content-Type', 'image/png');
      return res.send(Buffer.from(imageBuffer));
    }

    console.log('Connecting to fallback API...');
    const hfRes = await fetch(
      ${HF_FALLBACK_ENDPOINT}/api/process-all?enhance=,
      {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
          'x-api-key': 'SUPER_SECRET_KEY_998877',
        },
        body: body,
      }
    );

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      return res.status(hfRes.status).json({ error: errText });
    }

    const imageBuffer = await hfRes.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    return res.send(Buffer.from(imageBuffer));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
