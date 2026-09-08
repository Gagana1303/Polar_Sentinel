import { create } from 'zustand';
import { Iceberg, Vessel, RouteOption, DetailedRiskAssessment, EnvironmentalConditions, DataSourceStatus, SystemSettings } from '../types';
import { getDemoIcebergs, DEMO_VESSEL, getDemoRoutes, INITIAL_ENVIRONMENT, DEMO_DATA_SOURCES } from '../utils/demoData';
import { computeDynamicRiskAssessment } from '../utils/geo';

export interface MapLayerState {
  coastline: boolean;
  seaIce: boolean;
  icebergs: boolean;
  historicalTracks: boolean;
  predictedTrajectories: boolean;
  uncertaintyCorridors: boolean;
  vessel: boolean;
  routes: boolean;
  riskZones: boolean;
  oceanCurrents: boolean;
  windVectors: boolean;
}

interface AppStore {
  // Navigation & Theme
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Data Mode & Connection
  dataMode: 'DEMO' | 'LIVE';
  setDataMode: (mode: 'DEMO' | 'LIVE') => void;
  liveApiStatus: 'CONNECTED' | 'DISCONNECTED' | 'CHECKING';
  checkLiveApiStatus: () => Promise<boolean>;

  // Domain Objects
  icebergs: Iceberg[];
  selectedIcebergId: string | null;
  selectIceberg: (id: string | null) => void;

  vessel: Vessel;
  routes: RouteOption[];
  selectedRouteId: string;
  selectRoute: (id: string) => void;
  recalculateRoutes: () => void;

  riskAssessment: DetailedRiskAssessment;
  environment: EnvironmentalConditions;
  dataSources: DataSourceStatus[];

  // Settings & Debug Mode
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  isDebugMode: boolean;
  toggleDebugMode: () => void;

  // Map Layers
  layers: MapLayerState;
  toggleLayer: (layerKey: keyof MapLayerState) => void;

  // Simulation Timeline State
  simulationTimeOffset: number; // -72 to +48 hours
  isSimulating: boolean;
  simulationSpeed: number; // 1x, 2x, 5x
  setSimulationTimeOffset: (offset: number) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  setSimulationSpeed: (speed: number) => void;
  stepSimulation: (step: number) => void;

  // Command Center / SIH Demo Mode
  isPresentationMode: boolean;
  setPresentationMode: (val: boolean) => void;
  runFullSihDemo: () => void;

  // Notifications / Alerts
  notifications: { id: string; title: string; text: string; severity: 'info' | 'watch' | 'warning' | 'critical'; timestamp: string }[];
  dismissNotification: (id: string) => void;
}

const initialIcebergs = getDemoIcebergs();
const initialRoutes = getDemoRoutes();
const initialVessel = DEMO_VESSEL;
const initialEnv = INITIAL_ENVIRONMENT;
const initialSelectedIcebergId = 'ICE-A17';
const initialSelectedRouteId = 'ROUTE_C';

const initialRisk = computeDynamicRiskAssessment(
  initialIcebergs[0],
  initialVessel,
  initialRoutes.find((r) => r.id === initialSelectedRouteId) || initialRoutes[2],
  0,
  initialEnv
);

