"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { ImagePlus, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { upload } from "@imagekit/next";
import { cn } from "@/lib/utils";

interface ImageFormProps {
  onImageUploaded?: (url: string | null) => void;
  className?: string;
}

const ImageForm: React.FC<ImageFormProps> = ({
  onImageUploaded,
  className,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Format file harus berupa gambar.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Fetch authentication parameters from backend API
      const authRes = await fetch("/api/imagekit/auth");
      if (!authRes.ok) {
        throw new Error("Gagal mengambil autentikasi ImageKit.");
      }
      const authData = await authRes.json();

      // 2. Perform direct upload to ImageKit using @imagekit/next SDK
      const publicKey =
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
        process.env.NEXT_PUBLIC_IMAGEKIT;

      if (!publicKey) {
        throw new Error("NEXT_PUBLIC_IMAGEKIT public key is missing.");
      }

      const uploadRes = await upload({
        file,
        fileName: file.name,
        publicKey,
        signature: authData.signature,
        token: authData.token,
        expire: authData.expire,
      });

      if (uploadRes && uploadRes.url) {
        setPreviewUrl(uploadRes.url);
        if (onImageUploaded) {
          onImageUploaded(uploadRes.url);
        }
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Gagal mengunggah gambar. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageUploaded) {
      onImageUploaded(null);
    }
  };

  return (
    <div className={cn("w-full mb-6", className)}>
      <label className="block text-white text-base md:text-lg font-bold mb-3 select-none">
        Photo karakter <span className="text-pink-500 font-bold">*</span>
      </label>

      {/* Hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/*"
        className="hidden"
      />

      {!previewUrl ? (
        <div
          onClick={triggerFileInput}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileSelect(e.dataTransfer.files[0]);
            }
          }}
          className={cn(
            "w-full h-56 md:h-64 rounded-2xl border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group select-none",
            isDragging
              ? "border-purple-500 bg-purple-950/20"
              : "border-zinc-800 bg-[#16161a] hover:border-zinc-700 hover:bg-[#1c1c22]"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <span className="text-zinc-400 text-sm font-medium">
                Mengunggah ke ImageKit...
              </span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25252c] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200 shadow-inner">
                <ImagePlus className="w-6 h-6 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
              </div>
              <span className="text-zinc-400 text-sm md:text-base font-medium group-hover:text-zinc-300 transition-colors">
                Unggah dari album
              </span>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center w-full border-zinc-800 bg-[#16161a] rounded-2xl p-3">
          <div className="relative h-56 md:h-64 aspect-9/16 rounded-2xl overflow-hidden border border-purple-500/30 bg-zinc-950 shadow-2xl group">
            <img
              src={previewUrl}
              alt="Pratinjau Karakter"
              className="w-full h-full object-cover rounded-2xl"
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 p-3">
              <button
                type="button"
                onClick={triggerFileInput}
                className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Ganti
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="w-full py-2 px-3 rounded-lg bg-red-500/80 hover:bg-red-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
