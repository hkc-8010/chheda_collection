import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/products',
    '/categories',
    '/auth/signin',
    '/auth/signup',
    '/api/auth',
  ];

  // Admin routes that require ADMIN role
  const adminRoutes = ['/admin'];

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/cart', '/checkout', '/orders'];

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  );

  // Check if the route is admin-only
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Allow public routes
  if (isPublicRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  // Redirect to signin if not authenticated and trying to access protected routes
  if (!session && (isProtectedRoute || isAdminRoute)) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check admin access
  if (isAdminRoute && session?.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
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
