"use client";
import './globals.css';
import { useState, useEffect } from 'react';
import { Play, Square, RefreshCw, Smartphone } from 'lucide-react';

export default function Dashboard() {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const IPHONE_IP = '100.64.1.78'; // hirompsさんのiPhone IP

  const fetchScripts = async () => {
    setLoading(true);
    try {
      // ブラウザから直接iPhoneのAutoTouch APIを叩く (d.autotouch.netと同じ方式)
      const res = await fetch(`http://${IPHONE_IP}:8080/scripts/`, {
        mode: 'cors',
      });
      
      // AutoTouchのAPIがHTMLを返す場合は、その中からスクリプト名を抽出
      const text = await res.text();
      const scriptMatches = text.matchAll(/<a href="([^"]+\.(lua|at))"/g);
      const list = Array.from(scriptMatches).map(match => ({
        name: match[1].split('/').pop(),
        path: match[1]
      }));

      if (list.length > 0) {
        setScripts(list);
      } else {
        // もしJSONで返ってくる場合の予備
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) setScripts(data);
        } catch(e) {}
      }
    } catch (e) {
      console.error('Connection failed:', e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchScripts(); }, []);

  const playScript = async (path) => {
    // 再生用API (例: /control/start)
    try {
      await fetch(`http://${IPHONE_IP}:8080/control/start?path=${encodeURIComponent(path)}`, { mode: 'no-cors' });
      alert('再生開始: ' + path);
    } catch (e) { console.error(e); }
  };

  const stopScript = async () => {
    try {
      await fetch(`http://${IPHONE_IP}:8080/control/stop`, { mode: 'no-cors' });
      alert('停止しました');
    } catch (e) { console.error(e); }
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
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{IPHONE_IP}</p>
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
            <p className="text-xs text-gray-600 px-10">ブラウザを使っているデバイス（スマホ/PC）を、Tailscaleに接続してからリロードしてね。</p>
          </div>
        ) : (
          scripts.map((script) => (
            <div key={script.path} className="bg-gray-900/80 backdrop-blur-xl p-5 rounded-[2rem] flex justify-between items-center border border-gray-800 hover:border-blue-500/50 transition-all shadow-xl group">
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

      <footer className="fixed bottom-8 left-0 right-0 px-6">
        <button 
          onClick={stopScript}
          className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-2xl shadow-red-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Square size={20} fill="white" /> 全スクリプト停止
        </button>
      </footer>
    </div>
  );
}
