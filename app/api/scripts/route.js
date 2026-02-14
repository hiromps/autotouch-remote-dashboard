import { NextResponse } from 'next/server';

export async function GET() {
  // HTTPSを使い、ブラウザのUser-Agentを偽装する
  const CLOUDFLARE_URL = 'https://autotouch.smartgram.jp'; 
  try {
    const res = await fetch(`${CLOUDFLARE_URL}/scripts/`, {
      headers: { 
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
      },
      next: { revalidate: 0 }
    });
    
    const text = await res.text();
    console.log('Response from iPhone:', text);

    // AutoTouchはJSONを直接返す場合と、HTMLを返す場合がある
    // JSONとしてパースを試みる
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (e) {
      // もしHTMLが返ってきた場合、そこからスクリプト名を抽出する処理（簡易版）
      return NextResponse.json([{ name: 'Connection OK but no JSON', path: 'Check iPhone logs' }]);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect via HTTPS' }, { status: 500 });
  }
}
