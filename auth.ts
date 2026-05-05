import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { verifyAuthUser } from './lib/authUserRepository';

const demoEmail = process.env.AUTH_DEMO_EMAIL;
const demoPassword = process.env.AUTH_DEMO_PASSWORD;

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (typeof credentials?.email !== 'string' || typeof credentials?.password !== 'string') {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        if (!demoEmail || !demoPassword) {
          const user = await verifyAuthUser({ email, password });
          if (!user) {
            return null;
          }

          return {
            id: user.id,
            name: user.displayName ?? 'EmotionLens User',
            email: user.email,
          };
        }

        if (email === demoEmail && password === demoPassword) {
          return {
            id: 'demo-user',
            name: 'Demo User',
            email: demoEmail,
          };
        }

        const user = await verifyAuthUser({ email, password });
        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.displayName ?? 'EmotionLens User',
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
      }

      return session;
    },
  },
});