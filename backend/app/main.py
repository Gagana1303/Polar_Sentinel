# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import List, Optional
import math

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

# Complete Demo Data matching Frontend Schemas
DEMO_ICEBERGS = [
    {
        "id": "ICE-A17",
        "name": "Iceberg A-17 (Tabular)",
        "type": "Tabular",
        "lat": -68.42,
        "lng": 74.31,
        "lengthMeters": 1450,
        "widthMeters": 820,
        "heightMeters": 42,
        "areaKm2": 1.18,
        "headingDeg": 127,
        "speedKnots": 0.42,
        "confidencePercent": 94,
        "lastObservation": "Sentinel-1 SAR (28 min ago)",
        "detectionTimestamp": "2026-09-06T19:30:00Z",
        "currentStatus": "Active Tracking",
        "riskLevel": "high",
        "minClearanceNm": 5.8,
        "detectionSource": "Sentinel-1 SAR",
        "physicsAttribution": {
            "oceanCurrentPercent": 54,
            "windPercent": 27,
            "seaIcePercent": 12,
            "internalDynamicsPercent": 7,
            "oceanCurrentSpeedMs": 0.31,
            "windSpeedKnots": 18.5,
            "seaIceConcPercent": 64.0
        },
        "historicalTrack": [
            {"lat": -68.22, "lng": 73.85, "timeOffsetHours": -72, "speedKnots": 0.38, "headingDeg": 122},
            {"lat": -68.29, "lng": 74.00, "timeOffsetHours": -48, "speedKnots": 0.40, "headingDeg": 125},
            {"lat": -68.36, "lng": 74.15, "timeOffsetHours": -24, "speedKnots": 0.41, "headingDeg": 126},
            {"lat": -68.42, "lng": 74.31, "timeOffsetHours": 0, "speedKnots": 0.42, "headingDeg": 127}
        ],
        "forecastTrack": [
            {"lat": -68.42, "lng": 74.31, "timeOffsetHours": 0, "speedKnots": 0.42, "headingDeg": 127, "uncertaintyRadiusNm": 0.5},
            {"lat": -68.48, "lng": 74.45, "timeOffsetHours": 6, "speedKnots": 0.43, "headingDeg": 128, "uncertaintyRadiusNm": 1.2},
            {"lat": -68.54, "lng": 74.59, "timeOffsetHours": 12, "speedKnots": 0.44, "headingDeg": 129, "uncertaintyRadiusNm": 1.8},
            {"lat": -68.60, "lng": 74.73, "timeOffsetHours": 18, "speedKnots": 0.45, "headingDeg": 130, "uncertaintyRadiusNm": 2.4},
            {"lat": -68.66, "lng": 74.87, "timeOffsetHours": 24, "speedKnots": 0.46, "headingDeg": 131, "uncertaintyRadiusNm": 3.1},
            {"lat": -68.78, "lng": 75.14, "timeOffsetHours": 48, "speedKnots": 0.48, "headingDeg": 133, "uncertaintyRadiusNm": 5.4},
            {"lat": -68.90, "lng": 75.40, "timeOffsetHours": 72, "speedKnots": 0.50, "headingDeg": 135, "uncertaintyRadiusNm": 8.0}
        ]
    },
    {
        "id": "ICE-B09",
        "name": "Iceberg B-09",
        "type": "Dome",
        "lat": -68.85,
        "lng": 75.80,
        "lengthMeters": 620,
        "widthMeters": 380,
        "heightMeters": 28,
        "areaKm2": 0.24,
        "headingDeg": 110,
        "speedKnots": 0.35,
        "confidencePercent": 91,
        "lastObservation": "Sentinel-2 Optical (1.2h ago)",
        "detectionTimestamp": "2026-09-06T18:40:00Z",
        "currentStatus": "Monitored",
        "riskLevel": "medium",
        "minClearanceNm": 12.4,
        "detectionSource": "Sentinel-2 Optical",
        "physicsAttribution": {
            "oceanCurrentPercent": 61,
            "windPercent": 22,
            "seaIcePercent": 10,
            "internalDynamicsPercent": 7,
            "oceanCurrentSpeedMs": 0.28,
            "windSpeedKnots": 15.0,
            "seaIceConcPercent": 55.0
        },
        "historicalTrack": [
            {"lat": -68.70, "lng": 75.45, "timeOffsetHours": -72, "speedKnots": 0.31, "headingDeg": 105},
            {"lat": -68.75, "lng": 75.56, "timeOffsetHours": -48, "speedKnots": 0.33, "headingDeg": 107},
            {"lat": -68.80, "lng": 75.68, "timeOffsetHours": -24, "speedKnots": 0.34, "headingDeg": 109},
            {"lat": -68.85, "lng": 75.80, "timeOffsetHours": 0, "speedKnots": 0.35, "headingDeg": 110}
        ],
        "forecastTrack": [
            {"lat": -68.85, "lng": 75.80, "timeOffsetHours": 0, "speedKnots": 0.35, "headingDeg": 110, "uncertaintyRadiusNm": 0.4},
            {"lat": -68.90, "lng": 75.92, "timeOffsetHours": 6, "speedKnots": 0.36, "headingDeg": 111, "uncertaintyRadiusNm": 1.0},
            {"lat": -68.95, "lng": 76.04, "timeOffsetHours": 12, "speedKnots": 0.37, "headingDeg": 112, "uncertaintyRadiusNm": 1.6},
            {"lat": -68.99, "lng": 76.16, "timeOffsetHours": 18, "speedKnots": 0.38, "headingDeg": 113, "uncertaintyRadiusNm": 2.2},
            {"lat": -69.04, "lng": 76.28, "timeOffsetHours": 24, "speedKnots": 0.39, "headingDeg": 114, "uncertaintyRadiusNm": 2.8},
            {"lat": -69.14, "lng": 76.52, "timeOffsetHours": 48, "speedKnots": 0.41, "headingDeg": 116, "uncertaintyRadiusNm": 4.9},
            {"lat": -69.24, "lng": 76.76, "timeOffsetHours": 72, "speedKnots": 0.43, "headingDeg": 118, "uncertaintyRadiusNm": 7.2}
        ]
    }
]

