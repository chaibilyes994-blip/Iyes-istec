
import React, { useState, useCallback, useEffect } from 'react';
import { calculateCompoundInterest, formatCurrency } from '../services/mathUtils';
import { 
  calculateCA, calculateTauxMarge, 
  calculateTauxMarque, calculateCoeffMult, getHTfromTTC,
  calculateDelaiStock, calculateSR
} from '../services/managementUtils';
import { Question, CourseType } from '../types';

interface Props {
  course: CourseType;
}

const PracticeQuiz: React.FC<Props> = ({ course }) => {
  const [setup, setSetup] = useState(true);
  const [mode, setMode] = useState<string>('all');
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; expected: string } | null>(null);
  const [score, setScore] = useState(0);

  const generateFinanceQuestion = useCallback((targetMode: string) => {
    // Determine which part of the course we're in
    const isPart2Selected = targetMode === 'part2';
    const isAll = targetMode === 'all';
    const usePart2 = isPart2Selected || (isAll && Math.random() > 0.6);

    if (!usePart2) {
      // PART 1: Capitalization / Interests / C0
      const subType = Math.random();
      const c0_base = Math.floor(Math.random() * 5000) + 1000;
      const n = Math.floor(Math.random() * 10) + 3;
      const i = Math.floor(Math.random() * 7) + 2;
      const cn = calculateCompoundInterest(c0_base, n, i);

      if (subType > 0.6) {
        // Target: Find C0
        const roundedCn = Math.round(cn);
        const correctC0 = roundedCn / Math.pow(1 + i/100, n);
        return {
          id: Math.random().toString(),
          text: `Quel capital initial C₀ faut-il placer à ${i}% (composé) pendant ${n} ans pour atteindre une valeur acquise de ${formatCurrency(roundedCn)} ?`,
          correctAnswer: Number(correctC0.toFixed(2)),
          explanation: `Formule : C₀ = Cₙ × (1+i)⁻ⁿ`, unit: '€'
        };
      } else if (subType > 0.3) {
        // Target: Find Interests I
        const interests = cn - c0_base;
        return {
          id: Math.random().toString(),
          text: `Calculer le montant total des intérêts cumulés pour un placement de ${formatCurrency(c0_base)} à ${i}% (composé) sur ${n} ans.`,
          correctAnswer: Number(interests.toFixed(2)),
          explanation: `Calcul : Cₙ - C₀. (Cₙ = ${cn.toFixed(2)}€)`, unit: '€'
        };
      } else {
        // Target: Find Value Cn
        return {
          id: Math.random().toString(),
          text: `Quelle sera la valeur acquise (Cₙ) d'un placement de ${formatCurrency(c0_base)} placé à ${i}% (composé) pendant ${n} ans ?`,
          correctAnswer: Number(cn.toFixed(2)),
          explanation: `Formule : Cₙ = C₀ × (1+i)ⁿ`, unit: '€'
        };
      }
    } else {
      // PART 2: Loans / Annuities
      const k0 = Math.floor(Math.random() * 50000) + 20000;
      const rate = 3.5;
      const years = 10;
      const i_per = rate / 100;
      const annuity = k0 * (i_per / (1 - Math.pow(1 + i_per, -years)));
      
      return {
        id: Math.random().toString(),
        text: `Calculer l'annuité constante d'un emprunt de ${formatCurrency(k0)} sur ${years} ans au taux annuel de ${rate}%.`,
        correctAnswer: Number(annuity.toFixed(2)),
        explanation: `Formule : a = K₀ × [i / (1-(1+i)⁻ⁿ)]`, unit: '€'
      };
    }
  }, []);

  const generateManagementQuestion = useCallback((targetMode: string) => {
    const isPart2Selected = targetMode === 'part2';
    const isAll = targetMode === 'all';
    const usePart2 = isPart2Selected || (isAll && Math.random() > 0.6);

    if (!usePart2) {
      // PART 1: Prices & Margins
      const paHT = Math.floor(Math.random() * 150) + 50;
      const margin = Math.floor(Math.random() * 40) + 10;
      const pvHT = paHT + margin;
      const subType = Math.random();

      if (subType > 0.5) {
        return {
          id: Math.random().toString(),
          text: `Calculer le taux de marge d'un article acheté ${paHT}€ HT et revendu ${pvHT}€ HT.`,
          correctAnswer: Number(((margin / paHT) * 100).toFixed(2)),
          explanation: `(Marge / PA HT) × 100`, unit: '%'
        };
      } else {
        const pvTTC = pvHT * 1.2;
        return {
          id: Math.random().toString(),
          text: `Calculer le coefficient multiplicateur (arrondi à 2 décimales) pour un article acheté ${paHT}€ HT et vendu ${pvTTC.toFixed(2)}€ TTC.`,
          correctAnswer: Number((pvTTC / paHT).toFixed(2)),
          explanation: `PV TTC / PA HT`, unit: ''
        };
      }
    } else {
      // PART 2: Stocks & SR
      const subType = Math.random();
      if (subType > 0.5) {
        const stock = 25000; const cmv = 150000;
        return {
          id: Math.random().toString(),
          text: `Calculer le délai de stockage (en jours) si le stock moyen est de ${formatCurrency(stock)} et le CMV annuel est de ${formatCurrency(cmv)}.`,
          correctAnswer: Math.round(calculateDelaiStock(stock, cmv)),
          explanation: `(Stock / CMV) × 360`, unit: ' jours'
        };
      } else {
        const fixes = 40000; const tmcv = 35;
        return {
          id: Math.random().toString(),
          text: `Calculer le Seuil de Rentabilité (SR) pour une entreprise ayant ${formatCurrency(fixes)} de charges fixes et un taux de MCV de ${tmcv}%.`,
          correctAnswer: Number(calculateSR(fixes, tmcv).toFixed(2)),
          explanation: `Charges Fixes / Taux MCV`, unit: '€'
        };
      }
    }
  }, []);

  const nextQuestion = useCallback(() => {
    const q = course === 'finance' ? generateFinanceQuestion(mode) : generateManagementQuestion(mode);
    setQuestion(q as any);
    setUserAnswer('');
    setFeedback(null);
  }, [course, mode, generateFinanceQuestion, generateManagementQuestion]);

  useEffect(() => {
    if (!setup && !question) nextQuestion();
  }, [setup, question, nextQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || feedback) return;
    
    // Cleanup input: allow commas and remove spaces
    const cleanInput = userAnswer.replace(/,/g, '.').replace(/\s/g, '');
    const val = parseFloat(cleanInput);
    
    if (isNaN(val)) return;

    // Robust comparison with rounding and small error margin (0.5% or 0.10 absolute)
    const expected = question.correctAnswer;
    const diff = Math.abs(val - expected);
    const threshold = Math.max(0.1, expected * 0.005);
    const isCorrect = diff <= threshold;
    
    if (isCorrect) setScore(s => s + 1);
    setFeedback({ 
      isCorrect, 
      message: isCorrect ? "Parfait !" : "Calcul incorrect.",
      expected: `${expected}${question.unit}`
    });
  };

  if (setup) {
    const options = course === 'finance' ? [
      { id: 'part1', title: 'Partie 1 : Flux & Cap.', desc: 'C₀, Cₙ et calculs d\'intérêts composés.', color: 'blue' },
      { id: 'part2', title: 'Partie 2 : Emprunts', desc: 'Annuités constantes et amortissements.', color: 'emerald' },
      { id: 'all', title: 'Mode Mixte (Examen)', desc: 'Toutes les formules de finance.', color: 'zinc' }
    ] : [
      { id: 'part1', title: 'Partie 1 : Prix & Marges', desc: 'Taux de marge, marque et coefficients.', color: 'amber' },
      { id: 'part2', title: 'Partie 2 : Performance', desc: 'Rotation de stock et seuil de rentabilité.', color: 'rose' },
      { id: 'all', title: 'Mode Mixte (Examen)', desc: 'Toutes les formules de gestion.', color: 'zinc' }
    ];

    return (
      <div className="max-w-4xl mx-auto py-12 space-y-12 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Laboratoire de Pratique</h2>
          <p className="text-zinc-500 text-lg font-medium">Ciblez votre entraînement pour optimiser votre score aux partiels.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { setMode(opt.id); setSetup(false); }}
              className={`p-10 rounded-[3rem] border border-zinc-800 bg-zinc-900/50 text-left transition-all hover:border-${opt.color}-500/50 hover:bg-zinc-800/80 group flex flex-col justify-between h-full shadow-2xl`}
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl mb-8 flex items-center justify-center bg-zinc-950 text-${opt.color}-500 group-hover:bg-${opt.color}-600 group-hover:text-white transition-all`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 group-hover:translate-x-1 transition-transform">{opt.title}</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed">{opt.desc}</p>
              </div>
              <div className="mt-8 text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white">Lancer l'activité</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <div className="bg-zinc-900 p-12 rounded-[3.5rem] border border-zinc-800 shadow-2xl relative">
        {/* Header Question */}
        <div className="flex justify-between items-center mb-12">
          <button onClick={() => { setSetup(true); setQuestion(null); }} className="flex items-center gap-2 text-zinc-600 hover:text-white transition-colors font-black text-xs uppercase tracking-[0.2em]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg> Retour aux modes
          </button>
          <div className="bg-zinc-950 px-8 py-3 rounded-2xl border border-zinc-800 font-black text-blue-500 shadow-inner flex flex-col items-center">
            <span className="text-[10px] text-zinc-600 mb-0.5">SCORE</span>
            <span className="text-xl tracking-tighter">{score}</span>
          </div>
        </div>

        {question && (
          <div className="space-y-12">
            <div className="bg-zinc-950 p-10 rounded-[2.5rem] text-3xl font-bold text-white border border-zinc-800/50 leading-tight shadow-inner relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
               {question.text}
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
              <div className="relative flex-1 group">
                <input 
                  autoFocus
                  type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                  className="w-full p-8 bg-zinc-950 border-2 border-zinc-800 rounded-3xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 outline-none font-black text-white text-4xl transition-all shadow-inner placeholder:text-zinc-800"
                  placeholder="0,00"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-700 font-black uppercase text-lg tracking-widest pointer-events-none group-focus-within:text-blue-500 transition-colors">
                  {question.unit}
                </span>
              </div>
              <button className={`px-16 py-8 rounded-3xl font-black text-white text-xl uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${course === 'finance' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'}`}>VALIDER</button>
            </form>

            {feedback && (
              <div className={`p-10 rounded-[2.5rem] border-2 animate-in zoom-in-95 duration-300 ${feedback.isCorrect ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-400' : 'bg-red-950/20 border-red-500/50 text-red-400'}`}>
                <div className="flex items-center gap-6 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl ${feedback.isCorrect ? 'bg-emerald-500 text-emerald-950' : 'bg-red-500 text-red-950'}`}>
                    {feedback.isCorrect ? '✓' : '!'}
                  </div>
                  <h4 className="font-black text-3xl uppercase tracking-tighter">{feedback.message}</h4>
                </div>
                {!feedback.isCorrect && (
                  <div className="space-y-4 pl-16">
                    <p className="text-xl font-bold">Réponse correcte : <span className="bg-white/10 px-4 py-2 rounded-xl text-white font-mono">{feedback.expected}</span></p>
                    <p className="text-sm opacity-80 font-medium italic border-l-2 border-red-500/30 pl-4">{question.explanation}</p>
                  </div>
                )}
                <button onClick={nextQuestion} className="mt-10 w-full py-6 bg-white text-black font-black text-lg rounded-2xl uppercase tracking-[0.3em] hover:bg-zinc-200 transition-colors shadow-2xl active:scale-[0.98]">Question Suivante</button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="text-center px-12">
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em] leading-relaxed">Entraînement infini • Utilisez la calculatrice scientifique pour vos opérations complexes</p>
      </div>
    </div>
  );
};

export default PracticeQuiz;
