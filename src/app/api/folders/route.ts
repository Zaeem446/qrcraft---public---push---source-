import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import prisma from '@/lib/db';

// GET /api/folders - List all folders for current user
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const folders = await prisma.folder.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { qrcodes: true },
        },
      },
    });

    return NextResponse.json(
      folders.map((folder) => ({
        ...folder,
        qrCount: folder._count.qrcodes,
        _count: undefined,
      }))
    );
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/folders - Create a new folder
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, color } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check for duplicate folder name
    const existing = await prisma.folder.findFirst({
      where: { userId: user.id, name: trimmedName },
    });
    if (existing) {
      return NextResponse.json({ error: 'A folder with this name already exists' }, { status: 409 });
    }

    const folder = await prisma.folder.create({
      data: {
        userId: user.id,
        name: trimmedName,
        color: color || '#7C3AED',
      },
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
