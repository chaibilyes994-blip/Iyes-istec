
import React, { useState } from 'react';
import { AppSection, CourseType } from './types';
import CourseView from './components/CourseView';
import PracticeQuiz from './components/PracticeQuiz';
import ExamMode from './components/ExamMode';
import SidebarCalculator from './components/SidebarCalculator';
import HomeSelector from './components/HomeSelector';

const App: React.FC = () => {
  const [course, setCourse] = useState<CourseType | null>(null);
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.COURSE);

  if (!course) {
    return <HomeSelector onSelect={setCourse} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Header / Nav */}
      <nav className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setCourse(null); setActiveSection(AppSection.COURSE); }}>
              <div className={`p-2 rounded-lg text-white font-black text-xl shadow-lg transition-colors ${course === 'finance' ? 'bg-blue-600 shadow-blue-900/20' : 'bg-emerald-600 shadow-emerald-900/20'}`}>
                {course === 'finance' ? 'F' : 'M'}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white group-hover:text-blue-500 transition-colors uppercase leading-none">
                  I.S.T.E.C.
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${course === 'finance' ? 'text-blue-500' : 'text-emerald-500'}`}>
                  {course === 'finance' ? 'Finance' : 'Gestion'}
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex gap-1 bg-zinc-800 p-1 rounded-xl border border-zinc-700/50">
              <button 
                onClick={() => setActiveSection(AppSection.COURSE)}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeSection === AppSection.COURSE ? (course === 'finance' ? 'bg-zinc-700 text-blue-400' : 'bg-zinc-700 text-emerald-400') : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Cours
              </button>
              <button 
                onClick={() => setActiveSection(AppSection.PRACTICE)}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeSection === AppSection.PRACTICE ? (course === 'finance' ? 'bg-zinc-700 text-blue-400' : 'bg-zinc-700 text-emerald-400') : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Pratique
              </button>
              <button 
                onClick={() => setActiveSection(AppSection.EXAM)}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeSection === AppSection.EXAM ? (course === 'finance' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white') : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Examen ⏱️
              </button>
            </div>

            <button 
              onClick={() => setCourse(null)}
              className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              Modules
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 xl:col-span-9">
            {activeSection === AppSection.COURSE && <CourseView course={course} />}
            {activeSection === AppSection.PRACTICE && <PracticeQuiz course={course} />}
            {activeSection === AppSection.EXAM && <ExamMode course={course} />}
          </div>

          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-28 space-y-6">
              <SidebarCalculator />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-zinc-950 border-t border-zinc-800 py-8 text-center text-zinc-700 text-[9px] font-black uppercase tracking-[0.5em]">
        I.S.T.E.C. • Révision Partiels
      </footer>
    </div>
  );
};

export default App;
