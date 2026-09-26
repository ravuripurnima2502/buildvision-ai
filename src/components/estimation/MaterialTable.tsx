import React, { useState } from 'react';
import { MaterialItem } from '../../types/estimation';
import { formatCurrency } from '../../utils/formatting';
import { Edit2, Check, RotateCcw, Package, HelpCircle } from 'lucide-react';
import { DEFAULT_RATES } from '../../engine/estimator';

interface MaterialTableProps {
  materials: MaterialItem[];
  onUpdateRate: (id: string, newRate: number) => void;
  onResetRates: () => void;
}

export const MaterialTable: React.FC<MaterialTableProps> = ({
  materials,
  onUpdateRate,
  onResetRates,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempRate, setTempRate] = useState<number>(0);

  const startEdit = (item: MaterialItem) => {
    setEditingId(item.id);
    setTempRate(item.unitRate);
  };

  const saveEdit = (id: string) => {
    if (tempRate > 0) {
      onUpdateRate(id, tempRate);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
            <Package className="w-5 h-5 text-gold-400 stroke-[2.2]" />
            <span>Material Takeoff &amp; Bill of Quantities (BOQ)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Volumetric civil calculations derived from BIM wall lengths, slabs, and structural geometry. Click any unit rate to simulate market fluctuations.
          </p>
        </div>

        <button
          onClick={onResetRates}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-300 hover:text-gold-300 border border-white/[0.08] hover:border-gold-500/40 transition-colors flex items-center space-x-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Standard Rates</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-[#0B1017]/90 border border-white/[0.08] shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4 font-semibold">Material / Specification</th>
              <th className="py-3.5 px-4 font-semibold">Division</th>
              <th className="py-3.5 px-4 text-right font-semibold">Estimated Quantity</th>
              <th className="py-3.5 px-4 text-right font-semibold">Unit Rate (INR)</th>
              <th className="py-3.5 px-4 text-right font-semibold">Total Line Item</th>
              <th className="py-3.5 px-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-xs">
            {materials.map((mat) => (
              <tr key={mat.id} className="hover:bg-white/[0.02] transition-colors">
                {/* Name & Description */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-white">{mat.name}</div>
                  <div className="text-[11px] text-slate-400 max-w-sm line-clamp-1 mt-0.5 font-sans">{mat.description}</div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08] capitalize">
                    {mat.category}
                  </span>
                </td>

                {/* Quantity & Unit */}
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                  {mat.quantity.toLocaleString()} <span className="text-slate-400 font-normal text-[11px]">{mat.unit}</span>
                </td>

                {/* Unit Rate (Editable) */}
                <td className="py-3.5 px-4 text-right font-mono">
                  {editingId === mat.id ? (
                    <div className="inline-flex items-center space-x-1.5">
                      <input
                        type="number"
                        min={1}
                        value={tempRate}
                        onChange={(e) => setTempRate(Number(e.target.value))}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(mat.id)}
                        className="w-24 bg-[#080C14] border border-gold-500 rounded-lg px-2 py-1 text-xs text-right text-gold-300 font-mono focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(mat.id)}
                        className="p-1 rounded-md bg-gold-500 text-charcoal-950 hover:bg-gold-400 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => startEdit(mat)}
                      className="cursor-pointer text-slate-300 hover:text-gold-300 hover:underline font-semibold"
                      title="Click to edit unit rate"
                    >
                      ₹{mat.unitRate.toLocaleString()}
                    </span>
                  )}
                </td>

                {/* Total Cost */}
                <td className="py-3.5 px-4 text-right font-mono font-bold text-gold-300">
                  {formatCurrency(mat.totalCost)}
                </td>

                {/* Action */}
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => startEdit(mat)}
                    title="Edit Rate"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-gold-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
