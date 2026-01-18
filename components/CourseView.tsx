
import React from 'react';

const FormulaCard: React.FC<{ title: string; formula: string; description: string; color: string }> = ({ title, formula, description, color }) => (
  <div className={`p-5 rounded-2xl border bg-zinc-950/40 border-zinc-800 hover:border-${color}-500/50 transition-all group`}>
    <h4 className={`text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest group-hover:text-${color}-400 transition-colors`}>{title}</h4>
    <div className={`bg-zinc-900/80 p-4 rounded-xl font-mono text-center text-lg mb-3 border border-zinc-800 text-${color}-200 shadow-inner`}>
      {formula}
    </div>
    <p className="text-xs text-zinc-500 leading-relaxed italic">{description}</p>
  </div>
);

const CourseView: React.FC = () => {
  return (
    <div className="space-y-16 pb-24">
      {/* Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-white tracking-tight">Masterclass Mathématiques Financières</h1>
        <p className="text-zinc-500">Un guide complet pour maîtriser les flux financiers, du placement à l'amortissement.</p>
      </div>

      {/* PARTIE 1 */}
      <section className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-transparent rounded-full opacity-50"></div>
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-10">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
            <h2 className="text-3xl font-black text-white flex items-center gap-4">
              <span className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40 text-2xl">I</span>
              PARTIE 1 : Capitalisation & Actualisation
            </h2>
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest bg-zinc-950 px-4 py-2 rounded-full border border-zinc-800">Fondamentaux</span>
          </div>

          <div className="space-y-12">
            {/* Intérêts Simples */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-800"></div>
                <h3 className="text-xl font-bold text-blue-400">Intérêts Simples (Court Terme)</h3>
                <div className="h-px flex-1 bg-zinc-800"></div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed text-center max-w-xl mx-auto">
                Les intérêts sont calculés uniquement sur le capital initial. Ils ne sont pas réinvestis (pas de capitalisation).
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <FormulaCard 
                  title="Montant des intérêts" 
                  formula="I = C₀ × i × n" 
                  description="n est souvent exprimé en fraction d'année (jours/360 ou mois/12)." 
                  color="blue"
                />
                <FormulaCard 
                  title="Valeur Acquise" 
                  formula="Cₙ = C₀ × (1 + n × i)" 
                  description="Montant total disponible à la fin de la période." 
                  color="blue"
                />
              </div>
            </div>

            {/* Intérêts Composés */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-800"></div>
                <h3 className="text-xl font-bold text-indigo-400">Intérêts Composés (Long Terme)</h3>
                <div className="h-px flex-1 bg-zinc-800"></div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed text-center max-w-xl mx-auto">
                Les intérêts produits à la fin de chaque période sont ajoutés au capital pour produire eux-mêmes des intérêts.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <FormulaCard 
                  title="Valeur Acquise finale" 
                  formula="Cₙ = C₀ × (1 + i)ⁿ" 
                  description="La base de tous les calculs financiers de long terme." 
                  color="indigo"
                />
                <FormulaCard 
                  title="Valeur Actuelle (Actualisation)" 
                  formula="C₀ = Cₙ × (1 + i)⁻ⁿ" 
                  description="Combien vaut aujourd'hui une somme perçue dans le futur." 
                  color="indigo"
                />
              </div>
            </div>

            {/* Équivalence des taux */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
              <h3 className="font-bold text-zinc-300 mb-6 flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Taux Proportionnels vs Équivalents
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Proportionnels (Simple)</span>
                  <p className="text-xs text-zinc-500">Le taux est simplement divisé par la période.</p>
                  <div className="p-3 bg-zinc-900 rounded-lg text-sm font-mono text-center">iₚ = iₐ / k</div>
                </div>
                <div className="space-y-4">
                  <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">Équivalents (Composé)</span>
                  <p className="text-xs text-zinc-500">Garantit la même valeur acquise finale.</p>
                  <div className="p-3 bg-zinc-900 rounded-lg text-sm font-mono text-center">(1 + iₐ) = (1 + iₚ)ᵏ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTIE 2 */}
      <section className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-600 to-transparent rounded-full opacity-50"></div>
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-10">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
            <h2 className="text-3xl font-black text-white flex items-center gap-4">
              <span className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40 text-2xl">II</span>
              PARTIE 2 : Les Emprunts Indivis
            </h2>
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest bg-zinc-950 px-4 py-2 rounded-full border border-zinc-800">Crédits</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
              <h4 className="text-emerald-400 font-bold mb-4 text-sm uppercase">Composantes</h4>
              <ul className="space-y-3">
                <li className="flex justify-between text-xs border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Annuité (a)</span>
                  <span className="text-zinc-300 font-mono">a = I + M</span>
                </li>
                <li className="flex justify-between text-xs border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Intérêts (Iₚ)</span>
                  <span className="text-zinc-300 font-mono">i × Kₚ₋₁</span>
                </li>
                <li className="flex justify-between text-xs">
                  <span className="text-zinc-500">Amort. (Mₚ)</span>
                  <span className="text-zinc-300 font-mono">Kₚ₋₁ - Kₚ</span>
                </li>
              </ul>
            </div>
            
            <div className="md:col-span-2 bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-emerald-400 font-black uppercase tracking-widest text-sm">Formule de l'Annuité Constante</h4>
                <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-bold">Standard Bancaire</div>
              </div>
              <div className="bg-zinc-950 p-6 rounded-xl font-mono text-center text-2xl text-emerald-300 border border-emerald-900/50 mb-4">
                a = K₀ × [ i / (1 - (1 + i)⁻ⁿ) ]
              </div>
              <p className="text-xs text-zinc-500 text-center italic">Calcul de l'échéance fixe périodique pour amortir le capital K₀ sur n périodes.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Lois de progression</h3>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                  <span className="text-[10px] font-black text-zinc-600 block mb-1">Amortissements (M)</span>
                  <p className="text-xs text-zinc-400 mb-2">En annuités constantes, les amortissements progressent en progression géométrique de raison (1+i).</p>
                  <div className="font-mono text-emerald-400 text-center">Mₚ = M₁ × (1 + i)ᵖ⁻¹</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Coût réel du crédit</h3>
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                 <span className="text-[10px] font-black text-zinc-600 block mb-1">Total des Intérêts Payés</span>
                 <p className="text-xs text-zinc-400 mb-2">Somme de toutes les annuités moins le capital emprunté initial.</p>
                 <div className="font-mono text-emerald-400 text-center">ΣI = (n × a) - K₀</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseView;
