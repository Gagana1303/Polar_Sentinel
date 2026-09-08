import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

export const TimeSlider: React.FC = () => {
  const {
    simulationTimeOffset,
    setSimulationTimeOffset,
    isSimulating,
    setIsSimulating,
    simulationSpeed,
    setSimulationSpeed,
    stepSimulation,
  } = useAppStore();

  const timelineSteps = [
    { offset: -72, label: 'T-72h' },
    { offset: -48, label: 'T-48h' },
    { offset: -24, label: 'T-24h' },
    { offset: 0, label: 'NOW' },
    { offset: 6, label: '+6h' },
    { offset: 12, label: '+12h' },
    { offset: 18, label: '+18h (Risk Peak)' },
    { offset: 24, label: '+24h' },
    { offset: 48, label: '+48h' },
  ];

  // Auto playback effect
  useEffect(() => {
    let timer: any;
    if (isSimulating) {
      const intervalMs = 2000 / simulationSpeed;
      timer = setInterval(() => {
        const allowedTimes = timelineSteps.map((s) => s.offset);
        const currIdx = allowedTimes.indexOf(simulationTimeOffset);
        if (currIdx < allowedTimes.length - 1) {
          setSimulationTimeOffset(allowedTimes[currIdx + 1]);
        } else {
          setIsSimulating(false);
        }
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isSimulating, simulationTimeOffset, simulationSpeed, setSimulationTimeOffset, setIsSimulating]);

  return (
    <div className="bg-surface-light-card/95 dark:bg-surface-dark-card/95 backdrop-blur-md border border-surface-light-border dark:border-surface-dark-border p-4 rounded-3xl shadow-soft flex flex-col md:flex-row items-center gap-4">
      {/* Play Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => stepSimulation(-1)}
          className="p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary"
          title="Step Backward"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <Button
          variant={isSimulating ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => setIsSimulating(!isSimulating)}
          icon={isSimulating ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        >
          {isSimulating ? 'PAUSE' : 'PLAY'}
        </Button>

        <button
          onClick={() => stepSimulation(1)}
          className="p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary"
          title="Step Forward"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setSimulationTimeOffset(0);
            setIsSimulating(false);
          }}
          className="p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary"
          title="Reset to Present (NOW)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 pl-2 border-l border-surface-light-border dark:border-surface-dark-border text-xs font-bold">
          {[1, 2, 5].map((speed) => (
            <button
              key={speed}
              onClick={() => setSimulationSpeed(speed)}
              className={`px-2 py-1 rounded-xl transition-all ${
                simulationSpeed === speed
                  ? 'bg-polar-700 text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Timeline Track */}
      <div className="flex-1 w-full flex items-center justify-between gap-1 overflow-x-auto py-1">
        {timelineSteps.map((step) => {
          const isActive = simulationTimeOffset === step.offset;
          const isPresent = step.offset === 0;
          const isFuture = step.offset > 0;
          return (
            <button
              key={step.offset}
              onClick={() => {
                setSimulationTimeOffset(step.offset);
                setIsSimulating(false);
              }}
              className={`flex-1 min-w-[75px] py-1.5 px-2 rounded-2xl border text-center transition-all ${
                isActive
                  ? 'bg-polar-700 text-white border-polar-600 font-bold shadow-soft scale-105'
                  : isPresent
                  ? 'bg-polar-50 dark:bg-polar-950/60 text-polar-700 dark:text-polar-300 border-polar-300 font-bold'
                  : isFuture
                  ? 'border-surface-light-border dark:border-surface-dark-border text-text-secondary hover:border-polar-300'
                  : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}
            >
              <div className="text-[11px] leading-tight font-semibold flex items-center justify-center gap-1">
                {isPresent && <Clock className="w-3 h-3 text-emerald-500" />}
                <span>{step.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
