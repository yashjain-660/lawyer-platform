import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/lib/auth';

// Paths that require authentication
const protectedPaths = ['/app/', '/dashboard/', '/api/protected/'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if this is a protected path
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Get token from cookie or header
  const token = 
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    // Redirect to login if no token and accessing protected route
    if (pathname.startsWith('/app/') || pathname.startsWith('/dashboard/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json(
      { error: 'Unauthorized: No token provided' },
      { status: 401 }
    );
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    // Redirect to login if token is invalid
    if (pathname.startsWith('/app/') || pathname.startsWith('/dashboard/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token' },
      { status: 401 }
    );
  }

  // Add user info to response headers for downstream handlers
  const response = NextResponse.next();
  response.headers.set('x-user-id', payload.id);
  response.headers.set('x-user-email', payload.email);
  response.headers.set('x-user-type', payload.userType);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
