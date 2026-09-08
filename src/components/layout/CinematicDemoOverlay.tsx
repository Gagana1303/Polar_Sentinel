import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Video, CheckCircle, ShieldAlert, ArrowRight, X } from 'lucide-react';

interface StoryboardScene {
  id: number;
  tab: string;
  timeOffset: number;
  title: string;
  subtitle: string;
  highlightText: string;
  routeId: string;
  durationMs: number;
}

const STORYBOARD_SCENES: StoryboardScene[] = [
  {
    id: 1,
    tab: 'overview',
    timeOffset: 0,
    title: 'THE POLAR NAVIGATION PROBLEM',
    subtitle: 'Static satellite snapshots tell ships where the ice was 12 hours ago. They fail to answer: "Where will the ice be when our vessel arrives?"',
    highlightText: 'Southern Ocean Risk: High iceberg density & extreme weather',
    routeId: 'ROUTE_A',
    durationMs: 7000,
  },
  {
    id: 2,
    tab: 'ice-intelligence',
    timeOffset: 0,
    title: 'SAR SENSING & ICEBERG DETECTION',
    subtitle: 'Sentinel-1 C-band SAR and Sentinel-2 optical data fused to detect tabular icebergs and bergy bits regardless of polar darkness or cloud cover.',
    highlightText: 'Detected: Tabular Iceberg A-17 (Length: 1.45 km, Mass: 4.2 Mt)',
    routeId: 'ROUTE_A',
    durationMs: 7000,
  },
  {
    id: 3,
    tab: 'tracking',
    timeOffset: 12,
    title: 'PHYSICS & STOCHASTIC DRIFT FORECASTING',
    subtitle: 'Coupled ocean current (NEMO) & wind leeway (ERA5) drift physics combined with 500 Monte Carlo runs for 50%, 80%, and 95% spatial confidence corridors.',
    highlightText: 'Forecast: Drift heading 127° at 0.42 knots towards vessel corridor',
    routeId: 'ROUTE_A',
    durationMs: 8000,
  },
  {
    id: 4,
    tab: 'ai-predictions',
    timeOffset: 18,
    title: 'TRANSPARENT COLLISION RISK ENGINE',
    subtitle: 'Non-blackbox quantitative scoring (0-100) combining time-aligned clearance distance, spatial uncertainty, iceberg mass, and sea-ice density.',
    highlightText: 'Alert at T+18h: HIGH RISK (78/100) — Clearance distance drops to 5.8 NM',
    routeId: 'ROUTE_A',
    durationMs: 8000,
  },
  {
    id: 5,
    tab: 'navigation',
    timeOffset: 18,
    title: 'EXPLAINABLE AI ROUTE OPTIMIZATION',
    subtitle: 'A* graph search evaluates cost matrices across open water, pack ice, and drift corridors to compute Route C (Northern Arc diversion).',
    highlightText: 'Route C Trade-off: +72 NM distance, +8h ETA, but -68% ice exposure & -60 risk score',
    routeId: 'ROUTE_C',
    durationMs: 8000,
  },
  {
    id: 6,
    tab: 'overview',
    timeOffset: 48,
    title: 'TIMELINE SIMULATION & CONFLICT AVOIDANCE',
    subtitle: 'T-24h SAR Detection → T+18h Risk Flag → T+20h Diversion Executed → T+48h Polar Conflict Safely Avoided.',
    highlightText: 'MISSION ACCOMPLISHED: Vessel safely clear of Iceberg A-17 trajectory',
    routeId: 'ROUTE_C',
    durationMs: 9000,
  },
];

