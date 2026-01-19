
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { calculateCompoundInterest, calculateConstantAnnuity, formatCurrency, calculateSimpleInterest } from '../services/mathUtils';
import { calculateSR, calculateDelaiStock, calculateTauxMarge, calculateTauxMarque, getHTfromTTC, calculateCA, calculatePointMort } from '../services/managementUtils';
import { Question, CourseType } from '../types';

interface AttemptRecord {
  question: Question;
  userAnswer: string | number;
  isCorrect: boolean;
}

interface Props {
  course: CourseType;
}

const ExamMode: React.FC<Props> = ({ course }) => {
  const [status, setStatus] = useState<'setup' | 'active' | 'finished'>('setup');
  const [timeLimit, setTimeLimit] = useState(15); 
  const [timeLeft, setTimeLeft] = useState(0); 
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<AttemptRecord[]>([]);
  
  const lastQuestionsRef = useRef<string[]>([]);

  const generateQuestion = useCallback((): Question => {
    const qPool: (() => Question)[] = [];
    
    if (course === 'finance') {
      // THEORIE FINANCE
      qPool.push(() => ({
        id: 'f_theory_1', type: 'theory', text: "Dans un emprunt à annuités constantes, quelle composante diminue à chaque période ?", 
        correctAnswer: "Les intérêts",
        options: ["Le capital amorti", "Les intérêts", "L'annuité", "La durée"],
        explanation: "Puisque le capital restant dû diminue, l'intérêt calculé dessus baisse également.", unit: "", formula: "", params: {}
      }));
      qPool.push(() => ({
        id: 'f_theory_2', type: 'theory', text: "Un placement de court terme (inférieur à 1 an) utilise généralement :", 
        correctAnswer: "Les intérêts simples",
        options: ["Les intérêts composés", "Les intérêts simples", "La capitalisation continue", "L'actualisation exponentielle"],
        explanation: "Les intérêts simples sont la norme pour les produits de trésorerie court terme.", unit: "", formula: "", params: {}
      }));

      // CALCULS FINANCE
      qPool.push(() => {
        const c0 = Math.floor(Math.random() * 5000) + 1000;
        const i = 0.04; const n = 5;
        const res = c0 * Math.pow(1.04, 5);
        return { id: 'f_calc_1', text: `Calculer la valeur acquise (Cₙ) de ${formatCurrency(c0)} placé à 4% composé pendant 5 ans.`, type: 'calculation', correctAnswer: Number(res.toFixed(2)), explanation: "C₀(1+i)ⁿ", unit: "€", formula: "", params: {} };
      });
      qPool.push(() => {
        const k0 = 80000; const n = 10; const i = 0.025;
        const a = calculateConstantAnnuity(k0, n, i * 100);
        return { id: 'f_calc_2', text: `Annuité constante pour un prêt de ${formatCurrency(k0)} sur 10 ans à un taux de 2,5%.`, type: 'calculation', correctAnswer: Number(a.toFixed(2)), explanation: "Formule de l'annuité standard.", unit: "€", formula: "", params: {} };
      });
      qPool.push(() => {
        const c0 = 12000; const i = 0.03; const days = 180;
        const res = c0 * i * (180/360);
        return { id: 'f_calc_3', text: `Quel est le montant des intérêts SIMPLES pour ${formatCurrency(c0)} à 3% pendant 180 jours ?`, type: 'calculation', correctAnswer: Number(res.toFixed(2)), explanation: "I = C₀ × i × (n/360)", unit: "€", formula: "", params: {} };
      });
      qPool.push(() => {
        const k0 = 30000; const a = 6500; const i = 0.03;
        const i1 = k0 * i;
        const m1 = a - i1;
        return { id: 'f_calc_4', text: `Emprunt ${formatCurrency(k0)}, Taux 3%, Annuité ${formatCurrency(a)}. Calculer l'amortissement M₁ de la première année.`, type: 'calculation', correctAnswer: Number(m1.toFixed(2)), explanation: "M₁ = a - (K₀ × i)", unit: "€", formula: "", params: {} };
      });
    } else {
      // THEORIE MANAGEMENT
      qPool.push(() => ({
        id: 'm_theory_1', type: 'theory', text: "Quelle est la définition du Seuil de Rentabilité ?", 
        correctAnswer: "CA pour lequel le résultat est nul",
        options: ["CA maximum possible", "CA pour lequel le résultat est nul", "Marge réalisée sur chaque produit", "Total des charges variables"],
        explanation: "C'est le point mort financier où l'entreprise ne fait ni perte ni profit.", unit: "", formula: "", params: {}
      }));
      qPool.push(() => ({
        id: 'm_theory_2', type: 'theory', text: "Le taux de marque se calcule par rapport au :", 
        correctAnswer: "Prix de Vente HT",
        options: ["Coût d'Achat HT", "Prix de Vente HT", "Prix de Vente TTC", "Chiffre d'Affaires"],
        explanation: "Taux de marque = (Marge / PV HT) × 100.", unit: "", formula: "", params: {}
      }));

      // CALCULS MANAGEMENT
      qPool.push(() => {
        const pa = 120; const pv = 180;
        const tm = ((pv-pa)/pv)*100;
        return { id: 'm_calc_1', text: `Produit acheté ${pa}€ HT, vendu ${pv}€ HT. Calculer le taux de MARQUE.`, type: 'calculation', correctAnswer: Number(tm.toFixed(2)), explanation: "((PV-PA)/PV)×100", unit: "%", formula: "", params: {} };
      });
      qPool.push(() => {
        const cf = 45000; const tmcv = 30;
        const sr = cf / 0.3;
        return { id: 'm_calc_2', text: `Si Fixes = ${formatCurrency(cf)} et Taux MCV = 30%, quel est le SR ?`, type: 'calculation', correctAnswer: Number(sr.toFixed(2)), explanation: "CF / Taux MCV", unit: "€", formula: "", params: {} };
      });
      qPool.push(() => {
        const stock = 12000; const cmv = 72000;
        const delai = (stock / cmv) * 360;
        return { id: 'm_calc_3', text: `Rotation stock : Stock Moyen ${formatCurrency(stock)}, CMV annuel ${formatCurrency(cmv)}. Délai en jours ?`, type: 'calculation', correctAnswer: Number(delai.toFixed(0)), explanation: "(Stock/CMV)×360", unit: " jours", formula: "", params: {} };
      });
      qPool.push(() => {
        const pv_ttc = 144; const pa_ht = 80;
        const coeff = pv_ttc / pa_ht;
        return { id: 'm_calc_4', text: `Quel est le coefficient multiplicateur pour passer d'un achat de ${pa_ht}€ HT à un prix public de ${pv_ttc}€ TTC ?`, type: 'calculation', correctAnswer: Number(coeff.toFixed(2)), explanation: "PV TTC / PA HT", unit: "", formula: "", params: {} };
      });
    }

    let selected: () => Question;
    let attempts = 0;
    do {
      selected = qPool[Math.floor(Math.random() * qPool.length)];
      attempts++;
    } while (lastQuestionsRef.current.includes(selected().id) && attempts < 15);

    const q = selected();
    lastQuestionsRef.current = [q.id, ...lastQuestionsRef.current].slice(0, 8);
    return q;
  }, [course]);

  const startExam = () => {
    setScore(0);
    setHistory([]);
    setTimeLeft(timeLimit * 60);
    setStatus('active');
    setCurrentQuestion(generateQuestion());
  };

  useEffect(() => {
    let timer: any;
    if (status === 'active' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && status === 'active') {
      setStatus('finished');
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const handleAnswer = (answer: string | number) => {
    if (!currentQuestion) return;
    let isCorrect = false;
    if (currentQuestion.type === 'theory') {
      isCorrect = answer === currentQuestion.correctAnswer;
    } else {
      const val = parseFloat(String(answer).replace(',', '.').replace(/\s/g, ''));
      const threshold = Math.max(0.5, currentQuestion.correctAnswer * 0.01);
      isCorrect = Math.abs(val - (currentQuestion.correctAnswer as number)) <= threshold;
    }
    setHistory(prev => [...prev, { question: currentQuestion, userAnswer: answer, isCorrect }]);
    if (isCorrect) setScore(s => s + 1);
    setCurrentQuestion(generateQuestion());
    setUserAnswer('');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (status === 'setup') {
    return (
      <div className="max-w-2xl mx-auto bg-zinc-900 p-12 rounded-[3.5rem] border border-zinc-800 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">SIMULATION EXAMEN <span className={course === 'finance' ? 'text-blue-500' : 'text-emerald-500'}>{course}</span></h2>
        <p className="text-zinc-500 mb-12 text-lg font-medium italic">Préparation intensive I.S.T.E.C. sous contrainte de temps.</p>
        <div className="flex justify-center gap-6 mb-12">
          {[10, 20, 30].map(m => (
            <button key={m} onClick={() => setTimeLimit(m)} className={`w-24 h-24 rounded-3xl border-2 transition-all flex flex-col items-center justify-center ${timeLimit === m ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}>
              <span className="text-3xl font-black">{m}</span><span className="text-[10px] font-bold tracking-widest">MIN</span>
            </button>
          ))}
        </div>
        <button onClick={startExam} className={`w-full py-8 rounded-3xl font-black text-2xl text-white shadow-2xl transition-all active:scale-95 ${course === 'finance' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>DÉBUTER L'ÉPREUVE</button>
      </div>
    );
  }

  if (status === 'finished') {
    return (
      <div className="max-w-4xl mx-auto space-y-12 pb-32 animate-in zoom-in-95 duration-700">
        <div className="bg-zinc-900 p-16 rounded-[4rem] border border-zinc-800 shadow-2xl text-center">
          <h2 className="text-5xl font-black text-white mb-8 uppercase tracking-tighter">Bilan de l'Épreuve</h2>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="bg-zinc-950 p-10 rounded-[2.5rem] border border-zinc-800/50 shadow-inner">
              <span className="block text-[11px] font-black text-zinc-600 uppercase mb-4 tracking-[0.3em]">Score Final</span>
              <span className="text-6xl font-black text-blue-500 tracking-tighter">{score} <span className="text-2xl text-zinc-700">/ {history.length}</span></span>
            </div>
            <div className="bg-zinc-950 p-10 rounded-[2.5rem] border border-zinc-800/50 shadow-inner">
              <span className="block text-[11px] font-black text-zinc-600 uppercase mb-4 tracking-[0.3em]">Réussite</span>
              <span className={`text-6xl font-black ${history.length > 0 && (score/history.length) >= 0.5 ? 'text-emerald-500' : 'text-red-500'} tracking-tighter`}>
                {history.length > 0 ? Math.round((score/history.length)*100) : 0}%
              </span>
            </div>
          </div>
          <button onClick={() => setStatus('setup')} className="w-full py-6 bg-white text-black rounded-3xl font-black text-xl uppercase tracking-[0.4em] shadow-2xl hover:bg-zinc-100 transition-colors">Relancer une session</button>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-black text-white px-6 uppercase tracking-tighter">Analyse détaillée</h3>
          {history.map((h, i) => (
            <div key={i} className={`p-8 rounded-[2.5rem] border-2 transition-all ${h.isCorrect ? 'border-emerald-500/10 bg-emerald-500/5' : 'border-red-500/10 bg-red-500/5'}`}>
              <p className="text-xl font-bold text-zinc-100 mb-4">{h.question.text}</p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono font-bold">
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                   <span className="text-[10px] text-zinc-600 block mb-1 uppercase tracking-widest">Votre réponse</span>
                   <span className={h.isCorrect ? 'text-emerald-500' : 'text-red-500'}>{h.userAnswer}</span>
                </div>
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                   <span className="text-[10px] text-zinc-600 block mb-1 uppercase tracking-widest">Attendu</span>
                   <span className="text-emerald-500">{h.question.correctAnswer} {h.question.unit}</span>
                </div>
              </div>
              {!h.isCorrect && <p className="mt-4 text-xs italic text-zinc-500 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/30">Rappel : {h.question.explanation}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      <div className="flex justify-between items-center bg-zinc-900 px-10 py-6 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
        <span className="font-mono text-4xl font-black text-white tracking-tighter">{formatTime(timeLeft)}</span>
        <div className="text-right">
           <span className="text-[10px] font-black text-zinc-600 tracking-[0.4em] uppercase mb-1 block">Question</span>
           <span className="text-3xl font-black text-blue-500 tracking-tighter">{history.length + 1}</span>
        </div>
      </div>

      <div className="bg-zinc-900 p-12 rounded-[3.5rem] border border-zinc-800 shadow-2xl min-h-[400px] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full"></div>
        {currentQuestion && (
          <div className="space-y-12">
            <h3 className="text-3xl font-black text-zinc-100 leading-tight">{currentQuestion.text}</h3>
            
            {currentQuestion.type === 'theory' ? (
              <div className="grid gap-4 mt-8">
                {currentQuestion.options?.map((o, i) => (
                  <button key={i} onClick={() => handleAnswer(o)} className="w-full text-left p-6 bg-zinc-950 border-2 border-zinc-800 rounded-3xl hover:border-blue-500 hover:bg-zinc-900 transition-all font-bold text-xl text-zinc-500 hover:text-white group flex items-center justify-between shadow-inner">
                    {o}
                    <div className="w-8 h-8 rounded-full border border-zinc-800 group-hover:border-blue-500/50 transition-all"></div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6 mt-8 animate-in slide-in-from-bottom-4">
                <div className="relative flex-1 group">
                   <input 
                    autoFocus 
                    type="text" 
                    value={userAnswer} 
                    onChange={e => setUserAnswer(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleAnswer(userAnswer)} 
                    className="w-full p-8 bg-zinc-950 border-2 border-zinc-800 rounded-3xl text-4xl font-black text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner placeholder:text-zinc-900" 
                    placeholder="Résultat..."
                   />
                   <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-700 font-black text-xl">{currentQuestion.unit}</span>
                </div>
                <button onClick={() => handleAnswer(userAnswer)} className={`px-16 py-8 rounded-3xl font-black text-2xl text-white shadow-2xl active:scale-95 transition-all ${course === 'finance' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'}`}>OK</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamMode;
