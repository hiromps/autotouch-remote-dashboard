"use client";
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
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchScripts(); }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <Smartphone className="text-blue-400" size={32} />
          <h1 className="text-2xl font-bold tracking-tight">AutoTouch Dashboard</h1>
        </div>
        <button onClick={fetchScripts} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <RefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </header>

      <main className="grid gap-4">
        {scripts.length === 0 && !loading ? (
          <p className="text-gray-500 text-center py-20">No scripts found or connection failed.</p>
        ) : (
          scripts.map((script) => (
            <div key={script.path} className="bg-gray-800 p-4 rounded-xl flex justify-between items-center hover:border-blue-500 border border-transparent transition-all">
              <div>
                <h3 className="font-medium text-lg">{script.name || script.path}</h3>
                <p className="text-sm text-gray-400">{script.path}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-green-600 hover:bg-green-500 rounded-lg"><Play size={20} /></button>
                <button className="p-3 bg-red-600 hover:bg-red-500 rounded-lg"><Square size={20} /></button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
