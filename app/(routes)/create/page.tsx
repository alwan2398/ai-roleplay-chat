"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageForm from "@/components/view/ImageForm";
import InputForm, { CharacterFormData } from "@/components/view/InputForm";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import { ImageKitProvider } from "@imagekit/next";
import { createPersona } from "@/lib/actions/persona.actions";
import { toast } from "@/components/ui/toast";

const urlEndpoint =
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
  process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT;

const CreateCharacterPage = () => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (formData: CharacterFormData) => {
    setErrorMsg(null);

    if (!imageUrl) {
      const errorText = "Silakan unggah foto karakter terlebih dahulu.";
      setErrorMsg(errorText);
      toast.add({
        title: "Peringatan",
        description: errorText,
        type: "warning",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await createPersona({
        imageUrl,
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        description: formData.description,
        greeting: formData.firstMessage,
      });

      if (!res.success) {
        const errorText = res.error || "Gagal membuat karakter.";
        setErrorMsg(errorText);
        toast.add({
          title: "Gagal Membuat Karakter",
          description: errorText,
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      toast.add({
        title: "Karakter Berhasil Dibuat!",
        description: "Karakter AI baru Anda telah tersimpan.",
        type: "success",
      });
      router.push("/");
    } catch (err: any) {
      console.error(err);
      const errorText = "Terjadi kesalahan sistem.";
      setErrorMsg(errorText);
      toast.add({
        title: "Kesalahan Sistem",
        description: errorText,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <section className="min-h-screen pb-12">
        <div className="max-w-2xl mx-auto">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm">
              {errorMsg}
            </div>
          )}

          <ImageForm onImageUploaded={(url) => setImageUrl(url)} />
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </section>
    </ImageKitProvider>
  );
};

export default CreateCharacterPage;
