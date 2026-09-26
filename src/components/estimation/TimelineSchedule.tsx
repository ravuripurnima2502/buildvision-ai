import React from 'react';
import { TimelinePhase } from '../../types/estimation';
import { Clock, Calendar, CheckCircle2, Flag, ArrowRight, Layers, Activity } from 'lucide-react';

interface TimelineScheduleProps {
  phases: TimelinePhase[];
  totalWeeks: number;
  totalDays: number;
}

export const TimelineSchedule: React.FC<TimelineScheduleProps> = ({
  phases,
  totalWeeks,
  totalDays,
}) => {
  return (
    <div className="space-y-6 select-none">
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gold-400 stroke-[2.2]" />
            <span>Estimated Civil Construction Timeline &amp; Phases</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological milestone schedule structured according to Indian Standard civil engineering sequencing (IS 456).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono shadow-sm">
            <span className="text-slate-400">Total Program:</span>{' '}
            <span className="text-gold-300 font-bold">{totalWeeks} Weeks</span>{' '}
            <span className="text-slate-500">({totalDays} Days)</span>
          </div>
        </div>
      </div>

      {/* Sequential Milestone Roadway */}
      <div className="relative border-l-2 border-gold-500/30 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
        {phases.map((phase, idx) => {
          return (
            <div key={phase.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-[#080C14] border-2 border-gold-400 flex items-center justify-center group-hover:scale-125 transition-transform shadow-gold-glow">
                <span className="w-2 h-2 rounded-full bg-gold-400"></span>
              </div>

              {/* Card */}
              <div className="rounded-2xl cad-panel p-5 hover:border-gold-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 font-semibold uppercase">
                      Phase 0{idx + 1}
                    </span>
                    <h4 className="text-base font-display font-bold text-white group-hover:text-gold-300 transition-colors">
                      {phase.name}
                    </h4>
                  </div>

                  <div className="text-xs font-mono text-slate-300 flex items-center space-x-2 bg-white/[0.03] px-3 py-1 rounded-xl border border-white/[0.06]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Week {phase.startWeek} – Week {phase.endWeek}</span>
                    <span className="text-gold-400 font-bold">({phase.durationWeeks} Wks)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {phase.description}
                </p>

                {/* Key Deliverables */}
                <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Structural Milestones:</span>
                  {phase.keyDeliverables.map((deliv, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-200 border border-white/[0.08] flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-gold-400" />
                      <span>{deliv}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
