'use client';
hello
import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Cpu,
  Map,
  Sword,
  Shield,
  Scroll,
  Heart,
  Zap,
  ChevronRight,
  X,
  ExternalLink,
  Github,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type Quest = {
  slug: string;
  title: string;
  date: string;
  preview: string;
  excerpt: string;
  difficulty: string;
  difficultyColor: string;
};

type GameAppProps = {
  quests: Quest[];
  initialScreen?: 'TITLE' | 'GAME';
};

const inventoryItems = [
  { name: 'Portfolio Site', desc: 'React + Tailwind', icon: <Terminal size={24} /> },
  { name: 'ML Model', desc: 'PyTorch script', icon: <Cpu size={24} /> },
  { name: 'Discord Bot', desc: 'Node.js', icon: <Zap size={24} /> },
  { name: 'Data Viz', desc: 'D3.js Dashboard', icon: <Map size={24} /> },
];

const GameApp = ({ quests, initialScreen = 'TITLE' }: GameAppProps) => {
  const [currentScreen, setCurrentScreen] = useState<'TITLE' | 'GAME'>(initialScreen);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [scrollY, setScrollY] = useState(0);

  const Scanlines = () => (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
  );

  const TitleScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-green-400 font-mono relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 animate-pulse bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900 via-slate-900 to-black" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center space-y-8 p-8 border-4 border-green-500 bg-black/80 shadow-[0_0_50px_rgba(34,197,94,0.4)] max-w-2xl w-full mx-4"
      >
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 animate-bounce text-shadow-glow">
          Shakewin<span className="text-white">'s</span>
          <br />
          Quest
        </h1>
        <p className="text-sm md:text-xl text-green-300 mb-8 font-bold">"Be Pure. Be Dialectical."</p>

        <div className="space-y-4">
          <button
            onClick={() => setCurrentScreen('GAME')}
            className="group relative px-8 py-4 bg-green-600 text-black font-black text-xl hover:bg-white hover:scale-105 transition-all duration-100 uppercase tracking-widest w-full md:w-auto"
          >
            <span className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">▶</span>
            Start Game
            <span className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">◀</span>
          </button>

          <div className="text-xs text-green-600 mt-8 animate-pulse">INSERT COIN TO CONTINUE...</div>
        </div>
      </motion.div>
    </div>
  );

  const GameScreen = () => {
    useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-mono relative selection:bg-green-500 selection:text-black">
        <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/90 border-b-4 border-slate-700 backdrop-blur-sm p-4 flex justify-between items-center text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-black font-bold">S</div>
            <div className="flex flex-col">
              <span className="font-bold text-green-400">LVL 25 DEV</span>
              <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[85%] animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 uppercase font-bold text-slate-400">
            <a href="#stats" className="hover:text-white hover:underline decoration-green-500 underline-offset-4">
              Stats
            </a>
            <a href="#quests" className="hover:text-white hover:underline decoration-yellow-500 underline-offset-4">
              Quests
            </a>
            <a href="#inventory" className="hover:text-white hover:underline decoration-blue-500 underline-offset-4">
              Inventory
            </a>
          </div>
        </nav>

        <header className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b-8 border-slate-800">
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
          <div className="z-10 text-center p-6 bg-slate-900/80 border-2 border-slate-700 max-w-3xl mx-4 transform skew-x-[-2deg]">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
              WELCOME, TRAVELER
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              You have entered the domain of <span className="text-green-400 font-bold">Shakewin</span>. Here lies knowledge of Machine Learning, Web Development, and the Mathematical Arts.
            </p>
          </div>
        </header>

        <section id="stats" className="py-20 px-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Cpu className="w-8 h-8 text-green-500" />
            <h3 className="text-3xl font-black uppercase text-green-500">Character Stats</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border-4 border-slate-700 p-6 relative group hover:border-green-500 transition-colors">
              <div className="absolute top-2 right-2 text-xs text-slate-500">ID: #0001</div>
              <div className="flex gap-6 items-start">
                <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-blue-600 border-2 border-white flex items-center justify-center text-4xl shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                  👾
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Class</span>
                    <span className="text-green-400 font-bold">Data Alchemist</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Weapon</span>
                    <span className="text-blue-400 font-bold">Vim Editor</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Guild</span>
                    <span className="text-purple-400 font-bold">GitHub Pages</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border-4 border-slate-700 p-6 space-y-6">
              <StatBar label="Python / ML" value={95} color="bg-yellow-500" icon={<Zap size={16} />} />
              <StatBar label="Mathematics" value={88} color="bg-red-500" icon={<Sword size={16} />} />
              <StatBar label="Web Dev" value={75} color="bg-blue-500" icon={<Shield size={16} />} />
              <StatBar label="Dialectics" value={100} color="bg-purple-500" icon={<Heart size={16} />} />
            </div>
          </div>
        </section>

        <section id="quests" className="py-20 bg-slate-900 border-y-4 border-slate-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-12 justify-center">
              <Scroll className="w-8 h-8 text-yellow-500" />
              <h3 className="text-3xl font-black uppercase text-yellow-500">Quest Log</h3>
            </div>

            <div className="grid gap-6">
              {quests.map((quest) => (
                <motion.div
                  key={quest.slug}
                  whileHover={{ x: 10 }}
                  onClick={() => setSelectedQuest(quest)}
                  className="group relative bg-slate-950 border-2 border-slate-800 p-6 hover:border-yellow-500 cursor-pointer transition-all"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-800 group-hover:bg-yellow-500 transition-colors" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs px-2 py-1 font-bold rounded ${quest.difficultyColor} text-black uppercase`}>
                          {quest.difficulty}
                        </span>
                        <span className="text-slate-500 text-xs">{quest.date}</span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-200 group-hover:text-yellow-400 transition-colors">{quest.title}</h4>
                      <p className="text-slate-500 text-sm mt-1">{quest.preview}</p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 group-hover:text-yellow-500">
                      <span className="text-xs uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Accept Quest
                      </span>
                      <ChevronRight />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="inventory" className="py-20 px-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Map className="w-8 h-8 text-blue-500" />
            <h3 className="text-3xl font-black uppercase text-blue-500">Inventory (Projects)</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {inventoryItems.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="aspect-square bg-slate-800/50 border-2 border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all p-4 flex flex-col items-center justify-center text-center gap-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-blue-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="z-10 text-slate-300 group-hover:text-blue-400 group-hover:scale-110 transition-transform">{item.icon}</div>
                <div className="z-10">
                  <div className="text-xs font-bold uppercase mb-1">{item.name}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="bg-black py-12 border-t-4 border-green-900 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-wrap justify-center gap-6 mb-6 text-xs uppercase font-bold tracking-widest text-slate-500">
              <Link href="/about" className="hover:text-green-400 transition-colors">
                About
              </Link>
              <Link href="/support" className="hover:text-green-400 transition-colors">
                App Support
              </Link>
              <Link href="/privacy-policy" className="hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
            </div>
            <p className="text-green-700 font-bold mb-4">GAME OVER</p>
            <div className="flex justify-center gap-6 mb-8">
              <a
                href="https://github.com/shakewingo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Terminal size={20} />
              </a>
            </div>
            <p className="text-slate-700 text-xs">© 2025 Shakewin. Built with React & Tailwind.</p>
          </div>
        </footer>

        <AnimatePresence>
          {selectedQuest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-900 border-4 border-yellow-500 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative shadow-[0_0_50px_rgba(234,179,8,0.2)]"
              >
                <button onClick={() => setSelectedQuest(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                  <X size={24} />
                </button>

                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`text-xs px-2 py-1 font-bold rounded ${selectedQuest.difficultyColor} text-black uppercase`}>
                      {selectedQuest.difficulty}
                    </span>
                    <span className="text-slate-500">{selectedQuest.date}</span>
                  </div>
                  <h2 className="text-3xl font-black text-yellow-400 mb-6">{selectedQuest.title}</h2>

                  <div className="prose prose-invert prose-green max-w-none">
                    <p className="text-lg leading-relaxed text-slate-300">{selectedQuest.excerpt}</p>
                    <div className="my-8 p-4 bg-black border border-green-900 rounded font-mono text-sm text-green-400">
                      {'>'} Initializing Gradient Descent...
                      <br />
                      {'>'} Learning Rate: 0.01
                      <br />
                      {'>'} Convergence reached at epoch 100.
                    </div>
                    <p className="text-slate-400">
                      This is where the full blog content would load. You can integrate Markdown rendering here easily using react-markdown.
                    </p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-800 flex justify-end">
                    <Link
                      href={selectedQuest.slug ? `/quests/${selectedQuest.slug}` : '#'}
                      className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-2 font-bold uppercase transition-colors"
                    >
                      Read Full Post <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="antialiased font-mono">
      <Scanlines />
      {currentScreen === 'TITLE' ? <TitleScreen /> : <GameScreen />}

      <style jsx global>{`
        .text-shadow-glow {
          text-shadow: 0 0 10px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.3);
        }
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #0f172a;
        }
        ::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 0;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #16a34a;
        }
      `}</style>
    </div>
  );
};

const StatBar = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) => (
  <div>
    <div className="flex justify-between text-xs uppercase font-bold mb-1 tracking-wider text-slate-400">
      <div className="flex items-center gap-2">{icon} {label}</div>
      <span>{value}/100</span>
    </div>
    <div className="h-4 bg-slate-800 border border-slate-700 relative overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${value}%` }}>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:10px_10px] opacity-50" />
      </div>
    </div>
  </div>
);

export type { Quest };
export default GameApp;
