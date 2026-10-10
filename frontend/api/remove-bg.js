// Vercel Serverless Function — api/remove-bg.js
export const config = {
  api: { bodyParser: false, sizeLimit: '10mb' },
  maxDuration: 60,
};

const RUNPOD_ENDPOINT = 'https://9bak6x4vaiphn6.api.runpod.ai';
const HF_FALLBACK_ENDPOINT = 'https://manojkumarsh-allbgremove-api.hf.space';
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;

function reply(res, statusCode, body, contentType = 'application/json') {
  if (typeof res.status === 'function') {
    res.status(statusCode);
    if (contentType === 'application/json' && typeof body === 'object') {
      return res.json(body);
    }
    res.setHeader('Content-Type', contentType);
    return res.send ? res.send(body) : res.end(body);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', contentType);
  if (contentType === 'application/json' && typeof body === 'object') {
    return res.end(JSON.stringify(body));
  }
  return res.end(body);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(200).end();
    res.statusCode = 200;
    return res.end();
  }
  if (req.method !== 'POST') {
    return reply(res, 405, { error: 'Method not allowed' });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const contentType = req.headers['content-type'] || 'multipart/form-data';
    const url = new URL(req.url, https://);
    const enhance = url.searchParams.get('enhance') || 'false';

    let runpodRes = null;
    if (RUNPOD_API_KEY) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
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
      return reply(res, 200, Buffer.from(imageBuffer), 'image/png');
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
      return reply(res, hfRes.status, { error: errText });
    }

    const imageBuffer = await hfRes.arrayBuffer();
    return reply(res, 200, Buffer.from(imageBuffer), 'image/png');
  } catch (error) {
    return reply(res, 500, { error: error.message });
  }
}
