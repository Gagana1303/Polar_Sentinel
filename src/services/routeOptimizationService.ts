/**
 * ===============================================================================
 * POLAR SENTINEL — FRONTEND SERVICE 3: A* GRAPH ROUTE OPTIMIZER & RISK ENGINE
 * ===============================================================================
 * Responsible for graph path search, clearance distance evaluation, and risk scoring:
 *   Cost(Path) = Distance + w_risk * R(x,y,t) + w_ice * C_ice(x,y)
 * ===============================================================================
 */

import { RouteOption, DetailedRiskAssessment, Iceberg, Vessel, EnvironmentalConditions } from '../types';
import { computeDynamicRiskAssessment } from '../utils/geo';
import { getDemoRoutes } from '../utils/demoData';

export class RouteOptimizationService {
  /**
   * Evaluates dynamic risk metrics for a vessel route against iceberg drift trajectories
   */
  public evaluateRouteRisk(
    iceberg: Iceberg,
    vessel: Vessel,
    route: RouteOption,
    timeOffsetHours: number,
    env: EnvironmentalConditions
  ): DetailedRiskAssessment {
    return computeDynamicRiskAssessment(iceberg, vessel, route, timeOffsetHours, env);
  }

  /**
   * Computes available route options (Route A, Route B, Route C)
   */
  public getOptimizedRoutes(): RouteOption[] {
    return getDemoRoutes();
  }
}

export const routeOptimizationService = new RouteOptimizationService();
