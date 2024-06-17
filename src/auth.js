import NextAuth from "next-auth"
import Auth0 from "next-auth/providers/auth0"


const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Auth0({
      clientId: process.env.AUTH_AUTH0_ID,
      clientSecret: process.env.AUTH_AUTH0_SECRET,
      issuer: process.env.AUTH_AUTH0_ISSUER_BASE_URL,
      redirectProxyUrl: process.env.AUTH_AUTH0_REDIRECT_URL,
    }),
  ],
}

export const { handlers, signIn, signOut, auth } =  NextAuth(authOptions);

