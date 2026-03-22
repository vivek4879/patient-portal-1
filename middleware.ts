import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'super-secret-key-for-development-only'
)

export async function middleware(request: NextRequest) {
  // Only intercept /portal and arbitrary sub-paths
  if (request.nextUrl.pathname.startsWith('/portal')) {
    const sessionCookie = request.cookies.get('session')

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
    }

    try {
      // Extremely fast cryptographic verification native to the Edge engine
      const { payload } = await jose.jwtVerify(sessionCookie.value, secret, {
        algorithms: ['HS256']
      })
      if (!payload.userId) {
        throw new Error("Invalid payload payload")
      }
    } catch (err) {
      // Strip invalid malformed keys and reject immediately
      const response = NextResponse.redirect(new URL('/?error=unauthorized', request.url))
      response.cookies.delete('session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/portal/:path*']
}
