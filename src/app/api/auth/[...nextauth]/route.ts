import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid profile email https://www.googleapis.com/auth/gmail.readonly',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn() {
      // Always allow sign-in. Profile creation happens client-side
      // after Firebase Auth is established (see data-context.tsx).
      return true;
    },
    async jwt({ token, user, account }) {
      // On initial sign-in, capture the Google access_token
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (user?.email) {
        token.email = user.email;
      }
      if (user?.name) {
        token.name = user.name;
      }
      if (user?.image) {
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the access token and user ID to the client
      if (session.user) {
        (session.user as { id?: string }).id = token.email as string;
      }
      (session as { accessToken?: string }).accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
