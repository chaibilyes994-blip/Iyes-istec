
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { calculateCompoundInterest, formatCurrency, calculateSimpleInterest, calculateConstantAnnuity } from '../services/mathUtils';
import { 
  calculateTauxMarge, calculateTauxMarque, 
  calculateDelaiStock, calculateSR, calculateCoutRevient,
  calculateCA, getHTfromTTC, getTTCfromHT, calculateMarge, calculateCoeffMult, calculatePointMort
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
  
  const lastQuestionsHistory = useRef<string[]>([]);

  const generateFinanceQuestion = useCallback((targetMode: string): Question => {
    const generators: (() => Question)[] = [];

    // --- PARTIE 1 : FLUX & CAPITALISATION ---
    if (targetMode === 'part1' || targetMode === 'all') {
      generators.push(() => {
        const c0 = Math.floor(Math.random() * 4000) + 1000;
        const i = (Math.floor(Math.random() * 8) + 2) / 100;
        const n = Math.floor(Math.random() * 10) + 2;
        const res = c0 * Math.pow(1 + i, n);
        return { id: 'f1_cn', text: `Valeur acquise (Cₙ) d'un capital de ${formatCurrency(c0)} placé à ${i*100}% composé pendant ${n} ans ?`, correctAnswer: Number(res.toFixed(2)), explanation: `Formule : Cₙ = C₀(1+i)ⁿ`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const ia = (Math.floor(Math.random() * 6) + 3);
        const im = Math.pow(1 + ia/100, 1/12) - 1;
        return { id: 'f1_equiv_mensuel', text: `Calculer le taux MENSUEL équivalent à un taux annuel de ${ia}%. (Saisir en %, ex: 0.4868)`, correctAnswer: Number((im * 100).toFixed(4)), explanation: `iₘ = (1+iₐ)^(1/12) - 1. Utilisez la touche y^(1/x) !`, unit: '%', formula: '', params: {} };
      });
      generators.push(() => {
        const ia = (Math.floor(Math.random() * 5) + 2);
        const it = Math.pow(1 + ia/100, 1/4) - 1;
        return { id: 'f1_equiv_trimestriel', text: `Calculer le taux TRIMESTRIEL équivalent à un taux annuel de ${ia}%. (Saisir en %, ex: 1.25)`, correctAnswer: Number((it * 100).toFixed(4)), explanation: `iₜ = (1+iₐ)^(1/4) - 1`, unit: '%', formula: '', params: {} };
      });
      generators.push(() => {
        const c0 = 3500; const i = 0.045; const days = [45, 75, 105][Math.floor(Math.random() * 3)];
        const interest = c0 * i * (days / 360);
        return { id: 'f1_int_simple', text: `Quel est le montant des intérêts SIMPLES pour un capital de ${formatCurrency(c0)} à 4,5% pendant ${days} jours ?`, correctAnswer: Number(interest.toFixed(2)), explanation: `I = C₀ × i × (n/360)`, unit: '€', formula: '', params: {} };
      });
    }

    // --- PARTIE 2 : EMPRUNTS ---
    if (targetMode === 'part2' || targetMode === 'all') {
      generators.push(() => {
        const k0 = Math.floor(Math.random() * 30000) + 20000;
        const i = 0.025; const n = 10;
        const a = k0 * (i / (1 - Math.pow(1 + i, -n)));
        return { id: 'f2_annuity_calc', text: `Calculer l'annuité constante d'un prêt de ${formatCurrency(k0)} sur 10 ans au taux annuel de 2,5%.`, correctAnswer: Number(a.toFixed(2)), explanation: `a = K₀ × [i / (1-(1+i)⁻ⁿ)]`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const k0 = 15000; const rate = 5; const n = 5;
        const a = calculateConstantAnnuity(k0, n, rate);
        const i1 = k0 * (rate/100);
        return { id: 'f2_i1', text: `Pour un emprunt de ${formatCurrency(k0)} à ${rate}% remboursé par annuités constantes de ${formatCurrency(a)}, quel est le montant des intérêts de la 1ère période ?`, correctAnswer: Number(i1.toFixed(2)), explanation: `I₁ = K₀ × i`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const m1 = 2000; const rate = 3;
        const m2 = m1 * (1.03);
        return { id: 'f2_m2_direct', text: `Si le premier amortissement M₁ d'un prêt à annuités constantes est de ${formatCurrency(m1)} avec un taux de 3%, quel est le montant de M₂ ?`, correctAnswer: Number(m2.toFixed(2)), explanation: `M₂ = M₁ × (1+i)`, unit: '€', formula: '', params: {} };
      });
    }

    let selectedIdx: number;
    let attempts = 0;
    do {
      selectedIdx = Math.floor(Math.random() * generators.length);
      attempts++;
    } while (lastQuestionsHistory.current.includes(generators[selectedIdx]().id) && attempts < 15);

    const finalQ = generators[selectedIdx]();
    lastQuestionsHistory.current = [finalQ.id, ...lastQuestionsHistory.current].slice(0, 8);
    return finalQ;
  }, []);

  const generateManagementQuestion = useCallback((targetMode: string): Question => {
    const generators: (() => Question)[] = [];

    // --- PARTIE 1 : PRIX & MARGES ---
    if (targetMode === 'part1' || targetMode === 'all') {
      generators.push(() => {
        const pa_brut = 120; const remise = 10;
        return { id: 'm1_pa_net', text: `Un article coûte ${pa_brut}€ HT. On obtient une remise de ${remise}%. Quel est le prix d'achat net HT ?`, correctAnswer: Number((pa_brut * (1 - remise/100)).toFixed(2)), explanation: `PA Net = PA Brut × (1 - Remise)`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const pa = 80; const pv = 130;
        return { id: 'm1_taux_marge_2', text: `Calculer le taux de MARGE (en %) pour un achat à ${pa}€ HT et une vente à ${pv}€ HT.`, correctAnswer: Number((((pv-pa)/pa)*100).toFixed(2)), explanation: `((PV-PA)/PA)×100`, unit: '%', formula: '', params: {} };
      });
      generators.push(() => {
        const pa = 90; const pv = 140;
        return { id: 'm1_taux_marque_2', text: `Calculer le taux de MARQUE (en %) pour un achat à ${pa}€ HT et une vente à ${pv}€ HT.`, correctAnswer: Number((((pv-pa)/pv)*100).toFixed(2)), explanation: `((PV-PA)/PV)×100`, unit: '%', formula: '', params: {} };
      });
      generators.push(() => {
        const ht = 200; const tva = 20;
        return { id: 'm1_ttc_calc', text: `Un article coûte ${ht}€ HT. Quel est son prix TTC avec une TVA à ${tva}% ?`, correctAnswer: Number((ht * (1 + tva/100)).toFixed(2)), explanation: `TTC = HT × (1 + TVA)`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const ttc = 180; const tva = 20;
        return { id: 'm1_ht_from_ttc_2', text: `Un article est affiché à ${ttc}€ TTC. Quel est son prix HT (TVA 20%) ?`, correctAnswer: Number((ttc / 1.2).toFixed(2)), explanation: `HT = TTC / 1.20`, unit: '€', formula: '', params: {} };
      });
    }

    // --- PARTIE 2 : PERFORMANCE & STOCKS ---
    if (targetMode === 'part2' || targetMode === 'all') {
      generators.push(() => {
        const cf = 24000; const tmcv = 25;
        const sr = cf / (tmcv/100);
        return { id: 'm2_sr_calc', text: `Charges Fixes = ${formatCurrency(cf)}, Taux de MCV = ${tmcv}%. Calculer le Seuil de Rentabilité (SR).`, correctAnswer: Number(sr.toFixed(2)), explanation: `SR = CF / Taux MCV`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const sr = 100000; const ca = 400000;
        return { id: 'm2_pm_calc', text: `Si le SR est de ${formatCurrency(sr)} et le CA annuel de ${formatCurrency(ca)}, quel est le Point Mort (en jours) ?`, correctAnswer: Math.round((sr/ca)*360), explanation: `(SR / CA) × 360`, unit: ' jours', formula: '', params: {} };
      });
      generators.push(() => {
        const sm = 12000; const cmv = 60000;
        return { id: 'm2_rot_calc', text: `Stock Moyen = ${formatCurrency(sm)}, CMV = ${formatCurrency(cmv)}. Calculer le délai moyen de stockage (jours).`, correctAnswer: Math.round((sm/cmv)*360), explanation: `(Stock / CMV) × 360`, unit: ' jours', formula: '', params: {} };
      });
    }

    let selectedIdx: number;
    let attempts = 0;
    do {
      selectedIdx = Math.floor(Math.random() * generators.length);
      attempts++;
    } while (lastQuestionsHistory.current.includes(generators[selectedIdx]().id) && attempts < 15);

    const finalQ = generators[selectedIdx]();
    lastQuestionsHistory.current = [finalQ.id, ...lastQuestionsHistory.current].slice(0, 8);
    return finalQ;
  }, []);

  const nextQuestion = useCallback(() => {
    const q = course === 'finance' ? generateFinanceQuestion(mode) : generateManagementQuestion(mode);
    setQuestion(q);
    setUserAnswer('');
    setFeedback(null);
  }, [course, mode, generateFinanceQuestion, generateManagementQuestion]);

  useEffect(() => {
    if (!setup) nextQuestion();
  }, [setup, nextQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || feedback) return;
    
    const cleanInput = userAnswer.replace(/,/g, '.').replace(/\s/g, '');
    const val = parseFloat(cleanInput);
    if (isNaN(val)) return;

    // Seuil de tolérance dynamique selon la taille de la réponse attendue
    const threshold = Math.max(0.005, Math.abs(question.correctAnswer * 0.001));
    const isCorrect = Math.abs(val - question.correctAnswer) <= threshold;
    
    if (isCorrect) setScore(s => s + 1);
    setFeedback({ 
      isCorrect, 
      message: isCorrect ? "Excellent !" : "Erreur de calcul.",
      expected: `${question.correctAnswer}${question.unit}`
    });
  };

  if (setup) {
    const options = course === 'finance' ? [
      { id: 'part1', title: 'Flux & Cap.', desc: 'Focus sur les intérêts, valeurs acquises et taux équivalents.', color: 'blue' },
      { id: 'part2', title: 'Emprunts', desc: 'Focus sur les annuités, amortissements et crédits.', color: 'emerald' },
      { id: 'all', title: 'Mode Mixte', desc: 'Toute la palette technique de la finance.', color: 'zinc' }
    ] : [
      { id: 'part1', title: 'Prix & Marges', desc: 'Formation des prix, remises et TVA.', color: 'amber' },
      { id: 'part2', title: 'Analyse Expl.', desc: 'Seuil de rentabilité, point mort et gestion de stock.', color: 'rose' },
      { id: 'all', title: 'Mode Mixte', desc: 'Toute la palette technique de la gestion.', color: 'zinc' }
    ];

    return (
      <div className="max-w-4xl mx-auto py-12 space-y-12 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Laboratoire de Pratique</h2>
          <p className="text-zinc-500 text-lg font-medium italic">"C'est en forgeant que l'on devient forgeron." — Palette technique étendue.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { setMode(opt.id); setSetup(false); }}
              className={`p-10 rounded-[3rem] border border-zinc-800 bg-zinc-900/50 text-left transition-all hover:border-${opt.color}-500/50 hover:bg-zinc-800/80 group flex flex-col justify-between h-full shadow-2xl relative overflow-hidden`}
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl mb-8 flex items-center justify-center bg-zinc-950 text-${opt.color}-500 group-hover:bg-${opt.color}-600 group-hover:text-white transition-all`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{opt.title}</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed">{opt.desc}</p>
              </div>
              <div className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-white transition-colors">Démarrer →</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <div className="bg-zinc-900 p-12 rounded-[3.5rem] border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-12">
          <button onClick={() => { setSetup(true); setQuestion(null); }} className="text-zinc-600 hover:text-white transition-colors font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg> Retour
          </button>
          <div className="bg-zinc-950 px-6 py-3 rounded-2xl border border-zinc-800 font-black text-blue-500 shadow-inner">
             SCORE: {score}
          </div>
        </div>

        {question && (
          <div className="space-y-12">
            <div className="bg-zinc-950 p-10 rounded-[2.5rem] text-3xl font-bold text-zinc-100 border border-zinc-800/50 leading-tight shadow-inner relative">
               <div className={`absolute top-0 left-0 w-2 h-full ${course === 'finance' ? 'bg-blue-600' : 'bg-emerald-600'}`}></div>
               {question.text}
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
              <div className="relative flex-1 group">
                <input 
                  autoFocus
                  type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                  className="w-full p-8 bg-zinc-950 border-2 border-zinc-800 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none font-black text-white text-4xl shadow-inner placeholder:text-zinc-900"
                  placeholder="0,00"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-700 font-black uppercase text-xl tracking-widest pointer-events-none group-focus-within:text-blue-500 transition-colors">
                  {question.unit}
                </span>
              </div>
              <button className={`px-16 py-8 rounded-3xl font-black text-xl uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${course === 'finance' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'}`}>Valider</button>
            </form>

            {feedback && (
              <div className={`p-10 rounded-[2.5rem] border-2 animate-in zoom-in-95 duration-300 ${feedback.isCorrect ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-400 shadow-emerald-900/20 shadow-2xl' : 'bg-red-950/20 border-red-500/50 text-red-400 shadow-red-900/20 shadow-2xl'}`}>
                <div className="flex items-center gap-6 mb-6">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-3xl ${feedback.isCorrect ? 'bg-emerald-500 text-emerald-950' : 'bg-red-500 text-red-950'}`}>
                    {feedback.isCorrect ? '✓' : '!'}
                  </div>
                  <h4 className="font-black text-4xl uppercase tracking-tighter">{feedback.message}</h4>
                </div>
                {!feedback.isCorrect && (
                  <div className="space-y-4 pl-20">
                    <p className="text-2xl font-bold">Valeur attendue : <span className="bg-white/10 px-6 py-2 rounded-2xl text-white font-mono">{feedback.expected}</span></p>
                    <p className="text-sm opacity-80 font-medium italic border-l-4 border-red-500/30 pl-6 py-1 leading-relaxed">{question.explanation}</p>
                  </div>
                )}
                <button onClick={nextQuestion} className="mt-12 w-full py-7 bg-white text-black font-black text-xl rounded-2xl uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all shadow-2xl active:scale-[0.98]">Question Suivante <span className="ml-2">→</span></button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-center text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em] animate-pulse">Calculatrice scientifique à disposition pour les exposants fractionnaires</p>
    </div>
  );
};

export default PracticeQuiz;
