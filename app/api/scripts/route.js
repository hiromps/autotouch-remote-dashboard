import { NextResponse } from 'next/server';

export async function GET() {
  const PROXY_URL = 'https://autotouch.smartgram.jp/api/scripts'; 
  try {
    const res = await fetch(PROXY_URL, {
      next: { revalidate: 0 }
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Proxy Server Offline' }, { status: 500 });
  }
}
