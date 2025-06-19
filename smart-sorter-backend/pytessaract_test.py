import boto3

# Load image
with open("boxes/FRG001.jpeg", "rb") as img_file:
    image_bytes = img_file.read()

# Create Rekognition client
rekognition = boto3.client("rekognition")

# Detect labels
response = rekognition.detect_labels(
    Image={"Bytes": image_bytes},
    MaxLabels=5,
    MinConfidence=70
)

print("🧠 Detected Labels:")
for label in response['Labels']:
    print(f"🔹 {label['Name']} ({label['Confidence']:.2f}%)")
