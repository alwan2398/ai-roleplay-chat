"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface UpdateUserProfileInput {
  name: string;
}

export async function updateUserProfile(data: UpdateUserProfileInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: "You must be logged in to update your profile.",
      };
    }

    const trimmedName = data.name.trim();

    if (!trimmedName) {
      return {
        success: false,
        error: "Full Name cannot be empty.",
      };
    }

    if (trimmedName.length > 50) {
      return {
        success: false,
        error: "Name cannot exceed 50 characters.",
      };
    }

    // Update user record in database
    await db
      .update(user)
      .set({
        name: trimmedName,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    // Revalidate profile route to reflect updated data
    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error.message || "Failed to update profile. Please try again.",
    };
  }
}
