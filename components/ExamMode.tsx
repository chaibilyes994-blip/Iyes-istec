
import React, { useState, useEffect, useCallback } from 'react';
import { calculateCompoundInterest, formatCurrency } from '../services/mathUtils';
import { calculateTauxMarge, calculateCA, calculateCoeffMult } from '../services/managementUtils';
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

  const generateQuestion = useCallback((): Question => {
    const dice = Math.random();
    
    if (course === 'finance') {
      if (dice > 0.5) {
        // Theory Finance
        const pool = [
          { q: "Quelle est la formule des intérêts simples ?", a: "C0 * (1 + n*i)", opt: ["C0 * (1 + i)^n", "C0 * (1 + n*i)", "C0 / (1 + i)^n", "C0 * i"] },
          { q: "En intérêts composés, l'équivalence des taux se base sur :", a: "(1+ia) = (1+im)^12", opt: ["ia = im * 12", "(1+ia) = (1+im)^12", "ia = im / 12", "ia = im^12"] }
        ];
        const sel = pool[Math.floor(Math.random() * pool.length)];
        return { id: Math.random().toString(), text: sel.q, type: 'theory', options: sel.opt.sort(() => Math.random() - 0.5), correctAnswer: sel.a, explanation: "", formula: "", unit: "", params: {} };
      } else {
        // Calculation Finance
        const c0 = 2000; const n = 5; const i = 4;
        const cn = calculateCompoundInterest(c0, n, i);
        return { id: Math.random().toString(), text: `Valeur acquise de 2000€ à 4% composé sur 5 ans ?`, type: 'calculation', correctAnswer: Number(cn.toFixed(2)), explanation: "Cₙ = C₀(1+i)ⁿ", unit: "€", formula: "", params: {} };
      }
    } else {
      // Management Questions
      if (dice > 0.5) {
        // Theory Management
        const pool = [
          { q: "Que représente le coût de revient ?", a: "Ce que l'article coûte réellement à l'entreprise", opt: ["Le prix affiché en rayon", "Ce que l'article coûte réellement à l'entreprise", "La marge bénéficiaire", "Le montant de la TVA"] },
          { q: "Le taux de marge est rapporté au :", a: "Coût d'achat HT", opt: ["Prix de vente TTC", "Prix de vente HT", "Coût d'achat HT", "Montant des taxes"] }
        ];
        const sel = pool[Math.floor(Math.random() * pool.length)];
        return { id: Math.random().toString(), text: sel.q, type: 'theory', options: sel.opt.sort(() => Math.random() - 0.5), correctAnswer: sel.a, explanation: "", formula: "", unit: "", params: {} };
      } else {
        // Calculation Management
        return { id: Math.random().toString(), text: "Un produit est acheté 100€ HT et revendu 120€ HT. Quel est le taux de marge ?", type: 'calculation', correctAnswer: 20, explanation: "((120-100)/100)*100 = 20%", unit: "%", formula: "", params: {} };
      }
    }
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
      const val = parseFloat(String(answer).replace(',', '.'));
      isCorrect = Math.abs(val - currentQuestion.correctAnswer) < 1.0;
    }
    const record: AttemptRecord = { question: currentQuestion, userAnswer: answer, isCorrect };
    setHistory(prev => [...prev, record]);
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
      <div className="max-w-2xl mx-auto bg-zinc-900 p-12 rounded-[2.5rem] border border-zinc-800 text-center shadow-2xl">
        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">EXAMEN <span className={course === 'finance' ? 'text-blue-500' : 'text-emerald-500'}>{course}</span></h2>
        <p className="text-zinc-500 mb-12">Réglez votre chrono et lancez la session d'évaluation infinie.</p>
        <div className="flex justify-center gap-6 mb-12">
          {[10, 15, 20].map(m => (
            <button key={m} onClick={() => setTimeLimit(m)} className={`w-20 h-20 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${timeLimit === m ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-zinc-800 text-zinc-600'}`}>
              <span className="text-2xl font-black">{m}</span><span className="text-[10px] font-bold">MIN</span>
            </button>
          ))}
        </div>
        <button onClick={startExam} className={`w-full py-6 rounded-3xl font-black text-xl text-white shadow-xl ${course === 'finance' ? 'bg-blue-600 shadow-blue-900/20' : 'bg-emerald-600 shadow-emerald-900/20'}`}>LANCER L'ÉPREUVE</button>
      </div>
    );
  }

  if (status === 'finished') {
    return (
      <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-700 pb-20">
        <div className="bg-zinc-900 p-12 rounded-[2.5rem] border border-zinc-800 shadow-2xl text-center">
          <h2 className="text-4xl font-black text-white mb-4">Bilan de l'examen</h2>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800">
              <span className="block text-[10px] font-black text-zinc-600 uppercase mb-2">Réussite</span>
              <span className="text-4xl font-black text-emerald-400">{history.length > 0 ? Math.round((score/history.length)*100) : 0}%</span>
            </div>
            <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800">
              <span className="block text-[10px] font-black text-zinc-600 uppercase mb-2">Points</span>
              <span className="text-4xl font-black text-blue-400">{score} / {history.length}</span>
            </div>
          </div>
          <button onClick={() => setStatus('setup')} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest">Recommencer</button>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-black text-white px-2">Révision détaillée</h3>
          {history.map((h, i) => (
            <div key={i} className={`p-6 rounded-3xl border ${h.isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
              <p className="text-white font-bold mb-4">{h.question.text}</p>
              <div className="flex gap-4 text-sm font-mono">
                <span className={h.isCorrect ? 'text-emerald-500' : 'text-red-500'}>Réponse : {h.userAnswer}</span>
                {!h.isCorrect && <span className="text-emerald-500">Correct : {h.question.correctAnswer}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-zinc-900 px-8 py-5 rounded-3xl border border-zinc-800">
        <span className="font-mono text-3xl font-black text-white">{formatTime(timeLeft)}</span>
        <div className="text-right"><span className="block text-[10px] font-black text-zinc-600">SCORE</span><span className="text-2xl font-black text-blue-500">{score}</span></div>
      </div>
      <div className="bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl min-h-[400px] flex flex-col justify-between">
        {currentQuestion && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white leading-snug">{currentQuestion.text}</h3>
            {currentQuestion.type === 'theory' ? (
              <div className="grid gap-3">
                {currentQuestion.options?.map((o, i) => (
                  <button key={i} onClick={() => handleAnswer(o)} className="w-full text-left p-5 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-blue-500 transition-all font-bold text-zinc-400 hover:text-white">{o}</button>
                ))}
              </div>
            ) : (
              <div className="flex gap-4">
                <input autoFocus type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAnswer(userAnswer)} className="flex-1 p-5 bg-zinc-950 border border-zinc-800 rounded-2xl text-2xl font-bold text-white" />
                <button onClick={() => handleAnswer(userAnswer)} className={`px-10 rounded-2xl font-black text-white ${course === 'finance' ? 'bg-blue-600' : 'bg-emerald-600'}`}>SUIVANT</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamMode;
