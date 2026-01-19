
import { Question, CourseType } from '../types';
import { formatCurrency } from './mathUtils';

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateQuestion = (module: CourseType, themeId?: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Question => {
  const isFinance = module === 'finance';
  
  // Strict separation of themes
  const financeThemes = ['capitalization', 'annuity', 'amortization', 'equivalents'];
  const managementThemes = ['margins', 'stocks', 'profitability', 'pricing'];

  const selectedTheme = themeId || (isFinance 
    ? financeThemes[rand(0, financeThemes.length - 1)] 
    : managementThemes[rand(0, managementThemes.length - 1)]);

  if (isFinance) {
    // --- MODULE FINANCE (BLEU) ---
    switch (selectedTheme) {
      case 'capitalization': {
        const c0 = rand(10, 100) * 100;
        const i = rand(20, 60) / 10;
        const n = rand(2, 10);
        const type = Math.random() > 0.5 ? 'simple' : 'compound';
        
        if (type === 'simple') {
          const res = c0 * (1 + (i / 100) * n);
          return {
            id: `f_cap_s_${Date.now()}`,
            module: 'finance',
            theme: 'Capitalisation Simple',
            difficulty,
            text: `Calculer la valeur acquise (Cn) d'un capital de ${formatCurrency(c0)} placé pendant ${n} ans au taux d'intérêt simple de ${i}%.`,
            correctAnswer: Number(res.toFixed(2)),
            unit: '€',
            courseReminder: "Cn = C0 (1 + i × n)",
            method: "Appliquer la formule des intérêts simples : multiplier le capital par (1 + taux × durée).",
            explanation: `${c0} × (1 + ${i/100} × ${n}) = ${res.toFixed(2)}€`,
            type: 'calculation'
          };
        } else {
          const res = c0 * Math.pow(1 + (i / 100), n);
          return {
            id: `f_cap_c_${Date.now()}`,
            module: 'finance',
            theme: 'Capitalisation Composée',
            difficulty,
            text: `Calculer la valeur acquise (Cn) d'un capital de ${formatCurrency(c0)} placé pendant ${n} ans au taux d'intérêt composé de ${i}%.`,
            correctAnswer: Number(res.toFixed(2)),
            unit: '€',
            courseReminder: "Cn = C0 (1 + i)ⁿ",
            method: "Appliquer la puissance n au coefficient (1+i).",
            explanation: `${c0} × (1 + ${i/100})^${n} = ${res.toFixed(2)}€`,
            type: 'calculation'
          };
        }
      }
      case 'equivalents': {
        const ia = rand(30, 80) / 10;
        const res = (Math.pow(1 + ia/100, 1/12) - 1) * 100;
        return {
          id: `f_equiv_${Date.now()}`,
          module: 'finance',
          theme: 'Taux Équivalents',
          difficulty: 'hard',
          text: `Le taux annuel est de ${ia}%. Quel est le taux mensuel équivalent ? (Saisir en %, ex: 0.4868)`,
          correctAnswer: Number(res.toFixed(4)),
          unit: '%',
          courseReminder: "i_mensuel = (1 + i_annuel)^(1/12) - 1",
          method: "Utiliser la racine 12ème (puissance 1/12) pour passer de l'année au mois.",
          explanation: `(1 + ${ia/100})^(1/12) - 1 = ${(res/100).toFixed(6)} soit ${res.toFixed(4)}%`,
          trapWarning: "Ne pas diviser par 12. En intérêts composés, le temps est en puissance.",
          type: 'calculation'
        };
      }
      case 'annuity': {
        const k0 = rand(50, 200) * 1000;
        const n = rand(5, 20);
        const i = rand(15, 45) / 10;
        const a = k0 * ((i/100) / (1 - Math.pow(1 + i/100, -n)));
        return {
          id: `f_ann_${Date.now()}`,
          module: 'finance',
          theme: 'Annuités',
          difficulty: 'hard',
          text: `Calculer l'annuité constante pour le remboursement d'un emprunt de ${formatCurrency(k0)} sur ${n} ans au taux de ${i}%.`,
          correctAnswer: Number(a.toFixed(2)),
          unit: '€',
          courseReminder: "a = K0 × [i / (1 - (1+i)⁻ⁿ)]",
          method: "Utiliser la formule de l'annuité constante pour amortir un capital.",
          explanation: `${k0} × [${i/100} / (1 - (1+${i/100})^-${n})] = ${a.toFixed(2)}€`,
          type: 'calculation'
        };
      }
      default: return generateQuestion(module, 'capitalization', difficulty);
    }
  } else {
    // --- MODULE GESTION (VERT) ---
    switch (selectedTheme) {
      case 'margins': {
        const pa = rand(40, 150);
        const marginRate = rand(20, 50);
        const isMarge = Math.random() > 0.5;
        
        if (isMarge) {
          const pv = pa * (1 + marginRate/100);
          return {
            id: `m_marg_${Date.now()}`,
            module: 'management',
            theme: 'Taux de Marge',
            difficulty: 'medium',
            text: `Le coût d'achat est de ${pa}€ HT. Le taux de MARGE est de ${marginRate}%. Calculer le prix de vente HT.`,
            correctAnswer: Number(pv.toFixed(2)),
            unit: '€',
            courseReminder: "PV HT = PA HT × (1 + Taux Marge)",
            method: "Le taux de marge s'applique sur le prix d'ACHAT HT.",
            explanation: `${pa} × (1 + ${marginRate/100}) = ${pv.toFixed(2)}€`,
            trapWarning: "Ne confondez pas : Taux de Marge = calcul sur l'ACHAT.",
            type: 'calculation'
          };
        } else {
          const pv = pa / (1 - marginRate/100);
          return {
            id: `m_marq_${Date.now()}`,
            module: 'management',
            theme: 'Taux de Marque',
            difficulty: 'medium',
            text: `Le coût d'achat est de ${pa}€ HT. Le taux de MARQUE est de ${marginRate}%. Calculer le prix de vente HT.`,
            correctAnswer: Number(pv.toFixed(2)),
            unit: '€',
            courseReminder: "PV HT = PA HT / (1 - Taux Marque)",
            method: "Le taux de marque s'applique sur le prix de VENTE HT.",
            explanation: `${pa} / (1 - ${marginRate/100}) = ${pv.toFixed(2)}€`,
            trapWarning: "Le taux de marque se calcule sur le prix de VENTE.",
            type: 'calculation'
          };
        }
      }
      case 'profitability': {
        const fixes = rand(20, 100) * 1000;
        const tmcv = rand(20, 45);
        const sr = fixes / (tmcv/100);
        return {
          id: `m_sr_${Date.now()}`,
          module: 'management',
          theme: 'Seuil de Rentabilité',
          difficulty: 'medium',
          text: `Une entreprise a des charges fixes de ${formatCurrency(fixes)} et un taux de MCV de ${tmcv}%. Quel est son Seuil de Rentabilité (SR) ?`,
          correctAnswer: Number(sr.toFixed(2)),
          unit: '€',
          courseReminder: "SR = Charges Fixes / Taux de MCV",
          method: "Le SR est le CA nécessaire pour couvrir toutes les charges.",
          explanation: `${fixes} / ${tmcv/100} = ${sr.toFixed(2)}€`,
          type: 'calculation'
        };
      }
      case 'pricing': {
        const pa = rand(60, 200);
        const coeff = (rand(15, 25) / 10).toFixed(1);
        const ttc = pa * Number(coeff);
        return {
          id: `m_coeff_${Date.now()}`,
          module: 'management',
          theme: 'Coeff Multiplicateur',
          difficulty: 'easy',
          text: `Le prix d'achat HT est de ${pa}€. Le coefficient multiplicateur est de ${coeff}. Quel est le prix de vente TTC ?`,
          correctAnswer: Number(ttc.toFixed(2)),
          unit: '€',
          courseReminder: "PV TTC = PA HT × Coeff Multiplicateur",
          method: "Le coefficient permet de passer directement de l'achat HT au prix public TTC.",
          explanation: `${pa} × ${coeff} = ${ttc.toFixed(2)}€`,
          type: 'calculation'
        };
      }
      default: return generateQuestion(module, 'margins', difficulty);
    }
  }
};
