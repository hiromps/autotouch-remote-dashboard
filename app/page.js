"use client";
import './globals.css';
import { useState, useEffect } from 'react';
import { Play, Square, RefreshCw, Smartphone } from 'lucide-react';

export default function Dashboard() {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const PROXY_URL = 'https://autotouch.smartgram.jp'; 

  const fetchScripts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${PROXY_URL}/api/scripts`, { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) setScripts(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchScripts(); }, []);

  const playScript = async (path) => {
    alert('再生: ' + path);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-10 bg-gray-900 p-5 rounded-3xl border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl"><Smartphone className="text-white" size={24} /></div>
          <h1 className="text-xl font-bold">AutoTouch Remote</h1>
        </div>
        <button onClick={fetchScripts} className="p-3 hover:bg-gray-800 rounded-full transition-all">
          <RefreshCw className={loading ? "animate-spin text-blue-400" : "text-gray-400"} size={24} />
        </button>
      </header>

      <div className="grid gap-3">
        {scripts.length === 0 && !loading ? (
          <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
            <p className="text-gray-500">スクリプトが見つかりません</p>
          </div>
        ) : (
          scripts.map((script) => (
            <div key={script.path} className="bg-gray-900 p-5 rounded-2xl flex justify-between items-center border border-gray-800 hover:border-blue-500/50 transition-all">
              <div className="overflow-hidden mr-4">
                <h3 className="font-bold text-gray-100 truncate">{script.name}</h3>
                <p className="text-[10px] text-gray-500 truncate mt-1">{script.path}</p>
              </div>
              <button onClick={() => playScript(script.path)} className="p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-lg active:scale-90 transition-all">
                <Play size={20} fill="white" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
