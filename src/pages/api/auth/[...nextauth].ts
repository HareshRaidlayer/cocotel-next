import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import { OAuth2Client } from 'google-auth-library'
import { signupUser } from '@/lib/api'

const generateRandomMobile = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({length: 10}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          scope: 'openid email profile',
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'email',
        },
      },
    }),
    CredentialsProvider({
      id: 'google-one-tap',
      name: 'Google One Tap',
      credentials: {
        credential: { label: 'Credential', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.credential) return null

        try {
          const ticket = await googleClient.verifyIdToken({
            idToken: credentials.credential,
            audience: process.env.GOOGLE_CLIENT_ID!,
          })

          const payload = ticket.getPayload()
          if (!payload) return null

          // Add user to database for Google One Tap
          try {
            await signupUser({
              name: payload.email || 'Unknown',
              legalname: payload.name || 'Unknown',
              email: payload.email || '',
              password: 'social_login',
              role: '1749109628034',
              mobile: generateRandomMobile(),
            });
          } catch (error) {
            console.log('Google One Tap signup error:', error);
          }

          return {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            image: payload.picture,
            email_verified: payload.email_verified,
          }
        } catch (error) {
          console.error('One Tap verification failed:', error)
          return null
        }
      },
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const { loginUser } = await import('@/lib/api-auth')
          const loginResult = await loginUser({
            name: credentials.email,
            password: credentials.password,
          })

          if (loginResult.success && loginResult.data) {
            const userData = loginResult.data as Record<string, unknown>
            return {
              id: (userData.id || userData._id || credentials.email) as string,
              name: (userData.name || userData.username || credentials.email) as string,
              email: credentials.email,
            }
          }
          return null
        } catch (error) {
          console.error('Credentials login failed:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'facebook' || account?.provider === 'google-one-tap') {
        try {
           const email = user.email || `${user.name?.replace(/\s+/g, '') || 'user'}@facebook.com`;
          await signupUser({
            name: email,
            legalname: user.name || 'Unknown',
            email: email,
            password: 'social_login',
            role: '1749109628034',
            mobile: generateRandomMobile(),
          });
        } catch (error) {
          console.log('User signup error:', error);
        }
      }
      return true
    },
    async session({ session }) {
      return session
    },
  },
})