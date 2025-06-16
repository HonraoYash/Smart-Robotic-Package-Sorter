from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from vision import detect_objects, extract_text_labels
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

# Serve annotated images
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def root():
    return {"message": "Backend is live!"}

@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    filename = f"temp_{uuid.uuid4()}.jpg"
    with open(filename, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # YOLO + image saving
    detections, annotated_file = detect_objects(filename)

    # OCR for FRAGILE, URGENT, HEAVY
    ocr_label = extract_text_labels(filename)
    os.remove(filename)

    # Prioritize OCR label
    if ocr_label:
        label = ocr_label
        confidence = 1.0
    elif detections:
        label = detections[0]["label"]
        confidence = detections[0]["confidence"]
    else:
        label = "unknown"
        confidence = 0.0

    # Match bins for Lovable simulation categories
    bin_mapping = {
        "fragile": 1,
        "urgent": 2,
        "heavy": 3,
        "box": 1,           # fallback
        "bottle": 1,
        "microwave": 1,
        "book": 1
    }
    bin_id = bin_mapping.get(label, 0)

    annotated_url = f"http://localhost:8000/static/annotated_images/{annotated_file}"

    return {
        "label": label,
        "confidence": confidence,
        "bin_id": bin_id,
        "annotated_image_url": annotated_url
    }