DEMO_VESSELS = [
    {
        "id": "VESSEL-AURORA",
        "name": "Research Vessel Aurora",
        "vesselClass": "Polar Class 3",
        "type": "Icebreaker Research Vessel",
        "lat": -67.85,
        "lng": 72.50,
        "speedKnots": 12.5,
        "headingDeg": 135,
        "destination": "Mawson Station",
        "destinationLat": -67.60,
        "destinationLng": 62.88,
        "etaDaysHours": "1d 08h",
        "activeRouteId": "ROUTE_C",
        "safetyStatus": "low",
        "safetyClearanceNm": 10.0,
        "currentRiskScore": 22
    }
]

DEMO_ROUTES = [
    {
        "id": "ROUTE_A",
        "name": "Direct Route A (Highest Risk)",
        "code": "ROUTE_A",
        "tag": "Shortest",
        "distanceNm": 342,
        "etaDaysHours": "1d 03h",
        "etaHoursTotal": 27.3,
        "riskLevel": "high",
        "riskScore": 78,
        "iceExposurePercent": 42,
        "seaIceExposurePercent": 42,
        "minimumClearanceNm": 5.8,
        "fuelEstimateTonnes": 38.5,
        "isRecommended": False,
        "explanation": "High proximity to trajectory corridor of Iceberg A-17 (predicted clearance 5.8 NM vs 10.0 NM safety buffer).",
        "recommendationReason": "Passes through predicted high-risk iceberg drift corridor.",
        "points": [
            [72.50, -67.85],
            [73.50, -68.10],
            [74.30, -68.40],
            [75.00, -68.70],
            [76.20, -69.00]
        ],
        "conflictPoint": [74.30, -68.40],
        "conflictTimeHours": 14.5
    },
    {
        "id": "ROUTE_B",
        "name": "Northern Bypass B (Medium Risk)",
        "code": "ROUTE_B",
        "tag": "Balanced",
        "distanceNm": 368,
        "etaDaysHours": "1d 05h",
        "etaHoursTotal": 29.4,
        "riskLevel": "medium",
        "riskScore": 45,
        "iceExposurePercent": 24,
        "seaIceExposurePercent": 24,
        "minimumClearanceNm": 14.2,
        "fuelEstimateTonnes": 41.2,
        "isRecommended": False,
        "explanation": "Bypasses primary iceberg drift track to the north; moderate sea-ice concentration encountered.",
        "recommendationReason": "Acceptable clearance, slightly increased fuel consumption.",
        "points": [
            [72.50, -67.85],
            [73.10, -67.60],
            [74.10, -67.75],
            [75.20, -68.20],
            [76.20, -69.00]
        ]
    },
    {
        "id": "ROUTE_C",
        "name": "Optimal Coastal Route C (Recommended)",
        "code": "ROUTE_C",
        "tag": "Recommended",
        "distanceNm": 385,
        "etaDaysHours": "1d 08h",
        "etaHoursTotal": 32.1,
        "riskLevel": "low",
        "riskScore": 22,
        "iceExposurePercent": 12,
        "seaIceExposurePercent": 12,
        "minimumClearanceNm": 28.5,
        "fuelEstimateTonnes": 43.8,
        "isRecommended": True,
        "explanation": "Maximizes clearance distance from tracked icebergs (>28 NM) and minimizes pack-ice resistance.",
        "recommendationReason": "Optimal balance of ice safety, regulatory buffer compliance, and smooth navigation.",
        "points": [
            [72.50, -67.85],
            [72.10, -68.20],
            [73.00, -68.70],
            [74.50, -69.10],
            [76.20, -69.00]
        ]
    }
]

