"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { GENDER_OPTIONS } from "@/constant";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export interface CharacterFormData {
  gender: string;
  name: string;
  age: string;
  description: string;
  firstMessage: string;
}

interface InputFormProps {
  initialData?: Partial<CharacterFormData>;
  onSubmit?: (data: CharacterFormData) => void;
  isLoading?: boolean;
  className?: string;
}

const DEFAULT_FORM_DATA: CharacterFormData = {
  gender: "male",
  name: "",
  age: "",
  description: "",
  firstMessage: "hallo, siapa kamu?",
};

const INPUT_BASE_CLASSES =
  "w-full p-4 bg-[#1c1c1e] border-none text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200";

const FormLabel = ({
  label,
  required = true,
}: {
  label: string;
  required?: boolean;
}) => (
  <label className="block text-md font-semibold uppercase tracking-wider mb-2.5 text-white select-none">
    {label}
    {required && <span className="text-pink-500 font-bold"> *</span>}
  </label>
);

const InputForm: React.FC<InputFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  className,
}) => {
  const [formData, setFormData] = useState<CharacterFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (genderValue: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: genderValue,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("mb-6", className)}>
      {/* Jenis Kelamin */}
      <div>
        <FormLabel label="Jenis Kelamin" />
        <div className="flex gap-1 p-1 rounded-xl bg-[#1c1c1e]">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleGenderChange(option.value)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                formData.gender === option.value
                  ? "bg-[#333336] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nama Karakter & Usia Karakter side-by-side */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel label="Nama Karakter" />
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={cn(INPUT_BASE_CLASSES, "h-10 rounded-lg")}
            placeholder="Masukkan nama karakter"
            required
          />
        </div>

        <div>
          <FormLabel label="Usia Karakter" />
          <Input
            name="age"
            type="number"
            min="1"
            max="9999"
            value={formData.age}
            onChange={handleChange}
            className={cn(INPUT_BASE_CLASSES, "h-10 rounded-lg")}
            placeholder="Masukkan usia karakter"
            required
          />
        </div>
      </div>

      {/* Deskripsi Karakter */}
      <div className="mt-5">
        <FormLabel label="Deskripsi Karakter" />
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={cn(
            INPUT_BASE_CLASSES,
            "h-32 rounded-lg overflow-hidden resize-none"
          )}
          placeholder="Masukkan deskripsi karakter"
          required
        />
      </div>

      {/* Pesan Pertama */}
      <div className="mt-5">
        <FormLabel label="Pesan pertama" />
        <Textarea
          name="firstMessage"
          value={formData.firstMessage}
          onChange={handleChange}
          className={cn(
            INPUT_BASE_CLASSES,
            "h-32 rounded-lg overflow-hidden resize-none"
          )}
          placeholder="hallo, siapa kamu?"
          required
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className="w-full mt-5 py-2.5 px-5 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-full transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-sm font-medium">
          {isLoading ? "Memproses..." : "Buat Karakter"}
        </span>
      </Button>
    </form>
  );
};

export default InputForm;