export const CinematicDemoOverlay: React.FC = () => {
  const {
    isPresentationMode,
    setPresentationMode,
    setActiveTab,
    setSimulationTimeOffset,
    selectRoute,
  } = useAppStore();

  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Web Audio API for soothing ambient sound
  useEffect(() => {
    if (!isPresentationMode) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isAudioMuted ? 0 : 0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Create dual low-frequency ambient sine drone (soothing polar soundscape)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2 note

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3 note (Fifth chord)

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();

      return () => {
        try {
          osc1.stop();
          osc2.stop();
          ctx.close();
        } catch {
          // cleanup safe
        }
      };
    } catch {
      // AudioContext fallback
    }
  }, [isPresentationMode]);

  // Handle mute toggle
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isAudioMuted ? 0 : 0.08,
        audioCtxRef.current.currentTime
      );
    }
  }, [isAudioMuted]);

  // Scene driver logic
  useEffect(() => {
    if (!isPresentationMode) return;

    const scene = STORYBOARD_SCENES[currentSceneIdx];
    setActiveTab(scene.tab);
    setSimulationTimeOffset(scene.timeOffset);
    selectRoute(scene.routeId);

    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentSceneIdx < STORYBOARD_SCENES.length - 1) {
          setCurrentSceneIdx((prev) => prev + 1);
        } else {
          setIsPlaying(false); // Finished loop
        }
      }, scene.durationMs);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSceneIdx, isPlaying, isPresentationMode, setActiveTab, setSimulationTimeOffset, selectRoute]);

  if (!isPresentationMode) return null;

  const currentScene = STORYBOARD_SCENES[currentSceneIdx];

  const handleNext = () => {
    if (currentSceneIdx < STORYBOARD_SCENES.length - 1) {
      setCurrentSceneIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentSceneIdx(0);
    setIsPlaying(true);
  };

  const handleStartScreenRecord = async () => {
    try {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: false,
      });

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `polar_sentinel_demo_${Date.now()}.webm`;
        a.click();
        setIsRecording(false);
      };

      mediaRecorder.start();

      // Stop recording automatically when stream tracks end
      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
        setIsRecording(false);
      };
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Top Banner Overlay: Short Wording Title Card */}
      <div style={{
        margin: '16px auto 0 auto',
        pointerEvents: 'auto',
        maxWidth: '840px',
        width: '90%',
        background: 'rgba(10, 15, 30, 0.92)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(14, 165, 233, 0.2)',
        borderRadius: 12,
        padding: '16px 24px',
        backdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.4s ease-out',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.1em',
            }}>
              SCENE {currentScene.id} / {STORYBOARD_SCENES.length}
            </span>
            <h2 style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '0.12em',
              margin: 0,
              textTransform: 'uppercase',
            }}>
              {currentScene.title}
            </h2>
          </div>

          <button
            onClick={() => setPresentationMode(false)}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              borderRadius: 6,
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            <X size={12} /> EXIT DEMO
          </button>
        </div>

        <p style={{
          fontSize: 13,
          color: '#e2e8f0',
          lineHeight: 1.4,
          margin: '0 0 10px 0',
          fontWeight: 500,
        }}>
          {currentScene.subtitle}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(56, 189, 248, 0.08)',
          borderLeft: '3px solid #38bdf8',
          padding: '6px 12px',
          borderRadius: '0 6px 6px 0',
        }}>
          <ShieldAlert size={14} color="#38bdf8" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#7dd3fc' }}>
            {currentScene.highlightText}
          </span>
        </div>
      </div>

      {/* Bottom Control & Recording Bar */}
      <div style={{
        marginTop: 'auto',
        marginBottom: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        alignSelf: 'center',
        pointerEvents: 'auto',
        background: 'rgba(10, 14, 26, 0.95)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: 9999,
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(56, 189, 248, 0.15)',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Play / Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: 'none',
            border: 'none',
            color: '#38bdf8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>

        {/* Step Prev / Next */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={handlePrev}
            disabled={currentSceneIdx === 0}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.15)',
              color: currentSceneIdx === 0 ? '#475569' : '#94a3b8',
              borderRadius: '50%',
              width: 28,
              height: 28,
              cursor: currentSceneIdx === 0 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ‹
          </button>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>
            {currentSceneIdx + 1}/{STORYBOARD_SCENES.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentSceneIdx === STORYBOARD_SCENES.length - 1}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.15)',
              color: currentSceneIdx === STORYBOARD_SCENES.length - 1 ? '#475569' : '#94a3b8',
              borderRadius: '50%',
              width: 28,
              height: 28,
              cursor: currentSceneIdx === STORYBOARD_SCENES.length - 1 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ›
          </button>
        </div>

        {/* Restart */}
        <button
          onClick={handleRestart}
          title="Restart Demo Storyboard"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 4,
          }}
        >
          <RotateCcw size={14} />
        </button>

        <div style={{ width: 1, height: 16, background: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Soothing Minimal Music Toggle */}
        <button
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          style={{
            background: 'none',
            border: 'none',
            color: isAudioMuted ? '#64748b' : '#38bdf8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          {isAudioMuted ? 'SOOTHING AUDIO MUTED' : 'MINIMAL AMBIENT AUDIO ON'}
        </button>

        <div style={{ width: 1, height: 16, background: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Record Video Button */}
        <button
          onClick={handleStartScreenRecord}
          disabled={isRecording}
          style={{
            background: isRecording ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #10b981, #059669)',
            border: isRecording ? '1px solid #ef4444' : 'none',
            color: '#ffffff',
            borderRadius: 20,
            padding: '5px 14px',
            cursor: isRecording ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.05em',
            boxShadow: isRecording ? '0 0 10px rgba(239,68,68,0.5)' : '0 0 10px rgba(16,185,129,0.3)',
          }}
        >
          <Video size={13} />
          {isRecording ? 'RECORDING DEMO VIDEO...' : 'RECORD DEMO VIDEO (.WEBM)'}
        </button>
      </div>
    </div>
  );
};
