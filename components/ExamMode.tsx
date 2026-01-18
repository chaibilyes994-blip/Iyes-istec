
import React, { useState, useEffect, useCallback } from 'react';
import { calculateCompoundInterest, calculateSimpleInterest, formatCurrency } from '../services/mathUtils';
import { Question } from '../types';

interface AttemptRecord {
  question: Question;
  userAnswer: string | number;
  isCorrect: boolean;
}

const ExamMode: React.FC = () => {
  const [status, setStatus] = useState<'setup' | 'active' | 'finished'>('setup');
  const [timeLimit, setTimeLimit] = useState(15); 
  const [timeLeft, setTimeLeft] = useState(0); 
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<AttemptRecord[]>([]);

  const generateQuestion = useCallback((): Question => {
    const isTheory = Math.random() > 0.5;
    
    if (isTheory) {
      const theoryPool = [
        { q: "Quelle est la formule des intérêts simples ?", a: "C0 * (1 + n*i)", opt: ["C0 * (1 + i)^n", "C0 * (1 + n*i)", "C0 / (1 + i)^n", "C0 * i * n / 360"] },
        { q: "En intérêts composés, l'équivalence des taux se base sur :", a: "(1+ia) = (1+im)^12", opt: ["ia = im * 12", "(1+ia) = (1+im)^12", "ia = im / 12", "ia = im^12"] },
        { q: "Que signifie 'Annuites Constantes' ?", a: "Le montant payé chaque période est identique", opt: ["Le capital remboursé est identique", "Le montant payé chaque période est identique", "Les intérêts sont identiques", "L'emprunt est gratuit"] },
        { q: "L'actualisation permet de trouver :", a: "La valeur d'aujourd'hui d'une somme future", opt: ["La valeur future d'un capital", "La valeur d'aujourd'hui d'une somme future", "Le taux d'intérêt", "La durée de placement"] },
        { q: "Dans 'a = I + M', que représente M ?", a: "L'amortissement du capital", opt: ["Le montant des intérêts", "La marge de la banque", "L'amortissement du capital", "La mensualité totale"] },
        { q: "La capitalisation composée implique que :", a: "Les intérêts produisent des intérêts", opt: ["Les intérêts sont payés au début", "Les intérêts produisent des intérêts", "Le taux est fixe", "Le capital diminue"] },
        { q: "Le coût total du crédit est égal à :", a: "Total annuités - Capital initial", opt: ["Total intérêts + Capital", "Total annuités - Capital initial", "Capital / n", "Capital * taux"] }
      ];
      const selected = theoryPool[Math.floor(Math.random() * theoryPool.length)];
      return {
        id: Math.random().toString(),
        text: selected.q,
        type: 'theory',
        options: [...selected.opt].sort(() => Math.random() - 0.5),
        correctAnswer: selected.a,
        explanation: "Référence : Partie 1 & 2 du cours.",
        formula: "",
        unit: "",
        params: {}
      };
    } else {
      const isSimple = Math.random() > 0.5;
      const c0 = Math.floor(Math.random() * 5000) + 1000;
      const n = Math.floor(Math.random() * 10) + 2;
      const i = Math.floor(Math.random() * 8) + 1;
      
      const cn = isSimple ? calculateSimpleInterest(c0, n, i) : calculateCompoundInterest(c0, n, i);
      
      return {
        id: Math.random().toString(),
        text: `Déterminez la valeur acquise (Cn) d'un capital de ${formatCurrency(c0)} placé à ${i}% (${isSimple ? 'simple' : 'composé'}) pendant ${n} ${isSimple ? 'mois' : 'ans'}.`,
        type: 'calculation',
        correctAnswer: Number(cn.toFixed(2)),
        explanation: `Calcul : ${c0} * (1 + ${i/100})${isSimple ? ` * ${n}` : `^${n}`}`,
        formula: isSimple ? "Cn = C0 * (1 + ni)" : "Cn = C0 * (1 + i)^n",
        unit: "€",
        params: {}
      };
    }
  }, []);

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
      const numAnswer = parseFloat(String(answer).replace(',', '.'));
      isCorrect = Math.abs(numAnswer - currentQuestion.correctAnswer) < 1.0; // Tolérance d'un euro
    }

    const record: AttemptRecord = {
      question: currentQuestion,
      userAnswer: answer,
      isCorrect
    };

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
      <div className="max-w-2xl mx-auto bg-zinc-900 p-12 rounded-[2.5rem] border border-zinc-800 shadow-2xl text-center">
        <h2 className="text-4xl font-black text-white mb-4">Prêt pour l'examen ?</h2>
        <p className="text-zinc-400 mb-10 leading-relaxed font-medium">
          Une série de questions infinies pour tester votre maîtrise de la finance.
          Réglez votre chrono et lancez-vous.
        </p>
        
        <div className="space-y-6 mb-12">
          <label className="block text-xs font-black text-zinc-600 uppercase tracking-[0.2em]">Choisir la durée</label>
          <div className="flex justify-center gap-6">
            {[10, 15, 20].map(m => (
              <button 
                key={m}
                onClick={() => setTimeLimit(m)}
                className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center transition-all border-2 ${timeLimit === m ? 'bg-blue-600 border-blue-400 text-white shadow-2xl shadow-blue-900/40 scale-110' : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:bg-zinc-700/50'}`}
              >
                <span className="text-3xl font-black">{m}</span>
                <span className="text-[10px] font-bold">MIN</span>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={startExam}
          className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl font-black text-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]"
        >
          LANCER LA SESSION
        </button>
      </div>
    );
  }

  if (status === 'finished') {
    const accuracy = history.length > 0 ? Math.round((score / history.length) * 100) : 0;
    return (
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-zinc-900 p-12 rounded-[2.5rem] border border-zinc-800 shadow-2xl text-center">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-xl">🏆</div>
          <h2 className="text-4xl font-black text-white mb-2">Résultats de l'examen</h2>
          <p className="text-zinc-500 mb-12 font-medium">Excellente session d'apprentissage ! Voici votre bilan.</p>
          
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800">
              <span className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Taux de réussite</span>
              <span className={`text-4xl font-black ${accuracy >= 70 ? 'text-emerald-400' : accuracy >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                {accuracy}%
              </span>
            </div>
            <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800">
              <span className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Score Final</span>
              <span className="text-4xl font-black text-blue-400">{score} <span className="text-lg text-zinc-600">pts</span></span>
            </div>
          </div>

          <button 
            onClick={() => setStatus('setup')}
            className="w-full py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-zinc-200 transition-all uppercase tracking-widest shadow-xl"
          >
            Nouvelle Tentative
          </button>
        </div>

        {/* REVIEW SECTION */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white px-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            Révision des erreurs
          </h3>
          <div className="space-y-4">
            {history.map((item, idx) => (
              <div key={idx} className={`bg-zinc-900 p-6 rounded-3xl border ${item.isCorrect ? 'border-emerald-500/20' : 'border-red-500/20'} overflow-hidden relative`}>
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Question {idx + 1}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.isCorrect ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {item.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-white font-bold mb-6">{item.question.text}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <span className="block text-[10px] font-bold text-zinc-600 uppercase mb-2">Votre réponse</span>
                    <span className={`font-mono font-bold ${item.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.userAnswer} {item.question.unit}
                    </span>
                  </div>
                  {!item.isCorrect && (
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                      <span className="block text-[10px] font-bold text-zinc-600 uppercase mb-2">Bonne réponse</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {item.question.correctAnswer} {item.question.unit}
                      </span>
                    </div>
                  )}
                </div>
                {item.question.explanation && !item.isCorrect && (
                  <div className="mt-4 p-4 bg-blue-600/5 rounded-2xl border border-blue-500/10 text-blue-300 text-xs italic">
                    <strong>Note :</strong> {item.question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-zinc-900 px-10 py-6 rounded-3xl border border-zinc-800 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${timeLeft < 60 ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></div>
          <span className={`font-mono text-3xl font-black ${timeLeft < 60 ? 'text-red-500' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="flex items-center gap-8">
           <div className="text-right">
             <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Score</span>
             <span className="text-2xl font-black text-blue-400">{score}</span>
           </div>
           <div className="h-10 w-[1px] bg-zinc-800"></div>
           <div className="text-right">
             <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Effectué</span>
             <span className="text-2xl font-black text-zinc-500">{history.length}</span>
           </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl relative min-h-[450px] flex flex-col justify-between">
        {currentQuestion && (
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <div className="inline-block px-4 py-1.5 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-black uppercase text-blue-500 tracking-widest">
                {currentQuestion.type === 'theory' ? 'Théorie' : 'Calcul Pratique'}
              </div>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Question {history.length + 1}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white leading-snug">
              {currentQuestion.text}
            </h3>

            {currentQuestion.type === 'theory' ? (
              <div className="grid gap-4">
                {currentQuestion.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="w-full text-left p-6 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-blue-500 hover:bg-zinc-800/50 transition-all text-zinc-400 font-bold hover:text-blue-400 active:scale-[0.98] shadow-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input 
                    autoFocus
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnswer(userAnswer)}
                    placeholder="Résultat..."
                    className="w-full p-6 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-3xl font-black text-white font-mono transition-all"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-zinc-700 text-2xl">€</span>
                </div>
                <button 
                  onClick={() => handleAnswer(userAnswer)}
                  className="px-10 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/30"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-12 pt-8 border-t border-zinc-800/50 flex items-center justify-center gap-3 text-zinc-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-[10px] font-black uppercase tracking-widest">Utilisez la calculatrice latérale pour vos calculs</p>
        </div>
      </div>
    </div>
  );
};

export default ExamMode;
