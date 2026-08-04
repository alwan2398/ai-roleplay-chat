import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.BETTER_AUTH_URL ||
    "https://love-ai-demo.vercel.app",
});

export const { useSession, signIn, signUp, signOut } = authClient;
