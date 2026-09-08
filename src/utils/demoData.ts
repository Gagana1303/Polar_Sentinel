import { Iceberg, Vessel, RouteOption, DetailedRiskAssessment, EnvironmentalConditions, DataSourceStatus } from '../types';
import { predictIcebergTrajectory, generateUncertaintyCorridors } from './geo';

// Seeded coordinates centered around Antarctic Prydz Bay / Mawson Sea (-67°S to -69°S, 70°E to 80°E)

export const INITIAL_ENVIRONMENT: EnvironmentalConditions = {
  oceanCurrentSpeedMs: 0.31,
  oceanCurrentDirDeg: 127,
  windSpeedKnots: 18.5,
  windDirDeg: 142,
  seaIceConcentrationPercent: 14,
  seaSurfaceTempC: -1.2,
  waveHeightMeters: 2.1,
  dataTimestamp: '2026-09-05T18:00:00Z',
};

// Base Icebergs with realistic Antarctic trajectories
export function getDemoIcebergs(): Iceberg[] {
  const env = INITIAL_ENVIRONMENT;

  // ICEBERG A-17 (The primary high-risk iceberg in scenario)
  const a17BaseLat = -68.42;
  const a17BaseLng = 74.31;
  const a17Forecast = predictIcebergTrajectory(
    a17BaseLat,
    a17BaseLng,
    0.42,
    127,
    env.oceanCurrentSpeedMs,
    env.oceanCurrentDirDeg,
    env.windSpeedKnots,
    env.windDirDeg,
    [6, 12, 18, 24, 48, 72]
  );

  const a17Historical = [
    { lat: -68.18, lng: 73.65, timeOffsetHours: -72, speedKnots: 0.38, headingDeg: 122 },
    { lat: -68.26, lng: 73.88, timeOffsetHours: -48, speedKnots: 0.40, headingDeg: 125 },
    { lat: -68.34, lng: 74.08, timeOffsetHours: -24, speedKnots: 0.41, headingDeg: 126 },
    { lat: a17BaseLat, lng: a17BaseLng, timeOffsetHours: 0, speedKnots: 0.42, headingDeg: 127 },
  ];

  const a17Uncertainty = generateUncertaintyCorridors(a17Forecast);
  const a17RiskLevel = 'high' as const;

  // ICEBERG B-09 (Medium size, drift north-east)
  const b09Forecast = predictIcebergTrajectory(-68.85, 75.80, 0.35, 110, env.oceanCurrentSpeedMs, env.oceanCurrentDirDeg, env.windSpeedKnots, env.windDirDeg);
  const b09Historical = [
    { lat: -68.70, lng: 75.30, timeOffsetHours: -48, speedKnots: 0.32, headingDeg: 108 },
    { lat: -68.85, lng: 75.80, timeOffsetHours: 0, speedKnots: 0.35, headingDeg: 110 },
  ];

  // ICEBERG C-22 (Smaller bergy bit, near coast)
  const c22Forecast = predictIcebergTrajectory(-67.95, 72.50, 0.28, 145, env.oceanCurrentSpeedMs, env.oceanCurrentDirDeg, env.windSpeedKnots, env.windDirDeg);

  // ICEBERG D-04 (Large tabular iceberg, far offshore)
  const d04Forecast = predictIcebergTrajectory(-67.40, 77.20, 0.50, 95, env.oceanCurrentSpeedMs, env.oceanCurrentDirDeg, env.windSpeedKnots, env.windDirDeg);

  // ICEBERG E-11 (Southern sea ice margin)
  const e11Forecast = predictIcebergTrajectory(-69.20, 71.80, 0.30, 135, env.oceanCurrentSpeedMs, env.oceanCurrentDirDeg, env.windSpeedKnots, env.windDirDeg);

  return [
    {
      id: 'ICE-A17',
      name: 'Iceberg A-17 (Tabular)',
      type: 'Tabular Iceberg',
      lat: a17BaseLat,
      lng: a17BaseLng,
      lengthMeters: 1450,
      widthMeters: 820,
      heightMeters: 45,
      areaKm2: 1.18,
      headingDeg: 127,
      speedKnots: 0.42,
      confidencePercent: 94,
      lastObservation: 'Sentinel-1 SAR (28 min ago)',
      detectionTimestamp: '2026-09-05T17:42:00Z',
      currentStatus: 'Active Drift Monitoring',
      riskLevel: a17RiskLevel,
      minClearanceNm: 5.8,
      historicalTrack: a17Historical,
      forecastTrack: a17Forecast,
      uncertaintyCorridor: a17Uncertainty,
      physicsAttribution: {
        oceanCurrentPercent: 54,
        windPercent: 27,
        seaIcePercent: 12,
        internalDynamicsPercent: 7,
        oceanCurrentSpeedMs: 0.31,
        windSpeedKnots: 18.5,
        seaIceConcPercent: 14,
      },
      detectionSource: 'Sentinel-1 SAR',
    },
    {
      id: 'ICE-B09',
      name: 'Iceberg B-09',
      type: 'Dome Iceberg',
      lat: -68.85,
      lng: 75.80,
      lengthMeters: 620,
      widthMeters: 380,
      heightMeters: 28,
      areaKm2: 0.24,
      headingDeg: 110,
      speedKnots: 0.35,
      confidencePercent: 91,
      lastObservation: 'Sentinel-2 Optical (1.2h ago)',
      detectionTimestamp: '2026-09-05T16:10:00Z',
      currentStatus: 'Secondary Track',
      riskLevel: 'medium',
      minClearanceNm: 12.4,
      historicalTrack: b09Historical,
      forecastTrack: b09Forecast,
      uncertaintyCorridor: generateUncertaintyCorridors(b09Forecast),
      physicsAttribution: {
        oceanCurrentPercent: 58,
        windPercent: 22,
        seaIcePercent: 14,
        internalDynamicsPercent: 6,
        oceanCurrentSpeedMs: 0.28,
        windSpeedKnots: 15.0,
        seaIceConcPercent: 18,
      },
      detectionSource: 'Sentinel-2 Optical',
    },
    {
      id: 'ICE-C22',
      name: 'Iceberg C-22',
      type: 'Pinnacled Iceberg',
      lat: -67.95,
      lng: 72.50,
      lengthMeters: 310,
      widthMeters: 190,
      heightMeters: 18,
      areaKm2: 0.06,
      headingDeg: 145,
      speedKnots: 0.28,
      confidencePercent: 88,
      lastObservation: 'Sentinel-1 SAR (3.4h ago)',
      detectionTimestamp: '2026-09-05T14:30:00Z',
      currentStatus: 'Coastal Drift',
      riskLevel: 'low',
      minClearanceNm: 24.1,
      historicalTrack: [
        { lat: -67.85, lng: 72.30, timeOffsetHours: -24, speedKnots: 0.26, headingDeg: 140 },
        { lat: -67.95, lng: 72.50, timeOffsetHours: 0, speedKnots: 0.28, headingDeg: 145 },
      ],
      forecastTrack: c22Forecast,
      uncertaintyCorridor: generateUncertaintyCorridors(c22Forecast),
      physicsAttribution: {
        oceanCurrentPercent: 62,
        windPercent: 20,
        seaIcePercent: 10,
        internalDynamicsPercent: 8,
        oceanCurrentSpeedMs: 0.25,
        windSpeedKnots: 12.0,
        seaIceConcPercent: 8,
      },
      detectionSource: 'Sentinel-1 SAR',
    },
    {
      id: 'ICE-D04',
      name: 'Iceberg D-04 (Offshore Mega-Iceberg)',
      type: 'Tabular Mega-Iceberg',
      lat: -67.40,
      lng: 77.20,
      lengthMeters: 2800,
      widthMeters: 1400,
      heightMeters: 60,
      areaKm2: 3.92,
      headingDeg: 95,
      speedKnots: 0.50,
      confidencePercent: 96,
      lastObservation: 'MODIS (4.1h ago)',
      detectionTimestamp: '2026-09-05T13:40:00Z',
      currentStatus: 'Offshore Drift',
      riskLevel: 'low',
      minClearanceNm: 42.0,
      historicalTrack: [
        { lat: -67.30, lng: 76.50, timeOffsetHours: -48, speedKnots: 0.48, headingDeg: 92 },
        { lat: -67.40, lng: 77.20, timeOffsetHours: 0, speedKnots: 0.50, headingDeg: 95 },
      ],
      forecastTrack: d04Forecast,
      uncertaintyCorridor: generateUncertaintyCorridors(d04Forecast),
      physicsAttribution: {
        oceanCurrentPercent: 70,
        windPercent: 15,
        seaIcePercent: 8,
        internalDynamicsPercent: 7,
        oceanCurrentSpeedMs: 0.40,
        windSpeedKnots: 22.0,
        seaIceConcPercent: 5,
      },
      detectionSource: 'MODIS',
    },
    {
      id: 'ICE-E11',
      name: 'Iceberg E-11',
      type: 'Bergy Bit',
      lat: -69.20,
      lng: 71.80,
      lengthMeters: 450,
      widthMeters: 260,
      heightMeters: 22,
      areaKm2: 0.11,
      headingDeg: 135,
      speedKnots: 0.30,
      confidencePercent: 89,
      lastObservation: 'Sentinel-1 SAR (5.0h ago)',
      detectionTimestamp: '2026-09-05T12:50:00Z',
      currentStatus: 'Pack Ice Trapped',
      riskLevel: 'low',
      minClearanceNm: 31.5,
      historicalTrack: [
        { lat: -69.10, lng: 71.60, timeOffsetHours: -24, speedKnots: 0.29, headingDeg: 132 },
        { lat: -69.20, lng: 71.80, timeOffsetHours: 0, speedKnots: 0.30, headingDeg: 135 },
      ],
      forecastTrack: e11Forecast,
      uncertaintyCorridor: generateUncertaintyCorridors(e11Forecast),
      physicsAttribution: {
        oceanCurrentPercent: 50,
        windPercent: 30,
        seaIcePercent: 15,
        internalDynamicsPercent: 5,
        oceanCurrentSpeedMs: 0.22,
        windSpeedKnots: 16.0,
        seaIceConcPercent: 22,
      },
      detectionSource: 'Sentinel-1 SAR',
    },
  ];
}

