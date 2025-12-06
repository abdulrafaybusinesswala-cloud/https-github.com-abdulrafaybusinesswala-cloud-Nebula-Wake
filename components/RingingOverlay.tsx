import React from 'react';
import { Bell, Coffee, Moon } from 'lucide-react';
import { Alarm } from '../types';

interface RingingOverlayProps {
  alarm: Alarm | null;
  onSnooze: () => void;
  onDismiss: () => void;
}

const RingingOverlay: React.FC<RingingOverlayProps> = ({ alarm, onSnooze, onDismiss }) => {
  if (!alarm) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md">
      <div className="absolute inset-0 overflow-hidden">
         {/* Background pulse effect */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="animate-ring text-white mb-4">
          <Bell size={80} className="fill-white" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-8xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h2>
          <p className="text-2xl text-primary font-medium tracking-wide">
            {alarm.label || "Alarm"}
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm px-8 pt-8">
          <button 
            onClick={onDismiss}
            className="w-full bg-secondary hover:bg-secondary/90 text-white text-lg font-bold py-5 rounded-2xl shadow-xl shadow-secondary/30 transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Coffee size={24} />
            Wake Up & Get Briefing
          </button>

          <button 
            onClick={onSnooze}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-4 rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3"
          >
            <Moon size={20} />
            Snooze 5 Minutes
          </button>
        </div>
      </div>
    </div>
  );
};

export default RingingOverlay;