DEMO_ENVIRONMENT = {
    "oceanCurrentSpeedMs": 0.31,
    "oceanCurrentDirDeg": 127,
    "windSpeedKnots": 18.5,
    "windDirDeg": 142,
    "seaIceConcentrationPercent": 64.0,
    "seaSurfaceTempC": -1.4,
    "waveHeightMeters": 1.8,
    "waveConditions": "Moderate swell (1.8m, SSE)",
    "dataTimestamp": "2026-09-06T19:00:00Z"
}

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
        "sihYear": 2026
    }

@app.get("/api/system/status")
def system_status():
    return {
        "status": "OPERATIONAL",
        "mode": "DEMO",
        "activeIcebergs": len(DEMO_ICEBERGS),
        "vessel": "Research Vessel Aurora",
        "activeRoute": "ROUTE_C (Recommended)",
        "timestamp": "2026-09-06T20:00:00Z"
    }

@app.get("/api/icebergs")
def get_icebergs():
    return {"data": DEMO_ICEBERGS, "count": len(DEMO_ICEBERGS)}

@app.get("/api/icebergs/{iceberg_id}")
def get_iceberg_detail(iceberg_id: str):
    for ice in DEMO_ICEBERGS:
        if ice["id"].upper() == iceberg_id.upper():
            return ice
    raise HTTPException(status_code=404, detail="Iceberg not found")

@app.get("/api/icebergs/{iceberg_id}/track")
def get_iceberg_track(iceberg_id: str):
    for ice in DEMO_ICEBERGS:
        if ice["id"].upper() == iceberg_id.upper():
            return {"id": ice["id"], "historicalTrack": ice["historicalTrack"]}
    raise HTTPException(status_code=404, detail="Iceberg not found")

@app.get("/api/icebergs/{iceberg_id}/forecast")
def get_iceberg_forecast(iceberg_id: str):
    for ice in DEMO_ICEBERGS:
        if ice["id"].upper() == iceberg_id.upper():
            return {"id": ice["id"], "forecastTrack": ice["forecastTrack"]}
    raise HTTPException(status_code=404, detail="Iceberg not found")

@app.get("/api/environment")
def get_environment():
    return DEMO_ENVIRONMENT

@app.get("/api/vessels")
def get_vessels():
    return {"data": DEMO_VESSELS, "count": len(DEMO_VESSELS)}

@app.get("/api/routes")
def get_routes():
    return {"data": DEMO_ROUTES, "count": len(DEMO_ROUTES)}

@app.post("/api/routes/generate")
def generate_routes():
    return {
        "status": "SUCCESS",
        "message": "Routes successfully computed with updated drift physics and sea-ice fields.",
        "routes": DEMO_ROUTES
    }

