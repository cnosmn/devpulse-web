import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, user, profile }) {
      if (account?.provider === "github") {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
          // Backend API'sine sync isteği at
          await fetch(`${backendUrl}/v1/auth/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              githubId: account.providerAccountId,
              // @ts-expect-error: profile.login is available in Github profile
              username: profile?.login || user.name,
              email: user.email,
              avatarUrl: user.image,
              accessToken: account.access_token,
            }),
          });
        } catch (error) {
          console.error("Backend sync error:", error);
          // Login akışını bozmamak için hata fırlatmıyoruz
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-expect-error: NextAuth Session type doesn't include accessToken by default
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
