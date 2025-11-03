import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/features/auth/schemas/login";
import bcrypt from "bcrypt";
import { slugify } from "./helpers/slugify";

export const { handlers, auth, signOut } = NextAuth({
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ user, profile }) {
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
