
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { calculateCompoundInterest, calculateConstantAnnuity, formatCurrency, calculateSimpleInterest } from '../services/mathUtils';
import { calculateSR, calculateDelaiStock, calculateTauxMarge, calculateTauxMarque, getHTfromTTC, calculateCA, calculatePointMort } from '../services/managementUtils';
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
  
  // Suivi rigoureux pour éviter les répétitions durant TOUTE la session
  const sessionUsedIds = useRef<Set<string>>(new Set());
  // Suivi des catégories pour varier les thèmes
  const lastCategory = useRef<string>('');

  const generateQuestion = useCallback((): Question => {
    const qPool: { category: string; generator: () => Question }[] = [];
    
    if (course === 'finance') {
      // --- THEMES FINANCE ---

      // 1. INTÉRÊTS SIMPLES
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'simple', generator: () => ({
        id: 'f_th_1', type: 'theory', module: 'finance', theme: 'Intérêts Simples', difficulty: 'easy',
        text: "Dans quel cas utilise-t-on généralement les intérêts simples ?", 
        correctAnswer: "Opérations de court terme (< 1 an)",
        options: ["Placements longs (> 5 ans)", "Opérations de court terme (< 1 an)", "Emprunts immobiliers", "Calcul d'inflation"],
        explanation: "Les intérêts simples sont la norme pour les produits financiers de moins d'un an.", 
        method: "Analyse de la maturité du placement.", courseReminder: "Simples < 1 an, Composés > 1 an", unit: ""
      })});
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'simple', generator: () => {
        const c0 = 10000; const i = 3; const d = 90;
        return { 
          id: 'f_calc_s1', text: `Calculer les intérêts produits par ${formatCurrency(c0)} à 3% (simple) pendant 90 jours.`, 
          type: 'calculation', module: 'finance', theme: 'Intérêts Simples', difficulty: 'medium',
          correctAnswer: 75, explanation: "10000 * 0.03 * (90/360)", method: "I = C0 * i * n", courseReminder: "I = C0 * i * n", unit: "€" 
        };
      }});

      // 2. CAPITALISATION COMPOSÉE
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'compound', generator: () => ({
        id: 'f_th_2', type: 'theory', module: 'finance', theme: 'Capitalisation Composée', difficulty: 'easy',
        text: "Que signifie 'capitaliser des intérêts' ?", 
        correctAnswer: "Ajouter les intérêts au capital pour qu'ils produisent eux-mêmes des intérêts",
        options: ["Retirer les gains chaque mois", "Ajouter les intérêts au capital pour qu'ils produisent eux-mêmes des intérêts", "Réduire la dette", "Payer des frais de gestion"],
        explanation: "C'est le principe des intérêts composés.", method: "Définition de la capitalisation.", courseReminder: "C(n) = C(0)(1+i)^n", unit: ""
      })});
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'compound', generator: () => {
        const c0 = 5000; const n = 4;
        const res = c0 * Math.pow(1.05, 4);
        return { 
          id: 'f_calc_c1', text: `Valeur acquise (Cₙ) de ${formatCurrency(c0)} placé à 5% composé pendant 4 ans.`, 
          type: 'calculation', module: 'finance', theme: 'Capitalisation Composée', difficulty: 'medium',
          correctAnswer: Number(res.toFixed(2)), explanation: "5000 * (1.05)^4", method: "Cn = C0 * (1+i)^n", courseReminder: "Cn = C0 * (1+i)^n", unit: "€" 
        };
      }});

      // 3. ACTUALISATION
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'discount', generator: () => {
        const cn = 10000; const n = 3;
        const res = cn * Math.pow(1.04, -3);
        return { 
          id: 'f_calc_a1', text: `Quelle est la valeur actuelle (C₀) d'une somme de ${formatCurrency(cn)} disponible dans 3 ans (taux 4% composé) ?`, 
          type: 'calculation', module: 'finance', theme: 'Actualisation', difficulty: 'medium',
          correctAnswer: Number(res.toFixed(2)), explanation: "10000 * (1.04)^-3", method: "C0 = Cn * (1+i)^-n", courseReminder: "C0 = Cn * (1+i)^-n", unit: "€" 
        };
      }});

      // 4. TAUX ÉQUIVALENTS
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'equiv', generator: () => ({
        id: 'f_th_3', type: 'theory', module: 'finance', theme: 'Taux Équivalents', difficulty: 'medium',
        text: "Deux taux sont dits équivalents si :", 
        correctAnswer: "Appliqués au même capital pendant la même durée, ils produisent la même valeur acquise",
        options: ["Ils ont la même valeur faciale", "Appliqués au même capital pendant la même durée, ils produisent la même valeur acquise", "L'un est le double de l'autre", "Ils sont tous les deux inférieurs à 10%"],
        explanation: "C'est la définition mathématique de l'équivalence de taux.", method: "Définition de l'équivalence de taux.", courseReminder: "(1+ia) = (1+ik)^k", unit: ""
      })});
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'equiv', generator: () => {
        const res = (Math.pow(1.06, 1/12) - 1) * 100;
        return { 
          id: 'f_calc_e1', text: `Calculer le taux mensuel équivalent à un taux annuel de 6% (en %, 4 décimales).`, 
          type: 'calculation', module: 'finance', theme: 'Taux Équivalents', difficulty: 'hard',
          correctAnswer: Number(res.toFixed(4)), explanation: "(1.06)^(1/12) - 1", method: "im = (1+ia)^(1/12) - 1", courseReminder: "(1+ia) = (1+im)^12", unit: "%" 
        };
      }});

      // 5. ANNUITÉS
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'annuity', generator: () => {
        const k0 = 150000; const n = 20; const i = 3.5;
        const a = calculateConstantAnnuity(k0, n, i);
        return { 
          id: 'f_calc_an1', text: `Annuité constante pour un prêt de ${formatCurrency(k0)} sur 20 ans à 3,5%.`, 
          type: 'calculation', module: 'finance', theme: 'Annuités', difficulty: 'hard',
          correctAnswer: Number(a.toFixed(2)), explanation: "K₀ * [i / (1-(1+i)^-n)]", method: "a = K0 * [i / (1-(1+i)^-n)]", courseReminder: "a = K0 * [i / (1-(1+i)^-n)]", unit: "€" 
        };
      }});

      // 6. AMORTISSEMENT
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'amort', generator: () => ({
        id: 'f_th_4', type: 'theory', module: 'finance', theme: 'Amortissement', difficulty: 'medium',
        text: "Dans un tableau d'amortissement à annuités constantes, le capital restant dû :", 
        correctAnswer: "Décroît de plus en plus vite",
        options: ["Reste constant", "Décroît linéairement", "Croît avec le temps", "Décroît de plus en plus vite"],
        explanation: "L'amortissement augmentant à chaque période, la dette diminue de façon accélérée.", method: "Analyse du profil d'amortissement.", courseReminder: "Amortissement = Annuité - Intérêts", unit: ""
      })});
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'amort', generator: () => {
        const k0 = 20000; const i = 0.04; const a = 4492.54;
        const m1 = a - (k0 * i);
        return { 
          id: 'f_calc_m1', text: `Emprunt de ${formatCurrency(k0)} à 4%. Annuité = ${formatCurrency(a)}. Calculer l'amortissement M₁ de la 1ère année.`, 
          type: 'calculation', module: 'finance', theme: 'Amortissement', difficulty: 'medium',
          correctAnswer: Number(m1.toFixed(2)), explanation: "M₁ = a - (K₀ * i)", method: "M1 = a - (K0 * i)", courseReminder: "a = Intérêt + Amortissement", unit: "€" 
        };
      }});
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'amort', generator: () => {
        const m1 = 1500; const i = 0.03;
        const m10 = m1 * Math.pow(1.03, 9);
        return { 
          id: 'f_calc_m10', text: `Si M₁ = ${formatCurrency(m1)} et le taux est de 3%, quel est le 10ème amortissement M₁₀ ?`, 
          type: 'calculation', module: 'finance', theme: 'Amortissement', difficulty: 'hard',
          correctAnswer: Number(m10.toFixed(2)), explanation: "Mₚ = M₁ * (1+i)^(p-1)", method: "Mp = M1 * (1+i)^(p-1)", courseReminder: "Mp = M1 * (1+i)^(p-1)", unit: "€" 
        };
      }});

    } else {
      // --- THEMES MANAGEMENT ---

      // 1. FORMATION DES PRIX (HT/TTC/TVA)
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'prices', generator: () => {
        const ht = 150;
        return { 
          id: 'm_calc_p1', text: `Calculer le prix TTC d'un article coûtant ${ht}€ HT (TVA 20%).`, 
          type: 'calculation', module: 'management', theme: 'Formation des Prix', difficulty: 'easy',
          correctAnswer: 180, explanation: "150 * 1.2", method: "TTC = HT * (1 + TVA)", courseReminder: "TTC = HT * 1.20", unit: "€" 
        };
      }});
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'prices', generator: () => {
        const ttc = 144;
        return { 
          id: 'm_calc_p2', text: `Quel est le prix HT d'un article à ${ttc}€ TTC (TVA 20%) ?`, 
          type: 'calculation', module: 'management', theme: 'Formation des Prix', difficulty: 'easy',
          correctAnswer: 120, explanation: "144 / 1.2", method: "HT = TTC / (1 + TVA)", courseReminder: "HT = TTC / 1.20", unit: "€" 
        };
      }});

      // 2. MARGES ET TAUX
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'margins', generator: () => ({
        id: 'm_th_1', type: 'theory', module: 'management', theme: 'Marges et Taux', difficulty: 'medium',
        text: "Le taux de marge est calculé par rapport :", 
        correctAnswer: "Au coût d'achat HT",
        options: ["Au prix de vente HT", "Au coût d'achat HT", "Au prix de vente TTC", "Au chiffre d'affaires"],
        explanation: "Marge / Coût Achat HT.", method: "Définition du taux de marge.", courseReminder: "Taux Marge = Marge / PA HT", unit: ""
      })});
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'margins', generator: () => {
        const pa = 50; const pv = 75;
        return { 
          id: 'm_calc_m1', text: `PA HT = ${pa}€, PV HT = ${pv} €. Calculer le taux de MARGE (en %).`, 
          type: 'calculation', module: 'management', theme: 'Marges et Taux', difficulty: 'medium',
          correctAnswer: 50, explanation: "(25 / 50) * 100", method: "(PV HT - PA HT) / PA HT", courseReminder: "Marge / PA HT", unit: "%" 
        };
      }});
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'margins', generator: () => {
        const pa = 60; const pv = 100;
        return { 
          id: 'm_calc_m2', text: `PA HT = ${pa}€, PV HT = ${pv} €. Calculer le taux de MARQUE (en %).`, 
          type: 'calculation', module: 'management', theme: 'Marges et Taux', difficulty: 'medium',
          correctAnswer: 40, explanation: "(40 / 100) * 100", method: "(PV HT - PA HT) / PV HT", courseReminder: "Marge / PV HT", unit: "%" 
        };
      }});

      // 3. COEFFICIENT MULTIPLICATEUR
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'coeff', generator: () => {
        const pa = 40; const ttc = 72;
        return { 
          id: 'm_calc_c1', text: `Achat ${pa}€ HT, Vente ${ttc}€ TTC. Quel est le coefficient multiplicateur ?`, 
          type: 'calculation', module: 'management', theme: 'Coefficient Multiplicateur', difficulty: 'medium',
          correctAnswer: 1.8, explanation: "72 / 40", method: "PV TTC / PA HT", courseReminder: "Coeff = PV TTC / PA HT", unit: "" 
        };
      }});

      // 4. GESTION DES STOCKS
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'stocks', generator: () => {
        const sm = 10000; const cmv = 60000;
        return { 
          id: 'm_calc_s1', text: `Stock Moyen = ${formatCurrency(sm)}, CMV annuel = ${formatCurrency(cmv)}. Délai de rotation (en jours) ?`, 
          type: 'calculation', module: 'management', theme: 'Gestion des Stocks', difficulty: 'medium',
          correctAnswer: 60, explanation: "(10000 / 60000) * 360", method: "(Stock Moyen / CMV) * 360", courseReminder: "Délai = (Stock Moyen / CMV) * 360", unit: " jours" 
        };
      }});

      // 5. SEUIL DE RENTABILITÉ
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'be', generator: () => ({
        id: 'm_th_2', type: 'theory', module: 'management', theme: 'Seuil de Rentabilité', difficulty: 'medium',
        text: "Le Seuil de Rentabilité est le CA pour lequel :", 
        correctAnswer: "Le résultat est nul (0)",
        options: ["La marge est maximale", "Les charges fixes sont nulles", "Le résultat est nul (0)", "Les impôts sont payés"],
        explanation: "C'est le point d'équilibre où l'entreprise ne fait ni perte ni profit.", method: "Définition du seuil de rentabilité.", courseReminder: "SR = CF / Taux MCV", unit: ""
      })});
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'be', generator: () => {
        const fixes = 40000; const tmcv = 25;
        return { 
          id: 'm_calc_be1', text: `Charges Fixes = ${formatCurrency(fixes)}, Taux MCV = 25%. Quel est le Seuil de Rentabilité ?`, 
          type: 'calculation', module: 'management', theme: 'Seuil de Rentabilité', difficulty: 'medium',
          correctAnswer: 160000, explanation: "40000 / 0.25", method: "CF / Taux MCV", courseReminder: "SR = CF / (Taux MCV / 100)", unit: "€" 
        };
      }});

      // 6. POINT MORT
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'be', generator: () => {
        const sr = 200000; const ca = 800000;
        return { 
          id: 'm_calc_pm1', text: `Si le SR est de ${formatCurrency(sr)} et le CA annuel de ${formatCurrency(ca)}, quel est le point mort (en jours) ?`, 
          type: 'calculation', module: 'management', theme: 'Seuil de Rentabilité', difficulty: 'medium',
          correctAnswer: 90, explanation: "(200000 / 800000) * 360", method: "(SR / CA) * 360", courseReminder: "Point Mort = (SR / CA) * 360", unit: " jours" 
        };
      }});
      
      // 7. COÛT DE REVIENT
      // Fix: Added missing Question properties and removed unsupported ones
      qPool.push({ category: 'cost', generator: () => {
        const brut = 100; const remise = 10; const port = 5;
        return { 
          id: 'm_calc_cr1', text: `Prix Achat Brut ${brut}€, Remise 10%, Frais de port ${port}€. Calculer le coût de revient HT.`, 
          type: 'calculation', module: 'management', theme: 'Coût de Revient', difficulty: 'easy',
          correctAnswer: 95, explanation: "100 - 10 + 5", method: "PA Brut - Remise + Frais", courseReminder: "Coût Revient = PA Net + Frais Achat", unit: "€" 
        };
      }});
    }

    // Algorithme de sélection intelligente :
    // 1. Filtrer les questions déjà utilisées dans cette session
    let available = qPool.filter(q => !sessionUsedIds.current.has(q.generator().id));
    
    // 2. Si tout est utilisé, on réinitialise (sécurité)
    if (available.length === 0) {
      sessionUsedIds.current.clear();
      available = qPool;
    }

    // 3. Essayer de varier la catégorie par rapport à la question précédente
    let filteredByCategory = available.filter(q => q.category !== lastCategory.current);
    const selectionSource = filteredByCategory.length > 0 ? filteredByCategory : available;

    // 4. Tirage final
    const selected = selectionSource[Math.floor(Math.random() * selectionSource.length)];
    const q = selected.generator();
    
    // Mises à jour des trackers
    sessionUsedIds.current.add(q.id);
    lastCategory.current = selected.category;
    
    return q;
  }, [course]);

  const startExam = () => {
    sessionUsedIds.current.clear();
    lastCategory.current = '';
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
      const val = parseFloat(String(answer).replace(',', '.').replace(/\s/g, ''));
      // Seuil de tolérance réduit pour l'examen (précision exigée)
      const threshold = Math.max(0.01, Math.abs((currentQuestion.correctAnswer as number) * 0.001));
      isCorrect = Math.abs(val - (currentQuestion.correctAnswer as number)) <= threshold;
    }
    
    setHistory(prev => [...prev, { question: currentQuestion, userAnswer: answer, isCorrect }]);
    if (isCorrect) setScore(s => s + 1);
    
    // Vérifier si l'examen est fini par nombre de questions (ex: 20 questions) ou continuer jusqu'au temps
    // Pour cet app, on continue jusqu'à la fin du temps ou si l'utilisateur quitte
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
      <div className="max-w-2xl mx-auto bg-zinc-900 p-12 rounded-[3.5rem] border border-zinc-800 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">EXAMEN BLANC <span className={course === 'finance' ? 'text-blue-500' : 'text-emerald-500'}>{course}</span></h2>
        <p className="text-zinc-500 mb-12 text-lg font-medium italic">Simulation intensive I.S.T.E.C. • Couverture totale du module.</p>
        
        <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 mb-12 text-left space-y-3">
          <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Règles de l'épreuve :</h4>
          <ul className="text-xs text-zinc-400 space-y-2">
            <li>• Questions aléatoires piochées dans toutes les thématiques.</li>
            <li>• Aucune répétition de question durant la session.</li>
            <li>• Précision exigée pour les calculs (2 décimales).</li>
          </ul>
        </div>

        <div className="flex justify-center gap-6 mb-12">
          {[10, 20, 30].map(m => (
            <button key={m} onClick={() => setTimeLimit(m)} className={`w-24 h-24 rounded-3xl border-2 transition-all flex flex-col items-center justify-center ${timeLimit === m ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}>
              <span className="text-3xl font-black">{m}</span><span className="text-[10px] font-bold tracking-widest">MIN</span>
            </button>
          ))}
        </div>
        <button onClick={startExam} className={`w-full py-8 rounded-3xl font-black text-2xl text-white shadow-2xl transition-all active:scale-95 ${course === 'finance' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>DÉBUTER L'ÉPREUVE</button>
      </div>
    );
  }

  if (status === 'finished') {
    return (
      <div className="max-w-4xl mx-auto space-y-12 pb-32 animate-in zoom-in-95 duration-700">
        <div className="bg-zinc-900 p-16 rounded-[4rem] border border-zinc-800 shadow-2xl text-center">
          <h2 className="text-5xl font-black text-white mb-8 uppercase tracking-tighter">Résultats de la Session</h2>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="bg-zinc-950 p-10 rounded-[2.5rem] border border-zinc-800/50 shadow-inner">
              <span className="block text-[11px] font-black text-zinc-600 uppercase mb-4 tracking-[0.3em]">Score de précision</span>
              <span className="text-6xl font-black text-blue-500 tracking-tighter">{score} <span className="text-2xl text-zinc-700">/ {history.length}</span></span>
            </div>
            <div className="bg-zinc-950 p-10 rounded-[2.5rem] border border-zinc-800/50 shadow-inner">
              <span className="block text-[11px] font-black text-zinc-600 uppercase mb-4 tracking-[0.3em]">Taux de réussite</span>
              <span className={`text-6xl font-black ${history.length > 0 && (score/history.length) >= 0.5 ? 'text-emerald-500' : 'text-red-500'} tracking-tighter`}>
                {history.length > 0 ? Math.round((score/history.length)*100) : 0}%
              </span>
            </div>
          </div>
          <button onClick={() => setStatus('setup')} className="w-full py-6 bg-white text-black rounded-3xl font-black text-xl uppercase tracking-[0.4em] shadow-2xl hover:bg-zinc-100 transition-colors">Relancer un examen</button>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-black text-white px-6 uppercase tracking-tighter">Analyse par question</h3>
          {history.map((h, i) => (
            <div key={i} className={`p-8 rounded-[2.5rem] border-2 transition-all ${h.isCorrect ? 'border-emerald-500/10 bg-emerald-500/5' : 'border-red-500/10 bg-red-500/5'}`}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-xl font-bold text-zinc-100 flex-1">{h.question.text}</p>
                <span className={`ml-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${h.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {h.isCorrect ? 'Validé' : 'Échec'}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono font-bold">
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                   <span className="text-[10px] text-zinc-600 block mb-1 uppercase tracking-widest">Saisie</span>
                   <span className={h.isCorrect ? 'text-emerald-500' : 'text-red-500'}>{h.userAnswer}</span>
                </div>
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                   <span className="text-[10px] text-zinc-600 block mb-1 uppercase tracking-widest">Attendu</span>
                   <span className="text-emerald-500">{h.question.correctAnswer} {h.question.unit}</span>
                </div>
              </div>
              {!h.isCorrect && <p className="mt-4 text-xs italic text-zinc-500 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/30">Rappel : {h.question.explanation}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      <div className="flex justify-between items-center bg-zinc-900 px-10 py-6 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-zinc-600 tracking-[0.4em] uppercase mb-1">Temps Restant</span>
          <span className="font-mono text-4xl font-black text-white tracking-tighter">{formatTime(timeLeft)}</span>
        </div>
        <div className="text-right">
           <span className="text-[9px] font-black text-zinc-600 tracking-[0.4em] uppercase mb-1 block">Question n°</span>
           <span className="text-3xl font-black text-blue-500 tracking-tighter">{history.length + 1}</span>
        </div>
      </div>

      <div className="bg-zinc-900 p-12 rounded-[3.5rem] border border-zinc-800 shadow-2xl min-h-[400px] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full"></div>
        {currentQuestion && (
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="px-4 py-1.5 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                {currentQuestion.type === 'theory' ? 'Théorie' : 'Application Technique'}
              </span>
              <h3 className="text-3xl font-black text-zinc-100 leading-tight">{currentQuestion.text}</h3>
            </div>
            
            {currentQuestion.type === 'theory' ? (
              <div className="grid gap-4 mt-8">
                {currentQuestion.options?.map((o, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleAnswer(o)} 
                    className="w-full text-left p-6 bg-zinc-950 border-2 border-zinc-800 rounded-3xl hover:border-blue-500 hover:bg-zinc-900 transition-all font-bold text-lg text-zinc-500 hover:text-white group flex items-center justify-between shadow-inner"
                  >
                    {o}
                    <div className="w-6 h-6 rounded-full border border-zinc-800 group-hover:border-blue-500/50 transition-all"></div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6 mt-8 animate-in slide-in-from-bottom-4">
                <div className="relative flex-1 group">
                   <input 
                    autoFocus 
                    type="text" 
                    value={userAnswer} 
                    onChange={e => setUserAnswer(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleAnswer(userAnswer)} 
                    className="w-full p-8 bg-zinc-950 border-2 border-zinc-800 rounded-3xl text-4xl font-black text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner placeholder:text-zinc-900" 
                    placeholder="Résultat..."
                   />
                   <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-700 font-black text-xl">{currentQuestion.unit}</span>
                </div>
                <button onClick={() => handleAnswer(userAnswer)} className={`px-16 py-8 rounded-3xl font-black text-2xl text-white shadow-2xl active:scale-95 transition-all ${course === 'finance' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'}`}>VALIDER</button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-12 text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em]">
          <span>PRÉCISION EXIGÉE</span>
          <span>PAS DE CALCULATRICE EXTERNE</span>
          <span>SESSION UNIQUE</span>
      </div>
    </div>
  );
};

export default ExamMode;
