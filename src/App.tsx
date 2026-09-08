import React from 'react';
import { useAppStore } from './store/useAppStore';
import { AppLayout } from './components/layout/AppLayout';
import { OverviewPage } from './pages/Overview';
import { IcebergIntelligencePage } from './pages/IcebergIntelligence';
import { TrajectoryTrackingPage } from './pages/TrajectoryTracking';
import { NavigationPage } from './pages/Navigation';
import { SeaIcePage } from './pages/SeaIce';
import { AIPredictionsPage } from './pages/AIPredictions';
import { AlertsPage } from './pages/Alerts';
import { AnalyticsPage } from './pages/Analytics';
import { SettingsPage } from './pages/Settings';
import { ModelIntelligencePage } from './pages/ModelIntelligence';

export function App() {
  const { activeTab } = useAppStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'ice-intelligence':
        return <IcebergIntelligencePage />;
      case 'tracking':
        return <TrajectoryTrackingPage />;
      case 'navigation':
        return <NavigationPage />;
      case 'sea-ice':
        return <SeaIcePage />;
      case 'ai-predictions':
        return <AIPredictionsPage />;
      case 'model-intelligence':
        return <ModelIntelligencePage />;
      case 'alerts':
        return <AlertsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return <AppLayout>{renderContent()}</AppLayout>;
}

export default App;
