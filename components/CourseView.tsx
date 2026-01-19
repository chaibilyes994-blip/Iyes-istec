
import React from 'react';
import { CourseType } from '../types';

const FormulaBlock: React.FC<{ title: string; formula: string; desc: string; example: string; interpretation: string; color: string }> = ({ title, formula, desc, example, interpretation, color }) => (
  <div className={`group relative p-8 rounded-[2.5rem] border bg-zinc-900/40 border-zinc-800 hover:border-${color}-500/50 transition-all duration-500`}>
    <h4 className={`text-[11px] font-black text-zinc-500 mb-6 uppercase tracking-[0.3em] group-hover:text-${color}-400 transition-colors`}>{title}</h4>
    <div className="flex items-center justify-center min-h-[80px] mb-6">
      <div className={`text-2xl md:text-3xl font-mono font-bold tracking-tighter text-white group-hover:scale-105 transition-transform duration-500`}>
        {formula}
      </div>
    </div>
    <div className="space-y-4 border-t border-zinc-800 pt-4">
      <p className="text-sm text-zinc-400 font-medium leading-relaxed italic">{desc}</p>
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Exemple</span>
        <p className="text-xs font-mono text-zinc-300">{example}</p>
      </div>
      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
        💡 {interpretation}
      </div>
    </div>
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
          <p className="text-zinc-500 text-lg font-medium border-l-4 border-blue-600 pl-6">Le guide ultime des formules de capitalisation et d'emprunt.</p>
        </header>

        <section className="space-y-10">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">01. Flux & Capitalisation</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <FormulaBlock 
              title="Intérêts Simples" 
              formula="I = C₀ × i × n" 
              desc="Usage court terme. n en fraction d'année." 
              example="1000€ à 3% sur 90 jours : 1000 × 0,03 × (90/360) = 7,50€"
              interpretation="L'intérêt ne produit pas lui-même d'intérêt."
              color="blue" 
            />
            <FormulaBlock 
              title="Valeur Acquise" 
              formula="Cₙ = C₀ (1 + i)ⁿ" 
              desc="Intérêts composés. Croissance exponentielle." 
              example="1000€ à 4% sur 5 ans : 1000 × (1,04)⁵ = 1216,65€"
              interpretation="Chaque année, les intérêts s'ajoutent au capital."
              color="indigo" 
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-32 animate-in fade-in duration-1000">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Gestion Commerciale</h1>
        <p className="text-zinc-500 text-lg font-medium border-l-4 border-amber-600 pl-6">Maîtrise des indicateurs de performance et marges.</p>
      </header>

      <section className="space-y-10">
         <h2 className="text-3xl font-black text-white uppercase tracking-tighter">01. Marges & Coefficients</h2>
         <div className="grid lg:grid-cols-2 gap-8">
            <FormulaBlock 
              title="Taux de Marge" 
              formula="(Marge / P.A. HT) × 100" 
              desc="Rentabilité sur le coût d'achat." 
              example="Achat 50€, Vente 75€ -> (25/50)*100 = 50% de marge."
              interpretation="Combien je gagne par rapport à ce que j'ai payé."
              color="amber" 
            />
            <FormulaBlock 
              title="Taux de Marque" 
              formula="(Marge / P.V. HT) × 100" 
              desc="Part de la marge dans le prix final." 
              example="Achat 50€, Vente 75€ -> (25/75)*100 = 33,3% de marque."
              interpretation="Combien je garde sur 1€ de chiffre d'affaires."
              color="emerald" 
            />
         </div>
      </section>
    </div>
  );
};

export default CourseView;
