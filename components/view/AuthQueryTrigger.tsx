"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthModal } from "@/context/AuthModalContext";

export default function AuthQueryTrigger() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    if (searchParams.get("showLogin") === "true") {
      openAuthModal("signin");
      // Clean up the query parameter from URL so the user doesn't get stuck in a loop
      router.replace("/");
    }
  }, [searchParams, openAuthModal, router]);

  return null;
}
