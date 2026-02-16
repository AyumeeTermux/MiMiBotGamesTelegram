
import React, { useState, useEffect, useRef } from 'react';
import { TelegramService, TelegramUpdate } from '../telegramService';
import { GeminiService } from '../geminiService';
import { GameState, Player } from '../types';
import { INITIAL_PLAYER } from '../constants';
import PixelBanner from './PixelBanner';

interface BotTerminalProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const BotTerminal: React.FC<BotTerminalProps> = ({ gameState, setGameState }) => {
  const [token, setToken] = useState(localStorage.getItem('tg_bot_token') || '');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'deploy'>('terminal');
  const [logs, setLogs] = useState<{ time: string, msg: string, type: 'in' | 'out' | 'sys' }[]>([]);
  
  const offsetRef = useRef(0);
  const runningRef = useRef(false);

  const addLog = (msg: string, type: 'in' | 'out' | 'sys' = 'sys') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ time, msg, type }, ...prev].slice(0, 50));
  };

  const handleCommand = async (update: TelegramUpdate) => {
    if (!update.message || !update.message.text) return;
    const text = update.message.text.toLowerCase();
    const chatId = update.message.chat.id;
    const userId = String(update.message.from.id);
    const username = update.message.from.username || update.message.from.first_name;

    addLog(`Pesan: ${text} dari ${username}`, 'in');

    const buttons = {
      keyboard: [
        [{ text: "👤 Profile" }, { text: "⚔️ Hunt" }],
        [{ text: "🎒 Bag" }, { text: "❤️ Heal" }],
        [{ text: "🎁 Daily" }, { text: "🎨 Forge" }]
      ],
      resize_keyboard: true
    };

    setGameState(prev => {
      let players = [...prev.player];
      let pIdx = players.findIndex(p => p.userId === userId);
      
      if (pIdx === -1) {
        players.push({ ...INITIAL_PLAYER, userId, username });
        pIdx = players.length - 1;
        TelegramService.sendMessage(token, chatId, `Selamat datang ${username}! Akun Anda telah dibuat.`, 'Markdown', buttons);
      }

      const player = players[pIdx];
      let reply = "";

      if (text.includes('profile')) {
        reply = `👤 *HERO: ${player.username}*\nLevel: ${player.level}\nCoins: ${player.coins}💰\nHP: ${player.hp}/${player.maxHp}`;
      } else if (text.includes('hunt')) {
        const win = Math.random() > 0.4;
        if (win) {
          player.xp += 20; player.coins += 10;
          reply = "⚔️ Menang! Dapat 20 XP & 10 Koin.";
        } else {
          player.hp = Math.max(0, player.hp - 10);
          reply = "💀 Kalah! HP berkurang 10.";
        }
      } else if (text.includes('forge')) {
        const prompt = text.replace('forge', '').trim() || "A fantasy hero";
        GeminiService.generateImage(prompt).then(base64 => {
          const byteString = atob(base64.split(',')[1]);
          const ia = new Uint8Array(byteString.length);
          for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
          const blob = new Blob([ia], { type: 'image/png' });
          TelegramService.sendPhoto(token, chatId, blob, `🎨 *AI Forge:* ${prompt}`);
        });
        reply = "🛠️ Menempa gambar... mohon tunggu.";
      }

      if (reply) TelegramService.sendMessage(token, chatId, reply, 'Markdown', buttons);
      return { ...prev, player: players };
    });
  };

  const startBot = async () => {
    if (!token) return alert("Masukkan Token Bot!");
    setIsRunning(true);
    runningRef.current = true;
    addLog("Bot Aktif secara lokal.", "sys");
    while (runningRef.current) {
      try {
        const updates = await TelegramService.getUpdates(token, offsetRef.current);
        for (const u of updates) {
          offsetRef.current = u.update_id + 1;
          handleCommand(u);
        }
      } catch (e) {}
      await new Promise(r => setTimeout(r, 1000));
    }
  };

  const generateServerScript = () => {
    const script = `
// MiMi RPG Standalone Server
const fetch = require('node-fetch'); // npm install node-fetch@2
const TOKEN = '${token}';
let offset = 0;
console.log('Bot sedang berjalan...');
async function run() {
  while(true) {
    try {
      const r = await fetch('https://api.telegram.org/bot' + TOKEN + '/getUpdates?offset=' + offset);
      const d = await r.json();
      if(d.ok) for(const u of d.result) {
        offset = u.update_id + 1;
        console.log('Pesan masuk:', u.message?.text);
        // Tambahkan logika game di sini
      }
    } catch(e) {}
    await new Promise(res => setTimeout(res, 1000));
  }
}
run();`;
    const blob = new Blob([script], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mimi_server_bot.js'; a.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PixelBanner type="bot" title="Bot Studio Control" subtitle="Koneksi Telegram & Panduan Permanen" />
      
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-2">Bot API Token</label>
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="password" value={token} onChange={e => {setToken(e.target.value); localStorage.setItem('tg_bot_token', e.target.value);}}
            placeholder="Masukkan Token dari @BotFather"
            className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none font-mono"
          />
          <button 
            onClick={isRunning ? () => {setIsRunning(false); runningRef.current=false;} : startBot}
            className={`px-10 py-4 rounded-2xl font-black uppercase border-b-4 transition-all ${isRunning ? 'bg-rose-600 border-rose-900' : 'bg-emerald-600 border-emerald-900'}`}
          >
            {isRunning ? 'Stop Local' : 'Run Local'}
          </button>
        </div>
      </div>

      <div className="flex gap-4 p-1 bg-slate-900 rounded-2xl border border-slate-800 w-fit">
        <button onClick={() => setActiveTab('terminal')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase ${activeTab === 'terminal' ? 'bg-indigo-600' : 'text-slate-500'}`}>Console</button>
        <button onClick={() => setActiveTab('deploy')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase ${activeTab === 'deploy' ? 'bg-indigo-600' : 'text-slate-500'}`}>Permanen 24/7</button>
      </div>

      {activeTab === 'terminal' ? (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 h-[400px] overflow-y-auto p-6 font-mono text-xs space-y-2">
          {logs.map((l, i) => (
            <div key={i} className="flex gap-4">
              <span className="text-slate-600">[{l.time}]</span>
              <span className={l.type === 'in' ? 'text-indigo-400' : 'text-emerald-400'}>{l.type.toUpperCase()}</span>
              <span className="text-slate-200">{l.msg}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-xl font-bold medieval-font text-indigo-400">JALANKAN BOT SELAMANYA</h3>
          <p className="text-slate-400 text-sm">Browser ini hanya untuk kontrol sementara. Untuk jalan 24 jam nonstop:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <h4 className="font-bold mb-2">1. Sewa VPS</h4>
              <p className="text-xs text-slate-500">Sewa server Ubuntu murah (DigitalOcean atau VPS lokal). Install Node.js.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <h4 className="font-bold mb-2">2. Jalankan PM2</h4>
              <p className="text-xs text-slate-500">Gunakan PM2 agar bot otomatis restart jika server mati.</p>
            </div>
          </div>
          <button onClick={generateServerScript} className="w-full py-4 bg-indigo-600 rounded-2xl font-bold uppercase tracking-widest shadow-xl">
            Download Script Server (.js)
          </button>
        </div>
      )}
    </div>
  );
};

export default BotTerminal;
