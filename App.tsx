
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BRL_DENOMINATIONS, FORMATTER } from './constants';
import { ChangeResult, HistoryItem } from './types';
import DenominationGrid from './components/DenominationGrid';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [totalStr, setTotalStr] = useState<string>('');
  const [paidStr, setPaidStr] = useState<string>('');
  const [aiTip, setAiTip] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  const total = parseFloat(totalStr) || 0;
  const paid = parseFloat(paidStr) || 0;
  const changeValue = Math.max(0, paid - total);

  const calculateChange = useCallback((amount: number): ChangeResult => {
    let remaining = Math.round(amount * 100);
    const result: ChangeResult = {
      totalChange: amount,
      breakdown: [],
    };

    BRL_DENOMINATIONS.forEach((denom) => {
      const denomCents = Math.round(denom.value * 100);
      const count = Math.floor(remaining / denomCents);
      if (count > 0) {
        result.breakdown.push({ denomination: denom, count });
        remaining %= denomCents;
      }
    });

    return result;
  }, []);

  const changeResult = useMemo(() => {
    if (changeValue <= 0) return null;
    return calculateChange(changeValue);
  }, [changeValue, calculateChange]);

  const fetchAiTip = useCallback(async () => {
    if (total > 0 && paid > 0 && paid >= total) {
      setIsLoadingTip(true);
      const tip = await geminiService.getSmarterPaymentTip(total, paid);
      setAiTip(tip);
      setIsLoadingTip(false);
    } else {
      setAiTip('');
    }
  }, [total, paid]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAiTip();
    }, 1000);
    return () => clearTimeout(timer);
  }, [fetchAiTip]);

  const handleSaveToHistory = () => {
    if (total > 0 && paid >= total) {
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        total,
        paid,
        change: changeValue,
        timestamp: Date.now(),
      };
      setHistory(prev => [newItem, ...prev].slice(0, 10));
    }
  };

  const clearInputs = () => {
    setTotalStr('');
    setPaidStr('');
    setAiTip('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 flex flex-col items-center justify-center gap-2">
            <span className="bg-orange-600 text-white p-3 rounded-2xl shadow-lg shadow-orange-200 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            <span className="tracking-tight uppercase">TRAILLER DO CARLINHOS</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Calculadora de Troco Rápida</p>
        </header>

        {/* Calculator Card */}
        <main className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 mb-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Valor da Conta</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={totalStr}
                    onChange={(e) => setTotalStr(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-2xl outline-none transition-all text-xl font-semibold text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Valor Pago</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={paidStr}
                    onChange={(e) => setPaidStr(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition-all text-xl font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
               {[10, 20, 50, 100].map(val => (
                 <button 
                  key={val}
                  onClick={() => setPaidStr(val.toString())}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
                 >
                   R$ {val}
                 </button>
               ))}
               <button 
                 onClick={clearInputs}
                 className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium ml-auto transition-colors"
               >
                 Limpar
               </button>
            </div>

            {/* Result Area */}
            {paid > 0 && paid < total ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
                 <span className="font-medium">Valor insuficiente. Faltam <strong>{FORMATTER.format(total - paid)}</strong></span>
              </div>
            ) : changeValue > 0 ? (
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-end justify-between mb-4">
                   <div>
                      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total do Troco</h2>
                      <div className="text-4xl font-black text-green-600">{FORMATTER.format(changeValue)}</div>
                   </div>
                   <button 
                     onClick={handleSaveToHistory}
                     className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                     title="Salvar no Histórico"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                     </svg>
                   </button>
                </div>

                {aiTip && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in duration-500">
                    <div className="bg-blue-600 text-white p-1 rounded-md shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-blue-800 text-sm italic">{aiTip}</p>
                  </div>
                )}

                {isLoadingTip && (
                  <div className="mb-6 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-slate-400 font-medium">Buscando dicas inteligentes...</span>
                  </div>
                )}

                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detalhamento</h3>
                {changeResult && <DenominationGrid breakdown={changeResult.breakdown} />}
              </div>
            ) : paid > 0 && paid === total ? (
              <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <span className="font-medium">Pagamento exato. Sem troco necessário.</span>
              </div>
            ) : null}
          </div>
        </main>

        {/* History Area */}
        {history.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 p-6 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">Últimos Cálculos</h2>
                <button 
                  onClick={() => setHistory([])}
                  className="text-xs text-slate-400 hover:text-red-500 font-semibold"
                >
                  Limpar Histórico
                </button>
             </div>
             <div className="space-y-3">
                {history.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <div>
                      <div className="text-xs text-slate-400 font-medium">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-sm font-semibold text-slate-700">
                        Total: {FORMATTER.format(item.total)}
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-xs text-slate-400 font-medium">Troco</div>
                       <div className="text-md font-bold text-green-600">{FORMATTER.format(item.change)}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        <footer className="mt-8 text-center text-slate-400 text-xs">
           <p>© {new Date().getFullYear()} TRAILLER DO CARLINHOS • Desenvolvido com Gemini AI</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
