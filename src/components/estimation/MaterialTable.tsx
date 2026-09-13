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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
            <Package className="w-5 h-5 text-gold-400" />
            <span>Material Takeoff & Bill of Quantities (BOQ)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Computed from structural volumes and wall/floor surface areas. Click unit rate to adjust for local supplier prices.
          </p>
        </div>

        <button
          onClick={onResetRates}
          className="px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-xs text-slate-300 hover:text-gold-300 border border-slate-700 transition-colors flex items-center space-x-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Rates</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl glass-panel border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-charcoal-900/80 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Material / Item</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Estimated Qty</th>
              <th className="py-3 px-4 text-right">Unit Rate (INR)</th>
              <th className="py-3 px-4 text-right">Estimated Amount</th>
              <th className="py-3 px-4 text-center">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {materials.map((mat) => (
              <tr key={mat.id} className="hover:bg-charcoal-900/50 transition-colors">
                {/* Name & Description */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-200">{mat.name}</div>
                  <div className="text-[11px] text-slate-400 max-w-sm line-clamp-1">{mat.description}</div>
                </td>

                {/* Category */}
                <td className="py-3 px-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-900 text-slate-300 border border-slate-700 capitalize">
                    {mat.category}
                  </span>
                </td>

                {/* Quantity & Unit */}
                <td className="py-3 px-4 text-right font-mono font-bold text-white">
                  {mat.quantity.toLocaleString()} <span className="text-slate-400 font-normal text-[11px]">{mat.unit}</span>
                </td>

                {/* Unit Rate (Editable) */}
                <td className="py-3 px-4 text-right font-mono">
                  {editingId === mat.id ? (
                    <div className="inline-flex items-center space-x-1">
                      <input
                        type="number"
                        min={1}
                        value={tempRate}
                        onChange={(e) => setTempRate(Number(e.target.value))}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(mat.id)}
                        className="w-20 bg-charcoal-950 border border-gold-500 rounded px-1.5 py-0.5 text-xs text-right text-gold-300 font-mono focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(mat.id)}
                        className="p-1 rounded bg-gold-500 text-charcoal-950 hover:bg-gold-400"
                      >
                        <Check className="w-3 h-3" />
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
                <td className="py-3 px-4 text-right font-mono font-bold text-gold-300">
                  {formatCurrency(mat.totalCost)}
                </td>

                {/* Action */}
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => startEdit(mat)}
                    title="Edit Rate"
                    className="p-1 rounded text-slate-500 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
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
