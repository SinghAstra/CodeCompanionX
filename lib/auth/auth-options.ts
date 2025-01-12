import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../utils/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,

  // Use Prisma as the adapter for storing user accounts
  adapter: PrismaAdapter(prisma),

  // Configure GitHub as the authentication provider
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,

      // Custom profile data mapping
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  // Callbacks to customize session and token
  callbacks: {
    // Customize the session object
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      if (token.provider === "github" && token.accessToken) {
        session.user.accessToken = token.accessToken;
        session.user.provider = "github";
      }
      return session;
    },

    // Customize the JWT token
    async jwt({ token, account }) {
      if (account?.provider === "github") {
        token.accessToken = account.access_token;
        token.provider = "github";
      }

      return token;
    },

    // Customize the sign-in process to handle different scopes
    async signIn({ account }) {
      // You can add additional validation or logging here
      if (account?.provider === "github") {
        // Log the scopes requested during sign-in
        console.log("GitHub Sign-In Scopes:", account.scope);
        return true;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - URL:", url);
      console.log("Redirect callback - Base URL:", baseUrl);

      // Ensure URL is properly formatted
      try {
        // Handle relative URLs
        if (url.startsWith("/")) {
          const finalUrl = `${baseUrl}${url}`;
          console.log("Redirecting to:", finalUrl);
          return finalUrl;
        }

        // Handle absolute URLs
        const urlObject = new URL(url);
        if (urlObject.origin === baseUrl) {
          console.log("Redirecting to same-origin URL:", url);
          return url;
        }

        // Default fallback
        console.log("Falling back to base URL:", baseUrl);
        return baseUrl;
      } catch (error) {
        console.error("Error in redirect callback:", error);
        return baseUrl;
      }
    },
  },

  // Customize authentication pages
  pages: {
    signIn: "/auth/sign-in", // Custom sign-in page
    error: "/auth/error",
  },

  // debug: process.env.NODE_ENV === "development",
};
