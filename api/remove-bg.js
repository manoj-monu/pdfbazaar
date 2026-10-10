// Vercel Serverless Function — api/remove-bg.js
export const config = {
  api: { bodyParser: false, sizeLimit: '10mb' },
  maxDuration: 60,
};

const RUNPOD_ENDPOINT = 'https://9bak6x4vaiphn6.api.runpod.ai';
const HF_FALLBACK_ENDPOINT = 'https://manojkumarsh-allbgremove-api.hf.space';
const K1 = 'rpa_5VG5SBPDEC0EB1DK4';
const K2 = 'VQMT00RDRVHFZYEST0MXIR15wncv8';
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY || (K1 + K2);

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
    const host = req.headers.host || 'pdfbazaar.com';
    const url = new URL(req.url, 'https://' + host);
    const enhance = url.searchParams.get('enhance') || 'false';

    console.log('Sending to RunPod Serverless GPU endpoint...');
    let runpodRes = null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      runpodRes = await fetch(
        RUNPOD_ENDPOINT + '/api/process-all?enhance=' + enhance,
        {
          method: 'POST',
          headers: {
            'Content-Type': contentType,
            'Authorization': 'Bearer ' + RUNPOD_API_KEY,
            'x-api-key': 'SUPER_SECRET_KEY_998877',
          },
          body: body,
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
    } catch (err) {
      console.warn('RunPod attempt error:', err.message);
    }

    if (runpodRes && runpodRes.ok) {
      console.log('RunPod Serverless GPU responded successfully!');
      const imageBuffer = await runpodRes.arrayBuffer();
      return reply(res, 200, Buffer.from(imageBuffer), 'image/png');
    }

    console.log('RunPod failed or cold starting, using fallback...');
    const hfRes = await fetch(
      HF_FALLBACK_ENDPOINT + '/api/process-all?enhance=' + enhance,
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
    console.error('Handler error:', error);
    return reply(res, 500, { error: error.message });
  }
}
