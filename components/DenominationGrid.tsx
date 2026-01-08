
import React from 'react';
import { Denomination } from '../types';
import { FORMATTER } from '../constants';

interface DenominationGridProps {
  breakdown: { denomination: Denomination; count: number }[];
}

const DenominationGrid: React.FC<DenominationGridProps> = ({ breakdown }) => {
  if (breakdown.length === 0) return null;

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {breakdown.map(({ denomination, count }, index) => (
        <div 
          key={index}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all animate-in fade-in slide-in-from-bottom-2 duration-300
            ${denomination.type === 'note' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
        >
          <span className="text-xs font-semibold uppercase opacity-60">
            {denomination.type === 'note' ? 'Cédula' : 'Moeda'}
          </span>
          <span className="text-lg font-bold">{FORMATTER.format(denomination.value)}</span>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-2xl font-black">× {count}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DenominationGrid;
