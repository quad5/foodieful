import NextAuth from "next-auth"
import Auth0 from "next-auth/providers/auth0"


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
}

export const { handlers, signIn, signOut, auth } =  NextAuth(authOptions);

