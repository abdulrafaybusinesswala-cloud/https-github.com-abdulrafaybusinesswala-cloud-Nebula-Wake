import React from 'react';
import { Alarm } from '../types';
import { Trash2, Bell, BellOff } from 'lucide-react';
import { DAYS_OF_WEEK } from '../constants';

interface AlarmItemProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const AlarmItem: React.FC<AlarmItemProps> = ({ alarm, onToggle, onDelete }) => {
  // Convert 24h string to 12h display for the list
  const format12H = (time24: string) => {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hours = h % 12 || 12;
    return `${hours}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const dayString = alarm.days.length === 0 
    ? 'Once' 
    : alarm.days.length === 7 
      ? 'Everyday' 
      : alarm.days.map(d => DAYS_OF_WEEK[d]).join(', ');

  return (
    <div className={`
      relative group flex items-center justify-between p-5 rounded-2xl mb-3 
      transition-all duration-300 border border-white/5
      ${alarm.isActive 
        ? 'bg-slate-800/80 shadow-lg shadow-primary/5' 
        : 'bg-slate-900/50 opacity-70'}
    `}>
      <div className="flex flex-col">
        <div className="flex items-baseline space-x-2">
          <span className={`text-3xl font-bold font-mono ${alarm.isActive ? 'text-white' : 'text-slate-500'}`}>
            {format12H(alarm.time)}
          </span>
          {alarm.label && (
            <span className="text-sm text-slate-400 font-medium truncate max-w-[150px]">
              {alarm.label}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
          {dayString}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => onToggle(alarm.id)}
          className={`
            p-3 rounded-full transition-all duration-200 
            ${alarm.isActive 
              ? 'bg-primary text-white shadow-lg shadow-primary/40 hover:bg-primary/90' 
              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}
          `}
        >
          {alarm.isActive ? <Bell size={20} /> : <BellOff size={20} />}
        </button>
        
        <button
          onClick={() => onDelete(alarm.id)}
          className="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          title="Delete Alarm"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default AlarmItem;
