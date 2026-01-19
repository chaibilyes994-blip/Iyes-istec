
import React, { useState, useEffect, useRef } from 'react';

const SidebarCalculator: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [lastResult, setLastResult] = useState('0');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [expression]);

  const formatDisplayNumber = (numStr: string) => {
    if (!numStr || isNaN(Number(numStr))) return numStr;
    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join(',');
  };

  const handleInput = (val: string) => {
    if (isEvaluated) {
      if (['+', '-', '*', '/', '^'].includes(val)) {
        setExpression(result + val);
      } else {
        setExpression(val);
      }
      setIsEvaluated(false);
    } else {
      setExpression(prev => prev + val);
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
    setIsEvaluated(false);
  };

  const handleBackspace = () => {
    if (isEvaluated) {
      handleClear();
    } else {
      setExpression(prev => prev.slice(0, -1));
    }
  };

  const calculate = () => {
    if (!expression) return;
    try {
      let formattedExpr = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/(\d+(\.\d+)?)%/g, '($1/100)')
        .replace(/(\d)\(/g, '$1*(')
        .replace(/\)(\d)/g, ')*$1')
        .replace(/\)\(/g, ')*(')
        .replace(/√\(/g, 'Math.sqrt(');

      const evalResult = new Function(`return ${formattedExpr}`)();
      const finalRes = String(Number(evalResult.toFixed(10)));
      setResult(finalRes);
      setLastResult(finalRes);
      setIsEvaluated(true);
    } catch (e) {
      setResult('Erreur');
      setIsEvaluated(true);
    }
  };

  const btnBase = "flex items-center justify-center rounded-lg text-[11px] font-bold transition-all active:scale-95 select-none shadow-sm";
  const numBtn = `${btnBase} h-10 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/50`;
  const opBtn = `${btnBase} h-10 bg-blue-600 hover:bg-blue-500 text-white`;
  const fnBtn = `${btnBase} h-10 bg-zinc-800/50 hover:bg-zinc-700 text-blue-400 font-mono border border-zinc-700/30`;
  const clearBtn = `${btnBase} h-10 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30`;

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl overflow-hidden shadow-inner group">
        <div 
          ref={scrollRef}
          className="text-zinc-500 text-[10px] font-mono h-5 mb-1 overflow-x-auto whitespace-nowrap scrollbar-hide text-right flex items-center justify-end gap-1"
        >
          {expression.split(/([-+*/^])/).map((part, i) => (
            <span key={i} className={['+', '-', '*', '/', '^'].includes(part) ? 'text-blue-500 font-bold' : ''}>
              {part.replace(/\*/g, '×').replace(/\//g, '÷')}
            </span>
          )) || ' '}
        </div>
        <div className="text-right text-2xl font-mono text-blue-400 overflow-hidden truncate">
          {isEvaluated ? formatDisplayNumber(result) : formatDisplayNumber(expression.split(/[-+*\/^]/).pop() || '0')}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <button onClick={() => handleInput('^(')} title="Puissance fractionnaire" className={fnBtn}>y^(1/x)</button>
        <button onClick={() => handleInput('^')} title="Puissance" className={fnBtn}>xʸ</button>
        <button onClick={() => handleInput('1/(')} title="Inverse" className={fnBtn}>1/x</button>
        <button onClick={() => { if(isEvaluated) setExpression(lastResult); else handleInput(lastResult); }} title="Réponse précédente" className={fnBtn}>Ans</button>

        <button onClick={() => handleInput('√(')} className={fnBtn}>√</button>
        <button onClick={() => handleInput('%')} className={fnBtn}>%</button>
        <button onClick={() => handleInput('(')} className={fnBtn}>(</button>
        <button onClick={() => handleInput(')')} className={fnBtn}>)</button>

        <button onClick={handleClear} className={clearBtn}>AC</button>
        <button onClick={handleBackspace} className={clearBtn}>⌫</button>
        <button onClick={() => handleInput('÷')} className={opBtn}>÷</button>
        <button onClick={() => handleInput('×')} className={opBtn}>×</button>

        {[7, 8, 9].map(n => <button key={n} onClick={() => handleInput(String(n))} className={numBtn}>{n}</button>)}
        <button onClick={() => handleInput('-')} className={opBtn}>−</button>

        {[4, 5, 6].map(n => <button key={n} onClick={() => handleInput(String(n))} className={numBtn}>{n}</button>)}
        <button onClick={() => handleInput('+')} className={opBtn}>+</button>

        <div className="col-span-3 grid grid-cols-3 gap-2">
           {[1, 2, 3].map(n => <button key={n} onClick={() => handleInput(String(n))} className={numBtn}>{n}</button>)}
           <button onClick={() => handleInput('0')} className={`${numBtn} col-span-2`}>0</button>
           <button onClick={() => handleInput('.')} className={numBtn}>,</button>
        </div>
        <button onClick={calculate} className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black text-xl shadow-lg shadow-blue-900/30 border-b-2 border-blue-700 active:scale-95 transition-all">=</button>
      </div>

      <div className="mt-1 p-2 bg-zinc-950/50 rounded-lg border border-zinc-800">
        <div className="flex justify-between text-[8px] text-zinc-500 uppercase tracking-widest font-black mb-1">
          <span>Outils Scientifiques</span>
        </div>
        <div className="text-[9px] text-zinc-600 space-y-1">
          <p>• <span className="text-blue-500 font-bold">y^(1/x)</span> : Idéal pour les taux équivalents (ex: 1.06^(1/12))</p>
          <p>• <span className="text-blue-500 font-bold">%</span> : Divise par 100 le nombre précédent</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarCalculator;
