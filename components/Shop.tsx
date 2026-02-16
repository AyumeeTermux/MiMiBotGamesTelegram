
import React from 'react';
import { GameState, Player, Rarity } from '../types';

interface ShopProps {
  gameState: GameState;
  updatePlayer: (updates: Partial<Player>) => void;
}

const Shop: React.FC<ShopProps> = ({ gameState, updatePlayer }) => {
  const { player, items } = gameState;

  const handleBuy = (item: any) => {
    if (player.coins < item.price) {
      alert("Not enough coins!");
      return;
    }

    updatePlayer({
      coins: player.coins - item.price,
      inventory: [...player.inventory, item.name]
    });
  };

  const getRarityColor = (rarity: Rarity) => {
    switch(rarity) {
      case Rarity.COMMON: return 'text-slate-400';
      case Rarity.RARE: return 'text-blue-400';
      case Rarity.EPIC: return 'text-purple-400';
      case Rarity.LEGENDARY: return 'text-amber-400';
      case Rarity.MYTHIC: return 'text-rose-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl medieval-font tracking-wider">Merchant's Stall</h2>
        <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/50">
          <i className="fa-solid fa-coins text-yellow-500"></i>
          <span className="font-bold text-yellow-500">{player.coins} Coins</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.filter(i => i.price > 0).map((item, idx) => (
          <div key={`${item.name}-${idx}`} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all flex flex-col group">
            <div className="flex justify-between items-start mb-4">
               <span className={`text-[10px] font-bold uppercase tracking-widest ${getRarityColor(item.rarity)}`}>{item.rarity}</span>
               <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{item.category}</span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{item.name}</h3>
            
            <div className="flex-1 space-y-2 mb-6">
              {item.damage && <div className="text-sm text-slate-400 flex justify-between"><span>Attack:</span> <span className="text-rose-400">+{item.damage}</span></div>}
              {item.hp && <div className="text-sm text-slate-400 flex justify-between"><span>Health:</span> <span className="text-emerald-400">+{item.hp}</span></div>}
              {item.heal && <div className="text-sm text-slate-400 flex justify-between"><span>Healing:</span> <span className="text-sky-400">{item.heal}</span></div>}
              {item.crit && <div className="text-sm text-slate-400 flex justify-between"><span>Crit:</span> <span className="text-amber-400">+{item.crit}%</span></div>}
            </div>

            <button 
              onClick={() => handleBuy(item)}
              className="w-full py-3 bg-slate-800 hover:bg-indigo-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-indigo-600/20"
            >
              <i className="fa-solid fa-coins text-yellow-500"></i>
              <span>{item.price} Buy</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
