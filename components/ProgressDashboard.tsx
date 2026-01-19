
import React from 'react';
import { getProgress } from '../services/storage';

const ProgressDashboard: React.FC = () => {
  const data = getProgress();

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
      <header className="text-center space-y-4">
        <div className="inline-block px-4 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest">
          Tableau de Bord
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Votre Progression</h1>
        <p className="text-zinc-500">Statistiques basées sur vos sessions locales</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 text-center">
          <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Points d'expertise</span>
          <span className="text-6xl font-black text-blue-500">{data.totalPoints}</span>
        </div>
        <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 text-center">
          <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Examens tentés</span>
          <span className="text-6xl font-black text-white">{data.history.length}</span>
        </div>
        <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 text-center">
          <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Précision Globale</span>
          <span className="text-6xl font-black text-emerald-500">
            {data.stats.length > 0 
              ? Math.round((data.stats.reduce((acc, s) => acc + s.correctAnswers, 0) / 
                 data.stats.reduce((acc, s) => acc + s.totalAnswered, 0)) * 100) 
              : 0}%
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-white uppercase tracking-widest px-4">Performance par Thème</h3>
        <div className="grid lg:grid-cols-2 gap-4">
          {data.stats.map((s, i) => (
            <div key={i} className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-zinc-600 uppercase mb-1 block">{s.module}</span>
                <span className="text-lg font-bold text-white">{s.theme}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-400">{Math.round((s.correctAnswers/s.totalAnswered)*100)}%</span>
                <span className="block text-[10px] font-bold text-zinc-600">{s.correctAnswers}/{s.totalAnswered}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
