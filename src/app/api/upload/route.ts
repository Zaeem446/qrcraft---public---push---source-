import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const ALLOWED_TYPES = new Set([
  // Images
  'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml',
  'image/webp', 'image/bmp', 'image/tiff', 'image/heic', 'image/heif',
  'image/avif', 'image/x-icon', 'image/vnd.microsoft.icon',
  // PDF
  'application/pdf',
  // Audio
  'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/wav', 'audio/wave',
  'audio/x-wav', 'audio/ogg', 'audio/webm', 'audio/aac', 'audio/flac',
  'audio/x-m4a',
  // Video
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
  'video/x-matroska', 'video/ogg', 'video/3gpp', 'video/avi',
]);

// Also allow by file extension as a fallback (some browsers send wrong MIME)
const ALLOWED_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'tiff', 'heic', 'heif',
  'avif', 'ico', 'pdf',
  'mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma', 'webm',
  'mp4', 'mov', 'avi', 'mkv', 'wmv', '3gp', 'ogv',
]);

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized — please log in first' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const typeAllowed = ALLOWED_TYPES.has(file.type);
    const extAllowed = ALLOWED_EXTENSIONS.has(ext);

    if (!typeAllowed && !extAllowed) {
      return NextResponse.json(
        { error: `File type not allowed: ${file.type || ext}` },
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeExt = ext || 'bin';
    const fileName = `${nanoid(16)}.${safeExt}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${fileName}`;
    return NextResponse.json({ url, fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
