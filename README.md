# AgroEye 👁️🌾

AI-powered crop monitoring dashboard for Indian farmers — combining a real-time drone telemetry interface with a working crop disease detection model.

## Overview

AgroEye simulates an autonomous drone monitoring system: live telemetry, farm zone health tracking, disease alerts, and a control panel for drone operations. The crop disease detection feature is fully functional — upload a leaf image and get a real prediction from a custom-trained YOLOv8 model.

## Features

- **Crop Disease Detection** — Upload a leaf photo and get a prediction from a custom-trained YOLOv8 Nano model (28 disease classes)
- **Drone Telemetry Dashboard** — Live-updating altitude, battery, speed, and flight time
- **Crop Health Map** — Color-coded status across 9 farm zones
- **Disease Alerts** — Real-time alert feed with treatment recommendations
- **Drone Control Panel** — Arm, takeoff, land, return-home, and mission controls
- **GPS Farm Map** — Satellite view with animated drone position tracking
- **Disease Reference Library** — 28 crop diseases with bilingual (Hindi/English) descriptions
- **Bilingual Interface** — Full Hindi/English language toggle

## AI Model

The disease detection feature uses a YOLOv8 Nano classification model trained on the [PlantDoc dataset](https://github.com/pratikkayal/PlantDoc-Dataset) (28 plant/disease classes spanning tomato, potato, corn, grape, apple, and more). Trained for 30 epochs on a Colab T4 GPU, currently achieving ~59% top-1 and ~90% top-5 validation accuracy.

## Tech Stack

**Frontend:** React (Vite), Recharts, Leaflet.js
**Backend:** FastAPI, Ultralytics YOLOv8, Python 3.10

## Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend runs at `http://localhost:5173`. Backend API docs at `http://localhost:8000/docs`.

## API

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/` | Health check |
| POST | `/detect` | Upload a leaf image, returns disease predictions with confidence scores |

## Project Structure

AgroEye/

├── frontend/

│   ├── src/

│   │   ├── App.jsx

│   │   └── App.css

│   └── package.json

└── backend/

├── main.py

├── detect.py

├── best.pt

└── requirements.txt

## Author

**Niks**
[GitHub](https://github.com/Nikita2434)

## License

MIT
