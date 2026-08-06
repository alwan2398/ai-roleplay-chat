import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "Profile | AI Roleplay",
  description: "Manage your profile details and account settings.",
};

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/");
  }

  return <ProfileClient user={session.user} />;
};

export default ProfilePage;
