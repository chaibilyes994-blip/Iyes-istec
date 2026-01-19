
import React, { useState, useCallback, useEffect } from 'react';
import { calculateCompoundInterest, formatCurrency } from '../services/mathUtils';
import { 
  calculateCA, calculateMarge, calculateTauxMarge, 
  calculateTauxMarque, calculateCoeffMult, getHTfromTTC,
  calculateDelaiStock, calculateSR, calculatePointMort
} from '../services/managementUtils';
import { Question, CourseType } from '../types';

interface Props {
  course: CourseType;
}

type PracticeModeFinance = 'all' | 'capital' | 'interest' | 'loans';
type PracticeModeManagement = 'all' | 'prices' | 'margins' | 'stocks';

const PracticeQuiz: React.FC<Props> = ({ course }) => {
  const [setup, setSetup] = useState(true);
  const [mode, setMode] = useState<string>('all');
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);

  const generateFinanceQuestion = useCallback((targetMode: string) => {
    const availableTypes = targetMode === 'all' ? ['capital', 'interest', 'loans'] : [targetMode];
    const active = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    const c0 = Math.floor(Math.random() * 8000) + 2000;
    const n = Math.floor(Math.random() * 10) + 3;
    const i = Math.floor(Math.random() * 9) + 1;
    const cn = calculateCompoundInterest(c0, n, i);
    
    if (active === 'capital') {
      const target = Math.round(cn / 10) * 10;
      const ans = target / Math.pow(1 + i/100, n);
      return {
        id: Math.random().toString(),
        text: `Quel capital initial C₀ faut-il placer à ${i}% composé pendant ${n} ans pour obtenir ${formatCurrency(target)} ?`,
        correctAnswer: Number(ans.toFixed(2)),
        explanation: `C₀ = Cₙ / (1+i)ⁿ`, unit: '€', formula: ''
      };
    } else if (active === 'loans') {
      const k0 = Math.floor(Math.random() * 100000) + 50000;
      const rate = 3;
      const duration = 15;
      const i_periodic = rate / 100;
      const annuity = k0 * (i_periodic / (1 - Math.pow(1 + i_periodic, -duration)));
      return {
        id: Math.random().toString(),
        text: `Calculer l'annuité constante d'un emprunt de ${formatCurrency(k0)} sur ${duration} ans à un taux de ${rate}%.`,
        correctAnswer: Number(annuity.toFixed(2)),
        explanation: `a = K₀ × [i / (1-(1+i)⁻ⁿ)]`, unit: '€', formula: ''
      };
    } else {
      const ans = cn - c0;
      return {
        id: Math.random().toString(),
        text: `Combien d'intérêts cumulés rapporte un placement de ${formatCurrency(c0)} à ${i}% composé sur ${n} ans ?`,
        correctAnswer: Number(ans.toFixed(2)),
        explanation: `I = Cₙ - C₀`, unit: '€', formula: ''
      };
    }
  }, []);

  const generateManagementQuestion = useCallback((targetMode: string) => {
    const availableTypes = targetMode === 'all' ? ['prices', 'margins', 'stocks'] : [targetMode];
    const active = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    const paHT = Math.floor(Math.random() * 100) + 20;
    const margeUnit = Math.floor(Math.random() * 40) + 5;
    const pvHT = paHT + margeUnit;
    const pvTTC = pvHT * 1.2;
    const qte = Math.floor(Math.random() * 500) + 100;

    if (active === 'margins') {
      const subType = Math.random() > 0.5 ? 'marge' : 'marque';
      if (subType === 'marge') {
        return {
          id: Math.random().toString(),
          text: `Un produit est acheté ${paHT}€ HT et revendu ${pvHT}€ HT. Quel est son taux de marge (sur coût) ?`,
          correctAnswer: Number(calculateTauxMarge(margeUnit, paHT).toFixed(2)),
          explanation: `Taux Marge = (Marge / PA HT) × 100`, unit: '%', formula: ''
        };
      } else {
        return {
          id: Math.random().toString(),
          text: `Un produit est acheté ${paHT}€ HT et revendu ${pvHT}€ HT. Quel est son taux de marque (sur PV) ?`,
          correctAnswer: Number(calculateTauxMarque(margeUnit, pvHT).toFixed(2)),
          explanation: `Taux Marque = (Marge / PV HT) × 100`, unit: '%', formula: ''
        };
      }
    } else if (active === 'stocks') {
      const subType = Math.random() > 0.5 ? 'delai' : 'sr';
      if (subType === 'delai') {
        const stock = 50000; const cmv = 200000;
        return {
          id: Math.random().toString(),
          text: `Calculer le délai moyen de stockage en jours si le stock moyen est de ${formatCurrency(stock)} et le CMV annuel est de ${formatCurrency(cmv)}.`,
          correctAnswer: Number(calculateDelaiStock(stock, cmv).toFixed(0)),
          explanation: `Délai = (Stock / CMV) × 360`, unit: ' jours', formula: ''
        };
      } else {
        const cf = 30000; const tmcv = 40;
        return {
          id: Math.random().toString(),
          text: `Déterminer le Seuil de Rentabilité si les charges fixes sont de ${formatCurrency(cf)} et le taux de MCV est de ${tmcv}%.`,
          correctAnswer: Number(calculateSR(cf, tmcv).toFixed(2)),
          explanation: `SR = Charges Fixes / Taux MCV`, unit: '€', formula: ''
        };
      }
    } else {
      // Prices & CA
      const subType = Math.random() > 0.5 ? 'ca' : 'ttc';
      if (subType === 'ca') {
        return {
          id: Math.random().toString(),
          text: `Calculer le CA réalisé pour la vente de ${qte} articles à un prix unitaire de ${pvTTC.toFixed(2)}€ TTC.`,
          correctAnswer: Number(calculateCA(pvTTC, qte).toFixed(2)),
          explanation: `CA = PV TTC × Quantité`, unit: '€', formula: ''
        };
      } else {
        return {
          id: Math.random().toString(),
          text: `Convertir le prix TTC de ${pvTTC.toFixed(2)}€ en prix HT (TVA 20%).`,
          correctAnswer: Number(getHTfromTTC(pvTTC, 20).toFixed(2)),
          explanation: `HT = TTC / 1,20`, unit: '€ HT', formula: ''
        };
      }
    }
  }, []);

  const nextQuestion = useCallback(() => {
    const q = course === 'finance' ? generateFinanceQuestion(mode) : generateManagementQuestion(mode);
    setQuestion(q as Question);
    setUserAnswer('');
    setFeedback(null);
  }, [course, mode, generateFinanceQuestion, generateManagementQuestion]);

  const startPractice = (selectedMode: string) => {
    setMode(selectedMode);
    setSetup(false);
    setScore(0);
  };

  useEffect(() => {
    if (!setup) nextQuestion();
  }, [setup, nextQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || feedback) return;
    const val = parseFloat(userAnswer.replace(',', '.'));
    const isCorrect = Math.abs(val - question.correctAnswer) < 0.5;
    if (isCorrect) setScore(s => s + 1);
    setFeedback({ isCorrect, message: isCorrect ? "Excellent !" : `Incorrect. La réponse était ${question.correctAnswer}${question.unit}` });
  };

  if (setup) {
    const options = course === 'finance' ? [
      { id: 'all', label: 'Mode Global', desc: 'Toutes les formules' },
      { id: 'capital', label: 'Capital Initial (C₀)', desc: 'Calculer la valeur actuelle' },
      { id: 'interest', label: 'Intérêts & Cn', desc: 'Placements et capitalisation' },
      { id: 'loans', label: 'Emprunts', desc: 'Annuités et amortissements' }
    ] : [
      { id: 'all', label: 'Mode Global', desc: 'Tout le programme' },
      { id: 'prices', label: 'Prix & TVA', desc: 'CA, TTC et conversion HT' },
      { id: 'margins', label: 'Marges & Ratios', desc: 'Taux de marge et de marque' },
      { id: 'stocks', label: 'Stocks & Seuil', desc: 'Rotation, SR et Point Mort' }
    ];

    return (
      <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Entraînement Ciblé</h2>
          <p className="text-zinc-500">Choisissez l'activité sur laquelle vous souhaitez travailler.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => startPractice(opt.id)}
              className={`p-8 rounded-[2rem] border border-zinc-800 bg-zinc-900 text-left transition-all hover:border-${course === 'finance' ? 'blue' : 'emerald'}-500/50 hover:bg-zinc-800/50 group`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${course === 'finance' ? 'bg-blue-600/10 text-blue-500' : 'bg-emerald-600/10 text-emerald-500'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white transition-colors">{opt.label}</h3>
              <p className="text-sm text-zinc-500">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSetup(true)} className="text-zinc-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <h3 className="font-black text-2xl text-white uppercase tracking-tighter">
              Pratique <span className={course === 'finance' ? 'text-blue-500' : 'text-emerald-500'}>{mode === 'all' ? 'Globale' : mode}</span>
            </h3>
          </div>
          <div className="bg-zinc-950 px-6 py-2 rounded-2xl border border-zinc-800 font-black text-blue-500">{score} pts</div>
        </div>

        {question && (
          <div className="space-y-8">
            <div className="bg-zinc-950 p-8 rounded-2xl text-xl text-zinc-300 border border-zinc-800 leading-relaxed">{question.text}</div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input 
                  autoFocus
                  type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                  className="w-full p-5 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-white text-2xl"
                  placeholder="Réponse..."
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-700 font-black uppercase text-xs tracking-widest">{question.unit}</span>
              </div>
              <button className={`px-10 py-5 rounded-2xl font-black text-white uppercase tracking-widest transition-all active:scale-95 ${course === 'finance' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>VALIDER</button>
            </form>

            {feedback && (
              <div className={`p-6 rounded-2xl border ${feedback.isCorrect ? 'bg-emerald-900/10 border-emerald-500/50 text-emerald-400' : 'bg-red-900/10 border-red-500/50 text-red-400'}`}>
                <p className="font-bold mb-2 uppercase tracking-widest">{feedback.message}</p>
                {!feedback.isCorrect && <p className="text-sm opacity-80">{question.explanation}</p>}
                <button onClick={nextQuestion} className="mt-4 w-full py-3 bg-white text-black font-black rounded-xl uppercase tracking-widest hover:bg-zinc-200 transition-colors">Question Suivante</button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-center text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">Utilisez la calculatrice latérale pour vos calculs complexes</p>
    </div>
  );
};

export default PracticeQuiz;
