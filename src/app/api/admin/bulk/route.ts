import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin-auth';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await requireAdminUser();
    const body = await req.json();
    const { action, type, ids } = body;

    if (!action || !type || !ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    let result;

    if (type === 'users') {
      switch (action) {
        case 'disable':
          result = await prisma.user.updateMany({
            where: { id: { in: ids } },
            data: { isDisabled: true },
          });
          break;
        case 'enable':
          result = await prisma.user.updateMany({
            where: { id: { in: ids } },
            data: { isDisabled: false },
          });
          break;
        case 'expire':
          result = await prisma.user.updateMany({
            where: { id: { in: ids } },
            data: { subscriptionStatus: 'expired' },
          });
          // Also deactivate their QR codes
          await prisma.qRCode.updateMany({
            where: { userId: { in: ids } },
            data: { isActive: false },
          });
          break;
        case 'activate':
          result = await prisma.user.updateMany({
            where: { id: { in: ids } },
            data: { subscriptionStatus: 'active' },
          });
          // Also reactivate their QR codes
          await prisma.qRCode.updateMany({
            where: { userId: { in: ids } },
            data: { isActive: true },
          });
          break;
        case 'delete':
          result = await prisma.user.deleteMany({
            where: { id: { in: ids } },
          });
          break;
        default:
          return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
      }
    } else if (type === 'qrcodes') {
      switch (action) {
        case 'activate':
          result = await prisma.qRCode.updateMany({
            where: { id: { in: ids } },
            data: { isActive: true },
          });
          break;
        case 'deactivate':
          result = await prisma.qRCode.updateMany({
            where: { id: { in: ids } },
            data: { isActive: false },
          });
          break;
        case 'delete':
          result = await prisma.qRCode.deleteMany({
            where: { id: { in: ids } },
          });
          break;
        default:
          return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, affected: result.count });
  } catch (error: any) {
    console.error('Admin bulk action error:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 400 });
  }
}
