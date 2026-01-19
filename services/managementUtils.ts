
/**
 * Gestion Commerciale Utils
 */

// Coût de revient = Prix d'achat base - Réductions + Frais d'achat
export const calculateCoutRevient = (pa: number, reductions: number, frais: number) => {
  return pa - reductions + frais;
};

// CA = Prix Vente TTC * Quantité
export const calculateCA = (pvTTC: number, qte: number) => {
  return pvTTC * qte;
};

// TVA calculations
export const getHTfromTTC = (ttc: number, rate: number) => ttc / (1 + rate / 100);
export const getTTCfromHT = (ht: number, rate: number) => ht * (1 + rate / 100);

// Marge Commerciale = PV HT - Coût Achat HT
export const calculateMarge = (pvHT: number, paHT: number) => pvHT - paHT;

// Taux de marge = Marge / PA HT
export const calculateTauxMarge = (marge: number, paHT: number) => (marge / paHT) * 100;

// Taux de marque = Marge / PV HT
export const calculateTauxMarque = (marge: number, pvHT: number) => (marge / pvHT) * 100;

// Coefficient multiplicateur = PV TTC / PA HT
export const calculateCoeffMult = (pvTTC: number, paHT: number) => pvTTC / paHT;

// Délai moyen de stockage (jours) = (Valeur stock / CMV) * 360
export const calculateDelaiStock = (valeurStock: number, cmv: number) => (valeurStock / cmv) * 360;

// Seuil de rentabilité = Charges Fixes / Taux de MCV
export const calculateSR = (chargesFixes: number, tauxMCV: number) => chargesFixes / (tauxMCV / 100);

// Point Mort (jours) = (SR / CA_annuel) * 360
export const calculatePointMort = (sr: number, caAnnuel: number) => (sr / caAnnuel) * 360;
