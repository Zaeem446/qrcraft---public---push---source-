import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/admin(.*)']);

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key'
);

// Check custom JWT session
async function hasCustomSession(req: Request): Promise<boolean> {
  try {
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) return false;

    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [key, ...val] = c.trim().split('=');
        return [key, val.join('=')];
      })
    );

    const token = cookies['session-token'];
    if (!token) return false;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return !!payload.userId;
  } catch {
    return false;
  }
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Check Clerk session first
    const { userId: clerkUserId } = await auth();

    if (clerkUserId) {
      // User is logged in via Clerk, allow access
      return NextResponse.next();
    }

    // Check custom JWT session
    const hasCustomAuth = await hasCustomSession(req);

    if (hasCustomAuth) {
      // User is logged in via custom auth, allow access
      return NextResponse.next();
    }

    // No session found, redirect to login
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
