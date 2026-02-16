
import React, { useState } from 'react';
import { GameState, Player, Monster, Dungeon } from '../types';
import PixelBanner from './PixelBanner';

interface CombatSimulatorProps {
  gameState: GameState;
  updatePlayer: (updates: Partial<Player>) => void;
}

const CombatSimulator: React.FC<CombatSimulatorProps> = ({ gameState, updatePlayer }) => {
  const { player, monsters, dungeons } = gameState;
  const [battleLog, setBattleLog] = useState<{ msg: string, type: 'info' | 'player' | 'monster' | 'reward' }[]>([]);
  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
  const [monsterHp, setMonsterHp] = useState(0);
  const [isBattleActive, setIsBattleActive] = useState(false);
  const [activeView, setActiveView] = useState<'selection' | 'battle'>('selection');

  const initiateCombat = (monster: Monster) => {
    setCurrentMonster(monster);
    setMonsterHp(monster.hp);
    setIsBattleActive(true);
    setActiveView('battle');
    setBattleLog([{ msg: `You challenged ${monster.name}! Prepare to fight!`, type: 'info' }]);
  };

  const enterDungeon = (dungeon: Dungeon) => {
    if (player.level < dungeon.levelReq) {
      alert(`Level too low! Requires Level ${dungeon.levelReq}`);
      return;
    }
    const bossMonster = monsters.find(m => m.name.includes(dungeon.boss)) || monsters[monsters.length - 1];
    initiateCombat({
      ...bossMonster,
      name: `🏰 BOSS: ${bossMonster.name}`,
      hp: bossMonster.hp * 2,
      damage: bossMonster.damage * 1.5,
      xp: dungeon.rewardXp
    });
  };

  const attack = () => {
    if (!currentMonster || !isBattleActive) return;

    const isCrit = Math.random() * 100 < player.crit;
    const pDmg = player.damage * (isCrit ? 2 : 1);
    const newMonsterHp = Math.max(0, monsterHp - pDmg);
    
    const logs = [...battleLog];
    logs.push({ msg: `You dealt ${pDmg} damage to ${currentMonster.name}${isCrit ? ' (CRITICAL!)' : ''}`, type: 'player' });

    if (newMonsterHp <= 0) {
      logs.push({ msg: `You defeated ${currentMonster.name}!`, type: 'reward' });
      logs.push({ msg: `Gained ${currentMonster.xp} XP and 50 Coins!`, type: 'reward' });
      
      let newXp = player.xp + currentMonster.xp;
      let newLevel = player.level;
      if (newXp >= player.level * 100) {
        newXp -= player.level * 100;
        newLevel += 1;
        logs.push({ msg: `CONGRATULATIONS! You leveled up to ${newLevel}!`, type: 'reward' });
      }

      updatePlayer({
        xp: newXp,
        level: newLevel,
        coins: player.coins + 50,
        maxHp: player.maxHp + (newLevel > player.level ? 20 : 0),
        damage: player.damage + (newLevel > player.level ? 5 : 0),
        hp: player.maxHp
      });

      setMonsterHp(0);
      setIsBattleActive(false);
      setBattleLog(logs);
      return;
    }

    const mDmg = Math.floor(Math.random() * currentMonster.damage) + 1;
    const newPlayerHp = Math.max(0, player.hp - mDmg);
    
    logs.push({ msg: `${currentMonster.name} hit you for ${mDmg} damage!`, type: 'monster' });

    if (newPlayerHp <= 0) {
      logs.push({ msg: `You were defeated by ${currentMonster.name}...`, type: 'monster' });
      setIsBattleActive(false);
      updatePlayer({ hp: Math.floor(player.maxHp * 0.1) });
    } else {
      updatePlayer({ hp: newPlayerHp });
    }

    setMonsterHp(newMonsterHp);
    setBattleLog(logs);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12">
      {activeView === 'selection' ? (
        <>
          <PixelBanner 
            type="battle" 
            title="Battle Arena" 
            subtitle="Venture into the wilderness or test your might in dark dungeons."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-300">
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-rose-400 medieval-font tracking-widest uppercase">
                <i className="fa-solid fa-skull"></i> Hunt Monsters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {monsters.map((monster) => (
                  <button 
                    key={monster.name}
                    onClick={() => initiateCombat(monster)}
                    className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-rose-500/50 hover:bg-rose-500/5 transition-all text-left group shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg group-hover:text-rose-400 transition-colors uppercase tracking-tighter">{monster.name}</span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold">LVL {monster.level}</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-4 font-bold">DROPS: {monster.dropItem}</div>
                    <div className="w-full py-2 bg-rose-600 group-hover:bg-rose-500 rounded-lg text-center text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-900/20 transition-all">
                      Attack
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-400 medieval-font tracking-widest uppercase">
                <i className="fa-solid fa-dungeon"></i> Explore Dungeons
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {dungeons.map((dungeon) => {
                  const isLocked = player.level < dungeon.levelReq;
                  return (
                    <button 
                      key={dungeon.name}
                      disabled={isLocked}
                      onClick={() => enterDungeon(dungeon)}
                      className={`p-6 rounded-2xl border transition-all text-left flex items-center justify-between shadow-lg ${
                        isLocked 
                          ? 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed' 
                          : 'bg-slate-900 border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-500/5'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-xl uppercase tracking-widest">{dungeon.name}</span>
                          {isLocked && <i className="fa-solid fa-lock text-slate-600"></i>}
                        </div>
                        <p className="text-xs font-bold text-slate-500 mt-1 uppercase">Boss: {dungeon.boss} • Reward: {dungeon.rewardXp} XP</p>
                      </div>
                      <div className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm ${
                        isLocked ? 'bg-slate-800 text-slate-600' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20 transition-all'
                      }`}>
                        {isLocked ? `Req Lvl ${dungeon.levelReq}` : 'Enter'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[700px] animate-in slide-in-from-bottom duration-500">
          {/* Battle Screen */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-rose-500/10 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-center z-20">
               <button 
                onClick={() => setActiveView('selection')}
                className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-slate-700 transition-all"
               >
                 <i className="fa-solid fa-chevron-left"></i> Retreat
               </button>
               <span className="text-rose-500 font-black uppercase tracking-[0.2em] text-xs">Combat Mode</span>
            </div>

            {currentMonster && (
              <>
                <div className="text-center space-y-6 py-10">
                  <div className="relative inline-block">
                    <div className="w-40 h-40 bg-slate-800 rounded-full flex items-center justify-center text-7xl mx-auto border-4 border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.3)] animate-pulse">
                      {currentMonster.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-rose-600 rounded-full text-xs font-black uppercase tracking-widest border-2 border-slate-900 shadow-xl">
                      Threat
                    </div>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black medieval-font tracking-[0.2em] uppercase text-white">{currentMonster.name}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                       <span className="h-0.5 w-8 bg-rose-500/50"></span>
                       <span className="text-rose-400 font-black text-xs uppercase tracking-widest">Level {currentMonster.level}</span>
                       <span className="h-0.5 w-8 bg-rose-500/50"></span>
                    </div>
                  </div>
                  <div className="space-y-3 max-w-sm mx-auto">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 px-1 uppercase tracking-widest">
                      <span>Vitality</span>
                      <span>{monsterHp} / {currentMonster.hp}</span>
                    </div>
                    <div className="w-full h-5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-1 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]" 
                        style={{ width: `${(monsterHp / currentMonster.hp) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 text-center bg-slate-950/50 p-6 rounded-3xl border border-white/5">
                   <div className="flex items-center justify-center gap-8">
                      <div className="text-left flex-1">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <i className="fa-solid fa-shield-heart text-emerald-500"></i> Hero Health
                        </div>
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                            <div className="h-full bg-emerald-500 transition-all shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${(player.hp / player.maxHp) * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="text-3xl font-black text-slate-800 italic select-none">VS</div>
                      <div className="flex-1 text-right">
                         <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2 justify-end">
                            Enemy Health <i className="fa-solid fa-skull text-rose-500"></i>
                         </div>
                         <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                            <div className="h-full bg-rose-500 transition-all shadow-[0_0_8px_rgba(244,63,94,0.5)]" style={{ width: `${(monsterHp / currentMonster.hp) * 100}%` }}></div>
                        </div>
                      </div>
                   </div>

                   {!isBattleActive ? (
                      <button 
                        onClick={() => setActiveView('selection')}
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 border-b-4 border-indigo-900"
                      >
                        Return to Map
                      </button>
                   ) : (
                      <button 
                        onClick={attack}
                        className="w-full py-6 bg-white text-slate-900 hover:bg-indigo-50 rounded-2xl font-black uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all active:scale-95 flex items-center justify-center gap-4 border-b-4 border-slate-300"
                      >
                        <i className="fa-solid fa-hand-fist text-2xl"></i>
                        Strike Enemy
                      </button>
                   )}
                </div>
              </>
            )}
          </div>

          {/* Battle Log */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Combat Feed</span>
              <button onClick={() => setBattleLog([])} className="text-[9px] text-slate-500 hover:text-rose-400 uppercase font-black tracking-widest transition-colors">Wipe Terminal</button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto font-mono text-xs space-y-4 bg-slate-950/40 custom-scrollbar">
              {battleLog.map((log, i) => (
                <div key={i} className={`p-3 rounded-xl border animate-in slide-in-from-right duration-300 ${
                  log.type === 'info' ? 'text-blue-400 bg-blue-500/5 border-blue-500/10' : 
                  log.type === 'player' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' : 
                  log.type === 'monster' ? 'text-rose-400 bg-rose-500/5 border-rose-500/10' : 
                  'text-yellow-400 font-bold bg-yellow-500/5 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="opacity-30 font-black tracking-tighter shrink-0">{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    <span className="shrink-0">
                      {log.type === 'player' && '⚔️'}
                      {log.type === 'monster' && '💀'}
                      {log.type === 'reward' && '🌟'}
                      {log.type === 'info' && '📜'}
                    </span>
                    <span className="leading-relaxed tracking-wide font-medium">{log.msg}</span>
                  </div>
                </div>
              ))}
              {battleLog.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-800 italic opacity-40">
                   <i className="fa-solid fa-terminal text-5xl mb-6"></i>
                   <p className="font-black uppercase tracking-[0.3em]">No Combat Records</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombatSimulator;
