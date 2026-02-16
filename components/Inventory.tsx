
import React from 'react';
import { GameState, Player, Item } from '../types';
import PixelBanner from './PixelBanner';

interface InventoryProps {
  gameState: GameState;
  updatePlayer: (updates: Partial<Player>) => void;
}

const Inventory: React.FC<InventoryProps> = ({ gameState, updatePlayer }) => {
  const { player, items } = gameState;

  const handleEquip = (itemName: string) => {
    const itemData = items.find(i => i.name === itemName);
    if (!itemData) return;

    if (itemData.category === 'Weapon') {
      updatePlayer({ equippedWeapon: itemName });
    } else if (itemData.category === 'Armor') {
      updatePlayer({ equippedArmor: itemName });
    } else if (itemData.category === 'Accessory') {
      updatePlayer({ equippedAccessory: itemName });
    } else if (itemData.category === 'Potion') {
      if (itemData.heal) {
        const newHp = Math.min(player.hp + itemData.heal, player.maxHp);
        const newInventory = [...player.inventory];
        const index = newInventory.indexOf(itemName);
        if (index > -1) newInventory.splice(index, 1);
        updatePlayer({ hp: newHp, inventory: newInventory });
      }
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <PixelBanner 
        type="inventory" 
        title="Your Inventory" 
        subtitle="Manage your weapons, armors, accessories and consumable potions."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {player.inventory.map((itemName, idx) => {
          const itemData = items.find(i => i.name === itemName);
          const isEquipped = [player.equippedWeapon, player.equippedArmor, player.equippedAccessory].includes(itemName);
          
          return (
            <div key={`${itemName}-${idx}`} className={`p-6 rounded-3xl border transition-all shadow-xl group ${
              isEquipped ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0">
                  <h3 className="font-black text-lg uppercase tracking-widest line-clamp-1">{itemName}</h3>
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{itemData?.category || 'Utility'}</span>
                </div>
                {isEquipped && <span className="px-3 py-1 bg-indigo-500 text-white rounded-full text-[10px] font-black tracking-widest border border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]">EQUIPPED</span>}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {itemData?.damage && <span className="text-[10px] font-black px-3 py-1 bg-slate-800 rounded-full text-rose-400 border border-rose-500/20 uppercase tracking-widest">⚔️ +{itemData.damage} ATK</span>}
                {itemData?.hp && <span className="text-[10px] font-black px-3 py-1 bg-slate-800 rounded-full text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">🛡️ +{itemData.hp} HP</span>}
                {itemData?.heal && <span className="text-[10px] font-black px-3 py-1 bg-slate-800 rounded-full text-sky-400 border border-sky-500/20 uppercase tracking-widest">🧪 {itemData.heal} HEAL</span>}
              </div>

              <button 
                onClick={() => handleEquip(itemName)}
                disabled={isEquipped}
                className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 border-b-4 ${
                  isEquipped 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-900' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-900 shadow-lg shadow-indigo-900/20'
                }`}
              >
                {itemData?.category === 'Potion' ? 'Use Consumable' : (isEquipped ? 'Currently Active' : 'Equip Selection')}
              </button>
            </div>
          );
        })}

        {player.inventory.length === 0 && (
          <div className="col-span-full py-24 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-700">
             <i className="fa-solid fa-box-open text-7xl mb-6 opacity-20"></i>
             <p className="font-black uppercase tracking-[0.3em] text-xl">Bag Empty</p>
             <p className="text-sm font-medium mt-2">Visit the merchant to stock up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
