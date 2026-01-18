
import React, { useState, useMemo } from 'react';
import { 
  calculateSimpleInterest, 
  calculateCompoundInterest, 
  generateAmortizationTable,
  formatCurrency,
  formatPercent
} from '../services/mathUtils';
import { InterestType } from '../types';

const CalculatorLab: React.FC = () => {
  const [mode, setMode] = useState<'capitalization' | 'loan'>('capitalization');
  
  // Capitalization State
  const [c0, setC0] = useState(1000);
  const [n, setN] = useState(5);
  const [i, setI] = useState(4.5);
  const [type, setType] = useState<InterestType>('compound');

  // Loan State
  const [k0, setK0] = useState(150000);
  const [loanN, setLoanN] = useState(20);
  const [loanI, setLoanI] = useState(3.5);

  const capResult = useMemo(() => {
    return type === 'simple' 
      ? calculateSimpleInterest(c0, n, i) 
      : calculateCompoundInterest(c0, n, i);
  }, [c0, n, i, type]);

  const loanTable = useMemo(() => {
    return generateAmortizationTable(k0, loanN, loanI);
  }, [k0, loanN, loanI]);

  return (
    <div className="space-y-8">
      <div className="flex justify-center bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 w-fit mx-auto shadow-xl">
        <button 
          onClick={() => setMode('capitalization')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${mode === 'capitalization' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Capitalisation
        </button>
        <button 
          onClick={() => setMode('loan')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${mode === 'loan' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Prêt Bancaire
        </button>
      </div>

      {mode === 'capitalization' ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-800 space-y-6">
            <h3 className="font-bold text-xl text-white mb-4">Configuration</h3>
            <div>
              <label className="block text-sm font-medium text-zinc-500 mb-2 uppercase tracking-widest">Capital Initial (C₀)</label>
              <input 
                type="number" value={c0} onChange={(e) => setC0(Number(e.target.value))}
                className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-500 mb-2 uppercase tracking-widest">Durée (Périodes)</label>
              <input 
                type="number" value={n} onChange={(e) => setN(Number(e.target.value))}
                className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-500 mb-2 uppercase tracking-widest">Taux Intérêt (%)</label>
              <input 
                type="number" step="0.01" value={i} onChange={(e) => setI(Number(e.target.value))}
                className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white font-mono"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setType('simple')}
                className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${type === 'simple' ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
              >
                Simple
              </button>
              <button 
                onClick={() => setType('compound')}
                className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${type === 'compound' ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
              >
                Composé
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-zinc-900 p-10 rounded-3xl shadow-xl border border-zinc-800 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] rounded-full -mr-20 -mt-20"></div>
            <span className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mb-4">Valeur Acquise Finale (C<sub>n</sub>)</span>
            <div className="text-7xl font-black text-white mb-8 drop-shadow-2xl">
              {formatCurrency(capResult)}
            </div>
            
            <div className="bg-zinc-950/80 backdrop-blur-sm p-8 rounded-3xl border border-zinc-800 w-full max-w-lg">
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="text-left">
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Plus-value</span>
                  <span className="text-2xl font-bold text-emerald-500">+{formatCurrency(capResult - c0)}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Coefficient</span>
                  <span className="text-2xl font-bold text-zinc-200">×{(capResult/c0).toFixed(4)}</span>
                </div>
              </div>
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 font-mono text-sm text-blue-400 text-center">
                {type === 'simple' ? `C0 * (1 + ${n} * ${i/100})` : `C0 * (1 + ${i/100})^${n}`}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-800 grid md:grid-cols-3 gap-8">
             <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Capital Emprunté</label>
              <input 
                type="number" value={k0} onChange={(e) => setK0(Number(e.target.value))}
                className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Nombre d'échéances</label>
              <input 
                type="number" value={loanN} onChange={(e) => setLoanN(Number(e.target.value))}
                className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Taux Annuel (%)</label>
              <input 
                type="number" step="0.1" value={loanI} onChange={(e) => setLoanI(Number(e.target.value))}
                className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-mono"
              />
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl shadow-xl border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-950 text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-5 border-b border-zinc-800">Période</th>
                    <th className="px-6 py-5 border-b border-zinc-800">K restant (Début)</th>
                    <th className="px-6 py-5 border-b border-zinc-800">Intérêts (I)</th>
                    <th className="px-6 py-5 border-b border-zinc-800">Amort. (M)</th>
                    <th className="px-6 py-5 border-b border-zinc-800">Annuité (a)</th>
                    <th className="px-6 py-5 border-b border-zinc-800">K restant (Fin)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {loanTable.map((row) => (
                    <tr key={row.period} className="hover:bg-zinc-800/50 transition-colors font-mono text-sm">
                      <td className="px-6 py-4 font-bold text-blue-500">{row.period}</td>
                      <td className="px-6 py-4 text-zinc-300">{formatCurrency(row.remainingStart)}</td>
                      <td className="px-6 py-4 text-red-400">{formatCurrency(row.interest)}</td>
                      <td className="px-6 py-4 text-emerald-400">{formatCurrency(row.amortization)}</td>
                      <td className="px-6 py-4 font-bold text-white">{formatCurrency(row.annuity)}</td>
                      <td className="px-6 py-4 text-zinc-500">{formatCurrency(row.remainingEnd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorLab;
