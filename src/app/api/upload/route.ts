import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Force Node.js runtime (not Edge) so fs operations work
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'tiff', 'heic', 'heif',
  'avif', 'ico', 'pdf',
  'mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma', 'webm',
  'mp4', 'mov', 'avi', 'mkv', 'wmv', '3gp', 'ogv',
]);

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

function randomId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 24; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export async function POST(req: NextRequest) {
  // 1. Parse form data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (err: any) {
    console.error('[upload] formData parse error:', err?.message || err);
    return NextResponse.json({ error: 'Could not parse upload. Try a smaller file.' }, { status: 400 });
  }

  const f = formData.get('file');
  if (!f || typeof f === 'string') {
    return NextResponse.json({ error: 'No file found in request' }, { status: 400 });
  }

  const file = f as File;
  const originalName = file.name || 'unnamed';
  const ext = (originalName.split('.').pop() || '').toLowerCase();

  // 2. Validate extension
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: `File type ".${ext || '?'}" is not supported` },
      { status: 400 }
    );
  }

  // 3. Validate size
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File too large (${Math.round(file.size / 1024 / 1024)}MB). Max 50MB.` },
      { status: 400 }
    );
  }

  // 4. Read bytes
  let buffer: Buffer;
  try {
    const arrayBuf = await file.arrayBuffer();
    buffer = Buffer.from(new Uint8Array(arrayBuf));
  } catch (err: any) {
    console.error('[upload] arrayBuffer error:', err?.message || err);
    return NextResponse.json({ error: 'Could not read file data' }, { status: 400 });
  }

  // 5. Write to disk
  try {
    const fileName = `${randomId()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);

    return NextResponse.json({ url: `/uploads/${fileName}`, fileName });
  } catch (err: any) {
    console.error('[upload] disk write error:', err?.message || err);
    return NextResponse.json(
      { error: `Could not save file: ${err?.code || err?.message || 'unknown error'}` },
      { status: 500 }
    );
  }
}
