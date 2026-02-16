
import React, { useState, useEffect } from 'react';
import { INITIAL_PLAYER, ITEMS, MONSTERS, PETS, DUNGEONS } from './constants';
import { GameState } from './types';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Shop from './components/Shop';
import AIHub from './components/AIHub';
import BotTerminal from './components/BotTerminal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'shop' | 'ai-hub' | 'bot'>('bot');
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('mimi_rpg_state');
    return saved ? JSON.parse(saved) : { player: [INITIAL_PLAYER], items: ITEMS, monsters: MONSTERS, pets: PETS, dungeons: DUNGEONS };
  });

  useEffect(() => {
    localStorage.setItem('mimi_rpg_state', JSON.stringify(gameState));
  }, [gameState]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-4 gap-4">
        <div className="flex items-center justify-center md:justify-start gap-3 p-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><i className="fa-solid fa-gamepad"></i></div>
          <span className="hidden md:block font-black medieval-font text-xl text-indigo-400">MiMi Studio</span>
        </div>
        <nav className="flex-1 space-y-2 mt-8">
          <NavItem icon="fa-terminal" label="Bot Control" active={activeTab === 'bot'} onClick={() => setActiveTab('bot')} />
          <NavItem icon="fa-gauge" label="Stats" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon="fa-robot" label="AI Forge" active={activeTab === 'ai-hub'} onClick={() => setActiveTab('ai-hub')} />
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'bot' && <BotTerminal gameState={gameState} setGameState={setGameState} />}
        {activeTab === 'dashboard' && <Dashboard gameState={gameState as any} updatePlayer={(u) => setGameState(p => ({...p, player: [{...p.player[0], ...u}]}))} />}
        {activeTab === 'ai-hub' && <AIHub gameState={gameState} />}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}>
    <i className={`fa-solid ${icon} text-lg`}></i>
    <span className="hidden md:block font-bold text-xs uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
