import React from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { MorningBriefingData } from '../types';

interface MorningBriefingProps {
  data: MorningBriefingData | null;
  loading: boolean;
  onClose: () => void;
}

const MorningBriefing: React.FC<MorningBriefingProps> = ({ data, loading, onClose }) => {
  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
        <div className="flex flex-col items-center text-primary animate-pulse">
          <Loader2 size={64} className="animate-spin mb-4" />
          <p className="text-xl font-medium text-white">Generating your morning inspiration...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-6">
      <div className="w-full max-w-2xl bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        
        <div className="relative p-8 md:p-12 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Sparkles className="text-yellow-400" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white">Morning Briefing</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-primary font-semibold uppercase tracking-wider text-sm">Greeting</h3>
                <p className="text-2xl md:text-3xl text-white font-light leading-tight">
                  "{data.greeting}"
                </p>
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <h3 className="text-accent font-semibold uppercase tracking-wider text-sm mb-3">Quote of the Day</h3>
                <p className="text-lg text-slate-200 italic font-serif">
                  {data.quote}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-secondary font-semibold uppercase tracking-wider text-sm">Fun Fact</h3>
                <p className="text-slate-300 leading-relaxed">
                  {data.fact}
                </p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="mt-10 w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
            >
              I'm Ready!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorningBriefing;
