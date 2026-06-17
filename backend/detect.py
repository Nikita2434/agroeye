from ultralytics import YOLO
from PIL import Image
import io

# Load YOUR trained plant disease model
model = YOLO("best.pt")

def run_detection(file_bytes: bytes, filename: str):
    image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    
    # Run classification inference
    results = model(image)
    
    detections = []
    for result in results:
        # Classification model returns top predictions
        probs = result.probs
        top5_indices = probs.top5
        top5_conf = probs.top5conf.tolist()
        
        for idx, conf in zip(top5_indices, top5_conf):
            detections.append({
                "label": model.names[int(idx)],
                "confidence": round(float(conf), 2),
                "bbox": {"x1": 0, "y1": 0, "x2": 0, "y2": 0}
            })
    
    return detections