export const useAppStore = create<AppStore>((set, get) => ({
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),

  theme: 'light',
  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    if (typeof document !== 'undefined') {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme: nextTheme });
  },

  dataMode: 'DEMO',
  setDataMode: (mode) => {
    set({ dataMode: mode });
    if (mode === 'LIVE') {
      get().checkLiveApiStatus();
    }
  },

  liveApiStatus: 'DISCONNECTED',
  checkLiveApiStatus: async () => {
    set({ liveApiStatus: 'CHECKING' });
    try {
      const res = await fetch('http://localhost:8000/api/system/status', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        set({ liveApiStatus: 'CONNECTED' });
        // Optionally update data sources mode
        set((state) => ({
          dataSources: state.dataSources.map((ds) => ({ ...ds, mode: 'LIVE' })),
        }));
        return true;
      }
    } catch {
      // Backend offline
    }
    set({ liveApiStatus: 'DISCONNECTED' });
    return false;
  },

  icebergs: initialIcebergs,
  selectedIcebergId: initialSelectedIcebergId,
  selectIceberg: (id) => {
    const icebergs = get().icebergs;
    const selectedIce = icebergs.find((i) => i.id === id) || icebergs[0];
    const routes = get().routes;
    const selectedRoute = routes.find((r) => r.id === get().selectedRouteId) || routes[0];
    const newRisk = computeDynamicRiskAssessment(
      selectedIce,
      get().vessel,
      selectedRoute,
      get().simulationTimeOffset,
      get().environment
    );

    set({
      selectedIcebergId: id,
      riskAssessment: newRisk,
      vessel: {
        ...get().vessel,
        currentRiskScore: newRisk.overallScore,
        safetyStatus: newRisk.riskLevel,
      },
    });
  },

  vessel: {
    ...initialVessel,
    activeRouteId: initialSelectedRouteId,
    currentRiskScore: initialRisk.overallScore,
    safetyStatus: initialRisk.riskLevel,
  },
  routes: initialRoutes,
  selectedRouteId: initialSelectedRouteId,
  selectRoute: (id) => {
    const routes = get().routes;
    const selectedRoute = routes.find((r) => r.id === id) || routes[0];
    const icebergs = get().icebergs;
    const selectedIce = icebergs.find((i) => i.id === get().selectedIcebergId) || icebergs[0];
    const newRisk = computeDynamicRiskAssessment(
      selectedIce,
      get().vessel,
      selectedRoute,
      get().simulationTimeOffset,
      get().environment
    );

    set({
      selectedRouteId: id,
      riskAssessment: newRisk,
      vessel: {
        ...get().vessel,
        activeRouteId: id,
        currentRiskScore: newRisk.overallScore,
        safetyStatus: newRisk.riskLevel,
      },
    });
  },

  recalculateRoutes: () => {
    // Regenerate route metrics and trigger risk refresh
    const routes = getDemoRoutes();
    const icebergs = get().icebergs;
    const selectedIce = icebergs.find((i) => i.id === get().selectedIcebergId) || icebergs[0];
    const selectedRoute = routes.find((r) => r.id === get().selectedRouteId) || routes[2];
    const newRisk = computeDynamicRiskAssessment(
      selectedIce,
      get().vessel,
      selectedRoute,
      get().simulationTimeOffset,
      get().environment
    );

    set({
      routes,
      riskAssessment: newRisk,
      vessel: {
        ...get().vessel,
        currentRiskScore: newRisk.overallScore,
        safetyStatus: newRisk.riskLevel,
      },
    });
  },

  riskAssessment: initialRisk,
  environment: initialEnv,
  dataSources: DEMO_DATA_SOURCES,

  settings: {
    minSafetyBufferNm: 15,
    criticalClearanceNm: 4,
    stochasticIterations: 500,
  },
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  isDebugMode: false,
  toggleDebugMode: () => set((state) => ({ isDebugMode: !state.isDebugMode })),

  layers: {
    coastline: true,
    seaIce: true,
    icebergs: true,
    historicalTracks: true,
    predictedTrajectories: true,
    uncertaintyCorridors: true,
    vessel: true,
    routes: true,
    riskZones: true,
    oceanCurrents: false,
    windVectors: false,
  },
  toggleLayer: (layerKey) =>
    set((state) => ({
      layers: { ...state.layers, [layerKey]: !state.layers[layerKey] },
    })),

  simulationTimeOffset: 0,
  isSimulating: false,
  simulationSpeed: 1,

  setSimulationTimeOffset: (offset) => {
    const icebergs = get().icebergs;
    const selectedIce = icebergs.find((i) => i.id === get().selectedIcebergId) || icebergs[0];
    const routes = get().routes;
    const selectedRoute = routes.find((r) => r.id === get().selectedRouteId) || routes[0];
    const newRisk = computeDynamicRiskAssessment(
      selectedIce,
      get().vessel,
      selectedRoute,
      offset,
      get().environment
    );

    set({
      simulationTimeOffset: offset,
      riskAssessment: newRisk,
      vessel: {
        ...get().vessel,
        currentRiskScore: newRisk.overallScore,
        safetyStatus: newRisk.riskLevel,
      },
    });
  },

  setIsSimulating: (isSimulating) => set({ isSimulating }),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

  stepSimulation: (step) =>
    set((state) => {
      const allowedTimes = [-72, -48, -24, 0, 6, 12, 18, 24, 48];
      const idx = allowedTimes.indexOf(state.simulationTimeOffset);
      const nextIdx = Math.max(0, Math.min(allowedTimes.length - 1, (idx === -1 ? 3 : idx) + step));
      const nextOffset = allowedTimes[nextIdx];

      const selectedIce = state.icebergs.find((i) => i.id === state.selectedIcebergId) || state.icebergs[0];
      const selectedRoute = state.routes.find((r) => r.id === state.selectedRouteId) || state.routes[0];
      const newRisk = computeDynamicRiskAssessment(selectedIce, state.vessel, selectedRoute, nextOffset, state.environment);

      return {
        simulationTimeOffset: nextOffset,
        riskAssessment: newRisk,
        vessel: {
          ...state.vessel,
          currentRiskScore: newRisk.overallScore,
          safetyStatus: newRisk.riskLevel,
        },
      };
    }),

  isPresentationMode: false,
  setPresentationMode: (val) => set({ isPresentationMode: val }),

  runFullSihDemo: () => {
    // Reset to T-24h and step progressively through the storyline
    const routes = get().routes;
    const routeA = routes.find((r) => r.id === 'ROUTE_A') || routes[0];
    const icebergs = get().icebergs;
    const iceA17 = icebergs.find((i) => i.id === 'ICE-A17') || icebergs[0];
    const newRisk = computeDynamicRiskAssessment(iceA17, get().vessel, routeA, -24, get().environment);

    set({
      selectedIcebergId: 'ICE-A17',
      selectedRouteId: 'ROUTE_A',
      simulationTimeOffset: -24,
      isSimulating: true,
      activeTab: 'overview',
      riskAssessment: newRisk,
      vessel: {
        ...get().vessel,
        activeRouteId: 'ROUTE_A',
        currentRiskScore: newRisk.overallScore,
        safetyStatus: newRisk.riskLevel,
      },
    });
  },

  notifications: [
    {
      id: 'n1',
      title: 'HIGH RISK DETECTED',
      text: 'Iceberg A-17 trajectory corridor intersects vessel safety margin at T+18h.',
      severity: 'critical',
      timestamp: '12 min ago',
    },
    {
      id: 'n2',
      title: 'ROUTE RECALCULATED',
      text: 'AI Route Engine recommends Northern Arc (Route C) with 68% lower ice exposure.',
      severity: 'info',
      timestamp: '8 min ago',
    },
    {
      id: 'n3',
      title: 'SATELLITE DATA UPDATED',
      text: 'Sentinel-1 EW SAR pass processed successfully for Sector Prydz Bay.',
      severity: 'info',
      timestamp: '28 min ago',
    },
  ],
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

