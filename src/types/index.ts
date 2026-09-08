export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface TrajectoryPoint {
  lat: number;
  lng: number;
  timeOffsetHours: number; // e.g. -72, -48, -24, 0, 6, 12, 18, 24, 48, 72
  speedKnots: number;
  headingDeg: number;
  uncertaintyRadiusNm?: number;
}

export interface UncertaintyCorridor {
  confidence50: [number, number][]; // Polygon coordinates [lng, lat]
  confidence80: [number, number][];
  confidence95: [number, number][];
}

export interface PhysicsAttribution {
  oceanCurrentPercent: number;
  windPercent: number;
  seaIcePercent: number;
  internalDynamicsPercent: number;
  oceanCurrentSpeedMs: number;
  windSpeedKnots: number;
  seaIceConcPercent: number;
}

export interface Iceberg {
  id: string;
  name: string;
  type: string; // e.g. 'Tabular', 'Dome', 'Pinnacled', 'Bergy Bit'
  lat: number;
  lng: number;
  lengthMeters: number;
  widthMeters: number;
  heightMeters?: number;
  areaKm2: number;
  headingDeg: number;
  speedKnots: number;
  confidencePercent: number;
  lastObservation: string;
  detectionTimestamp: string;
  currentStatus: string;
  riskLevel: RiskLevel;
  minClearanceNm: number;
  historicalTrack: TrajectoryPoint[];
  forecastTrack: TrajectoryPoint[];
  uncertaintyCorridor?: UncertaintyCorridor;
  physicsAttribution: PhysicsAttribution;
  detectionSource: 'Sentinel-1 SAR' | 'Sentinel-2 Optical' | 'MODIS' | 'Aerial Recon';
}

export interface Vessel {
  id: string;
  name: string;
  vesselClass: string; // e.g. 'Polar Class 3'
  type: string;
  lat: number;
  lng: number;
  speedKnots: number;
  headingDeg: number;
  destination: string;
  destinationLat: number;
  destinationLng: number;
  etaDaysHours: string;
  activeRouteId: string;
  safetyStatus: RiskLevel;
  safetyClearanceNm: number;
  currentRiskScore: number;
}

export interface RouteOption {
  id: string;
  name: string;
  code: 'ROUTE_A' | 'ROUTE_B' | 'ROUTE_C';
  tag: 'Shortest' | 'Balanced' | 'Recommended';
  distanceNm: number;
  etaDaysHours: string;
  etaHoursTotal: number;
  riskLevel: RiskLevel;
  riskScore: number;
  iceExposurePercent: number;
  seaIceExposurePercent: number;
  minimumClearanceNm: number;
  fuelEstimateTonnes: number;
  isRecommended: boolean;
  explanation?: string;
  recommendationReason?: string;
  points: [number, number][]; // GeoJSON format [lng, lat]
  conflictPoint?: [number, number];
  conflictTimeHours?: number;
}

export interface RiskFactor {
  label: string;
  value: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface DetailedRiskAssessment {
  overallScore: number; // 0 - 100
  riskLevel: RiskLevel;
  predictedMinClearanceNm: number;
  conflictWindowHours: string;
  conflictLocation?: string;
  summaryExplanation: string;
  contributingFactors: RiskFactor[];
  recommendedAction: string;
  uncertainty: string;
  safetyThresholdNm: number;
}

export interface EnvironmentalConditions {
  oceanCurrentSpeedMs: number;
  oceanCurrentDirDeg: number;
  windSpeedKnots: number;
  windDirDeg: number;
  seaIceConcentrationPercent: number;
  seaSurfaceTempC: number;
  waveHeightMeters: number;
  waveConditions?: string;
  dataTimestamp: string;
}

export interface SimulationState {
  timeOffsetHours: number; // -72 to +48
  isPlaying: boolean;
  playbackSpeed: number; // 1x, 2x, 5x
  currentStepIndex: number;
  debugMode?: boolean;
}

export interface DataSourceStatus {
  name: string;
  category: 'Satellite' | 'Environmental' | 'Bathymetry';
  provider: string;
  resolution: string;
  updateFrequency: string;
  status: 'Operational' | 'Degraded' | 'Offline';
  mode: 'DEMO' | 'LIVE' | 'PROVIDER READY';
  lastUpdated: string;
}

export interface SystemSettings {
  minSafetyBufferNm: number;
  criticalClearanceNm: number;
  stochasticIterations: number;
}
