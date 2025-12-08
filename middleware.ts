// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // We removed the database check here because Mongoose cannot run in Edge Middleware.
  // The maintenance check is now handled in src/app/layout.tsx (Server Component).
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};