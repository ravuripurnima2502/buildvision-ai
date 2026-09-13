import React, { useState } from 'react';
import { EstimationSummary, MaterialItem } from '../../types/estimation';
import { BuildingSpecification } from '../../types/building';
import { MaterialTable } from './MaterialTable';
import { CostBreakdown } from './CostBreakdown';
import { TimelineSchedule } from './TimelineSchedule';
import {
  Package,
  PieChart,
  Clock,
  Printer,
  FileSpreadsheet,
  Download,
  Building,
} from 'lucide-react';

interface EstimationViewProps {
  estimation: EstimationSummary;
  spec: BuildingSpecification;
  onUpdateRate: (id: string, newRate: number) => void;
  onResetRates: () => void;
}

export const EstimationView: React.FC<EstimationViewProps> = ({
  estimation,
  spec,
  onUpdateRate,
  onResetRates,
}) => {
  const [subTab, setSubTab] = useState<'materials' | 'cost' | 'timeline'>('cost');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-full bg-charcoal-950 text-slate-100 blueprint-grid p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Estimation Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 bg-gold-500/10 px-2.5 py-1 rounded border border-gold-500/20">
            ENGINEERING BILL OF QUANTITIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1.5">
            Estimation & Construction Planning
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Project: {spec.name} • Built-Up Area: {spec.totalBuiltUpAreaSqFt.toLocaleString()} sq.ft • {spec.floors.length} Floors
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Sub-navigation tabs */}
          <div className="bg-charcoal-900 p-1 rounded-xl border border-slate-800 flex items-center space-x-1">
            <button
              onClick={() => setSubTab('cost')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                subTab === 'cost' ? 'bg-gold-500 text-charcoal-950 shadow-gold-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Cost Estimate</span>
            </button>

            <button
              onClick={() => setSubTab('materials')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                subTab === 'materials' ? 'bg-gold-500 text-charcoal-950 shadow-gold-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Materials (BOQ)</span>
            </button>

            <button
              onClick={() => setSubTab('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                subTab === 'timeline' ? 'bg-gold-500 text-charcoal-950 shadow-gold-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            title="Export / Print BOQ Report"
            className="p-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-slate-400 hover:text-gold-300 border border-slate-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtab Views */}
      {subTab === 'cost' && (
        <CostBreakdown
          categories={estimation.costBreakdown}
          totalCost={estimation.totalCost}
          builtUpAreaSqFt={spec.totalBuiltUpAreaSqFt}
        />
      )}

      {subTab === 'materials' && (
        <MaterialTable
          materials={estimation.materials}
          onUpdateRate={onUpdateRate}
          onResetRates={onResetRates}
        />
      )}

      {subTab === 'timeline' && (
        <TimelineSchedule
          phases={estimation.timelinePhases}
          totalWeeks={estimation.totalWeeks}
          totalDays={estimation.totalDays}
        />
      )}
    </div>
  );
};
