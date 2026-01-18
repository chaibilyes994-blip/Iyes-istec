
import React, { useState, useCallback, useEffect } from 'react';
import { 
  calculateSimpleInterest, 
  calculateCompoundInterest, 
  formatCurrency 
} from '../services/mathUtils';
import { Question } from '../types';

type QuizCategory = 'all' | 'capital' | 'rate' | 'period' | 'interest';

const PracticeQuiz: React.FC = () => {
  const [category, setCategory] = useState<QuizCategory>('all');
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);

  const generateNewQuestion = useCallback(() => {
    const categories: QuizCategory[] = ['capital', 'rate', 'period', 'interest'];
    const activeCat = category === 'all' ? categories[Math.floor(Math.random() * categories.length)] : category;
    
    // Random base parameters
    const c0 = Math.floor(Math.random() * 8000) + 2000;
    const n = Math.floor(Math.random() * 15) + 3;
    const i = Math.floor(Math.random() * 9) + 1;
    const iDecimal = i / 100;
    const cn = calculateCompoundInterest(c0, n, i);
    
    let qText = '';
    let answer = 0;
    let explanation = '';
    let unit = '€';

    switch (activeCat) {
      case 'capital':
        // Finding C0 given Cn, i, n
        const targetCn = Math.round(cn / 10) * 10;
        answer = targetCn / Math.pow(1 + iDecimal, n);
        qText = `Quel capital initial (C₀) faut-il placer à un taux composé de ${i}% pendant ${n} ans pour obtenir une valeur acquise de ${formatCurrency(targetCn)} ?`;
        explanation = `C₀ = Cₙ / (1 + i)ⁿ = ${targetCn} / (1 + ${iDecimal})¹⁵ = ${answer.toFixed(2)}€`;
        break;

      case 'rate':
        // Finding i given C0, Cn, n
        const targetCnRate = Math.round(cn * 1.2 / 10) * 10;
        answer = (Math.pow(targetCnRate / c0, 1 / n) - 1) * 100;
        qText = `À quel taux d'intérêt composé annuel (en %) un capital de ${formatCurrency(c0)} a-t-il été placé s'il est devenu ${formatCurrency(targetCnRate)} après ${n} ans ?`;
        explanation = `i = [(Cₙ / C₀)^(1/n)] - 1 = [(${targetCnRate} / ${c0})^(1/${n})] - 1 = ${(answer/100).toFixed(4)} soit ${answer.toFixed(2)}%`;
        unit = '%';
        break;

      case 'period':
        // Finding n given C0, Cn, i
        const targetCnPeriod = Math.round(cn * 1.5 / 10) * 10;
        answer = Math.log(targetCnPeriod / c0) / Math.log(1 + iDecimal);
        qText = `Pendant combien d'années (n) faut-il placer ${formatCurrency(c0)} à un taux de ${i}% composé pour atteindre au moins ${formatCurrency(targetCnPeriod)} ?`;
        explanation = `n = ln(Cₙ / C₀) / ln(1 + i) = ln(${targetCnPeriod} / ${c0}) / ln(1 + ${iDecimal}) = ${answer.toFixed(2)} ans`;
        unit = 'ans';
        break;

      case 'interest':
      default:
        // Finding I given C0, i, n
        answer = cn - c0;
        qText = `Combien d'intérêts cumulés (I) un placement de ${formatCurrency(c0)} rapporte-t-il après ${n} ans à un taux composé de ${i}% ?`;
        explanation = `I = Cₙ - C₀ = ${cn.toFixed(2)} - ${c0} = ${answer.toFixed(2)}€`;
        break;
    }

    setQuestion({
      id: Math.random().toString(),
      text: qText,
      formula: '',
      params: { c0, n, i, activeCat },
      correctAnswer: Number(answer.toFixed(2)),
      explanation,
      unit
    });
    setUserAnswer('');
    setFeedback(null);
  }, [category]);

  useEffect(() => {
    generateNewQuestion();
  }, [generateNewQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || feedback) return;

    const numericAnswer = parseFloat(userAnswer.replace(',', '.'));
    const isCorrect = Math.abs(numericAnswer - question.correctAnswer) < 0.1; // More precise tolerance

    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback({ isCorrect: true, message: "Parfait ! Calcul exact." });
    } else {
      setFeedback({ isCorrect: false, message: `Pas tout à fait. La réponse attendue était ${question.correctAnswer}${question.unit}.` });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Category Selection */}
      <div className="bg-zinc-900 p-2 rounded-2xl border border-zinc-800 flex flex-wrap gap-1 shadow-xl">
        {[
          { id: 'all', label: 'Mélange' },
          { id: 'capital', label: 'Capital (C₀)' },
          { id: 'rate', label: 'Taux (i)' },
          { id: 'period', label: 'Durée (n)' },
          { id: 'interest', label: 'Intérêts (I)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id as QuizCategory)}
            className={`flex-1 min-w-[100px] px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
              category === cat.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 p-8 rounded-3xl shadow-2xl border border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="font-bold text-3xl text-white">Focus Training</h3>
            <p className="text-zinc-500 text-sm mt-1">Pratique ciblée sur les variables financières</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Score</span>
            <div className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-6 py-2 rounded-2xl font-black text-2xl">
              {score}
            </div>
          </div>
        </div>

        {question && (
          <div className="space-y-8">
            <div className="bg-zinc-950 p-8 rounded-2xl text-xl text-zinc-200 leading-relaxed border border-zinc-800 shadow-inner">
              {question.text}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                  <input 
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Votre résultat..."
                    className="w-full p-5 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-2xl font-bold text-white placeholder-zinc-700 font-mono transition-all"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 font-bold text-xl group-focus-within:text-blue-500 transition-colors">
                    {question.unit}
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={!!feedback || !userAnswer}
                  className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-900/30 hover:bg-blue-500 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all"
                >
                  VALIDER
                </button>
              </div>
            </form>

            {feedback && (
              <div className={`p-8 rounded-2xl animate-in zoom-in-95 duration-300 border ${feedback.isCorrect ? 'bg-emerald-900/20 text-emerald-300 border-emerald-500/30' : 'bg-red-900/20 text-red-300 border-red-500/30'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-2 rounded-lg ${feedback.isCorrect ? 'bg-emerald-500' : 'bg-red-500'} text-white shadow-lg`}>
                    {feedback.isCorrect ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                  </div>
                  <div>
                    <p className="font-black text-xl">{feedback.message}</p>
                    <p className="text-sm opacity-70 mt-1">Utilisez la calculatrice pour vérifier la logique inverse.</p>
                  </div>
                </div>
                
                <div className="bg-zinc-950 p-5 rounded-xl border border-white/5 font-mono text-sm mb-8">
                  <span className="text-zinc-500 mr-2 uppercase text-[10px] font-bold">Démonstration :</span> 
                  <span className="text-zinc-300">{question.explanation}</span>
                </div>
                
                <button 
                  onClick={generateNewQuestion}
                  className="w-full py-4 bg-white text-black rounded-xl font-black hover:bg-zinc-200 active:bg-zinc-300 transition-all uppercase tracking-widest shadow-xl"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 text-center">
        <p className="text-xs text-zinc-500 italic">
          Astuce : Pour la durée <span className="text-blue-400">n</span>, utilisez le bouton <span className="font-mono text-blue-400">log</span> ou <span className="font-mono text-blue-400">ln</span> de la calculatrice.
        </p>
      </div>
    </div>
  );
};

export default PracticeQuiz;
