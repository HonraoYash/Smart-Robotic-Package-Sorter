import boto3
import os

rekognition = boto3.client(
    "rekognition",
    region_name=os.getenv("AWS_REGION", "us-east-1")
)


def detect_labels_and_text(image_bytes):
    label_response = rekognition.detect_labels(
        Image={"Bytes": image_bytes},
        MaxLabels=5,
        MinConfidence=70
    )
    text_response = rekognition.detect_text(Image={"Bytes": image_bytes})

    # OCR override
    texts = [t["DetectedText"].lower() for t in text_response["TextDetections"]]
    for t in texts:
        if "fragile" in t:
            return "fragile", 1.0
        elif "urgent" in t:
            return "urgent", 1.0
        elif "heavy" in t:
            return "heavy", 1.0

    # Otherwise, return all detected labels
    labels = [label["Name"].lower() for label in label_response["Labels"]]
    return labels, None
