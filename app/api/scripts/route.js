import { NextResponse } from 'next/server';

export async function GET() {
  const CLOUDFLARE_URL = 'http://autotouch.smartgram.jp'; 
  try {
    const res = await fetch(`${CLOUDFLARE_URL}/scripts/`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 0 }
    });
    
    // ボディが空の場合やパースエラーの対策
    const text = await res.text();
    if (!text) return NextResponse.json([]);
    
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('JSON Parse Error:', text);
      return NextResponse.json({ error: 'Invalid response from iPhone' }, { status: 500 });
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to connect via Cloudflare' }, { status: 500 });
  }
}
