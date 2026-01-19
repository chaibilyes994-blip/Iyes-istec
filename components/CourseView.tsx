
import React from 'react';
import { CourseType } from '../types';

const FormulaBlock: React.FC<{ title: string; formula: string; desc: string; color: string }> = ({ title, formula, desc, color }) => (
  <div className={`group relative p-8 rounded-[2.5rem] border bg-zinc-900/40 border-zinc-800 hover:border-${color}-500/50 transition-all duration-500`}>
    <div className={`absolute -top-3 -right-3 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-${color}-600 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity`}>
      Essentiel
    </div>
    <h4 className={`text-[11px] font-black text-zinc-500 mb-6 uppercase tracking-[0.3em] group-hover:text-${color}-400 transition-colors`}>{title}</h4>
    <div className="flex items-center justify-center min-h-[100px] mb-6">
      <div className={`text-3xl md:text-4xl font-mono font-bold tracking-tighter text-white group-hover:scale-105 transition-transform duration-500`}>
        {formula.split('=').map((part, i) => (
          <span key={i}>
            {i > 0 && <span className={`text-${color}-500 mx-3`}>=</span>}
            {part.trim()}
          </span>
        ))}
      </div>
    </div>
    <p className="text-sm text-zinc-500 font-medium leading-relaxed italic border-t border-zinc-800 pt-4">{desc}</p>
  </div>
);

interface Props {
  course: CourseType;
}

const CourseView: React.FC<Props> = ({ course }) => {
  if (course === 'finance') {
    return (
      <div className="space-y-24 pb-32 animate-in fade-in duration-1000">
        <header className="max-w-3xl space-y-4">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Mathématiques Financières</h1>
          <p className="text-zinc-500 text-lg font-medium border-l-4 border-blue-600 pl-6">Le guide ultime des formules de capitalisation et d'emprunt pour l'I.S.T.E.C.</p>
        </header>

        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-2xl shadow-blue-900/40">01</div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Flux & Capitalisation</h2>
              <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-[0.4em]">Valeurs présentes et futures</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <FormulaBlock title="Intérêts Simples" formula="I = C₀ × i × n" desc="Usage court terme. n est souvent exprimé en jours/360." color="blue" />
            <FormulaBlock title="Valeur Acquise" formula="Cₙ = C₀ (1 + i)ⁿ" desc="Intérêts composés. La valeur d'un capital après n périodes." color="indigo" />
            <FormulaBlock title="Valeur Actuelle" formula="C₀ = Cₙ (1 + i)⁻ⁿ" desc="Actualisation. Utile pour ramener un flux futur à aujourd'hui." color="blue" />
            <FormulaBlock title="Taux Équivalent" formula="(1+iₐ) = (1+iₚ)ᵏ" desc="iₚ est le taux périodique (mensuel, trimestriel) pour un taux annuel iₐ." color="zinc" />
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-2xl font-black text-white shadow-2xl shadow-emerald-900/40">02</div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Remboursements Indivis</h2>
              <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-[0.4em]">Annuités et amortissements</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <FormulaBlock title="Annuité Constante" formula="a = K₀ [ i / (1-(1+i)⁻ⁿ) ]" desc="Le montant fixe versé à chaque période (Intérêt + Amortissement)." color="emerald" />
            <FormulaBlock title="Amortissement p" formula="Mₚ = M₁ (1 + i)ᵖ⁻¹" desc="L'amortissement progresse géométriquement chaque mois." color="emerald" />
            <FormulaBlock title="Intérêt Période" formula="Iₚ = Kₚ₋₁ × i" desc="L'intérêt est calculé sur le capital restant dû au début." color="emerald" />
            <FormulaBlock title="Annuité Simple" formula="a = I + M" desc="Composition basique d'une échéance bancaire." color="emerald" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-32 animate-in fade-in duration-1000">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Gestion Commerciale</h1>
        <p className="text-zinc-500 text-lg font-medium border-l-4 border-amber-600 pl-6">Maîtrise des indicateurs de performance, marges et seuils de rentabilité.</p>
      </header>

      <section className="space-y-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center text-2xl font-black text-white shadow-2xl shadow-amber-900/40">01</div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Marges & Coefficients</h2>
            <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-[0.4em]">Structure du profit unitaire</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <FormulaBlock title="Coût de Revient" formula="P.A. - Réducs + Frais" desc="Calcul du coût réel de l'article avant stockage." color="amber" />
          <FormulaBlock title="Taux de Marge" formula="(Marge / P.A. HT) × 100" desc="Rentabilité calculée sur le coût d'achat." color="amber" />
          <FormulaBlock title="Taux de Marque" formula="(Marge / P.V. HT) × 100" desc="Part de la marge dans le prix de vente HT." color="emerald" />
          <FormulaBlock title="Coefficient Multiplicateur" formula="P.V. TTC / P.A. HT" desc="Pour passer directement du coût d'achat au prix étiquette." color="zinc" />
        </div>
      </section>

      <section className="space-y-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-2xl font-black text-white shadow-2xl shadow-rose-900/40">02</div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Exploitation & Risques</h2>
            <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-[0.4em]">Stocks et seuil critique</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <FormulaBlock title="Délai Moyen Stock" formula="(Stock / CMV) × 360" desc="Nombre de jours moyen avant épuisement du stock." color="rose" />
          <FormulaBlock title="Seuil Rentabilité" formula="C.F. / Taux M.C.V." desc="Chiffre d'affaires minimum pour ne pas être à perte." color="rose" />
          <FormulaBlock title="Point Mort" formula="(S.R. / C.A.) × 360" desc="Le jour de l'année où l'entreprise devient rentable." color="rose" />
          <FormulaBlock title="Taux de M.C.V." formula="(M.C.V. / C.A.) × 100" desc="Marge sur coûts variables rapportée au CA." color="rose" />
        </div>
      </section>
    </div>
  );
};

export default CourseView;
