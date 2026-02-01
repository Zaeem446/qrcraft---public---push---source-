import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }

      // Check trial expiration
      if (token.subscriptionStatus !== 'active' && token.trialEndsAt) {
        const trialEnd = new Date(token.trialEndsAt);
        if (trialEnd < new Date() && token.plan === 'free') {
          // Allow access to settings and create page for upgrade
          if (!pathname.includes('/settings') && !pathname.includes('/pricing')) {
            return NextResponse.redirect(new URL('/pricing', req.url));
          }
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*'],
};
