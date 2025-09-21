import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For now, we'll implement basic route protection without heavy auth imports
  // This keeps the middleware bundle size under 1MB for Vercel's free plan
  
  // Admin routes that should be protected
  const adminRoutes = ['/admin'];
  
  // Protected routes that require authentication  
  const protectedRoutes = ['/dashboard', '/cart', '/checkout', '/orders'];

  // Check if accessing admin routes
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  
  // Check if accessing protected routes
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // For admin and protected routes, we'll handle auth at the page level instead
  // This is a temporary solution to reduce middleware bundle size
  
  // Only redirect admin routes for now (most critical)
  if (isAdminRoute) {
    // Simple check - redirect to signin for admin routes
    // The actual role check will happen at the page level
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
