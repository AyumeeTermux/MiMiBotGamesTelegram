
import React from 'react';
import { GameState, Player } from '../types';
import PixelBanner from './PixelBanner';

interface DashboardProps {
  gameState: GameState;
  updatePlayer: (updates: Partial<Player>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ gameState, updatePlayer }) => {
  const { player } = gameState;

  const handleHeal = () => {
    if (player.hp >= player.maxHp) {
      alert("Health is already full!");
      return;
    }
    if (player.coins < 20) {
      alert("Not enough coins (Need 20)!");
      return;
    }
    updatePlayer({
      hp: player.maxHp,
      coins: player.coins - 20
    });
  };

  const handleDaily = () => {
    const today = new Date().toDateString();
    if (player.dailyDate === today) {
      alert("Daily reward already claimed today! Come back tomorrow warrior.");
      return;
    }

    const baseReward = 50;
    const vipBonus = player.vip ? 150 : 0;
    const levelBonus = player.level * 5;
    const totalReward = baseReward + vipBonus + levelBonus;

    updatePlayer({
      coins: player.coins + totalReward,
      dailyDate: today,
      dailyClaimed: true
    });

    const breakdown = `Reward Claimed!\n\nBase: 50💰\n${player.vip ? `VIP Bonus: 150💰\n` : ''}Level Bonus: ${levelBonus}💰\n------------------\nTotal: ${totalReward}💰`;
    alert(breakdown);
  };

  const isDailyAvailable = player.dailyDate !== new Date().toDateString();

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <PixelBanner 
        type="profile" 
        title="Hero Profile" 
        subtitle="View your equipment, stats, and progression in the MiMi Kingdom."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <i className="fa-solid fa-crown text-8xl"></i>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
            <div className="w-32 h-32 rounded-3xl bg-indigo-500 flex items-center justify-center text-5xl shadow-xl shadow-indigo-500/20 border-4 border-slate-800">
              {player.username.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl medieval-font tracking-wide mb-2">{player.username}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider border border-slate-700">{player.rank} RANK</span>
                {player.vip && <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider border border-amber-500/50 flex items-center gap-1">
                  <i className="fa-solid fa-gem text-[10px]"></i> VIP STATUS
                </span>}
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/50">{player.guild}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                <button 
                  onClick={handleHeal} 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
                >
                  <i className="fa-solid fa-heart-pulse"></i> Full Heal (20💰)
                </button>
                <button 
                  onClick={handleDaily} 
                  disabled={!isDailyAvailable}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg ${
                    isDailyAvailable 
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50 shadow-none'
                  }`}
                >
                  <i className={`fa-solid ${isDailyAvailable ? 'fa-calendar-check' : 'fa-clock'}`}></i> 
                  {isDailyAvailable ? 'Claim Daily Reward' : 'Reward Claimed'}
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Experience (XP)</span>
                  <span className="text-slate-300 font-mono text-xs font-bold">{player.xp} / {player.level * 100}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                    style={{ width: `${Math.min((player.xp / (player.level * 100)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vital Stats */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col justify-center space-y-6">
          <StatItem icon="fa-heart" color="text-rose-500" label="Health Points" value={`${player.hp} / ${player.maxHp}`} percentage={(player.hp / player.maxHp) * 100} barColor="bg-rose-500" />
          <StatItem icon="fa-bolt" color="text-amber-400" label="Base Damage" value={player.damage} />
          <StatItem icon="fa-crosshairs" color="text-emerald-400" label="Critical Rate" value={`${player.crit}%`} />
          <StatItem icon="fa-flask-vial" color="text-blue-400" label="Healing Power" value={player.heal} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <EquipmentSlot icon="fa-sword" label="Weapon" item={player.equippedWeapon} rarity="RARE" />
        <EquipmentSlot icon="fa-shield" label="Armor" item={player.equippedArmor} rarity="COMMON" />
        <EquipmentSlot icon="fa-ring" label="Accessory" item={player.equippedAccessory} rarity="EPIC" />
        <EquipmentSlot icon="fa-paw" label="Active Pet" item={player.activePet} rarity="COMMON" />
      </div>
    </div>
  );
};

const StatItem: React.FC<{ icon: string, color: string, label: string, value: string | number, percentage?: number, barColor?: string }> = ({ icon, color, label, value, percentage, barColor }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center ${color}`}>
          <i className={`fa-solid ${icon}`}></i>
        </div>
        <span className="text-slate-400 text-xs font-bold uppercase tracking-tight">{label}</span>
      </div>
      <span className="font-bold font-mono text-sm">{value}</span>
    </div>
    {percentage !== undefined && (
      <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
        <div className={`h-full ${barColor} transition-all duration-500 ease-in-out`} style={{ width: `${percentage}%` }}></div>
      </div>
    )}
  </div>
);

const EquipmentSlot: React.FC<{ icon: string, label: string, item: string, rarity: string }> = ({ icon, label, item, rarity }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500/50 transition-all duration-300 group cursor-default shadow-lg">
    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-4">{label}</span>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xl group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-colors border border-slate-700 group-hover:border-indigo-500/30">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="min-w-0">
        <div className="font-bold text-slate-200 line-clamp-1 text-sm">{item}</div>
        <div className={`text-[9px] font-black uppercase tracking-tighter ${
          rarity === 'COMMON' ? 'text-slate-500' : 
          rarity === 'RARE' ? 'text-blue-400' : 
          rarity === 'EPIC' ? 'text-purple-400' : 'text-amber-500'
        }`}>{rarity}</div>
      </div>
    </div>
  </div>
);

export default Dashboard;
