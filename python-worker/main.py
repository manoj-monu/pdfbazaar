from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import cv2
import numpy as np
from PIL import Image
from rembg import remove, new_session
import io
import base64

app = FastAPI(title="ID Studio AI Worker", version="1.0.0")

# Initialize rembg session (downloads U2Net weights automatically if missing)
# Use u2net_human_seg for better human segmentation
session = new_session("u2net_human_seg")

# Load OpenCV's pre-trained face detector (Development adapter for SCRFD/RetinaFace)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.get("/health")
def health_check():
    return {"status": "ok", "gpu_available": False} # Change to True if CUDA is setup

@app.post("/api/process")
async def process_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    try:
        # 1. Read Image
        image_data = await file.read()
        pil_img = Image.open(io.BytesIO(image_data)).convert("RGB")
        cv_img = np.array(pil_img)
        cv_img = cv2.cvtColor(cv_img, cv2.COLOR_RGB2BGR)

        # 2. Image Quality & EXIF Orientation (Handled mostly by PIL)
        
        # 3. Face Detection & Multi-Face Check
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        if len(faces) == 0:
            return JSONResponse(status_code=400, content={"error": "Face not detected. Please upload a clear photo."})
        elif len(faces) > 1:
            return JSONResponse(status_code=400, content={"error": "Multiple faces detected. Please upload a photo with exactly one person."})

        # 4. Face Landmarks & Head Pose (Mock data for development adapter)
        x, y, w, h = faces[0]
        face_center = {"x": int(x + w/2), "y": int(y + h/2)}
        compliance_score = "PASS" if w > 100 else "WARNING" # Example check

        # 5. Background Removal & Hair/Edge Refinement (Using rembg)
        # rembg automatically applies alpha matting if configured
        transparent_img_data = remove(image_data, session=session, alpha_matting=True)
        
        # Convert to Base64 to send back to Node.js / Frontend
        b64_img = base64.b64encode(transparent_img_data).decode('utf-8')
        transparent_url = f"data:image/png;base64,{b64_img}"

        # 6. Lighting Correction & Enhancement (Phase 3 OpenCV adjustments can go here)

        return {
            "state": "COMPLETED",
            "result": {
                "aiData": {
                    "faceCount": 1,
                    "faceBoundingBox": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
                    "faceCenter": face_center,
                    "compliance": compliance_score,
                    "backgroundData": {
                        "transparentImageUrl": transparent_url
                    }
                }
            }
        }

    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during AI processing")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
