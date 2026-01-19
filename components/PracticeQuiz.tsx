
import React, { useState, useCallback, useEffect } from 'react';
import { calculateCompoundInterest, formatCurrency } from '../services/mathUtils';
import { 
  calculateCA, calculateMarge, calculateTauxMarge, 
  calculateTauxMarque, calculateCoeffMult, getHTfromTTC 
} from '../services/managementUtils';
import { Question, CourseType } from '../types';

interface Props {
  course: CourseType;
}

const PracticeQuiz: React.FC<Props> = ({ course }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);

  const generateFinanceQuestion = useCallback(() => {
    const types = ['capital', 'rate', 'interest'];
    const active = types[Math.floor(Math.random() * types.length)];
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

  const generateManagementQuestion = useCallback(() => {
    const types = ['margin', 'markup', 'coeff', 'ca'];
    const active = types[Math.floor(Math.random() * types.length)];
    const paHT = Math.floor(Math.random() * 100) + 20;
    const margeUnit = Math.floor(Math.random() * 40) + 5;
    const pvHT = paHT + margeUnit;
    const pvTTC = pvHT * 1.2;
    const qte = Math.floor(Math.random() * 500) + 100;

    switch(active) {
      case 'margin':
        return {
          id: Math.random().toString(),
          text: `Un produit est acheté ${paHT}€ HT et revendu ${pvHT}€ HT. Quel est son taux de marge (sur coût) ?`,
          correctAnswer: Number(calculateTauxMarge(margeUnit, paHT).toFixed(2)),
          explanation: `Taux Marge = (Marge / PA HT) × 100`, unit: '%', formula: ''
        };
      case 'markup':
        return {
          id: Math.random().toString(),
          text: `Un produit est acheté ${paHT}€ HT et revendu ${pvHT}€ HT. Quel est son taux de marque (sur PV) ?`,
          correctAnswer: Number(calculateTauxMarque(margeUnit, pvHT).toFixed(2)),
          explanation: `Taux Marque = (Marge / PV HT) × 100`, unit: '%', formula: ''
        };
      case 'coeff':
        return {
          id: Math.random().toString(),
          text: `Si un produit coûte ${paHT}€ HT et est étiqueté ${pvTTC.toFixed(2)}€ TTC, quel est le coefficient multiplicateur ?`,
          correctAnswer: Number(calculateCoeffMult(pvTTC, paHT).toFixed(2)),
          explanation: `Coeff = PV TTC / PA HT`, unit: '', formula: ''
        };
      default:
        return {
          id: Math.random().toString(),
          text: `Calculer le CA réalisé pour la vente de ${qte} polos à un prix unitaire de ${pvTTC.toFixed(2)}€ TTC.`,
          correctAnswer: Number(calculateCA(pvTTC, qte).toFixed(2)),
          explanation: `CA = PV TTC × Quantité`, unit: '€', formula: ''
        };
    }
  }, []);

  const nextQuestion = useCallback(() => {
    const q = course === 'finance' ? generateFinanceQuestion() : generateManagementQuestion();
    setQuestion(q as Question);
    setUserAnswer('');
    setFeedback(null);
  }, [course, generateFinanceQuestion, generateManagementQuestion]);

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || feedback) return;
    const val = parseFloat(userAnswer.replace(',', '.'));
    const isCorrect = Math.abs(val - question.correctAnswer) < 0.5;
    if (isCorrect) setScore(s => s + 1);
    setFeedback({ isCorrect, message: isCorrect ? "Parfait !" : `Erreur. C'était ${question.correctAnswer}${question.unit}` });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <h3 className="font-black text-2xl text-white uppercase tracking-tighter">Entraînement <span className={course === 'finance' ? 'text-blue-500' : 'text-emerald-500'}>{course}</span></h3>
          <div className="bg-zinc-950 px-6 py-2 rounded-2xl border border-zinc-800 font-black text-blue-500">{score} pts</div>
        </div>

        {question && (
          <div className="space-y-8">
            <div className="bg-zinc-950 p-8 rounded-2xl text-xl text-zinc-300 border border-zinc-800">{question.text}</div>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input 
                type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                className="flex-1 p-5 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-white text-2xl"
                placeholder="0.00"
              />
              <button className={`px-10 rounded-2xl font-black text-white ${course === 'finance' ? 'bg-blue-600' : 'bg-emerald-600'}`}>VALIDER</button>
            </form>

            {feedback && (
              <div className={`p-6 rounded-2xl border ${feedback.isCorrect ? 'bg-emerald-900/10 border-emerald-500/50 text-emerald-400' : 'bg-red-900/10 border-red-500/50 text-red-400'}`}>
                <p className="font-bold mb-2">{feedback.message}</p>
                {!feedback.isCorrect && <p className="text-sm opacity-80">{question.explanation}</p>}
                <button onClick={nextQuestion} className="mt-4 w-full py-3 bg-white text-black font-black rounded-xl uppercase tracking-widest">Suivant</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeQuiz;
