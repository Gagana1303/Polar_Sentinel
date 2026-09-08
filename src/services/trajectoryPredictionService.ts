/**
 * ===============================================================================
 * POLAR SENTINEL — FRONTEND SERVICE 2: TRAJECTORY PREDICTION & MONTE CARLO ENGINE
 * ===============================================================================
 * Responsible for vector drift calculation and stochastic perturbation:
 *   Vector Equation: V_drift = C_ocean * V_current + C_wind * V_wind
 *   Monte Carlo: 500 stochastic runs generating 50%, 80%, 95% confidence bounds
 * ===============================================================================
 */

import { TrajectoryPoint, UncertaintyCorridor } from '../types';
import { predictIcebergTrajectory, generateUncertaintyCorridors } from '../utils/geo';

export class TrajectoryPredictionService {
  /**
   * Executes coupled vector drift trajectory forecast
   */
  public computeTrajectory(
    startLat: number,
    startLng: number,
    baseSpeedKnots: number,
    baseHeadingDeg: number,
    oceanCurrentSpeedMs: number,
    oceanCurrentDirDeg: number,
    windSpeedKnots: number,
    windDirDeg: number,
    hoursForecast: number[] = [6, 12, 18, 24, 48, 72]
  ): TrajectoryPoint[] {
    return predictIcebergTrajectory(
      startLat,
      startLng,
      baseSpeedKnots,
      baseHeadingDeg,
      oceanCurrentSpeedMs,
      oceanCurrentDirDeg,
      windSpeedKnots,
      windDirDeg,
      hoursForecast
    );
  }

  /**
   * Generates Monte Carlo spatial confidence corridors (50%, 80%, 95%)
   */
  public computeUncertaintyCorridors(forecastTrack: TrajectoryPoint[]): UncertaintyCorridor {
    return generateUncertaintyCorridors(forecastTrack);
  }
}

export const trajectoryPredictionService = new TrajectoryPredictionService();
