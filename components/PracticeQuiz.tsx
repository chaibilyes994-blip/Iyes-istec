
import React, { useState, useCallback, useEffect } from 'react';
import { generateQuestion } from '../services/questionGenerator';
import { updateStats } from '../services/storage';
import { Question, CourseType } from '../types';

interface Props {
  course: CourseType;
}

const PracticeQuiz: React.FC<Props> = ({ course }) => {
  const [setup, setSetup] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(undefined);
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; showDetail: boolean } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const getNext = useCallback(() => {
    setQuestion(generateQuestion(course, selectedTheme));
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
  }, [course, selectedTheme]);

  useEffect(() => {
    if (!setup) {
      getNext();
    }
  }, [setup, getNext]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || feedback) return;

    const val = parseFloat(userAnswer.replace(',', '.').replace(/\s/g, ''));
    const isCorrect = Math.abs(val - (question.correctAnswer as number)) <= 0.01;
    
    setFeedback({ isCorrect, showDetail: false });
    updateStats(course, question.theme, isCorrect);
  };

  if (setup) {
    const themes = course === 'finance' 
      ? [
          { id: 'capitalization', label: 'Capitalisation', icon: '💰' },
          { id: 'equivalents', label: 'Taux Équivalents', icon: '⚖️' },
          { id: 'annuity', label: 'Annuités & Prêts', icon: '📉' }
        ]
      : [
          { id: 'margins', label: 'Marges & Marque', icon: '🏷️' },
          { id: 'profitability', label: 'Rentabilité (SR)', icon: '📈' },
          { id: 'pricing', label: 'Formation des Prix', icon: '💶' }
        ];

    return (
      <div className="max-w-4xl mx-auto py-12 space-y-12 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">Mode Pratique</h2>
          <p className="text-zinc-500 text-lg font-medium">Ciblez une notion ou entraînez-vous sur tout le module.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => { setSelectedTheme(undefined); setSetup(false); }}
            className={`p-8 rounded-[2rem] border-2 bg-zinc-900 border-zinc-800 hover:border-${course === 'finance' ? 'blue' : 'emerald'}-500 transition-all text-center group`}
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔥</div>
            <span className="font-black uppercase tracking-widest text-xs text-white">Tout le module</span>
          </button>
          
          {themes.map(t => (
            <button 
              key={t.id}
              onClick={() => { setSelectedTheme(t.id); setSetup(false); }}
              className={`p-8 rounded-[2rem] border-2 bg-zinc-900 border-zinc-800 hover:border-${course === 'finance' ? 'blue' : 'emerald'}-500 transition-all text-center group`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{t.icon}</div>
              <span className="font-black uppercase tracking-widest text-xs text-white">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <div className="bg-zinc-900 p-12 rounded-[3.5rem] border border-zinc-800 shadow-2xl relative">
        <div className="flex justify-between items-center mb-12">
           <button 
             onClick={() => setSetup(true)}
             className="text-zinc-600 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
           >
             ← Changer de thème
           </button>
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
            <p className="text-sm text-zinc-300">Valeur numérique brute. Unité : {question.unit}</p>
          </div>
        )}

        <div className="space-y-12">
          <div className="relative">
             <span className={`absolute -top-4 left-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg ${course === 'finance' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {question.theme}
             </span>
             <div className="bg-zinc-950 p-10 rounded-[2.5rem] text-3xl font-bold text-zinc-100 border border-zinc-800/50 leading-tight shadow-inner">
                {question.text}
             </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
            <div className="relative flex-1">
              <input 
                autoFocus
                type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                disabled={!!feedback}
                className={`w-full p-8 bg-zinc-950 border-2 ${course === 'finance' ? 'border-blue-900/50 focus:border-blue-500' : 'border-emerald-900/50 focus:border-emerald-500'} rounded-3xl focus:ring-4 outline-none font-black text-white text-4xl shadow-inner placeholder:text-zinc-900 transition-all disabled:opacity-50`}
                placeholder="0,00"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-700 font-black uppercase text-xl">{question.unit}</span>
            </div>
            {!feedback && (
              <button className={`px-16 py-8 rounded-3xl font-black text-xl uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${course === 'finance' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'}`}>Valider</button>
            )}
          </form>

          {feedback && (
            <div className={`p-10 rounded-[2.5rem] border-2 animate-in zoom-in-95 duration-300 ${feedback.isCorrect ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-red-950/20 border-red-500/50'}`}>
              <div className="flex items-center gap-6 mb-8">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-3xl ${feedback.isCorrect ? 'bg-emerald-500 text-emerald-950' : 'bg-red-500 text-red-950'}`}>
                  {feedback.isCorrect ? '✓' : '!'}
                </div>
                <h4 className={`font-black text-4xl uppercase tracking-tighter ${feedback.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {feedback.isCorrect ? "Parfait !" : "C'est une erreur"}
                </h4>
              </div>

              <div className="space-y-6">
                <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                   <span className="text-[10px] font-black text-zinc-600 uppercase mb-2 block">Réponse attendue :</span>
                   <span className="text-2xl font-black text-white">{question.correctAnswer} {question.unit}</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <span className="text-[10px] font-black text-zinc-500 uppercase mb-2 block">Méthode</span>
                    <p className="text-xs text-zinc-400 leading-relaxed">{question.method}</p>
                  </div>
                  <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <span className="text-[10px] font-black text-zinc-500 uppercase mb-2 block">Formule Clé</span>
                    <p className="text-sm font-mono text-blue-400">{question.courseReminder}</p>
                  </div>
                </div>

                {!feedback.isCorrect && question.trapWarning && (
                  <div className="p-4 bg-orange-900/10 border border-orange-500/20 rounded-xl">
                    <p className="text-xs text-orange-400 font-bold italic">⚠️ {question.trapWarning}</p>
                  </div>
                )}
                
                <button onClick={getNext} className="w-full py-6 bg-white text-black font-black text-xl rounded-2xl uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all shadow-2xl active:scale-[0.98] mt-4">Exercice Suivant →</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-center text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">Propulsé par le moteur de génération intelligent I.S.T.E.C.</p>
    </div>
  );
};

export default PracticeQuiz;
