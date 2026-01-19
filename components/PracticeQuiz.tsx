
import React, { useState, useCallback, useEffect } from 'react';
import { generateQuestion } from '../services/questionGenerator';
import { updateStats } from '../services/storage';
import { Question, CourseType } from '../types';

interface Props {
  course: CourseType;
}

const PracticeQuiz: React.FC<Props> = ({ course }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; showDetail: boolean } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const getNext = useCallback(() => {
    setQuestion(generateQuestion(course));
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
  }, [course]);

  useEffect(() => {
    getNext();
  }, [getNext]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || feedback) return;

    const val = parseFloat(userAnswer.replace(',', '.').replace(/\s/g, ''));
    const isCorrect = Math.abs(val - (question.correctAnswer as number)) <= 0.01;
    
    setFeedback({ isCorrect, showDetail: false });
    updateStats(course, question.theme, isCorrect);
  };

  if (!question) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <div className="bg-zinc-900 p-12 rounded-[3.5rem] border border-zinc-800 shadow-2xl relative">
        <div className="flex justify-between items-center mb-12">
           <div className="px-4 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-black text-blue-500 uppercase tracking-widest">
             Thème : {question.theme}
           </div>
           <button 
             onClick={() => setShowHint(!showHint)}
             className="text-zinc-600 hover:text-white transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2"
           >
             <span className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center">?</span>
             Aide
           </button>
        </div>

        {showHint && (
          <div className="mb-8 p-6 bg-blue-600/10 border border-blue-500/30 rounded-2xl animate-in fade-in zoom-in-95">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Format attendu :</span>
            <p className="text-sm text-zinc-300">Arrondi à 2 décimales. Unité : {question.unit}</p>
          </div>
        )}

        <div className="space-y-12">
          <div className="bg-zinc-950 p-10 rounded-[2.5rem] text-3xl font-bold text-zinc-100 border border-zinc-800/50 leading-tight shadow-inner">
             {question.text}
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
            <div className="relative flex-1">
              <input 
                autoFocus
                type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                disabled={!!feedback}
                className="w-full p-8 bg-zinc-950 border-2 border-zinc-800 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none font-black text-white text-4xl shadow-inner placeholder:text-zinc-900 transition-all disabled:opacity-50"
                placeholder="0,00"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-700 font-black uppercase text-xl">{question.unit}</span>
            </div>
            {!feedback && (
              <button className={`px-16 py-8 rounded-3xl font-black text-xl uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${course === 'finance' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>Valider</button>
            )}
          </form>

          {feedback && (
            <div className={`p-10 rounded-[2.5rem] border-2 animate-in zoom-in-95 duration-300 ${feedback.isCorrect ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-red-950/20 border-red-500/50'}`}>
              <div className="flex items-center gap-6 mb-8">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-3xl ${feedback.isCorrect ? 'bg-emerald-500 text-emerald-950' : 'bg-red-500 text-red-950'}`}>
                  {feedback.isCorrect ? '✓' : '!'}
                </div>
                <h4 className={`font-black text-4xl uppercase tracking-tighter ${feedback.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {feedback.isCorrect ? "Excellent !" : "Erreur Détectée"}
                </h4>
              </div>

              <div className="space-y-6">
                <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                   <span className="text-[10px] font-black text-zinc-600 uppercase mb-2 block">La bonne réponse :</span>
                   <span className="text-2xl font-black text-white">{question.correctAnswer} {question.unit}</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <span className="text-[10px] font-black text-zinc-500 uppercase mb-2 block">Méthode</span>
                    <p className="text-xs text-zinc-400 leading-relaxed">{question.method}</p>
                  </div>
                  <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <span className="text-[10px] font-black text-zinc-500 uppercase mb-2 block">Rappel Cours</span>
                    <p className="text-sm font-mono text-blue-400">{question.courseReminder}</p>
                  </div>
                </div>

                {!feedback.isCorrect && question.trapWarning && (
                  <div className="p-4 bg-orange-900/10 border border-orange-500/20 rounded-xl">
                    <p className="text-xs text-orange-400 font-bold italic">⚠️ {question.trapWarning}</p>
                  </div>
                )}
                
                <button onClick={getNext} className="w-full py-6 bg-white text-black font-black text-xl rounded-2xl uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all shadow-2xl active:scale-[0.98] mt-4">Suivant →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeQuiz;
