import React, { useState } from 'react';
import { X, Check, Clock } from 'lucide-react';
import { DAYS_OF_WEEK } from '../constants';

interface AddAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (time: string, label: string, days: number[]) => void;
}

const AddAlarmModal: React.FC<AddAlarmModalProps> = ({ isOpen, onClose, onSave }) => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  );
  const [label, setLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  if (!isOpen) return null;

  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex)
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex].sort()
    );
  };

  const handleSave = () => {
    onSave(time, label, selectedDays);
    onClose();
    // Reset defaults
    setLabel('');
    setSelectedDays([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="text-primary" size={24} />
            Set Alarm
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Time Input */}
          <div className="flex justify-center">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-transparent text-5xl md:text-6xl font-mono text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg p-2 text-center"
              required
            />
          </div>

          {/* Days Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Repeat</label>
            <div className="flex justify-between gap-1">
              {DAYS_OF_WEEK.map((day, index) => (
                <button
                  key={day}
                  onClick={() => toggleDay(index)}
                  className={`
                    w-10 h-10 rounded-full text-xs font-bold transition-all
                    ${selectedDays.includes(index) 
                      ? 'bg-primary text-white shadow-md shadow-primary/30 scale-105' 
                      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'}
                  `}
                >
                  {day.charAt(0)}
                </button>
              ))}
            </div>
          </div>

          {/* Label Input */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Morning Workout"
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Save Alarm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAlarmModal;
