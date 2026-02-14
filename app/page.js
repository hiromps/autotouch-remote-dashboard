"use client";
import './globals.css';
import { useState, useEffect } from 'react';
import { Play, Square, RefreshCw, Smartphone } from 'lucide-react';

export default function Dashboard() {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cloudflare Tunnel を経由して、ブラウザのHTTPS制限を回避する
  const PROXY_URL = 'https://autotouch.smartgram.jp'; 

  const fetchScripts = async () => {
    setLoading(true);
    try {
      // 僕のサーバーで動いている中継APIを叩く
      const res = await fetch(`${PROXY_URL}/api/scripts`, {
        mode: 'cors',
        cache: 'no-store'
      });
      
      const data = await res.json();
      if (Array.isArray(data)) {
        setScripts(data);
      }
    } catch (e) {
      console.error('Connection failed:', e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchScripts(); }, []);

  const playScript = async (path) => {
    // 再生リクエストも中継サーバー経由で行う（後で中継APIに機能追加するね）
    alert('再生機能は現在セットアップ中です: ' + path);
  };

  const stopScript = async () => {
    alert('停止機能は現在セットアップ中です');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-10 bg-gray-900 p-5 rounded-3xl border border-gray-800 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Smartphone className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AutoTouch Remote</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">via Cloudflare Tunnel</p>
          </div>
        </div>
        <button onClick={fetchScripts} className="p-3 hover:bg-gray-800 rounded-full transition-all active:scale-90">
          <RefreshCw className={loading ? "animate-spin text-blue-400" : "text-gray-400"} size={24} />
        </button>
      </header>

      <div className="grid gap-4">
        {scripts.length === 0 && !loading ? (
          <div className="text-center py-24 bg-gray-900/30 rounded-[2.5rem] border border-dashed border-gray-800">
            <p className="text-gray-500 mb-2 font-medium">iPhoneに接続できません</p>
            <p className="text-xs text-gray-600 px-10">Cloudflare Tunnelの状態を確認中...</p>
          </div>
        ) : (
          scripts.map((script) => (
            <div key={script.path} className="bg-gray-900/80 backdrop-blur-xl p-5 rounded-[2rem] flex justify-between items-center border border-gray-800 hover:border-blue-500/50 transition-all shadow-xl">
              <div className="overflow-hidden mr-4">
                <h3 className="font-bold text-gray-100 truncate text-lg">{script.name}</h3>
                <p className="text-[10px] text-gray-500 truncate mt-0.5 font-mono">{script.path}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => playScript(script.path)}
                  className="p-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all active:scale-90 shadow-lg shadow-blue-900/30"
                >
                  <Play size={22} fill="white" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
