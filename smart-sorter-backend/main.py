from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from rekognition_helper import detect_labels_and_text
from llm_classifier import classify_semantically
from fastapi import Form
from typing import Optional
# from vision import detect_objects, extract_text_labels
import shutil
import uuid
import os

app = FastAPI()

# CORS (for frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve annotated or raw uploaded images
os.makedirs("static/annotated_images", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def root():
    return {"message": "Backend is live!"}

@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    image_bytes = await file.read()

    # Save uploaded image
    filename = f"annotated_{uuid.uuid4()}.jpg"
    save_path = os.path.join("static", "annotated_images", filename)
    with open(save_path, "wb") as f:
        f.write(image_bytes)

    # Run Rekognition
    detection_result, confidence = detect_labels_and_text(image_bytes)

    # Case 1: OCR gave us an exact match
    if isinstance(detection_result, str):
        label = detection_result
        confidence = confidence or 1.0
    # Case 2: Use semantic LLM classification
    else:
        label = classify_semantically(detection_result)
        confidence = 0.9

    # Map to bins
    bin_mapping = {"fragile": 1, "urgent": 2, "heavy": 3}
    bin_id = bin_mapping.get(label, 0)

    return {
        "label": label,
        "confidence": confidence,
        "bin_id": bin_id,
        "annotated_image_url": f"http://localhost:8000/static/annotated_images/{filename}"
    }