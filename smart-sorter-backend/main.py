from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from vision import detect_objects
import shutil
import uuid
import os

app = FastAPI()


app.mount("/static", StaticFiles(directory="static"), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with frontend origin for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is live!"}

@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    filename = f"temp_{uuid.uuid4()}.jpg"
    with open(filename, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Run YOLO detection + get image file
    detections, annotated_file = detect_objects(filename)
    os.remove(filename)

    if detections:
        top = detections[0]
        label = top["label"]
        confidence = top["confidence"]

        bin_mapping = {
            "box": 1,
            "bottle": 2,
            "book": 3,
            "microwave": 1,
        }
        bin_id = bin_mapping.get(label, 1)
    else:
        label = "unknown"
        confidence = 0.0
        bin_id = 0

    annotated_url = f"http://localhost:8000/static/annotated_images/{annotated_file}"

    return {
        "label": label,
        "confidence": confidence,
        "bin_id": bin_id,
        "annotated_image_url": annotated_url
    }