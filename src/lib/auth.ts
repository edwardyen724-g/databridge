import { NextAuthOptions, Session } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { NextApiRequest } from "next";
import { ApiRoute } from "src/types/api";

interface AuthedRequest extends NextApiRequest {
  user?: Session["user"];
}

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.NEXT_PUBLIC_AUTH0_ISSUER as string,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: null // Will disable the new account creation screen
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};