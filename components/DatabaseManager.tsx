
import React, { useState } from 'react';
import { GameState } from '../types';
import { INITIAL_PLAYER, ITEMS, MONSTERS, PETS, DUNGEONS } from '../constants';
import PixelBanner from './PixelBanner';

interface DatabaseManagerProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const DatabaseManager: React.FC<DatabaseManagerProps> = ({ gameState, setGameState }) => {
  const [activeTable, setActiveTable] = useState<keyof GameState>('player');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const getTableData = () => {
    const data = gameState[activeTable];
    if (Array.isArray(data)) return data;
    return [data];
  };

  const tableData = getTableData();
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  const handleResetDatabase = () => {
    setGameState({
      player: [INITIAL_PLAYER],
      items: ITEMS,
      monsters: MONSTERS,
      pets: PETS,
      dungeons: DUNGEONS
    });
    setShowConfirmReset(false);
    alert("Database has been reset to default values.");
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gameState, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `mimi_rpg_backup_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      <PixelBanner 
        type="bot" 
        title="Master Database" 
        subtitle="Pantau dan kelola data seluruh pemain MiMi Kingdom secara real-time."
      />

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex flex-wrap gap-2">
           {(['player', 'items', 'monsters', 'pets', 'dungeons'] as const).map(tab => (
             <button 
                key={tab}
                onClick={() => setActiveTable(tab as any)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                  activeTable === tab 
                    ? 'bg-indigo-600 text-white border-indigo-900 shadow-lg shadow-indigo-900/20' 
                    : 'bg-slate-800 text-slate-400 border-slate-950 hover:bg-slate-700'
                }`}
             >
               {tab === 'player' ? 'Pemain (Active)' : tab}
             </button>
           ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={handleExportData}
             className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-slate-700"
           >
             <i className="fa-solid fa-download text-indigo-400"></i>
             Export JSON
           </button>
           
           <button 
             onClick={() => setShowConfirmReset(true)}
             className="px-4 py-2 bg-rose-950/30 hover:bg-rose-900/50 text-rose-500 border border-rose-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
           >
             <i className="fa-solid fa-trash-can"></i>
             Wipe DB
           </button>
        </div>
      </div>

      {showConfirmReset && (
        <div className="bg-rose-950/30 border border-rose-500/50 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-triangle-exclamation text-rose-500 text-xl"></i>
              </div>
              <div>
                <p className="font-bold text-rose-200">Konfirmasi Penghapusan Database</p>
                <p className="text-xs text-rose-300/60">Tindakan ini tidak dapat dibatalkan. Seluruh pemain akan terhapus.</p>
              </div>
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => setShowConfirmReset(false)} className="flex-1 md:flex-none px-6 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Batal</button>
              <button onClick={handleResetDatabase} className="flex-1 md:flex-none px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-widest border-b-4 border-rose-900">Ya, Reset</button>
           </div>
        </div>
      )}

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80">
                {columns.map(col => (
                  <th key={col} className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-700 whitespace-nowrap">{col.replace(/([A-Z])/g, ' $1')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row: any, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  {columns.map(col => (
                    <td key={col} className="p-5 text-xs text-slate-300 border-b border-slate-800/50 font-mono">
                      {typeof row[col] === 'boolean' ? (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${row[col] ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {row[col] ? 'YES' : 'NO'}
                        </span>
                      ) : 
                       Array.isArray(row[col]) ? (
                         <span className="text-indigo-400 font-bold">{row[col].length} ITEMS</span>
                       ) : 
                       <span className="truncate max-w-[150px] inline-block">{String(row[col])}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tableData.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
             <i className="fa-solid fa-database text-5xl text-slate-800"></i>
             <p className="font-black uppercase tracking-[0.3em] text-slate-600 italic">Database is Empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseManager;
