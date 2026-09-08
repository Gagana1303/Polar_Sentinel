import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

// Demo analytics data
const movementData = [
  { time: 'T-72h', A17: 0.38, B09: 0.32, C22: 0.26, D04: 0.48 },
  { time: 'T-48h', A17: 0.40, B09: 0.33, C22: 0.27, D04: 0.49 },
  { time: 'T-24h', A17: 0.41, B09: 0.34, C22: 0.28, D04: 0.50 },
  { time: 'NOW', A17: 0.42, B09: 0.35, C22: 0.28, D04: 0.50 },
  { time: 'T+6h', A17: 0.43, B09: 0.35, C22: 0.29, D04: 0.51 },
  { time: 'T+12h', A17: 0.44, B09: 0.36, C22: 0.29, D04: 0.51 },
  { time: 'T+24h', A17: 0.45, B09: 0.36, C22: 0.30, D04: 0.52 },
  { time: 'T+48h', A17: 0.46, B09: 0.37, C22: 0.30, D04: 0.53 },
];

const riskScoreData = [
  { time: 'T-72h', routeA: 72, routeB: 42, routeC: 15 },
  { time: 'T-48h', routeA: 74, routeB: 44, routeC: 16 },
  { time: 'T-24h', routeA: 76, routeB: 46, routeC: 17 },
  { time: 'NOW', routeA: 78, routeB: 48, routeC: 18 },
  { time: 'T+12h', routeA: 80, routeB: 45, routeC: 16 },
  { time: 'T+24h', routeA: 82, routeB: 43, routeC: 15 },
  { time: 'T+48h', routeA: 79, routeB: 40, routeC: 14 },
];

const seaIceData = [
  { zone: 'Prydz N', concentration: 8, thickness: 0.4 },
  { zone: 'Prydz C', concentration: 14, thickness: 0.7 },
  { zone: 'Mawson', concentration: 22, thickness: 1.1 },
  { zone: 'Davis', concentration: 6, thickness: 0.3 },
  { zone: 'Southern', concentration: 45, thickness: 1.8 },
  { zone: 'Ice Shelf', concentration: 62, thickness: 2.5 },
  { zone: 'Open', concentration: 3, thickness: 0.1 },
  { zone: 'West', concentration: 18, thickness: 0.9 },
];

const navSafetyData = [
  { time: 'Day 1', safety: 88 },
  { time: 'Day 2', safety: 85 },
  { time: 'Day 3', safety: 82 },
  { time: 'Day 4', safety: 78 },
  { time: 'Day 5', safety: 82 },
  { time: 'Day 6', safety: 86 },
  { time: 'Day 7', safety: 84 },
];

const tooltipStyle = {
  backgroundColor: 'rgba(15, 21, 38, 0.95)',
  border: '1px solid rgba(56, 189, 248, 0.2)',
  borderRadius: '8px',
  fontSize: '11px',
  color: '#e2e8f0',
};

export const AnalyticsPage: React.FC = () => {
  return (
    <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.15em', marginBottom: 6 }}>
            ANALYTICS DASHBOARD
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
            Operational Analytics & Trends
          </h1>
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Iceberg Movement */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', marginBottom: 16 }}>
              ICEBERG DRIFT VELOCITY (KNOTS)
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={movementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.06)" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0.2, 0.6]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="A17" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="A-17" />
                <Line type="monotone" dataKey="B09" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="B-09" />
                <Line type="monotone" dataKey="D04" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="D-04" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Score Over Time */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', marginBottom: 16 }}>
              ROUTE RISK SCORES OVER TIME
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={riskScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.06)" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Area type="monotone" dataKey="routeA" stroke="#ef4444" fill="#ef444415" strokeWidth={2} name="Route A" />
                <Area type="monotone" dataKey="routeB" stroke="#f59e0b" fill="#f59e0b15" strokeWidth={2} name="Route B" />
                <Area type="monotone" dataKey="routeC" stroke="#22c55e" fill="#22c55e15" strokeWidth={2} name="Route C" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sea-Ice Concentration */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', marginBottom: 16 }}>
              SEA-ICE CONCENTRATION BY ZONE (%)
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={seaIceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.06)" />
                <XAxis dataKey="zone" tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="concentration" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Concentration %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Navigation Safety Trend */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', marginBottom: 16 }}>
              NAVIGATION SAFETY TREND (%)
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={navSafetyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.06)" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[60, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <defs>
                  <linearGradient id="safetyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="safety" stroke="#22c55e" fill="url(#safetyGrad)" strokeWidth={2.5} name="Safety Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
