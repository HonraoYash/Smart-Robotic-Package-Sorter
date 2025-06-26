from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from rekognition_helper import detect_labels_and_text
from llm_classifier import classify_semantically
import os

app = FastAPI()

# CORS (for frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Backend is live!"}


@app.post("/classify")
async def classify_image(request: Request, file: UploadFile = File(...)):
    image_bytes = await file.read()

    # Run Rekognition
    detection_result, confidence = detect_labels_and_text(image_bytes)

    # Case 1: OCR gave us an exact match
    if isinstance(detection_result, str):
        label = detection_result
        confidence = confidence or 1.0
    else:
        label = classify_semantically(detection_result)
        confidence = 0.9

    # Bin mapping logic
    bin_mapping = {"fragile": 1, "urgent": 2, "heavy": 3}
    bin_id = bin_mapping.get(label, 0)

    return {
        "label": label,
        "confidence": confidence,
        "bin_id": bin_id
    }
