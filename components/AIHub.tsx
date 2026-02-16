
import React, { useState, useRef, useEffect } from 'react';
import { GameState, ChatMessage } from '../types';
import { GeminiService } from '../geminiService';

interface AIHubProps {
  gameState: GameState;
}

const AIHub: React.FC<AIHubProps> = ({ gameState }) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'forge' | 'animotion'>('chat');
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Image Forge State
  const [forgePrompt, setForgePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSize, setImageSize] = useState('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isForging, setIsForging] = useState(false);

  // Animotion State
  const [isAnimating, setIsAnimating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [animPrompt, setAnimPrompt] = useState('');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: inputMessage, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await GeminiService.chat(inputMessage, []);
      const aiMsg: ChatMessage = { role: 'model', text: response || 'Sorry, I couldn\'t process that.', timestamp: Date.now() };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleForge = async () => {
    if (!forgePrompt.trim() || isForging) return;
    setIsForging(true);
    setGeneratedImage(null);
    try {
      const url = await GeminiService.generateImage(forgePrompt, aspectRatio, imageSize);
      setGeneratedImage(url);
    } catch (err) {
      alert("Forging failed. Check your API key.");
    } finally {
      setIsForging(false);
    }
  };

  const handleAnimate = async () => {
    if (!generatedImage || isAnimating) return;
    setIsAnimating(true);
    setGeneratedVideo(null);
    try {
      const videoUrl = await GeminiService.animateImage(animPrompt, generatedImage, '16:9');
      setGeneratedVideo(videoUrl);
    } catch (err) {
      alert("Animation failed. Veo requires a valid paid API key.");
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex gap-4 p-1 bg-slate-900 rounded-2xl border border-slate-800 self-start">
        <TabButton active={activeMode === 'chat'} onClick={() => setActiveMode('chat')} icon="fa-comment-dots" label="Lore Chat" />
        <TabButton active={activeMode === 'forge'} onClick={() => setActiveMode('forge')} icon="fa-wand-magic-sparkles" label="Image Forge" />
        <TabButton active={activeMode === 'animotion'} onClick={() => setActiveMode('animotion')} icon="fa-film" label="Animotion" />
      </div>

      <div className="flex-1 min-h-0 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
        {activeMode === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
                  <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 text-2xl">
                    <i className="fa-solid fa-robot"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold medieval-font">The Ancient Archive</h3>
                    <p className="text-slate-500 text-sm mt-2">Ask me about the legends of MiMi Kingdom, item locations, or monster weaknesses.</p>
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-700 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChatSend} className="p-4 border-t border-slate-800 flex gap-2">
              <input 
                type="text" 
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Ask the chronicler..." 
                className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <button disabled={isTyping} className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center transition-colors shadow-lg disabled:opacity-50">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        )}

        {activeMode === 'forge' && (
          <div className="p-8 space-y-8 overflow-y-auto h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Aesthetic Prompt</label>
                  <textarea 
                    value={forgePrompt}
                    onChange={e => setForgePrompt(e.target.value)}
                    rows={4}
                    placeholder="E.g., A legendary dragon scale armor glowing in a dark dungeon..."
                    className="w-full bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Aspect Ratio</label>
                    <select 
                      value={aspectRatio}
                      onChange={e => setAspectRatio(e.target.value)}
                      className="w-full bg-slate-800 rounded-xl p-3 outline-none"
                    >
                      <option value="1:1">1:1 Square</option>
                      <option value="16:9">16:9 Landscape</option>
                      <option value="9:16">9:16 Portrait</option>
                      <option value="4:3">4:3 Photo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resolution</label>
                    <select 
                      value={imageSize}
                      onChange={e => setImageSize(e.target.value)}
                      className="w-full bg-slate-800 rounded-xl p-3 outline-none"
                    >
                      <option value="1K">1K Quality</option>
                      <option value="2K">2K High</option>
                      <option value="4K">4K Ultra</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleForge}
                  disabled={isForging || !forgePrompt.trim()}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
                >
                  {isForging ? <><i className="fa-solid fa-spinner animate-spin"></i> Forging Artifact...</> : <><i className="fa-solid fa-fire-sparkles"></i> Forge Image</>}
                </button>
              </div>

              <div className="aspect-square bg-slate-800 rounded-2xl flex items-center justify-center border-4 border-slate-800 shadow-inner overflow-hidden relative">
                {generatedImage ? (
                  <img src={generatedImage} alt="Generated Artifact" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-slate-600 space-y-4">
                    <i className="fa-solid fa-image text-6xl opacity-20"></i>
                    <p className="text-sm font-medium">Your creation will appear here</p>
                  </div>
                )}
                {isForging && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-4">
                       <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                       <p className="text-indigo-400 font-bold medieval-font text-lg tracking-widest animate-pulse">Summoning Reality...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeMode === 'animotion' && (
          <div className="p-8 flex flex-col items-center justify-center h-full space-y-6">
            {!generatedImage ? (
              <div className="text-center space-y-4 max-w-sm">
                 <i className="fa-solid fa-film text-6xl text-slate-800"></i>
                 <h3 className="text-xl font-bold">Forge an image first</h3>
                 <p className="text-slate-500 text-sm">To animate a scene, you must first generate an image in the Forge tab.</p>
                 <button onClick={() => setActiveMode('forge')} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm font-bold">Go to Forge</button>
              </div>
            ) : (
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
                       <img src={generatedImage} alt="Source" className="w-full h-full object-cover opacity-50 grayscale-[50%]" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Motion Prompt</label>
                       <textarea 
                          value={animPrompt}
                          onChange={e => setAnimPrompt(e.target.value)}
                          placeholder="E.g., Cinematic camera pan, dust particles floating, glowing aura..."
                          className="w-full bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                       />
                    </div>
                    <button 
                      onClick={handleAnimate}
                      disabled={isAnimating}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20"
                    >
                      {isAnimating ? <><i className="fa-solid fa-spinner animate-spin"></i> Breathing Life...</> : <><i className="fa-solid fa-play"></i> Animate Scene</>}
                    </button>
                 </div>
                 
                 <div className="aspect-video bg-slate-950 rounded-2xl flex items-center justify-center border-4 border-slate-800 shadow-2xl relative overflow-hidden">
                    {generatedVideo ? (
                      <video src={generatedVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-700 space-y-4">
                        <i className="fa-solid fa-clapperboard text-6xl opacity-10"></i>
                        <p className="text-xs">Animation output</p>
                      </div>
                    )}
                    {isAnimating && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-20">
                         <div className="text-center space-y-6 px-12">
                            <i className="fa-solid fa-wand-magic-sparkles text-4xl text-emerald-400 animate-pulse"></i>
                            <div className="space-y-2">
                              <p className="font-bold medieval-font text-emerald-400">Veo is generating your cinematic masterpiece...</p>
                              <p className="text-slate-500 text-[10px] italic">This may take up to 60 seconds. Do not close this tab.</p>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                               <div className="bg-emerald-500 h-full animate-[progress_30s_ease-in-out]"></div>
                            </div>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: string, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
      active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
    }`}
  >
    <i className={`fa-solid ${icon}`}></i>
    <span>{label}</span>
  </button>
);

export default AIHub;
