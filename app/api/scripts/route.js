import { NextResponse } from 'next/server';

export async function GET() {
  const IPHONE_IP = '100.64.1.78'; // hirompsさんのiPhone Tailscale IP
  try {
    const res = await fetch(`http://${IPHONE_IP}:8080/scripts/`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 0 }
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect to iPhone' }, { status: 500 });
  }
}
