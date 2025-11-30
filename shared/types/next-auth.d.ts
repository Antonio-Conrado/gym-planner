import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      role?: string;
      isFirstLogin?: boolean;
      passwordGeneratedByAdmin?: boolean;
      emailGeneratedByAdmin?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    isFirstLogin?: boolean;
    passwordGeneratedByAdmin?: boolean;
    emailGeneratedByAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    role?: string;
    isFirstLogin?: boolean;
    passwordGeneratedByAdmin?: boolean;
    emailGeneratedByAdmin?: boolean;
  }
}
