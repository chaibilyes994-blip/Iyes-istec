
import React from 'react';
import { CourseType } from '../types';

const FormulaCard: React.FC<{ title: string; formula: string; description: string; color: string }> = ({ title, formula, description, color }) => (
  <div className={`p-5 rounded-2xl border bg-zinc-950/40 border-zinc-800 hover:border-${color}-500/50 transition-all group`}>
    <h4 className={`text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest group-hover:text-${color}-400 transition-colors`}>{title}</h4>
    <div className={`bg-zinc-900/80 p-4 rounded-xl font-mono text-center text-lg mb-3 border border-zinc-800 text-${color}-200 shadow-inner`}>
      {formula}
    </div>
    <p className="text-xs text-zinc-500 leading-relaxed italic">{description}</p>
  </div>
);

interface Props {
  course: CourseType;
}

const CourseView: React.FC<Props> = ({ course }) => {
  if (course === 'finance') {
    return (
      <div className="space-y-16 pb-24">
        {/* Finance Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-black text-white tracking-tight">Masterclass Mathématiques Financières</h1>
          <p className="text-zinc-500">Un guide complet pour maîtriser les flux financiers, du placement à l'amortissement.</p>
        </div>

        {/* PARTIE 1 Finance */}
        <section className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-transparent rounded-full opacity-50"></div>
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-10">
            <h2 className="text-3xl font-black text-white flex items-center gap-4">
              <span className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40 text-2xl">I</span>
              PARTIE 1 : Capitalisation & Actualisation
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormulaCard title="Intérêts Simples" formula="I = C₀ × i × n" description="Pour le court terme. n en fraction d'année." color="blue" />
              <FormulaCard title="Valeur Acquise (Composé)" formula="Cₙ = C₀ × (1 + i)ⁿ" description="Base du long terme. Les intérêts produisent des intérêts." color="indigo" />
            </div>
          </div>
        </section>

        {/* PARTIE 2 Finance */}
        <section className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-600 to-transparent rounded-full opacity-50"></div>
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-10">
            <h2 className="text-3xl font-black text-white flex items-center gap-4">
              <span className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40 text-2xl">II</span>
              PARTIE 2 : Les Emprunts Indivis
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormulaCard title="Annuité Constante" formula="a = K₀ × [ i / (1 - (1 + i)⁻ⁿ) ]" description="Montant fixe payé à chaque période." color="emerald" />
              <FormulaCard title="Progression Amortissements" formula="Mₚ = M₁ × (1 + i)ᵖ⁻¹" description="Loi de progression géométrique des M." color="emerald" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Management Course View
  return (
    <div className="space-y-16 pb-24">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-white tracking-tight text-emerald-500">Gestion Commerciale & Contrôle</h1>
        <p className="text-zinc-500">Indicateurs de performance, analyse des marges et pilotage des stocks.</p>
      </div>

      {/* PARTIE 1 Management */}
      <section className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600 to-transparent rounded-full opacity-50"></div>
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-10">
          <h2 className="text-3xl font-black text-white flex items-center gap-4">
            <span className="bg-amber-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-900/40 text-2xl">I</span>
            Analyse de l'Activité & Prix
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FormulaCard title="Coût de Revient" formula="PA Base - Reductions + Frais" description="Ce que l'article coûte réellement à l'entreprise." color="amber" />
            <FormulaCard title="Chiffre d'Affaires" formula="PV TTC × Quantité" description="Valeur totale facturée aux clients." color="amber" />
            <FormulaCard title="HT depuis TTC" formula="PV TTC / (1 + Taux TVA)" description="Convertir un prix public en hors taxes." color="amber" />
            <FormulaCard title="Marge Commerciale" formula="PV HT - PA HT" description="Ce qui reste pour couvrir les frais fixes." color="amber" />
          </div>
        </div>
      </section>

      {/* PARTIE 2 Management */}
      <section className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-600 to-transparent rounded-full opacity-50"></div>
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-10">
          <h2 className="text-3xl font-black text-white flex items-center gap-4">
            <span className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40 text-2xl">II</span>
            Indicateurs & Rentabilité
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FormulaCard title="Taux de Marge" formula="Marge / PA HT" description="Rentabilité rapportée au coût d'achat." color="emerald" />
            <FormulaCard title="Taux de Marque" formula="Marge / PV HT" description="Part de la marge dans le prix de vente." color="emerald" />
            <FormulaCard title="Délai Moyen Stock" formula="(Stock / CMV) × 360" description="Vitesse de rotation des marchandises." color="emerald" />
            <FormulaCard title="Seuil Rentabilité" formula="Charges Fixes / Taux MCV" description="CA minimum pour ne pas être en perte." color="emerald" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseView;
