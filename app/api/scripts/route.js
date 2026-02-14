import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function GET() {
  const ssh = new NodeSSH();
  
  try {
    await ssh.connect({
      host: '100.126.108.117', // iPhoneのTailscale IP
      username: 'root',
      password: '0324',
      port: 22,
      readyTimeout: 10000
    });

    const result = await ssh.execCommand('ls /var/mobile/Library/AutoTouch/Scripts/*.{lua,at}');
    
    const files = result.stdout.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const name = line.split('/').pop();
        return { name, path: line };
      });

    ssh.dispose();
    return NextResponse.json(files);
  } catch (error) {
    console.error('SSH Error:', error);
    return NextResponse.json({ error: 'Failed to connect via SSH' }, { status: 500 });
  }
}
