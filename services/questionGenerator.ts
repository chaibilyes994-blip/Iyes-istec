
import { Question, CourseType } from '../types';
import { formatCurrency } from './mathUtils';

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateQuestion = (module: CourseType, theme?: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Question => {
  const isFinance = module === 'finance';
  
  // Liste des thèmes disponibles par module
  const themes = isFinance 
    ? ['capitalization', 'annuity', 'amortization', 'equivalents']
    : ['margins', 'stocks', 'profitability', 'pricing'];

  const selectedTheme = theme || themes[rand(0, themes.length - 1)];

  if (isFinance) {
    switch (selectedTheme) {
      case 'capitalization': {
        const c0 = rand(10, 50) * 100;
        const i = rand(2, 8);
        const n = rand(2, 12);
        const type = Math.random() > 0.5 ? 'simple' : 'compound';
        
        if (type === 'simple') {
          const res = c0 * (1 + (i / 100) * (n / 12)); // On joue sur les mois pour corser
          return {
            id: `f_cap_s_${Date.now()}`,
            module: 'finance',
            theme: 'Capitalisation Simple',
            difficulty,
            text: `Un artisan place ${formatCurrency(c0)} sur un livret à ${i}% d'intérêts simples pendant ${n} mois. Quelle est la valeur acquise ?`,
            correctAnswer: Number(res.toFixed(2)),
            unit: '€',
            courseReminder: "Cₙ = C₀ (1 + i × n)",
            method: "1. Convertir n en années (n/12). 2. Appliquer la formule des intérêts simples.",
            explanation: `${c0} × (1 + ${i/100} × ${n}/12) = ${res.toFixed(2)}€`,
            trapWarning: "Attention : n doit être exprimé en années. Si la durée est en mois, divisez par 12.",
            type: 'calculation'
          };
        } else {
          const res = c0 * Math.pow(1 + (i / 100), n);
          return {
            id: `f_cap_c_${Date.now()}`,
            module: 'finance',
            theme: 'Capitalisation Composée',
            difficulty,
            text: `Calculer la valeur acquise d'un capital de ${formatCurrency(c0)} placé à ${i}% (intérêts composés) pendant ${n} ans.`,
            correctAnswer: Number(res.toFixed(2)),
            unit: '€',
            courseReminder: "Cₙ = C₀ (1 + i)ⁿ",
            method: "Appliquer la puissance n au coefficient de capitalisation (1+i).",
            explanation: `${c0} × (1 + ${i/100})^${n} = ${res.toFixed(2)}€`,
            type: 'calculation'
          };
        }
      }
      case 'equivalents': {
        const ia = rand(3, 9);
        const res = (Math.pow(1 + ia/100, 1/12) - 1) * 100;
        return {
          id: `f_equiv_${Date.now()}`,
          module: 'finance',
          theme: 'Taux Équivalents',
          difficulty: 'hard',
          text: `Une banque affiche un taux annuel de ${ia}%. Quel est le taux mensuel équivalent (iₘ) ?`,
          correctAnswer: Number(res.toFixed(4)),
          unit: '%',
          courseReminder: "(1+iₐ) = (1+iₘ)¹²",
          method: "Extraire la racine 12ème : iₘ = (1+iₐ)^(1/12) - 1",
          explanation: `(1 + ${ia/100})^(1/12) - 1 = ${(res/100).toFixed(6)} soit ${res.toFixed(4)}%`,
          trapWarning: "Ne pas diviser simplement par 12 ! En intérêts composés, on utilise la puissance fractionnaire.",
          type: 'calculation'
        };
      }
      case 'margins':
      default: {
        const pa = rand(40, 120);
        const pv = pa + rand(20, 60);
        const type = Math.random() > 0.5 ? 'marge' : 'marque';
        const res = type === 'marge' ? ((pv-pa)/pa)*100 : ((pv-pa)/pv)*100;
        return {
          id: `m_marg_${Date.now()}`,
          module: 'management',
          theme: type === 'marge' ? 'Taux de Marge' : 'Taux de Marque',
          difficulty: 'medium',
          text: `Un commerçant achète un produit ${pa}€ HT et le revend ${pv}€ HT. Quel est son taux de ${type} ?`,
          correctAnswer: Number(res.toFixed(2)),
          unit: '%',
          courseReminder: type === 'marge' ? "Marge / PA HT" : "Marge / PV HT",
          method: `1. Calculer la marge brute (PV - PA). 2. Diviser par le ${type === 'marge' ? 'coût d\'achat' : 'prix de vente'} HT.`,
          explanation: `Marge = ${pv-pa}€. Taux = (${pv-pa} / ${type === 'marge' ? pa : pv}) × 100 = ${res.toFixed(2)}%`,
          trapWarning: `Confusion classique : le taux de MARGE se calcule sur l'ACHAT, le taux de MARQUE sur la VENTE.`,
          type: 'calculation'
        };
      }
    }
  } else {
    // Management templates...
    const pa = rand(50, 200);
    const pv_ht = pa * 1.4;
    const ttc = pv_ht * 1.2;
    return {
      id: `m_pricing_${Date.now()}`,
      module: 'management',
      theme: 'Formation des Prix',
      difficulty: 'easy',
      text: `Un article est acheté ${pa}€ HT. Le commerçant applique un taux de marque de 30% et une TVA de 20%. Quel est le prix de vente TTC ?`,
      correctAnswer: Number((pa / 0.7 * 1.2).toFixed(2)),
      unit: '€',
      courseReminder: "PV HT = PA HT / (1 - Taux Marque)",
      method: "1. Trouver le PV HT en utilisant le taux de marque. 2. Appliquer la TVA.",
      explanation: `PV HT = ${pa} / (1 - 0.3) = ${(pa/0.7).toFixed(2)}€. TTC = ${(pa/0.7).toFixed(2)} × 1.2 = ${(pa/0.7*1.2).toFixed(2)}€`,
      type: 'calculation'
    };
  }
};
