import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from PIL import Image
import io
import torch
from transformers import AutoModelForImageSegmentation
from torchvision import transforms

app = FastAPI()

# Deploying BiRefNet ULTRA LIGHT as requested
device = "cpu"
print("Loading BiRefNet Ultra Light model...")
model = AutoModelForImageSegmentation.from_pretrained(
    "ZhengPeng7/BiRefNet_lite", 
    trust_remote_code=True,
    low_cpu_mem_usage=True
)
model.to(device)
model.eval()

def process(image):
    # Standard BiRefNet processing for Lite version
    input_size = (1024, 1024)
    original_size = image.size
    
    transform = transforms.Compose([
        transforms.Resize(input_size),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    input_tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        preds = model(input_tensor)[-1].sigmoid().cpu()
    
    pred = preds[0].squeeze()
    mask = transforms.ToPILImage()(pred)
    mask = mask.resize(original_size, Image.LANCZOS)
    
    result = image.convert("RGBA")
    result.putalpha(mask)
    return result

@app.post("/api/process-all")
async def process_all(file: UploadFile = File(...), enhance: bool = False):
    try:
        data = await file.read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
        result = process(img)
        
        buf = io.BytesIO()
        result.save(buf, format="PNG")
        return Response(content=buf.getvalue(), media_type="image/png")
    except Exception as e:
        print(f"Error: {e}")
        return Response(content=str(e), status_code=500)

@app.get("/")
def root():
    return {"status": "BiRefNet_ULTRA_LIGHT_Active"}
