import { NextResponse } from 'next/server';

export async function GET() {
  const CLOUDFLARE_URL = 'https://autotouch.smartgram.jp'; 
  try {
    const res = await fetch(`${CLOUDFLARE_URL}/scripts/`, {
      headers: { 
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
      },
      next: { revalidate: 0 }
    });
    
    const text = await res.text();

    // JSONとしてパースを試みる
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) return NextResponse.json(data);
    } catch (e) {
      // JSONでなければHTMLからスクリプト名を抽出（正規表現で強引に抜く）
      const scriptMatches = text.matchAll(/<a href="([^"]+\.(lua|at))"/g);
      const scripts = Array.from(scriptMatches).map(match => ({
        name: match[1].split('/').pop(),
        path: match[1]
      }));

      if (scripts.length > 0) {
        return NextResponse.json(scripts);
      }
    }
    
    return NextResponse.json([{ name: 'Connection OK, but parser failed', path: 'Check HTML source' }]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect' }, { status: 500 });
  }
}