export const DEMO_VESSEL: Vessel = {
  id: 'VESSEL-AURORA',
  name: 'Research Vessel Aurora',
  vesselClass: 'Polar Class 3',
  type: 'Polar Research Ship',
  lat: -68.51,
  lng: 72.80,
  speedKnots: 11.4,
  headingDeg: 124,
  destination: 'Davis Station / McMurdo Route',
  destinationLat: -68.58,
  destinationLng: 77.96,
  etaDaysHours: '5d 12h',
  activeRouteId: 'ROUTE_C',
  safetyStatus: 'low',
  safetyClearanceNm: 15.0,
  currentRiskScore: 18,
};

// Route definitions (Route A: intersects Iceberg A-17 corridor at +18h, Route C: curves north safely)
export function getDemoRoutes(): RouteOption[] {
  // ROUTE A: Direct shortest path (Intersects Iceberg A-17 prediction zone!)
  const routeAPoints: [number, number][] = [
    [72.80, -68.51], // Start vessel pos
    [73.50, -68.48],
    [74.20, -68.45], // Near Iceberg A-17 predicted position at +18h! (Min clearance ~ 3.2 NM)
    [75.10, -68.42],
    [76.20, -68.46],
    [77.96, -68.58], // Destination
  ];

  // ROUTE B: Minor southward divergence (Medium risk, moderate ice)
  const routeBPoints: [number, number][] = [
    [72.80, -68.51],
    [73.40, -68.70],
    [74.50, -68.75],
    [75.80, -68.65],
    [76.80, -68.60],
    [77.96, -68.58],
  ];

  // ROUTE C: AI RECOMMENDED (Northward arc around Iceberg A-17 drift corridor)
  const routeCPoints: [number, number][] = [
    [72.80, -68.51],
    [73.30, -68.25], // Northward curve
    [74.40, -68.20], // Clear of A-17 by > 18.5 NM!
    [75.60, -68.30],
    [76.80, -68.45],
    [77.96, -68.58],
  ];

  return [
    {
      id: 'ROUTE_A',
      name: 'Direct Trans-Bay Channel',
      code: 'ROUTE_A',
      tag: 'Shortest',
      distanceNm: 1240,
      etaDaysHours: '5d 04h',
      etaHoursTotal: 124,
      riskLevel: 'high',
      riskScore: 78,
      iceExposurePercent: 64,
      seaIceExposurePercent: 24,
      minimumClearanceNm: 5.8,
      fuelEstimateTonnes: 142.5,
      isRecommended: false,
      conflictPoint: [74.20, -68.45],
      conflictTimeHours: 18,
      explanation: 'Shortest route, but predicted trajectory corridor of Iceberg A-17 intersects safety buffer in 18 hours.',
      recommendationReason: 'NOT RECOMMENDED: Intersects Iceberg A-17 15 NM safety zone at T+18h.',
      points: routeAPoints,
    },
    {
      id: 'ROUTE_B',
      name: 'Southern Coastal Bypass',
      code: 'ROUTE_B',
      tag: 'Balanced',
      distanceNm: 1276,
      etaDaysHours: '5d 08h',
      etaHoursTotal: 128,
      riskLevel: 'medium',
      riskScore: 48,
      iceExposurePercent: 38,
      seaIceExposurePercent: 38,
      minimumClearanceNm: 12.4,
      fuelEstimateTonnes: 148.0,
      isRecommended: false,
      explanation: 'Avoids direct iceberg intersection, but traverses areas with higher coastal sea ice concentration (38%).',
      recommendationReason: 'MODERATE RISK: Higher fuel consumption and 38% pack ice density.',
      points: routeBPoints,
    },
    {
      id: 'ROUTE_C',
      name: 'Northern Arc Diversion',
      code: 'ROUTE_C',
      tag: 'Recommended',
      distanceNm: 1312,
      etaDaysHours: '5d 12h',
      etaHoursTotal: 132,
      riskLevel: 'low',
      riskScore: 18,
      iceExposurePercent: 12,
      seaIceExposurePercent: 12,
      minimumClearanceNm: 18.5,
      fuelEstimateTonnes: 151.2,
      isRecommended: true,
      explanation: 'Adds 72 NM (+8h ETA) but reduces predicted iceberg exposure by 68% and maintains a 18.5 NM safety clearance.',
      recommendationReason: 'OPTIMAL: Reduces iceberg exposure by 68% and maintains 18.5 NM clearance.',
      points: routeCPoints,
    },
  ];
}

