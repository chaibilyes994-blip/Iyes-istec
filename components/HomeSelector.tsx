
import React from 'react';
import { CourseType } from '../types';

interface Props {
  onSelect: (course: CourseType) => void;
}

const HomeSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-black text-white tracking-tighter">FONTANA <span className="text-blue-500">LEARNING</span></h1>
          <p className="text-zinc-500 text-lg">Choisissez votre pôle d'excellence académique</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Finance */}
          <button 
            onClick={() => onSelect('finance')}
            className="group relative bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 text-left transition-all hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/20 active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-900/40">
              <span className="text-2xl font-black text-white">F</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Fontana Finance</h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Masterclass Mathématiques Financières : Capitalisation, Actualisation, et Emprunts Indivis.
            </p>
            <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-widest text-xs">
              Accéder au pôle <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </button>

          {/* Card 2: Management */}
          <button 
            onClick={() => onSelect('management')}
            className="group relative bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 text-left transition-all hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-900/20 active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-900/40">
              <span className="text-2xl font-black text-white">M</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Gestion & Contrôle</h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Gestion Commerciale B2 : Coûts, Marges, Ratios de rentabilité et Analyse des stocks.
            </p>
            <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-xs">
              Accéder au pôle <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeSelector;
