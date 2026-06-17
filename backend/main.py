from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from detect import run_detection

app = FastAPI()

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AgroEye Backend Running!"}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    detections = run_detection(contents, file.filename)
    return {
        "filename": file.filename,
        "detections": detections,
        "count": len(detections)
    }