export const DEMO_RISK_ASSESSMENT: DetailedRiskAssessment = {
  overallScore: 78,
  riskLevel: 'high',
  predictedMinClearanceNm: 5.8,
  conflictWindowHours: 'T+18h to T+22h',
  conflictLocation: 'Sector Prydz Bay (68.45°S, 74.20°E)',
  summaryExplanation: 'Predicted trajectory corridor of Tabular Iceberg A-17 intersects vessel safety envelope in approximately 18 hours along Route A.',
  uncertainty: '±2.1 NM (80% CI)',
  safetyThresholdNm: 15.0,
  contributingFactors: [
    {
      label: 'Minimum Clearance',
      value: '5.8 NM',
      impact: 'critical',
      description: 'Below 15 NM minimum safety threshold for polar research vessels.',
    },
    {
      label: 'Trajectory Uncertainty',
      value: '2.1 NM (80% CI)',
      impact: 'high',
      description: 'Wind drift shift increases spatial overlap probability.',
    },
    {
      label: 'Iceberg Size & Momentum',
      value: '1.45 km length (1.18 km²)',
      impact: 'high',
      description: 'Tabular mass produces severe collision consequence.',
    },
    {
      label: 'Sea-Ice Concentration',
      value: '14% moderate pack',
      impact: 'medium',
      description: 'Limits sudden vessel maneuvers around drift path.',
    },
  ],
  recommendedAction: 'Execute Diversion via Route C (Northern Arc). Alters course by 14° North at T+4h.',
};

