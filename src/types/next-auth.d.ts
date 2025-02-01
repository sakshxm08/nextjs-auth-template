import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string | null;
    email: string | null;
    name?: string | null;
    username?: string | null;
    image?: string | null;
    providers?: string[];
    providerAccounts?: object;
  }
  interface Session {
    user: {
      _id?: string | null;
      email: string | null;
      name?: string | null;
      username?: string | null;
      image?: string | null;
      providers?: string[];
      providerAccounts?: object;
    } & DefaultSession["user"];
  }
  interface JWT {
    _id?: string | null;
    email: string | null;
    name?: string | null;
    username?: string | null;
    image?: string | null;
    providers?: string[];
    providerAccounts?: object;
  }
}
