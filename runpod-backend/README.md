# PassportSnap Pro — Project Files

## Files
- `index.html` — Complete website (single file, all CSS + JS included)
- `api-proxy.js` — Node.js/Next.js API route for BG remove (proxy)

## Deploy on allbgremove.com (Next.js)

### Step 1 — Copy index.html content
Paste the HTML content into your Next.js project as a page,
or serve it as a static file.

### Step 2 — Add API proxy route
Copy `api-proxy.js` to:
  `pages/api/remove-bg.js`  (Next.js pages router)
  OR
  `app/api/remove-bg/route.js`  (Next.js app router)

### Step 3 — Update API URL in index.html
Find this line in index.html:
  `https://manojkumarsh-ai-passport-studio-pro.hf.space/api/process-all`
Replace with:
  `/api/remove-bg`

### That's it! No CORS issue because call is server-side.