@app.post("/api/predict-trajectory")
def predict_trajectory(req: TrajectoryPredictRequest):
    v_base_x = req.speedKnots * math.sin(math.radians(req.headingDeg))
    v_base_y = req.speedKnots * math.cos(math.radians(req.headingDeg))

    current_knots = req.oceanCurrentSpeedMs * 1.94384
    v_ocean_x = current_knots * math.sin(math.radians(req.oceanCurrentDirDeg)) * 0.8
    v_ocean_y = current_knots * math.cos(math.radians(req.oceanCurrentDirDeg)) * 0.8

    v_wind_x = req.windSpeedKnots * math.sin(math.radians(req.windDirDeg)) * 0.02
    v_wind_y = req.windSpeedKnots * math.cos(math.radians(req.windDirDeg)) * 0.02

    v_total_x = v_base_x + v_ocean_x + v_wind_x
    v_total_y = v_base_y + v_ocean_y + v_wind_y

    total_speed = math.sqrt(v_total_x**2 + v_total_y**2)
    total_heading = (math.degrees(math.atan2(v_total_x, v_total_y)) + 360) % 360

    forecast = []
    curr_lat, curr_lng = req.currentLat, req.currentLng
    prev_h = 0

    for h in req.hoursForecast:
        dt = h - prev_h
        dist_nm = total_speed * dt
        d_lat = (dist_nm / 60.0) * math.cos(math.radians(total_heading))
        d_lng = (dist_nm / (60.0 * math.cos(math.radians(curr_lat)))) * math.sin(math.radians(total_heading))
        curr_lat += d_lat
        curr_lng += d_lng
        prev_h = h

        forecast.append({
            "timeOffsetHours": h,
            "lat": round(curr_lat, 4),
            "lng": round(curr_lng, 4),
            "speedKnots": round(total_speed, 2),
            "headingDeg": round(total_heading, 1),
            "uncertaintyRadiusNm": round(0.5 + 0.11 * h, 2)
        })

    return {
        "icebergId": req.icebergId,
        "model": "Physics-Informed Hydrodynamic Drift Model v2.1",
        "attribution": {
            "oceanCurrentPercent": 54,
            "windPercent": 27,
            "seaIcePercent": 12,
            "internalDynamicsPercent": 7
        },
        "forecastTrack": forecast
    }

@app.post("/api/risk/analyze")
def analyze_risk(req: RiskAnalysisRequest):
    route = next((r for r in DEMO_ROUTES if r["code"] == req.routeId or r["id"] == req.routeId), DEMO_ROUTES[0])
    
    if route["code"] == "ROUTE_A":
        return {
            "overallScore": 78,
            "riskLevel": "high",
            "predictedMinClearanceNm": 5.8,
            "conflictWindowHours": "T+12h to T+18h",
            "conflictLocation": "Lat 68.40°S, Lng 74.30°E",
            "summaryExplanation": "Route A intersects the 80% confidence drift corridor of Iceberg A-17.",
            "contributingFactors": [
                {"label": "Iceberg Proximity", "value": "5.8 NM", "impact": "high", "description": "Below 10 NM safety clearance buffer"},
                {"label": "Sea-Ice Exposure", "value": "42%", "impact": "medium", "description": "High pack ice density"},
                {"label": "Wind & Current Drift", "value": "18.5 kts SSE", "impact": "medium", "description": "Pushing iceberg towards route axis"}
            ],
            "recommendedAction": "EXECUTE COURSE ALTERATION TO ROUTE C IMMEDIATELY",
            "uncertainty": "Medium (Stochastic envelope +/- 1.8 NM)",
            "safetyThresholdNm": 10.0
        }
    elif route["code"] == "ROUTE_B":
        return {
            "overallScore": 45,
            "riskLevel": "medium",
            "predictedMinClearanceNm": 14.2,
            "conflictWindowHours": "None predicted",
            "summaryExplanation": "Route B maintains moderate clearance from Iceberg A-17.",
            "contributingFactors": [
                {"label": "Iceberg Proximity", "value": "14.2 NM", "impact": "low", "description": "Above safety buffer"},
                {"label": "Sea-Ice Exposure", "value": "24%", "impact": "low", "description": "Moderate ice density"}
            ],
            "recommendedAction": "MONITOR CORRIDOR CLOSELY; PREPARE FOR MARGINAL DETOUR IF WINDS INTENSIFY",
            "uncertainty": "Low (+/- 1.2 NM)",
            "safetyThresholdNm": 10.0
        }
    else:
        return {
            "overallScore": 22,
            "riskLevel": "low",
            "predictedMinClearanceNm": 28.5,
            "conflictWindowHours": "None predicted",
            "summaryExplanation": "Route C provides maximum clearance from all active hazards.",
            "contributingFactors": [
                {"label": "Iceberg Proximity", "value": "28.5 NM", "impact": "low", "description": "Well clear of all tracked icebergs"},
                {"label": "Sea-Ice Exposure", "value": "12%", "impact": "low", "description": "Open water lead navigation"}
            ],
            "recommendedAction": "MAINTAIN OPTIMAL ROUTE C AND STANDING WATCH",
            "uncertainty": "Low (+/- 0.8 NM)",
            "safetyThresholdNm": 10.0
        }

