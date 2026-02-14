import { NextResponse } from 'next/server';

export async function GET() {
  // キャッシュを一切使わないように「?t=タイムスタンプ」を付与
  const PROXY_URL = `https://autotouch.smartgram.jp/api/scripts?t=${Date.now()}`; 
  
  try {
    const res = await fetch(PROXY_URL, {
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!res.ok) {
      throw new Error(`Proxy status: ${res.status}`);
    }

    const data = await res.json();
    console.log('Fetched data length:', data.length);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ error: 'Proxy Offline or Timeout' }, { status: 500 });
  }
}
