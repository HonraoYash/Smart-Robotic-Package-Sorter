from ultralytics import YOLO
import cv2
import os
import uuid

# Load the YOLO model once
model = YOLO("yolov8n.pt")

# Output folder for annotated images
ANNOTATED_DIR = "static/annotated_images"
os.makedirs(ANNOTATED_DIR, exist_ok=True)

def detect_objects(image_path: str):
    results = model(image_path)
    result = results[0]

    # Load image to draw on
    image = cv2.imread(image_path)

    detections = []

    for box in result.boxes:
        class_id = int(box.cls[0])
        confidence = float(box.conf[0])
        label = model.names[class_id]

        # Bounding box coords
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        color = (0, 255, 0)
        cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
        cv2.putText(image, f"{label} {confidence:.2f}", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        detections.append({
            "label": label,
            "confidence": round(confidence, 2)
        })

    # Save the annotated image
    output_filename = f"annotated_{uuid.uuid4()}.jpg"
    output_path = os.path.join(ANNOTATED_DIR, output_filename)
    cv2.imwrite(output_path, image)

    return detections, output_filename
