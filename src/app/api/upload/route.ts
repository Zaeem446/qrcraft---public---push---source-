import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'tiff', 'heic', 'heif',
  'avif', 'ico', 'pdf',
  'mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma', 'webm',
  'mp4', 'mov', 'avi', 'mkv', 'wmv', '3gp', 'ogv',
]);

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  // 1. Auth check (wrapped separately so it can't crash the whole route)
  let userId: string | undefined;
  try {
    const session = await getServerSession(authOptions);
    userId = session?.user?.id;
  } catch (authErr) {
    console.error('Upload auth error:', authErr);
    // Allow upload to proceed even if session check fails in dev
    // This prevents getServerSession crashes from blocking all uploads
  }

  if (!userId && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized — please log in first' }, { status: 401 });
  }

  // 2. Parse form data
  let file: File;
  try {
    const formData = await req.formData();
    const f = formData.get('file');
    if (!f || typeof f === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    file = f as File;
  } catch (parseErr) {
    console.error('Upload parse error:', parseErr);
    return NextResponse.json({ error: 'Could not read uploaded file' }, { status: 400 });
  }

  // 3. Validate
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: `File type ".${ext}" is not allowed` },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    const sizeMB = Math.round(file.size / 1024 / 1024);
    return NextResponse.json(
      { error: `File too large (${sizeMB}MB). Max is 50MB.` },
      { status: 400 }
    );
  }

  // 4. Write file
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const id = crypto.randomBytes(12).toString('hex');
    const fileName = `${id}.${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    await writeFile(path.join(uploadDir, fileName), buffer);

    return NextResponse.json({ url: `/uploads/${fileName}`, fileName });
  } catch (writeErr) {
    console.error('Upload write error:', writeErr);
    return NextResponse.json({ error: 'Failed to save file to disk' }, { status: 500 });
  }
}
