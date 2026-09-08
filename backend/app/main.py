# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import List, Optional

# Import modular pipeline components
from app.data_ingestion import data_ingestion_service
from app.trajectory_engine import trajectory_engine_service
from app.route_optimizer import route_optimizer_service

app = FastAPI(
    title="Antarctic Ice Intelligence API",
    description="AI-Enabled Sea-Ice, Iceberg Trajectory & Navigation Decision Support System API for Smart India Hackathon 2026",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TrajectoryPredictRequest(BaseModel):
    icebergId: Optional[str] = "ICE-A17"
    currentLat: float = -68.42
    currentLng: float = 74.31
    speedKnots: float = 0.42
    headingDeg: float = 127
    oceanCurrentSpeedMs: float = 0.31
    oceanCurrentDirDeg: float = 127
    windSpeedKnots: float = 18.5
    windDirDeg: float = 142
    hoursForecast: List[int] = [6, 12, 18, 24, 48, 72]

class RiskAnalysisRequest(BaseModel):
    routeId: str = "ROUTE_A"
    icebergId: str = "ICE-A17"
    timeOffsetHours: float = 0

@app.get("/")
def read_root():
    return {
        "title": "ANTARCTIC ICE INTELLIGENCE API",
        "subtitle": "AI-Enabled Sea-Ice, Iceberg Trajectory & Navigation Decision Support System",
        "status": "OPERATIONAL",
        "mode": "DEMO",
        "sihYear": 2026,
        "modules": [
            "Module 1: Satellite & Weather Ingestion (Sentinel-1 SAR / CMEMS / ERA5)",
            "Module 2: Hydrodynamic Vector Trajectory & Monte Carlo Drift Engine",
            "Module 3: A* Graph Search & Dynamic Risk Route Optimizer"
        ]
    }

@app.get("/api/system/status")
def system_status():
    icebergs = data_ingestion_service.fetch_sar_iceberg_detections([-75, -70, 60, 80])
    routes = route_optimizer_service.compute_all_routes()
    return {
        "status": "OPERATIONAL",
        "mode": "DEMO",
        "activeIcebergs": len(icebergs),
        "vessel": "Research Vessel Aurora",
        "activeRoute": "ROUTE_C (Recommended)",
        "routesCount": len(routes),
        "timestamp": "2026-09-06T20:00:00Z"
    }

@app.get("/api/icebergs")
def get_icebergs():
    icebergs = data_ingestion_service.fetch_sar_iceberg_detections([-75, -70, 60, 80])
    return {"data": icebergs, "count": len(icebergs)}

@app.get("/api/environment")
def get_environment():
    return data_ingestion_service.fetch_ocean_environmental_fields(-68.42, 74.31)

@app.get("/api/routes")
def get_routes():
    routes = route_optimizer_service.compute_all_routes()
    return {"data": routes, "count": len(routes)}

@app.post("/api/predict-trajectory")
def predict_trajectory(req: TrajectoryPredictRequest):
    """
    Module 2: Calls Hydrodynamic Vector Drift Engine
    """
    result = trajectory_engine_service.predict_drift_trajectory(
        start_lat=req.currentLat,
        start_lng=req.currentLng,
        base_speed_knots=req.speedKnots,
        base_heading_deg=req.headingDeg,
        ocean_current_speed_ms=req.oceanCurrentSpeedMs,
        ocean_current_dir_deg=req.oceanCurrentDirDeg,
        wind_speed_knots=req.windSpeedKnots,
        wind_dir_deg=req.windDirDeg,
        hours_forecast=req.hoursForecast
    )
    return result

@app.post("/api/risk/analyze")
def analyze_risk(req: RiskAnalysisRequest):
    """
    Module 3: Calls A* Route Risk Evaluator
    """
    clearance = 5.8 if req.routeId == "ROUTE_A" else (14.2 if req.routeId == "ROUTE_B" else 28.5)
    return route_optimizer_service.evaluate_route_risk(req.routeId, clearance)
