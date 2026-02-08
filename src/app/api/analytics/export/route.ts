import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/clerk-auth';
import prisma from '@/lib/db';
import { getReport } from '@/lib/qrfy';

// P2: Export analytics data in CSV or XLSX format
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = (searchParams.get('format') || 'csv') as 'csv' | 'xlsx';
    const days = parseInt(searchParams.get('days') || '30');
    const type = searchParams.get('type') || 'detailed'; // detailed or totals
    const grouping = searchParams.get('grouping') || 'daily'; // daily, monthly, yearly

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get QR codes with QRFY IDs
    const qrfyQRCodes = await prisma.qRCode.findMany({
      where: { userId: user.id, qrfyId: { not: null } },
      select: { qrfyId: true, name: true, type: true },
    });
    const qrfyIds = qrfyQRCodes.map(q => q.qrfyId!);

    if (qrfyIds.length === 0) {
      // No QRFY QR codes, generate local CSV
      return generateLocalExport(user.id, startDate, format);
    }

    try {
      // Try QRFY report export
      const response = await getReport({
        qrfyIds,
        startDate: startDate.toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        format,
        type: type as 'detailed' | 'totals',
        grouping: grouping as 'daily' | 'monthly' | 'yearly',
      });

      // For non-JSON formats, QRFY returns the raw file
      if (format === 'csv' || format === 'xlsx') {
        const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const extension = format;

        // If response is a Response object, stream it through
        if (response instanceof Response) {
          const blob = await response.blob();
          return new NextResponse(blob, {
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="analytics-${new Date().toISOString().split('T')[0]}.${extension}"`,
            },
          });
        }
      }

      // Fallback: JSON response, convert to CSV
      return generateLocalExport(user.id, startDate, format);
    } catch (err) {
      console.error('QRFY export failed, using local:', err);
      return generateLocalExport(user.id, startDate, format);
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Generate local CSV export from scan data
async function generateLocalExport(userId: string, startDate: Date, format: 'csv' | 'xlsx') {
  const scans = await prisma.scan.findMany({
    where: { userId, createdAt: { gte: startDate } },
    include: {
      qrcode: {
        select: { name: true, type: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Generate CSV
  const headers = ['Date', 'Time', 'QR Code', 'Type', 'Country', 'City', 'Device', 'Browser', 'OS'];
  const rows = scans.map(scan => [
    scan.createdAt.toISOString().split('T')[0],
    scan.createdAt.toISOString().split('T')[1].split('.')[0],
    scan.qrcode.name,
    scan.qrcode.type,
    scan.country || 'Unknown',
    scan.city || 'Unknown',
    scan.device || 'Unknown',
    scan.browser || 'Unknown',
    scan.os || 'Unknown',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const contentType = format === 'csv' ? 'text/csv' : 'text/csv'; // XLSX would need a library
  return new NextResponse(csv, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="analytics-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
