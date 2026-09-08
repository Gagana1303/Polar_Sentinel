import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Play, Radio, Clock, Zap, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    dataMode,
    runFullSihDemo,
    isPresentationMode,
    setPresentationMode,
    isSimulating,
    setIsSimulating,
  } = useAppStore();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const utcTime = currentTime.toISOString().slice(11, 19);
  const utcDate = currentTime.toISOString().slice(0, 10);

  return (
    <header style={{
      height: 48,
      minHeight: 48,
      background: 'rgba(10, 14, 26, 0.95)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      backdropFilter: 'blur(12px)',
      zIndex: 40,
    }}>
      {/* Left: Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h1 style={{
          fontSize: 12,
          fontWeight: 800,
          color: '#94a3b8',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          ANTARCTIC OPERATIONS CENTER
        </h1>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 10px',
          borderRadius: 9999,
          background: isSimulating ? 'rgba(34, 197, 94, 0.12)' : 'rgba(56, 189, 248, 0.08)',
          border: `1px solid ${isSimulating ? 'rgba(34, 197, 94, 0.2)' : 'rgba(56, 189, 248, 0.12)'}`,
        }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: isSimulating ? '#22c55e' : '#38bdf8',
            boxShadow: `0 0 6px ${isSimulating ? 'rgba(34,197,94,0.5)' : 'rgba(56,189,248,0.5)'}`,
          }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: isSimulating ? '#4ade80' : '#7dd3fc', letterSpacing: '0.08em' }}>
            {isSimulating ? 'LIVE SIMULATION' : dataMode === 'LIVE' ? 'LIVE DATA' : 'DEMO MODE'}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 10px',
          borderRadius: 9999,
          background: 'rgba(14, 165, 233, 0.08)',
          border: '1px solid rgba(14, 165, 233, 0.12)',
        }}>
          <Zap size={10} color="#0ea5e9" />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.06em' }}>
            AI SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* Right: Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* UTC Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 6,
          background: 'rgba(56, 189, 248, 0.04)',
          border: '1px solid rgba(56, 189, 248, 0.06)',
        }}>
          <Clock size={12} color="#64748b" />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
            {utcTime}
          </span>
          <span style={{ fontSize: 9, fontWeight: 600, color: '#475569' }}>UTC</span>
        </div>

        {/* Live Mode Toggle */}
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 12px',
            borderRadius: 6,
            background: isSimulating ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.06)',
            border: `1px solid ${isSimulating ? 'rgba(34, 197, 94, 0.25)' : 'rgba(56, 189, 248, 0.1)'}`,
            cursor: 'pointer',
            fontSize: 10,
            fontWeight: 700,
            color: isSimulating ? '#4ade80' : '#94a3b8',
            letterSpacing: '0.05em',
          }}
        >
          <Radio size={12} />
          LIVE MODE
        </button>

        {/* Demo Mode Button */}
        <button
          onClick={runFullSihDemo}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 14px',
            borderRadius: 6,
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 10,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '0.08em',
            boxShadow: '0 0 12px rgba(14,165,233,0.25)',
          }}
        >
          <Play size={11} fill="white" />
          DEMO MODE
        </button>
      </div>
    </header>
  );
};
