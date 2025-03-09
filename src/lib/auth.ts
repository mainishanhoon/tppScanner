import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        }

        if (
          credentials.email === String(process.env.ADMIN_EMAIL) &&
          credentials.password === String(process.env.ADMIN_PASSWORD)
        ) {
          return { id: '1', name: 'Admin User', email: credentials.email };
        }

        throw new Error('Invalid credentials');
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: undefined,
      },
    },
  },
});