export const DEMO_DATA_SOURCES: DataSourceStatus[] = [
  {
    name: 'Sentinel-1 C-Band SAR',
    category: 'Satellite',
    provider: 'ESA Copernicus Program',
    resolution: '10m / Extra Wide Swath',
    updateFrequency: '12 - 24 hours',
    status: 'Operational',
    mode: 'DEMO',
    lastUpdated: '2026-09-05T17:42:00Z',
  },
  {
    name: 'Sentinel-2 MSI Optical',
    category: 'Satellite',
    provider: 'ESA Copernicus Program',
    resolution: '10m Color / Thermal',
    updateFrequency: '2 - 5 days',
    status: 'Operational',
    mode: 'DEMO',
    lastUpdated: '2026-09-05T16:10:00Z',
  },
  {
    name: 'ERA5 Global Reanalysis',
    category: 'Environmental',
    provider: 'ECMWF Climate Change Service',
    resolution: '0.25° x 0.25° grid',
    updateFrequency: 'Hourly',
    status: 'Operational',
    mode: 'DEMO',
    lastUpdated: '2026-09-05T18:00:00Z',
  },
  {
    name: 'Copernicus Marine Physics (NEMO)',
    category: 'Environmental',
    provider: 'Mercator Ocean International',
    resolution: '1/12° (~8km)',
    updateFrequency: 'Daily forecast',
    status: 'Operational',
    mode: 'DEMO',
    lastUpdated: '2026-09-05T12:00:00Z',
  },
  {
    name: 'GEBCO Bathymetric Chart',
    category: 'Bathymetry',
    provider: 'IHO / IOC Intergovernmental',
    resolution: '15 arc-second grid',
    updateFrequency: 'Static reference',
    status: 'Operational',
    mode: 'DEMO',
    lastUpdated: '2026-01-01T00:00:00Z',
  },
];
