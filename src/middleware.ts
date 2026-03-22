import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Handle root path - redirect to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}${request.nextUrl.search}`, request.url));
  }
  
  // Handle direct listing paths like /listing/1 - redirect to locale
  if (pathname.startsWith('/listing/')) {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}${pathname}${request.nextUrl.search}`, request.url));
  }
  
  // Handle direct category paths like /category/xyz - redirect to locale
  if (pathname.startsWith('/category/')) {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}${pathname}${request.nextUrl.search}`, request.url));
  }
  
  // Handle direct other paths without locale - redirect to locale
  const publicPaths = ['/login', '/register', '/favorites', '/messages', '/dashboard', '/create-listing', '/admin', '/auctions', '/investment', '/jobs', '/lands', '/equipment', '/listings'];
  for (const path of publicPaths) {
    if (pathname.startsWith(path)) {
      return NextResponse.redirect(new URL(`/${routing.defaultLocale}${pathname}${request.nextUrl.search}`, request.url));
    }
  }
  
  // Let next-intl handle the rest
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
