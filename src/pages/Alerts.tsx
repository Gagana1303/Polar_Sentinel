import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Bell, AlertTriangle, Info, ShieldAlert, MapPin, Clock, CheckCircle, X } from 'lucide-react';

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
  critical: { color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)', icon: <ShieldAlert size={16} />, label: 'HIGH RISK' },
  warning: { color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)', icon: <AlertTriangle size={16} />, label: 'MEDIUM RISK' },
  watch: { color: '#fb923c', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.15)', icon: <AlertTriangle size={16} />, label: 'WATCH' },
  info: { color: '#38bdf8', bg: 'rgba(56,189,248,0.06)', border: 'rgba(56,189,248,0.1)', icon: <Info size={16} />, label: 'INFO' },
};

// Extended alerts
const EXTENDED_ALERTS = [
  {
    id: 'a1', severity: 'critical' as const,
    title: 'Iceberg A-17 Collision Risk',
    text: 'Iceberg A-17A approaching planned vessel corridor. Predicted clearance of 5.8 NM at T+18h — below 15 NM safety threshold.',
    time: '12 min ago', location: '68.45°S, 74.20°E',
    action: 'Execute route diversion to Route C (Northern Arc). Course adjustment recommended at T+4h.',
  },
  {
    id: 'a2', severity: 'warning' as const,
    title: 'Sea-Ice Concentration Increase',
    text: 'Sea-ice concentration increasing to 22% near Mawson Coast research zone. May affect vessel maneuverability.',
    time: '28 min ago', location: '68.5°S, 72.0°E',
    action: 'Monitor ice conditions. Consider speed reduction in affected sector.',
  },
  {
    id: 'a3', severity: 'info' as const,
    title: 'Trajectory Data Updated',
    text: 'New iceberg trajectory predictions computed from latest Sentinel-1 SAR pass. 5 icebergs updated.',
    time: '45 min ago', location: 'Sector Prydz Bay',
    action: 'Review updated trajectories in Tracking view.',
  },
  {
    id: 'a4', severity: 'info' as const,
    title: 'Satellite Pass Complete',
    text: 'Sentinel-1 EW SAR pass processed successfully. Coverage: Prydz Bay sector. Resolution: 10m.',
    time: '1h ago', location: 'Full sector coverage',
    action: 'New imagery available for analysis.',
  },
  {
    id: 'a5', severity: 'warning' as const,
    title: 'Wind Speed Increase',
    text: 'Wind speed forecast to increase to 25+ knots in next 6 hours. May affect iceberg drift predictions.',
    time: '2h ago', location: 'Regional',
    action: 'Recompute trajectory forecasts with updated wind data.',
  },
  {
    id: 'a6', severity: 'info' as const,
    title: 'AI Model Recalibrated',
    text: 'Physics-informed trajectory model recalibrated with latest ocean current data from NEMO.',
    time: '3h ago', location: 'System',
    action: 'No action required. Model accuracy improved.',
  },
];

export const AlertsPage: React.FC = () => {
  const { setActiveTab, selectIceberg } = useAppStore();
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());

  const visibleAlerts = EXTENDED_ALERTS.filter(a => !dismissed.has(a.id));

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  const handleViewOnMap = (alert: typeof EXTENDED_ALERTS[0]) => {
    if (alert.id === 'a1') {
      selectIceberg('ICE-A17');
      setActiveTab('tracking');
    } else {
      setActiveTab('overview');
    }
  };

  const criticalCount = visibleAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = visibleAlerts.filter(a => a.severity === 'warning').length;
  const infoCount = visibleAlerts.filter(a => a.severity === 'info').length;

  return (
    <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.15em', marginBottom: 6 }}>
              ALERTS CENTER
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
              Operational Alerts & Notifications
            </h1>
          </div>

          {/* Summary badges */}
          <div style={{ display: 'flex', gap: 8 }}>
            {criticalCount > 0 && (
              <span className="risk-critical" style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 9999 }}>
                {criticalCount} CRITICAL
              </span>
            )}
            {warningCount > 0 && (
              <span className="risk-medium" style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 9999 }}>
                {warningCount} WARNING
              </span>
            )}
            <span className="risk-low" style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 9999 }}>
              {infoCount} INFO
            </span>
          </div>
        </div>

        {/* Alerts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visibleAlerts.map((alert, idx) => {
            const config = SEVERITY_CONFIG[alert.severity];
            return (
              <div
                key={alert.id}
                className="animate-fade-in"
                style={{
                  padding: '16px 20px', borderRadius: 10,
                  background: config.bg,
                  border: `1px solid ${config.border}`,
                  animationDelay: `${idx * 80}ms`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: config.color }}>{config.icon}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 9999,
                      background: `${config.color}15`, color: config.color,
                      letterSpacing: '0.08em',
                    }}>
                      {config.label}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    style={{
                      padding: '2px', borderRadius: 4,
                      background: 'transparent', border: 'none',
                      color: '#475569', cursor: 'pointer',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: '0 0 6px' }}>
                  {alert.title}
                </h3>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 10px', lineHeight: 1.5 }}>
                  {alert.text}
                </p>

                <div style={{ display: 'flex', gap: 12, fontSize: 10, color: '#64748b', marginBottom: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} /> {alert.time}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={10} /> {alert.location}
                  </span>
                </div>

                {/* Recommended Action */}
                <div style={{
                  padding: '8px 10px', borderRadius: 6,
                  background: 'rgba(56,189,248,0.04)',
                  border: '1px solid rgba(56,189,248,0.06)',
                  fontSize: 11, color: '#7dd3fc', marginBottom: 10,
                }}>
                  <span style={{ fontWeight: 700, color: '#64748b' }}>Action: </span>
                  {alert.action}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    style={{
                      padding: '6px 14px', borderRadius: 6,
                      background: 'rgba(56,189,248,0.06)',
                      border: '1px solid rgba(56,189,248,0.1)',
                      color: '#94a3b8', fontSize: 10, fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <CheckCircle size={12} /> ACKNOWLEDGE
                  </button>
                  <button
                    onClick={() => handleViewOnMap(alert)}
                    style={{
                      padding: '6px 14px', borderRadius: 6,
                      background: 'rgba(14,165,233,0.1)',
                      border: '1px solid rgba(14,165,233,0.2)',
                      color: '#38bdf8', fontSize: 10, fontWeight: 700,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <MapPin size={12} /> VIEW ON MAP
                  </button>
                </div>
              </div>
            );
          })}

          {visibleAlerts.length === 0 && (
            <div style={{
              padding: 40, textAlign: 'center', borderRadius: 10,
              background: 'rgba(56,189,248,0.03)',
              border: '1px solid rgba(56,189,248,0.06)',
            }}>
              <CheckCircle size={32} color="#22c55e" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>
                All Clear
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                All alerts have been acknowledged.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
