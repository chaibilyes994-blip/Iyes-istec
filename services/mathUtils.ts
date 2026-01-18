
import { AmortizationRow } from '../types';

/**
 * Capitalisation à intérêts simples
 * Cn = C0 * (1 + n * i)
 */
export const calculateSimpleInterest = (c0: number, n: number, i: number): number => {
  return c0 * (1 + n * (i / 100));
};

/**
 * Capitalisation à intérêts composés
 * Cn = C0 * (1 + i)^n
 */
export const calculateCompoundInterest = (c0: number, n: number, i: number): number => {
  return c0 * Math.pow(1 + (i / 100), n);
};

/**
 * Calcul de l'annuité constante
 * a = K0 * [i / (1 - (1+i)^-n)]
 */
export const calculateConstantAnnuity = (k0: number, n: number, iPercent: number): number => {
  const i = iPercent / 100;
  if (i === 0) return k0 / n;
  return k0 * (i / (1 - Math.pow(1 + i, -n)));
};

/**
 * Génération du tableau d'amortissement (Annuités constantes)
 */
export const generateAmortizationTable = (k0: number, n: number, iPercent: number): AmortizationRow[] => {
  const i = iPercent / 100;
  const annuity = calculateConstantAnnuity(k0, n, iPercent);
  const table: AmortizationRow[] = [];
  let currentBalance = k0;

  for (let p = 1; p <= n; p++) {
    const interest = currentBalance * i;
    const amortization = annuity - interest;
    const remainingEnd = Math.max(0, currentBalance - amortization);

    table.push({
      period: p,
      remainingStart: currentBalance,
      interest,
      amortization,
      annuity,
      remainingEnd
    });

    currentBalance = remainingEnd;
  }

  return table;
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
};

export const formatPercent = (val: number) => {
  return val.toFixed(2) + '%';
};
