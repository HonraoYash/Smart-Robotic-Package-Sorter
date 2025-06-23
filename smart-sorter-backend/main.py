from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from rekognition_helper import detect_labels_and_text
from llm_classifier import classify_semantically
import shutil
import uuid
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

# Serve static files (for annotated image URLs)
os.makedirs("static/annotated_images", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def root():
    return {"message": "Backend is live!"}


@app.post("/classify")
async def classify_image(request: Request, file: UploadFile = File(...)):
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
    else:
        label = classify_semantically(detection_result)
        confidence = 0.9

    # Bin mapping logic
    bin_mapping = {"fragile": 1, "urgent": 2, "heavy": 3}
    bin_id = bin_mapping.get(label, 0)

    # Use dynamic domain
    base_url = str(request.base_url).rstrip("/")
    annotated_url = f"{base_url}/static/annotated_images/{filename}"

    return {
        "label": label,
        "confidence": confidence,
        "bin_id": bin_id,
        "annotated_image_url": annotated_url
    }
