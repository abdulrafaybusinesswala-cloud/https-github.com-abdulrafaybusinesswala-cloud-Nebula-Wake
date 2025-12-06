import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus } from 'lucide-react';
import Clock from './components/Clock';
import AlarmItem from './components/AlarmItem';
import AddAlarmModal from './components/AddAlarmModal';
import RingingOverlay from './components/RingingOverlay';
import MorningBriefing from './components/MorningBriefing';
import { useCurrentTime } from './hooks/useCurrentTime';
import { Alarm, AppState, MorningBriefingData } from './types';
import { SNOOZE_DURATION_MINUTES } from './constants';
import { generateMorningBriefing } from './services/gemini';

const App: React.FC = () => {
  const { timeString, displayTime, seconds, dateString, now } = useCurrentTime();
  
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('nebula-alarms');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [triggeringAlarm, setTriggeringAlarm] = useState<Alarm | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Gemini Briefing State
  const [briefingData, setBriefingData] = useState<MorningBriefingData | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  // Audio Context Ref
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Persist alarms
  useEffect(() => {
    localStorage.setItem('nebula-alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Audio Logic: Beep Sound
  const playAlarmSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    
    // Create an intermittent beep
    const playBeep = () => {
        if(oscillatorRef.current) return; // Already playing
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1); 

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    }

    // Play immediately then interval
    playBeep();
    intervalRef.current = window.setInterval(playBeep, 1000);

  }, []);

  const stopAlarmSound = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Context isn't closed, just stopped generating tones
  }, []);

  // Alarm Trigger Check
  useEffect(() => {
    if (appState === AppState.RINGING) return;

    const currentDay = now.getDay();
    // Seconds must be "00" to trigger exactly at the minute start, 
    // but we use a wider check (like processed flag) in a real robust app.
    // Here, checking matches every second is fine if we debounce or check state.
    // However, since `useCurrentTime` updates every second, we rely on `seconds` being '00'.
    
    if (seconds === '00') {
      const match = alarms.find(alarm => {
        if (!alarm.isActive) return false;
        if (alarm.time !== timeString) return false;
        
        // If days array is empty, it's a one-time alarm
        if (alarm.days.length === 0) return true;
        
        // Check if today is in the days array
        return alarm.days.includes(currentDay);
      });

      if (match) {
        setTriggeringAlarm(match);
        setAppState(AppState.RINGING);
        playAlarmSound();
      }
    }
  }, [timeString, seconds, alarms, appState, now, playAlarmSound]);

  // Handlers
  const handleAddAlarm = (time: string, label: string, days: number[]) => {
    const newAlarm: Alarm = {
      id: crypto.randomUUID(),
      time,
      label,
      days,
      isActive: true,
      createdAt: Date.now(),
    };
    setAlarms(prev => [...prev, newAlarm].sort((a, b) => a.time.localeCompare(b.time)));
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const handleSnooze = () => {
    stopAlarmSound();
    setAppState(AppState.SNOOZED);
    
    // Logic to re-trigger in X mins? 
    // Simple implementation: Create a temp alarm or just wait.
    // Better: Add a temporary active alarm for current time + 5 mins.
    
    const snoozeTime = new Date(now.getTime() + SNOOZE_DURATION_MINUTES * 60000);
    const h = snoozeTime.getHours().toString().padStart(2, '0');
    const m = snoozeTime.getMinutes().toString().padStart(2, '0');
    const newTime = `${h}:${m}`;
    
    handleAddAlarm(newTime, `Snooze: ${triggeringAlarm?.label || 'Alarm'}`, []); // One time alarm
    setTriggeringAlarm(null);
    setAppState(AppState.IDLE);
  };

  const handleDismiss = async () => {
    stopAlarmSound();
    
    // If it was a one-time alarm, disable it
    if (triggeringAlarm && triggeringAlarm.days.length === 0) {
      setAlarms(prev => prev.map(a => 
        a.id === triggeringAlarm.id ? { ...a, isActive: false } : a
      ));
    }

    setAppState(AppState.IDLE);
    
    // Trigger Briefing
    setIsBriefingLoading(true);
    // Fetch briefing
    const data = await generateMorningBriefing(displayTime);
    setBriefingData(data);
    setIsBriefingLoading(false);
  };

  const closeBriefing = () => {
    setBriefingData(null);
    setTriggeringAlarm(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-primary/30 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto min-h-screen flex flex-col p-6">
        
        {/* Header / Clock Area */}
        <div className="flex-1 flex flex-col justify-center">
          <Clock displayTime={displayTime} seconds={seconds} dateString={dateString} />
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-300">Your Alarms</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="group flex items-center justify-center w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-full border border-white/10 shadow-lg transition-all hover:scale-110 active:scale-95"
          >
            <Plus className="text-primary group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Alarm List */}
        <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
          {alarms.length === 0 ? (
            <div className="text-center py-12 opacity-50">
              <p className="text-slate-500">No alarms set.</p>
              <p className="text-sm text-slate-600 mt-2">Tap + to add one.</p>
            </div>
          ) : (
            alarms.map(alarm => (
              <AlarmItem 
                key={alarm.id} 
                alarm={alarm} 
                onToggle={handleToggleAlarm}
                onDelete={handleDeleteAlarm}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals & Overlays */}
      <AddAlarmModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddAlarm} 
      />

      {(appState === AppState.RINGING) && (
        <RingingOverlay 
          alarm={triggeringAlarm} 
          onSnooze={handleSnooze} 
          onDismiss={handleDismiss} 
        />
      )}

      {(isBriefingLoading || briefingData) && (
        <MorningBriefing 
          data={briefingData} 
          loading={isBriefingLoading} 
          onClose={closeBriefing} 
        />
      )}
    </div>
  );
};

export default App;
