
import React, { useState, useEffect, useCallback } from 'react';
import { calculateCompoundInterest, calculateSimpleInterest, formatCurrency } from '../services/mathUtils';
import { Question } from '../types';

const ExamMode: React.FC = () => {
  const [status, setStatus] = useState<'setup' | 'active' | 'finished'>('setup');
  const [timeLimit, setTimeLimit] = useState(15); // minutes
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateQuestion = useCallback((): Question => {
    const isTheory = Math.random() > 0.6;
    
    if (isTheory) {
      const theoryPool = [
        { q: "Quelle est la formule des intérêts simples ?", a: "C0 * (1 + n*i)", opt: ["C0 * (1 + i)^n", "C0 * (1 + n*i)", "C0 / (1 + i)^n", "C0 * i * n / 360"] },
        { q: "En intérêts composés, l'équivalence des taux se base sur :", a: "(1+ia) = (1+im)^12", opt: ["ia = im * 12", "(1+ia) = (1+im)^12", "ia = im / 12", "ia = im^12"] },
        { q: "Que signifie 'Annuites Constantes' ?", a: "Le montant payé chaque période est identique", opt: ["Le capital remboursé est identique", "Le montant payé chaque période est identique", "Les intérêts sont identiques", "L'emprunt est gratuit"] },
        { q: "La capitalisation transforme :", a: "Le temps en valeur monétaire", opt: ["Les euros en dollars", "Le temps en valeur monétaire", "Le risque en certitude", "Le capital en dette"] },
        { q: "Dans 'a = I + M', que représente M ?", a: "L'amortissement du capital", opt: ["Le montant des intérêts", "La marge de la banque", "L'amortissement du capital", "La mensualité totale"] }
      ];
      const selected = theoryPool[Math.floor(Math.random() * theoryPool.length)];
      return {
        id: Math.random().toString(),
        text: selected.q,
        type: 'theory',
        options: [...selected.opt].sort(() => Math.random() - 0.5),
        correctAnswer: selected.a,
        explanation: "",
        formula: "",
        unit: "",
        params: {}
      };
    } else {
      // Calculation logic
      const isSimple = Math.random() > 0.5;
      const c0 = Math.floor(Math.random() * 5000) + 1000;
      const n = Math.floor(Math.random() * 10) + 2;
      const i = Math.floor(Math.random() * 8) + 1;
      
      const cn = isSimple ? calculateSimpleInterest(c0, n, i) : calculateCompoundInterest(c0, n, i);
      
      return {
        id: Math.random().toString(),
        text: `Calculez la valeur acquise (Cn) d'un capital de ${formatCurrency(c0)} placé à ${i}% (${isSimple ? 'simple' : 'composé'}) pendant ${n} ${isSimple ? 'mois' : 'ans'}.`,
        type: 'calculation',
        correctAnswer: Number(cn.toFixed(2)),
        explanation: "",
        formula: "",
        unit: "€",
        params: {}
      };
    }
  }, []);

  const startExam = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setTimeLeft(timeLimit * 60);
    setStatus('active');
    setCurrentQuestion(generateQuestion());
  };

  useEffect(() => {
    let timer: any;
    if (status === 'active' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
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
      const numAnswer = parseFloat(String(answer).replace(',', '.'));
      isCorrect = Math.abs(numAnswer - currentQuestion.correctAnswer) < 0.5;
    }

    if (isCorrect) setScore(s => s + 1);
    setQuestionsAnswered(q => q + 1);
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
      <div className="max-w-2xl mx-auto bg-zinc-900 p-10 rounded-3xl border border-zinc-800 shadow-2xl text-center">
        <h2 className="text-4xl font-black text-white mb-4">Mode Examen</h2>
        <p className="text-zinc-400 mb-10 leading-relaxed">
          Testez vos connaissances sous pression. Répondez au maximum de questions avant la fin du chronomètre.
        </p>
        
        <div className="space-y-6 mb-10">
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Durée de l'examen</label>
          <div className="flex justify-center gap-4">
            {[10, 15, 20].map(m => (
              <button 
                key={m}
                onClick={() => setTimeLimit(m)}
                className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${timeLimit === m ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40 scale-110' : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-500'}`}
              >
                <span className="text-2xl font-black">{m}</span>
                <span className="text-[10px] font-bold">MIN</span>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={startExam}
          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]"
        >
          COMMENCER L'EXAMEN
        </button>
      </div>
    );
  }

  if (status === 'finished') {
    return (
      <div className="max-w-2xl mx-auto bg-zinc-900 p-10 rounded-3xl border border-zinc-800 shadow-2xl text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl shadow-xl shadow-blue-900/40">
          🏁
        </div>
        <h2 className="text-4xl font-black text-white mb-2">Examen Terminé</h2>
        <p className="text-zinc-500 mb-8 uppercase tracking-widest text-xs font-bold">Vos statistiques de session</p>
        
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
            <span className="block text-zinc-500 text-[10px] font-bold uppercase mb-1">Précision</span>
            <span className="text-3xl font-black text-emerald-400">
              {questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0}%
            </span>
          </div>
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
            <span className="block text-zinc-500 text-[10px] font-bold uppercase mb-1">Score Final</span>
            <span className="text-3xl font-black text-blue-400">{score}</span>
          </div>
        </div>

        <button 
          onClick={() => setStatus('setup')}
          className="w-full py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-zinc-200 transition-all uppercase tracking-widest"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-zinc-900 px-8 py-4 rounded-2xl border border-zinc-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="font-mono text-2xl font-black text-white">{formatTime(timeLeft)}</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
             <span className="block text-[10px] text-zinc-500 font-bold uppercase">Question</span>
             <span className="text-xl font-black text-zinc-200">{questionsAnswered + 1}</span>
           </div>
           <div className="h-8 w-[1px] bg-zinc-800"></div>
           <div className="text-right">
             <span className="block text-[10px] text-zinc-500 font-bold uppercase">Points</span>
             <span className="text-xl font-black text-blue-400">{score}</span>
           </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl relative min-h-[400px] flex flex-col justify-between">
        {currentQuestion && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white leading-tight">
              {currentQuestion.text}
            </h3>

            {currentQuestion.type === 'theory' ? (
              <div className="grid gap-3">
                {currentQuestion.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="w-full text-left p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-blue-500 hover:bg-zinc-900 transition-all text-zinc-300 font-medium active:scale-[0.99]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-4">
                <input 
                  autoFocus
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnswer(userAnswer)}
                  placeholder="Votre réponse..."
                  className="flex-1 p-5 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-2xl font-bold text-white font-mono"
                />
                <button 
                  onClick={() => handleAnswer(userAnswer)}
                  className="px-8 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm hover:bg-blue-500 transition-all"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Utilisez la barre latérale pour vos brouillons</p>
        </div>
      </div>
    </div>
  );
};

export default ExamMode;
