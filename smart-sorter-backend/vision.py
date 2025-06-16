from ultralytics import YOLO
import cv2
import os
import uuid
import pytesseract
from PIL import Image

# Load YOLOv8 model
model = YOLO("yolov8n.pt")

# Annotated image output folder
ANNOTATED_DIR = "static/annotated_images"
os.makedirs(ANNOTATED_DIR, exist_ok=True)


def detect_objects(image_path: str):
    results = model(image_path)
    result = results[0]
    image = cv2.imread(image_path)

    detections = []

    for box in result.boxes:
        class_id = int(box.cls[0])
        confidence = float(box.conf[0])
        label = model.names[class_id]

        # Draw bounding boxes
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        color = (0, 255, 0)
        cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
        cv2.putText(image, f"{label} {confidence:.2f}", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        detections.append({
            "label": label,
            "confidence": round(confidence, 2)
        })

    # Save annotated image
    output_filename = f"annotated_{uuid.uuid4()}.jpg"
    output_path = os.path.join(ANNOTATED_DIR, output_filename)
    cv2.imwrite(output_path, image)

    return detections, output_filename



def extract_text_labels(image_path: str):
    # Load image
    image = cv2.imread(image_path)

    # Resize (scale up if needed)
    image = cv2.resize(image, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply thresholding to get black/white image
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)

    # Optional: save for debugging
    cv2.imwrite("preprocessed.jpg", thresh)

    # OCR
    text = pytesseract.image_to_string(thresh).lower()
    print("\n🧠 OCR Text:\n", text)

    # Match categories
    if "fragile" in text:
        return "fragile"
    elif "urgent" in text:
        return "urgent"
    elif "heavy" in text:
        return "heavy"
    return None
