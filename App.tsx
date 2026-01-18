
import React, { useState } from 'react';
import { AppSection } from './types';
import CourseView from './components/CourseView';
import CalculatorLab from './components/CalculatorLab';
import PracticeQuiz from './components/PracticeQuiz';
import SidebarCalculator from './components/SidebarCalculator';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.COURSE);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Header / Nav */}
      <nav className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white font-black text-xl shadow-lg shadow-blue-900/20">F</div>
              <span className="text-xl font-bold tracking-tight text-white">
                Fontana <span className="text-blue-500">Finance</span>
              </span>
            </div>
            
            <div className="hidden md:flex gap-1 bg-zinc-800 p-1 rounded-xl">
              <button 
                onClick={() => setActiveSection(AppSection.COURSE)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSection === AppSection.COURSE ? 'bg-zinc-700 text-blue-400 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Cours & Formules
              </button>
              <button 
                onClick={() => setActiveSection(AppSection.CALCULATOR)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSection === AppSection.CALCULATOR ? 'bg-zinc-700 text-blue-400 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Calculateurs Lab
              </button>
              <button 
                onClick={() => setActiveSection(AppSection.PRACTICE)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSection === AppSection.PRACTICE ? 'bg-zinc-700 text-blue-400 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Entraînement ∞
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Masterclass</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8 xl:col-span-9">
            {activeSection === AppSection.COURSE && <CourseView />}
            {activeSection === AppSection.CALCULATOR && <CalculatorLab />}
            {activeSection === AppSection.PRACTICE && <PracticeQuiz />}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="sticky top-28">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                Calculatrice Intégrée
              </h3>
              <SidebarCalculator />
              
              <div className="mt-8 p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                <h4 className="font-bold text-zinc-300 mb-2">Mode Concentration</h4>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  L'interface sombre réduit la fatigue oculaire et maximise la focalisation sur les concepts clés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Nav */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-lg shadow-2xl rounded-full border border-zinc-800 p-2 flex gap-2 z-50">
        <button 
          onClick={() => setActiveSection(AppSection.COURSE)}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${activeSection === AppSection.COURSE ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </button>
        <button 
          onClick={() => setActiveSection(AppSection.CALCULATOR)}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${activeSection === AppSection.CALCULATOR ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        </button>
        <button 
          onClick={() => setActiveSection(AppSection.PRACTICE)}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${activeSection === AppSection.PRACTICE ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-10 mt-auto text-center text-zinc-600 text-sm">
        <p>© {new Date().getFullYear()} Fontana Finance Education - Perfection dans chaque pixel.</p>
        <div className="flex justify-center gap-6 mt-4">
          <span className="hover:text-blue-500 transition-colors cursor-pointer">Aide</span>
          <span className="hover:text-blue-500 transition-colors cursor-pointer">Méthodologie</span>
          <span className="hover:text-blue-500 transition-colors cursor-pointer">Glossaire</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
