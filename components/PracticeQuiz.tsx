
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
  
  // Suivi étendu pour éviter les répétitions (mémorise les 8 dernières questions)
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
        return { id: 'f1_cn', text: `Valeur acquise (Cₙ) d'un capital de ${formatCurrency(c0)} placé à ${i*100}% composé pendant ${n} ans ?`, correctAnswer: Number(res.toFixed(2)), explanation: `Cₙ = C₀(1+i)ⁿ`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const cn = Math.floor(Math.random() * 10000) + 5000;
        const i = 0.04; const n = 6;
        const res = cn / Math.pow(1.04, 6);
        return { id: 'f1_c0', text: `Actualisation : Quel capital C₀ faut-il placer à 4% composé pour disposer de ${formatCurrency(cn)} dans 6 ans ?`, correctAnswer: Number(res.toFixed(2)), explanation: `C₀ = Cₙ(1+i)⁻ⁿ`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const c0 = 2500; const i = 0.05; const days = [30, 45, 60, 90][Math.floor(Math.random() * 4)];
        const interest = c0 * i * (days / 360);
        return { id: 'f1_simple_int', text: `Calculer les intérêts SIMPLES produits par ${formatCurrency(c0)} à 5% pendant ${days} jours.`, correctAnswer: Number(interest.toFixed(2)), explanation: `I = C₀ × i × (n/360)`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const c0 = 4000; const i = 0.035; const n = 5;
        const cn = c0 * Math.pow(1 + i, n);
        return { id: 'f1_int_comp', text: `Quel est le montant total des intérêts COMPOSÉS pour un placement de ${formatCurrency(c0)} à 3,5% sur 5 ans ?`, correctAnswer: Number((cn - c0).toFixed(2)), explanation: `Intérêts = Cₙ - C₀`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const ia = 0.06;
        const im = Math.pow(1 + ia, 1/12) - 1;
        return { id: 'f1_equiv', text: `Calculer le taux mensuel équivalent à un taux annuel de 6%. (Arrondir à 4 décimales en %, ex: 0,4868)`, correctAnswer: Number((im * 100).toFixed(4)), explanation: `iₘ = (1+iₐ)^(1/12) - 1`, unit: '%', formula: '', params: {} };
      });
    }

    // --- PARTIE 2 : EMPRUNTS ---
    if (targetMode === 'part2' || targetMode === 'all') {
      generators.push(() => {
        const k0 = Math.floor(Math.random() * 50000) + 50000;
        const i = 0.03; const n = 15;
        const a = k0 * (i / (1 - Math.pow(1 + i, -n)));
        return { id: 'f2_annuity', text: `Calculer l'annuité constante d'un emprunt de ${formatCurrency(k0)} sur 15 ans au taux de 3%.`, correctAnswer: Number(a.toFixed(2)), explanation: `a = K₀ × [i / (1-(1+i)⁻ⁿ)]`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const k0 = 20000; const i = 0.04; const a = 4492.54;
        const m1 = a - (k0 * i);
        return { id: 'f2_m1', text: `Pour un prêt de ${formatCurrency(k0)} à 4% avec une annuité de ${formatCurrency(a)}, quel est le 1er amortissement (M₁) ?`, correctAnswer: Number(m1.toFixed(2)), explanation: `M₁ = a - (K₀ × i)`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const k0 = 10000; const i = 0.02; const n = 5;
        const a = calculateConstantAnnuity(k0, n, i * 100);
        return { id: 'f2_total_cost', text: `Quel est le coût TOTAL du crédit pour un emprunt de ${formatCurrency(k0)} sur 5 ans à 2% (annuités constantes) ?`, correctAnswer: Number((a * n - k0).toFixed(2)), explanation: `Coût = (n × a) - K₀`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const m1 = 1500; const i = 0.03;
        const m2 = m1 * (1 + i);
        return { id: 'f2_progression', text: `Si le 1er amortissement M₁ est de ${formatCurrency(m1)} et le taux est de 3%, quel est le 2ème amortissement M₂ ?`, correctAnswer: Number(m2.toFixed(2)), explanation: `Mₚ = M₁ × (1+i)ᵖ⁻¹`, unit: '€', formula: '', params: {} };
      });
    }

    // Sélection aléatoire avec vérification d'historique
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
        const pa = 45; const pv = 70;
        const marge = pv - pa;
        return { id: 'm1_marge', text: `Taux de MARGE pour un article acheté ${pa}€ HT et revendu ${pv}€ HT ?`, correctAnswer: Number(((marge/pa)*100).toFixed(2)), explanation: `((PV-PA)/PA)×100`, unit: '%', formula: '', params: {} };
      });
      generators.push(() => {
        const pa = 60; const pv = 100;
        const marge = pv - pa;
        return { id: 'm1_marque', text: `Taux de MARQUE pour un article acheté ${pa}€ HT et revendu ${pv}€ HT ?`, correctAnswer: Number(((marge/pv)*100).toFixed(2)), explanation: `((PV-PA)/PV)×100`, unit: '%', formula: '', params: {} };
      });
      generators.push(() => {
        const pa = 40; const pv_ttc = 72;
        return { id: 'm1_coeff', text: `Calculer le coefficient multiplicateur (PV TTC / PA HT) pour un achat à ${pa}€ HT et une vente à ${pv_ttc}€ TTC.`, correctAnswer: Number((pv_ttc/pa).toFixed(2)), explanation: `PV TTC / PA HT`, unit: '', formula: '', params: {} };
      });
      generators.push(() => {
        const ttc = 150; const tva = 20;
        const ht = ttc / 1.2;
        return { id: 'm1_ht_from_ttc', text: `Calculer le prix HT d'un produit vendu ${ttc}€ TTC (TVA 20%).`, correctAnswer: Number(ht.toFixed(2)), explanation: `HT = TTC / 1,20`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const pa_brut = 100; const remise = 10; const port = 5;
        const pa_net = pa_brut - remise + port;
        return { id: 'm1_revient', text: `Calculer le coût de revient : Prix Achat Brut 100€, Remise 10€, Frais de port 5€.`, correctAnswer: pa_net, explanation: `PA Brut - Remise + Frais`, unit: '€', formula: '', params: {} };
      });
    }

    // --- PARTIE 2 : PERFORMANCE & STOCKS ---
    if (targetMode === 'part2' || targetMode === 'all') {
      generators.push(() => {
        const cf = 35000; const tmcv = 40;
        const sr = cf / (tmcv/100);
        return { id: 'm2_sr', text: `Calculer le Seuil de Rentabilité (SR) si Charges Fixes = ${formatCurrency(cf)} et Taux de MCV = ${tmcv}%.`, correctAnswer: Number(sr.toFixed(2)), explanation: `SR = CF / Taux MCV`, unit: '€', formula: '', params: {} };
      });
      generators.push(() => {
        const sm = 8000; const cmv = 48000;
        const delai = (sm / cmv) * 360;
        return { id: 'm2_delai_stock', text: `Si le Stock Moyen est de ${formatCurrency(sm)} et le CMV annuel est de ${formatCurrency(cmv)}, quel est le délai moyen de stockage ?`, correctAnswer: Number(delai.toFixed(0)), explanation: `(Stock / CMV) × 360`, unit: ' jours', formula: '', params: {} };
      });
      generators.push(() => {
        const sr = 180000; const ca = 600000;
        const pm = (sr / ca) * 360;
        return { id: 'm2_pm', text: `Calculer le Point Mort (en jours) si SR = ${formatCurrency(sr)} et CA annuel = ${formatCurrency(ca)}.`, correctAnswer: Number(pm.toFixed(0)), explanation: `(SR / CA) × 360`, unit: ' jours', formula: '', params: {} };
      });
      generators.push(() => {
        const pv_unit = 25; const cv_unit = 15;
        const mcv = pv_unit - cv_unit;
        const tmcv = (mcv / pv_unit) * 100;
        return { id: 'm2_tmcv', text: `Quel est le taux de MCV si le Prix de Vente est de ${pv_unit}€ et les Charges Variables unitaires sont de ${cv_unit}€ ?`, correctAnswer: Number(tmcv.toFixed(2)), explanation: `((PV-CV)/PV)×100`, unit: '%', formula: '', params: {} };
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

    // Seuil de tolérance élargi pour les calculs complexes (0.5% ou 0.25€)
    const threshold = Math.max(0.25, Math.abs(question.correctAnswer * 0.005));
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
      { id: 'part1', title: 'Flux & Cap.', desc: 'Focus sur les intérêts, valeurs acquises et actualisation.', color: 'blue' },
      { id: 'part2', title: 'Emprunts', desc: 'Focus sur les annuités, amortissements et crédits.', color: 'emerald' },
      { id: 'all', title: 'Mode Mixte', desc: 'Toute la palette technique de la finance.', color: 'zinc' }
    ] : [
      { id: 'part1', title: 'Prix & Marges', desc: 'Formation des prix, taux de marge et marque.', color: 'amber' },
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
      <p className="text-center text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em] animate-pulse">Algorithme de diversification actif • Entraînement I.S.T.E.C.</p>
    </div>
  );
};

export default PracticeQuiz;
