"use client";
import './globals.css';
import { useState, useEffect } from 'react';
import { Play, Square, RefreshCw, Smartphone } from 'lucide-react';

export default function Dashboard() {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScripts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scripts');
      const data = await res.json();
      if (Array.isArray(data)) setScripts(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchScripts(); }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-10 bg-gray-900 p-4 rounded-2xl border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Smartphone className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AutoTouch Dash</h1>
        </div>
        <button onClick={fetchScripts} className="p-2 hover:bg-gray-800 rounded-full transition-all active:scale-95">
          <RefreshCw className={loading ? "animate-spin text-blue-400" : "text-gray-400"} size={24} />
        </button>
      </header>

      <div className="grid gap-4">
        {scripts.length === 0 && !loading ? (
          <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-dashed border-gray-800">
            <p className="text-gray-500 mb-2">iPhoneに接続できません</p>
            <p className="text-xs text-gray-600">Tailscale IP: 100.64.1.78 を確認してね</p>
          </div>
        ) : (
          scripts.map((script) => (
            <div key={script.path} className="bg-gray-900 p-5 rounded-2xl flex justify-between items-center border border-gray-800 hover:border-blue-500/50 transition-all shadow-xl">
              <div className="overflow-hidden mr-4">
                <h3 className="font-bold text-gray-100 truncate">{script.name || script.path.split('/').pop()}</h3>
                <p className="text-xs text-gray-500 truncate mt-1">{script.path}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all active:scale-90 shadow-lg shadow-blue-900/20"><Play size={20} fill="white" /></button>
                <button className="p-4 bg-gray-800 hover:bg-red-600 rounded-2xl transition-all active:scale-90 shadow-lg"><Square size={20} fill="white" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
