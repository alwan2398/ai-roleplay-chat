"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { personas } from "@/lib/db/schema";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface CreatePersonaInput {
  imageUrl: string;
  name: string;
  age: number;
  gender: string;
  description: string;
  backstory: string;
  greeting: string;
}

export async function createPersona(data: CreatePersonaInput) {
  try {
    // 1. Verify user session via Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: "Anda harus login terlebih dahulu untuk membuat karakter.",
      };
    }

    // 2. Validate input fields
    if (!data.imageUrl) {
      return { success: false, error: "Foto karakter wajib diunggah." };
    }
    if (
      !data.name ||
      !data.age ||
      !data.gender ||
      !data.description ||
      !data.backstory ||
      !data.greeting
    ) {
      return { success: false, error: "Semua kolom input wajib diisi." };
    }

    // 3. Insert new persona record into NeonDB via Drizzle ORM
    const [newPersona] = await db
      .insert(personas)
      .values({
        creatorId: session.user.id,
        imageUrl: data.imageUrl,
        name: data.name,
        age: Number(data.age),
        gender: data.gender,
        description: data.description,
        backstory: data.backstory,
        greeting: data.greeting,
      })
      .returning();

    // 4. Revalidate cache so the new character appears instantly on Explore / Home pages
    revalidatePath("/explore");
    revalidatePath("/");

    return {
      success: true,
      personaId: newPersona.id,
      data: newPersona,
    };
  } catch (error: any) {
    console.error("Error creating persona:", error);
    return {
      success: false,
      error: error.message || "Gagal membuat karakter. Silakan coba lagi.",
    };
  }
}
