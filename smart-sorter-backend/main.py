from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import Form
from typing import Optional
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
async def classify_image(
    file: Optional[UploadFile] = File(None),
    package_id: Optional[str] = Form(None)
):
    # CASE 1: User selected from rack (simulation)
    if package_id:
        package_file = f"packages/{package_id}.jpg"
        if not os.path.exists(package_file):
            return {"error": "Invalid package_id"}

        detections, annotated_file = detect_objects(package_file)
        ocr_label = extract_text_labels(package_file)
        label, confidence = classify_from_results(detections, ocr_label)
    # CASE 2: User uploaded a new image
    elif file:
        filename = f"temp_{uuid.uuid4()}.jpg"
        with open(filename, "wb") as f:
            shutil.copyfileobj(file.file, f)

        detections, annotated_file = detect_objects(filename)
        ocr_label = extract_text_labels(filename)
        label, confidence = classify_from_results(detections, ocr_label)
        os.remove(filename)
    else:
        return {"error": "No file or package_id provided"}

    # Decide bin
    bin_mapping = {
        "fragile": 1,
        "urgent": 2,
        "heavy": 3
    }
    bin_id = bin_mapping.get(label, 0)

    annotated_url = f"http://localhost:8000/static/annotated_images/{annotated_file}"

    return {
        "label": label,
        "confidence": confidence,
        "bin_id": bin_id,
        "annotated_image_url": annotated_url
    }

def classify_from_results(detections, ocr_label):
    if ocr_label:
        return ocr_label, 1.0
    elif detections:
        return detections[0]["label"], detections[0]["confidence"]
    else:
        return "unknown", 0.0