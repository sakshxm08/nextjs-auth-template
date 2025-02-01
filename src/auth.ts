import NextAuth, { CredentialsSignin, NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github, { GitHubProfile } from "next-auth/providers/github";
import Google, { GoogleProfile } from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { signinSchema } from "./schemas/signinSchema";
import { Provider, ProviderProfile } from "@/models/user.model";

class InvalidIdentifierError extends CredentialsSignin {
  code = "No user found with this email or username";
}
class InvalidPasswordError extends CredentialsSignin {
  code = "Incorrect password";
}
class UnverifiedError extends CredentialsSignin {
  code = "Please verify your email before signing in";
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // const { default: dbConnect } = await import("@/lib/dbConnect");
        const { default: UserModel } = await import("@/models/user.model");
        // await dbConnect();
        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });
        await signinSchema.parseAsync(credentials);

        if (!user || !user?.providers.includes("credentials")) {
          throw new InvalidIdentifierError();
        }
        if (!user.providerAccounts?.credentials?.isVerified) {
          throw new UnverifiedError();
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );
        if (!isPasswordCorrect) {
          throw new InvalidPasswordError();
        }
        return {
          _id: user._id,
          email: user.email,
          name: user.name,
          image: user.image,
          providerAccounts: user.providerAccounts,
          username: user.username,
          providers: user.providers,
        } as User;
      },
    }),
    Github,
    Google,
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const { default: UserModel } = await import("@/models/user.model");
      try {
        if (!account?.provider) {
          return false;
        }
        if (account?.provider === "credentials") {
          return true;
        }
        if (!user.email) {
          return false;
        }

        const provider = account.provider as Provider;

        const existingUser = await UserModel.findOne({
          email: user.email,
        });

        const existingUserByThisProvider =
          existingUser?.providers.includes(provider);

        if (existingUser) {
          // Ensure providerAccounts exists as an object
          if (!existingUser.providerAccounts) {
            existingUser.providerAccounts = {};
          }
          if (!existingUserByThisProvider) {
            existingUser.providers.push(provider);
            existingUser.providerAccounts[provider] = {
              providerAccountId: account.providerAccountId,
              profile: profile as ProviderProfile,
              lastUsed: new Date(),
              isVerified: true,
            };
            existingUser.lastLogin = new Date();
            existingUser.markModified(`providerAccounts.${provider}`);

            await existingUser.save();
          }
          user.image = existingUser.image;
          user.username = existingUser.username;
          user.providers = existingUser.providers;
          user.providerAccounts = existingUser.providerAccounts;
          user._id = existingUser._id?.toString();
        } else {
          const provider = account?.provider;

          const newUser = new UserModel({
            name: profile?.name,
            email: profile?.email,
            image: user?.image,
            providers: [provider],
            primaryProvider: provider,
            providerAccounts: {
              [provider]: {
                providerAccountId: account.providerAccountId,
                profile: profile as GitHubProfile | GoogleProfile,
                lastUsed: new Date(),
                isVerified: true,
              },
            },
          });

          await newUser.save();
        }
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.providerAccounts = token.providerAccounts as object;
        session.user.providers = token.providers as string[];
        session.user.username = token.username as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.providerAccounts = user.providerAccounts;
        token.providers = user.providers;
        token.username = user.username;
        token.image = user.image;
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
} as const;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
