
import React from 'react';
import { CourseType } from '../types';

const FormulaCard: React.FC<{ title: string; formula: string; description?: string; color: string }> = ({ title, formula, description, color }) => (
  <div className={`p-5 rounded-2xl border bg-zinc-950/40 border-zinc-800 hover:border-${color}-500/50 transition-all group h-full flex flex-col`}>
    <h4 className={`text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-widest group-hover:text-${color}-400 transition-colors`}>{title}</h4>
    <div className={`bg-zinc-900/80 p-4 rounded-xl font-mono text-center text-base mb-3 border border-zinc-800 text-${color}-200 shadow-inner flex-1 flex items-center justify-center`}>
      {formula}
    </div>
    {description && <p className="text-[11px] text-zinc-500 leading-relaxed italic">{description}</p>}
  </div>
);

interface Props {
  course: CourseType;
}

const CourseView: React.FC<Props> = ({ course }) => {
  if (course === 'finance') {
    return (
      <div className="space-y-16 pb-24 animate-in fade-in duration-700">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">I.S.T.E.C. Finance</h1>
          <p className="text-zinc-500 font-medium">Mathématiques Financières : Référentiel complet des formules.</p>
        </div>

        {/* PARTIE 1 Finance */}
        <section className="relative space-y-6">
          <div className="flex items-center gap-4">
            <span className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-900/40">1</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Capitalisation & Actualisation</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormulaCard title="Intérêt Simple" formula="I = C₀ × i × n" description="Court terme. n en fraction d'année (jours/360)." color="blue" />
            <FormulaCard title="Valeur Acquise (Simple)" formula="Cₙ = C₀ (1 + ni)" description="Capital initial + intérêts produits." color="blue" />
            <FormulaCard title="Valeur Acquise (Composé)" formula="Cₙ = C₀ (1 + i)ⁿ" description="Long terme. Réinvestissement des intérêts." color="indigo" />
            <FormulaCard title="Actualisation (Composé)" formula="C₀ = Cₙ (1 + i)⁻ⁿ" description="Valeur présente d'un flux futur." color="indigo" />
            <FormulaCard title="Taux Proportionnel" formula="i_p = i_a / k" description="Simple division du taux annuel." color="zinc" />
            <FormulaCard title="Taux Équivalent" formula="(1+i_a) = (1+i_p)ᵏ" description="Même valeur acquise en intérêts composés." color="zinc" />
          </div>
        </section>

        {/* PARTIE 2 Finance */}
        <section className="relative space-y-6">
          <div className="flex items-center gap-4">
            <span className="bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-900/40">2</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Emprunts & Annuités</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormulaCard title="Annuité Constante" formula="a = K₀ × [i / (1-(1+i)⁻ⁿ)]" description="Échéance périodique fixe (Intérêt + Amortissement)." color="emerald" />
            <FormulaCard title="Amortissement p" formula="Mₚ = M₁ (1 + i)ᵖ⁻¹" description="Progression géométrique des amortissements." color="emerald" />
            <FormulaCard title="Dernier Amortissement" formula="Mₙ = M₁ (1 + i)ⁿ⁻¹" description="M₁ est le premier amortissement." color="emerald" />
            <FormulaCard title="Capital Restant p" formula="Kₚ = K₀ - ΣM" description="K₀ moins somme des amortissements effectués." color="emerald" />
            <FormulaCard title="Intérêt de la période" formula="Iₚ = Kₚ₋₁ × i" description="Calculé sur le capital restant dû." color="emerald" />
            <FormulaCard title="Coût Total du Crédit" formula="ΣI = (n × a) - K₀" description="Somme totale des intérêts payés." color="emerald" />
          </div>
        </section>
      </div>
    );
  }

  // Management Course View
  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-700">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">I.S.T.E.C. Gestion</h1>
        <p className="text-zinc-500 font-medium">Gestion Commerciale & Contrôle B2 : Synthèse de cours.</p>
      </div>

      {/* PARTIE 1 Management */}
      <section className="relative space-y-6">
        <div className="flex items-center gap-4">
          <span className="bg-amber-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-amber-900/40">1</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Analyse Commerciale (Flux & Prix)</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormulaCard title="Coût de Revient" formula="P.A. - Reducs + Frais" description="P.A. Catalogue - (Remise/Rabais/Ristourne) + Frais Achat." color="amber" />
          <FormulaCard title="CdeR Moyen (CUMP)" formula="Σ(Q×C) / ΣQ" description="Coût de revient pondéré par les quantités du lot." color="amber" />
          <FormulaCard title="Chiffre d'Affaires" formula="PV TTC × Quantité" description="Valeur totale facturée toutes taxes comprises." color="amber" />
          <FormulaCard title="Passage HT → TTC" formula="PV TTC = HT × (1+TVA)" description="Taux courants : 20%, 10%, 5.5%, 2.1%." color="amber" />
          <FormulaCard title="Marge Commerciale" formula="PV HT - PA HT" description="Différence brute pour couvrir les charges fixes." color="emerald" />
          <FormulaCard title="Taux de Marge" formula="(Marge / PA HT) × 100" description="Rentabilité par rapport au coût d'achat." color="emerald" />
          <FormulaCard title="Taux de Marque" formula="(Marge / PV HT) × 100" description="Part de la marge dans le prix de vente HT." color="emerald" />
          <FormulaCard title="Coeff. Multiplicateur" formula="PV TTC / PA HT" description="Nombre (>1) pour passer du coût d'achat au prix TTC." color="emerald" />
        </div>
      </section>

      {/* PARTIE 2 Management */}
      <section className="relative space-y-6">
        <div className="flex items-center gap-4">
          <span className="bg-rose-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-rose-900/40">2</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Stocks & Seuil de Rentabilité</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormulaCard title="Délai Moyen Stock" formula="(Stock / CMV) × 360" description="Vitesse de rotation en jours d'écoulement." color="rose" />
          <FormulaCard title="Besoin en Fonds (BFR)" formula="Stocks + Créances - Dettes" description="Capitaux mobilisés par le cycle d'exploitation." color="rose" />
          <FormulaCard title="Marge s/ Coût Variable" formula="CA - Charges Var." description="Aussi appelée MCV (Marge sur Coûts Variables)." color="rose" />
          <FormulaCard title="Seuil Rentabilité" formula="F / (MCV/CA)" description="CA min. pour Résultat = 0. (F = Charges Fixes)." color="rose" />
          <FormulaCard title="Point Mort (jours)" formula="(SR / CA Annuel) × 360" description="Date à laquelle le seuil est atteint." color="rose" />
          <FormulaCard title="Indice d'Évolution" formula="(V₁ / V₀) × 100" description="Comparaison par rapport à une valeur de référence." color="zinc" />
        </div>
      </section>
    </div>
  );
};

export default CourseView;
