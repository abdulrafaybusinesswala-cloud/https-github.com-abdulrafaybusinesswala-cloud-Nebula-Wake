import React from 'react';

interface ClockProps {
  displayTime: string;
  seconds: string;
  dateString: string;
}

const Clock: React.FC<ClockProps> = ({ displayTime, seconds, dateString }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 mb-4 relative z-10">
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="relative flex items-baseline space-x-2">
          <h1 className="text-7xl md:text-9xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary tracking-tighter drop-shadow-lg">
            {displayTime}
          </h1>
          <span className="text-2xl md:text-4xl font-mono text-slate-400 font-light">
            {seconds}
          </span>
        </div>
      </div>
      <p className="mt-4 text-lg md:text-xl text-slate-400 font-light tracking-wide uppercase">
        {dateString}
      </p>
    </div>
  );
};

export default Clock;
