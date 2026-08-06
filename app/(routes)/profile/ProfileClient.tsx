"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, LogOut, Loader2, Save, ShieldAlert } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { signOut } from "@/lib/auth-client";

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface ProfileClientProps {
  user: ProfileUser;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // User initial for avatar fallback
  const userInitial = user.name
    ? user.name.charAt(0).toUpperCase()
    : user.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  const isNameChanged = name.trim() !== user.name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.add({
        title: "Validation Error",
        description: "Full Name cannot be empty.",
        type: "warning",
      });
      return;
    }

    if (!isNameChanged) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await updateUserProfile({ name });

      if (!res.success) {
        toast.add({
          title: "Update Failed",
          description: res.error || "Failed to update profile.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Profile Updated",
        description: res.message || "Your profile has been saved successfully.",
        type: "success",
      });
      router.refresh();
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.add({
        title: "System Error",
        description: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
      toast.add({
        title: "Signed Out",
        description: "You have been logged out of your account.",
        type: "info",
      });
      router.push("/");
      router.refresh();
    } catch (err: any) {
      console.error("Sign out error:", err);
      toast.add({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        type: "error",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-2 pb-12 px-4">
      {/* Page Title */}
      <div className="space-y-1 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold font-secondary bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
          Account Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details and account settings.
        </p>
      </div>

      {/* CARD 1: Profile Details & Edit Form */}
      <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl">
        <CardHeader className="flex flex-col items-center justify-center text-center pt-8 pb-6 border-b border-white/5">
          <Avatar className="w-24 h-24 border-2 border-violet-500/40 shadow-lg shadow-violet-500/20 mb-3">
            {user.image && <AvatarImage src={user.image} alt={user.name || "User Avatar"} />}
            <AvatarFallback className="text-2xl font-bold bg-linear-to-br from-violet-600 to-purple-700 text-white">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-semibold text-foreground">
            {user.name || "User"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {user.email}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-6">
            {/* Field 1: Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2 text-foreground">
                <User className="w-4 h-4 text-violet-400" />
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                disabled={isSubmitting}
                className="h-10 bg-white/5 border-white/10 focus:border-violet-500/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Field 2: Email Address (Disabled / Read-only) */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-foreground">
                <Mail className="w-4 h-4 text-violet-400" />
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                readOnly
                className="h-10 bg-white/5 border-white/5 text-muted-foreground cursor-not-allowed opacity-75"
              />
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed directly for security reasons.
              </p>
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-6">
            <Button
              type="submit"
              disabled={isSubmitting || !isNameChanged || !name.trim()}
              className="w-full h-10 bg-linear-to-r from-violet-600 to-purple-600 text-white font-medium rounded-lg hover:from-violet-500 hover:to-purple-500 hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* CARD 2: Danger Zone (Sign Out) */}
      <Card className="border border-red-500/20 bg-red-950/10 backdrop-blur-xl shadow-lg">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Sign Out
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Log out of your account on this device.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-2 pb-5">
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full md:w-auto h-9 px-4 bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/30 font-medium rounded-lg transition-all cursor-pointer"
          >
            {isSigningOut ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing Out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
