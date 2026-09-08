import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  LayoutDashboard,
  Radar,
  Navigation2,
  ShieldAlert,
  Snowflake,
  BrainCircuit,
  Bell,
  BarChart3,
  Settings,
  Compass,
  Wifi,
  Activity,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, icebergs, notifications } = useAppStore();

  const highRiskCount = icebergs.filter(i => i.riskLevel === 'high' || i.riskLevel === 'critical').length;

  const mainNavItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'ice-intelligence', label: 'Iceberg Intelligence', icon: <Radar size={16} /> },
    { id: 'tracking', label: 'Trajectory Tracking', icon: <Activity size={16} /> },
    { id: 'navigation', label: 'Risk & Navigation', icon: <Navigation2 size={16} />, badge: 'AI', badgeColor: '#0ea5e9' },
    { id: 'sea-ice', label: 'Sea-Ice Monitor', icon: <Snowflake size={16} /> },
    { id: 'ai-predictions', label: 'AI Predictions', icon: <BrainCircuit size={16} /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell size={16} />, badge: String(notifications.length), badgeColor: highRiskCount > 0 ? '#ef4444' : '#f59e0b' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  ];

  const bottomNavItems: NavItem[] = [
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  return (
    <aside style={{
      width: 240,
      minWidth: 240,
      height: '100%',
      background: 'linear-gradient(180deg, #0c1220 0%, #0a0e1a 100%)',
      borderRight: '1px solid rgba(56, 189, 248, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 12px',
      gap: 4,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '4px 8px 16px', borderBottom: '1px solid rgba(56, 189, 248, 0.06)', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(14,165,233,0.25)',
            flexShrink: 0,
          }}>
            <Compass size={18} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', letterSpacing: '0.08em', lineHeight: 1.2 }}>
              ANTARCTIC
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', lineHeight: 1.2 }}>
              INTELLIGENCE
            </div>
          </div>
        </div>
        <div style={{ fontSize: 9, fontWeight: 600, color: '#475569', letterSpacing: '0.15em', marginTop: 8, textTransform: 'uppercase' }}>
          ICEBERG • SEA-ICE • NAVIGATION
        </div>
      </div>

      {/* Main Navigation */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {mainNavItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{ border: 'none', background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent', textAlign: 'left' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20 }}>
                {item.icon}
              </span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 9999,
                  background: `${item.badgeColor}18`,
                  color: item.badgeColor,
                  letterSpacing: '0.05em',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom section */}
      <div style={{ borderTop: '1px solid rgba(56, 189, 248, 0.06)', paddingTop: 8, marginTop: 4 }}>
        {bottomNavItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{ border: 'none', background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent', textAlign: 'left' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20 }}>
                {item.icon}
              </span>
              <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
            </button>
          );
        })}

        {/* System Status */}
        <div style={{
          marginTop: 10,
          padding: '10px 12px',
          borderRadius: 8,
          background: 'rgba(56, 189, 248, 0.04)',
          border: '1px solid rgba(56, 189, 248, 0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div className="status-dot online" />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', letterSpacing: '0.08em' }}>SYSTEM ONLINE</span>
          </div>
          <div style={{ fontSize: 9, color: '#475569', lineHeight: 1.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Wifi size={10} />
              Data: Demo Mode
            </div>
            <div>SIH 2026 Platform</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
