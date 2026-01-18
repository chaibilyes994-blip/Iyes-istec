
import React from 'react';

const CourseView: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      <section className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
          <span className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-4 text-xl shadow-lg shadow-blue-900/40">1</span>
          Chapitre 1 : La Capitalisation
        </h2>
        <p className="text-zinc-400 mb-8 leading-relaxed text-lg">
          La capitalisation est le mécanisme par lequel un capital produit des intérêts. C'est transformer le temps en valeur monétaire.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50 hover:border-blue-500/30 transition-all group">
            <h3 className="font-bold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors">Intérêts Simples (I.S.)</h3>
            <p className="text-sm text-zinc-500 mb-4">Utilisé pour le court terme. Les intérêts ne sont pas réinvestis.</p>
            <div className="bg-zinc-950 p-4 rounded-xl font-mono text-center text-lg border border-zinc-800 text-blue-200">
              C<sub>n</sub> = C<sub>0</sub> × (1 + n × i)
            </div>
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50 hover:border-indigo-500/30 transition-all group">
            <h3 className="font-bold text-indigo-400 mb-3 group-hover:text-indigo-300 transition-colors">Intérêts Composés (I.C.)</h3>
            <p className="text-sm text-zinc-500 mb-4">Utilisé pour le long terme. Les intérêts produisent des intérêts.</p>
            <div className="bg-zinc-950 p-4 rounded-xl font-mono text-center text-lg border border-zinc-800 text-indigo-200">
              C<sub>n</sub> = C<sub>0</sub> × (1 + i)<sup>n</sup>
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 bg-zinc-950/50 rounded-2xl border border-zinc-800">
          <h3 className="font-bold text-zinc-300 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Équivalence des taux
          </h3>
          <ul className="space-y-3 text-zinc-400">
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>En simple :</strong> Proratisation linéaire (ex: 6% an = 0.5% mois).</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>En composé :</strong> (1 + i<sub>a</sub>) = (1 + i<sub>m</sub>)<sup>12</sup>. Les intérêts sont capitalisés chaque période.</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
          <span className="bg-emerald-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-4 text-xl shadow-lg shadow-emerald-900/40">2</span>
          Chapitre 2 : Les Emprunts Indivis
        </h2>
        <p className="text-zinc-400 mb-8 leading-relaxed text-lg">
          Un emprunt indivis est un prêt classique auprès d'une banque. Chaque paiement (annuité) comprend des intérêts et une part de capital.
        </p>

        <div className="space-y-8">
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-emerald-950 text-emerald-400 border border-emerald-900/50 rounded-xl text-sm font-bold">a = I + M</span>
            <span className="px-4 py-2 bg-emerald-950 text-emerald-400 border border-emerald-900/50 rounded-xl text-sm font-bold">I = i × K<sub>p-1</sub></span>
            <span className="px-4 py-2 bg-emerald-950 text-emerald-400 border border-emerald-900/50 rounded-xl text-sm font-bold">M = K<sub>p-1</sub> - K<sub>p</sub></span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl">
              <h4 className="font-bold text-zinc-200 mb-2">In Fine</h4>
              <p className="text-xs text-zinc-500">Capital remboursé en une seule fois à la fin. Les intérêts sont payés périodiquement sur le capital total.</p>
            </div>
            <div className="p-5 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl">
              <h4 className="font-bold text-zinc-200 mb-2">Amort. Constants</h4>
              <p className="text-xs text-zinc-500">La part de capital remboursé (M) est identique chaque période. Les annuités sont dégressives.</p>
            </div>
            <div className="p-5 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-12 h-12 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <h4 className="font-bold text-emerald-400 mb-2">Annuités Constantes</h4>
              <p className="text-xs text-emerald-600/80 mb-4 font-medium">Le système le plus courant. Le montant total payé (a) ne change jamais.</p>
              <div className="font-mono text-xs bg-zinc-950 p-3 rounded-xl border border-emerald-900/50 text-emerald-300">
                a = K<sub>0</sub> × [ i / (1 - (1+i)<sup>-n</sup>) ]
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseView;
