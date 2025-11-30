import NextAuth, { Profile, User, type Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/features/auth/schemas/login";
import bcrypt from "bcryptjs";
import { slugify } from "./helpers/slugify";
import type { JWT } from "next-auth/jwt";
import { profile } from "../features/user/profile/schema/profile";

export const { handlers, auth, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      // Authenticate using only email and password
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) throw new Error("El usuario no existe");

          const isValidPassword = bcrypt.compareSync(password, user.password!);

          if (!isValidPassword) {
            throw new Error("La contraseña no es válida");
          }

          if (user.isFirstLogin && user.emailGeneratedByAdmin) {
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
              isFirstLogin: user.isFirstLogin,
              emailGeneratedByAdmin: user.emailGeneratedByAdmin,
            };
          }

          if (user.passwordGeneratedByAdmin) {
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
              passwordGeneratedByAdmin: user.passwordGeneratedByAdmin,
            };
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.AUTH_SECRET,

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: string }).role;
        token.isFirstLogin = user.isFirstLogin;
        token.emailGeneratedByAdmin = user.emailGeneratedByAdmin;
        token.passwordGeneratedByAdmin = user.passwordGeneratedByAdmin;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isFirstLogin = token.isFirstLogin;
        session.user.emailGeneratedByAdmin = token.emailGeneratedByAdmin;
        session.user.passwordGeneratedByAdmin = token.passwordGeneratedByAdmin;
      }
      return session;
    },
    async signIn({ user, profile }: { user: User; profile: Profile }) {
      const email = user?.email;
      const googleId = profile?.sub;

      if (!email) return false;

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        if (googleId)
          await prisma.user.update({ where: { email }, data: { googleId } });
      } else {
        await prisma.user.create({
          data: {
            googleId: googleId ?? null,
            name: user.name!,
            slug: slugify(user.name!),
            email,
            photo: user.image,
          },
        });
      }
      return true;
    },
  },
});
