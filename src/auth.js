import NextAuth from "next-auth"
import Auth0 from "next-auth/providers/auth0"

import { getVendorProfileByEmail, sendLogToNewRelic } from "@/app/lib/apiHelpers"
import { ERROR } from "@/app/lib/constants"


const authOptions = {
  // Configure one or more authentication providers
  secret: process.env.AUTH_SECRET,
  redirectProxyUrl: process.env.AUTH_AUTH0_REDIRECT_URL,
  trustHost: true,
  providers: [
    Auth0({
      clientId: process.env.AUTH_AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH_AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH_AUTH0_ISSUER_BASE_URL,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const response = await getVendorProfileByEmail(user?.email)

      if (!response.success) {
        sendLogToNewRelic(ERROR, `In signIn callback, unrecognized email address '${user?.email}'.`)
        return false
      }
      return true
    },
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

