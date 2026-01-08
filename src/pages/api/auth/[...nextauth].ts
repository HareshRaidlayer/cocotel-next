import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import { OAuth2Client } from 'google-auth-library'
import { signupUser } from '@/lib/api'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", 
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
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
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'facebook' || account?.provider === 'google-one-tap') {
        try {
          await signupUser({
            name: user.name || 'Unknown',
            legalname: user.name || 'Unknown',
            email: user.email || '',
            password: 'social_login',
            role: '1749109628034',
            mobile: '',
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