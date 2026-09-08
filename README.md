# ANTARCTIC ICE INTELLIGENCE
### AI-Enabled Sea-Ice, Iceberg Trajectory & Navigation Decision Support System

> **Tagline**: *Don't just see the ice. Anticipate it.*
>
> Developed for **Smart India Hackathon 2026**.

---

## 1. Problem Statement & Executive Summary

Polar navigation in the Southern Ocean around Antarctica presents extreme risks to scientific research vessels, supply ships, and expedition fleets. Existing satellite dashboards provide static observations ("where the iceberg was when the satellite passed 12 hours ago"), but fail to answer the critical operational question:

> **"Where will the ice be when our vessel gets there?"**

**Antarctic Ice Intelligence** is a production-quality, scientifically credible decision support platform that bridges satellite observation, oceanographic physics, and explainable AI routing:

```
SATELLITE DATA → ICE DETECTION → ICEBERG TRACKING → ENVIRONMENTAL FUSION
→ TRAJECTORY PREDICTION → UNCERTAINTY FORECASTING → COLLISION/RISK ANALYSIS
→ ROUTE OPTIMIZATION → EXPLAINABLE AI RECOMMENDATION
```

---

## 2. Key Capabilities

1. **Synthetic Aperture Radar (SAR) Detection**: Processes Sentinel-1 EW C-band SAR and Sentinel-2 optical imagery for deep-learning segmentation (SegFormer-B3) of tabular icebergs and bergy bits.
2. **Physics-Informed Trajectory Predictor**: Coupled vector-drift model incorporating ocean currents (Copernicus NEMO), wind leeway (ERA5), and sea-ice drag.
3. **Monte Carlo Uncertainty Engine**: 500-run stochastic perturbation generating 50%, 80%, and 95% spatial confidence corridors.
4. **Transparent Risk Engine**: Non-blackbox scoring (0–100) combining time-aligned Haversine distance clearance, spatial uncertainty, iceberg mass, and sea-ice density.
5. **A* Graph Route Optimizer**: Evaluates cost matrices across open water, pack ice, and drift corridors to generate Route A (Direct), Route B (Coastal), and Route C (AI Recommended).
6. **Explainable AI Decision Support**: Explicit trade-off reasoning ("+72 NM, +8h ETA, -68% iceberg exposure, -60 risk score").

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Mapping**: MapLibre GL JS (open polar basemaps)
- **State Management**: Zustand
- **Visualization**: Recharts + Framer Motion + Lucide React
- **Design Language**: Tailwind CSS v3 + Manrope Font (Apple-level polish + modern healthcare SaaS cleanliness)

### Backend
- **Framework**: Python 3.11+ FastAPI
- **Validation**: Pydantic v2
- **Data Architecture**: GeoJSON spatial feature standard

---

## 4. SIH 2026 Guided Demonstration Flow

Click **RUN FULL DEMO** on the top header or navigate to **Simulation**:

- **T-24h**: Sentinel SAR pass acquires imagery; direct route appears clear.
- **NOW**: Segmentation engine detects Tabular Iceberg A-17 (1.45 km length).
- **+6h**: Drift tracking confirms 0.42 knots velocity at 127° heading.
- **+12h**: Physics predictor forecasts drift path intersecting vessel corridor.
- **+18h**: Risk engine flags HIGH RISK (5.8 NM clearance, score 78/100).
- **+20h**: Route engine generates Route C (Northern Arc diversion).
- **+24h**: Vessel executes safer route.
- **+48h**: Display **CONFLICT AVOIDED**.

---

## 5. Getting Started

### Prerequisites
- Node.js 18+ and npm

### Run Frontend
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### Run Python FastAPI Backend (Optional)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API docs available at `http://localhost:8000/docs`.

---

## 6. Scientific Honesty & Data Provenance

All predictions in Demo Mode run on deterministic seeded simulations calibrated with Antarctic oceanographic reference parameters. Live integration connectors are architected for Copernicus Marine (NEMO) and ECMWF ERA5 APIs.

---

### Protecting Lives. Enabling Sustainable Polar Operations.
