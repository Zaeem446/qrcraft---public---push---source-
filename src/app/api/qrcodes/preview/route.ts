import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createStaticQRImage } from '@/lib/qrfy';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, content, design } = body;

    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }

    const imageBuffer = await createStaticQRImage(
      type,
      content || {},
      design || {},
      'png'
    );

    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=60, s-maxage=120',
      },
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
  }
}
