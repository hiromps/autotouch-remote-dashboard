import { NextResponse } from 'next/server';

export async function GET() {
  const CLOUDFLARE_URL = 'https://autotouch.smartgram.jp'; 
  try {
    const res = await fetch(`${CLOUDFLARE_URL}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 0 }
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to connect to Custom API' }, { status: 500 });
  }
}
