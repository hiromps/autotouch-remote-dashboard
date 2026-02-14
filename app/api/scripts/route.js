import { NextResponse } from 'next/server';

export async function GET() {
  // iPhoneへ直接ではなく、OpenClawの中継サーバー(9999)を通す
  // hiropi4さんのサーバーIPを指定
  const PROXY_IP = '100.86.154.59'; 
  try {
    const res = await fetch(`http://${PROXY_IP}:9999/scripts/`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 0 }
    });
    // ボディが空の場合の対策
    const text = await res.text();
    if (!text) return NextResponse.json([]);
    
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to connect via Proxy' }, { status: 500 });
  }
}
