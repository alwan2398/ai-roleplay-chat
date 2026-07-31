"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { DummyCharacter } from "@/constant/DummyCharacter";
import { Heart, MapPin, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CharacterItem {
  id: number;
  imageUrl: string;
  name: string;
  age: number;
  likes?: string;
  chats?: string;
  style?: string;
}

// Reusable Character Card Component built with Shadcn UI Card primitives
export function CharacterCardItem({ character }: { character: CharacterItem }) {
  return (
    <Card className="group relative w-full aspect-[3/4.4] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-violet-500 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(167,139,250,0.35)] bg-zinc-900 ring-0 p-0 gap-0">
      {/* Character Background Image */}
      <Image
        src={character.imageUrl}
        alt={character.name}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        priority={character.id <= 2}
      />

      {/* Dark Linear Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      {/* Card Content Overlay */}
      <CardContent className="absolute bottom-0 inset-x-0 p-3.5 md:p-4 z-10 flex flex-col gap-1 text-white bg-transparent border-none">
        <CardHeader className="p-0 gap-0">
          <CardTitle className="flex items-baseline gap-1.5 p-0">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {character.name}
            </span>
            <span className="text-base md:text-xl font-medium text-zinc-300">
              {character.age}
            </span>
          </CardTitle>
        </CardHeader>

        <CardFooter className="p-0 border-none bg-transparent flex items-center justify-between text-xs text-zinc-300 font-medium mt-0.5">
          {/* Location / Style */}
          <div className="hidden md:flex items-center gap-1 text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span className="truncate max-w-22.5 md:max-w-27.5">
              {character.style}
            </span>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center gap-2 md:gap-3 text-zinc-300">
            {/* Likes */}
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-zinc-300 fill-white/20" />
              <span>{character.likes}</span>
            </div>

            {/* Chats */}
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-300" />
              <span>{character.chats}</span>
            </div>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

// Skeleton Loader built using Shadcn UI Card primitives
const CardCharacterSkeleton = () => (
  <Card className="relative w-full aspect-[3/4.4] rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900/90 border border-zinc-800/60 p-3.5 md:p-4 flex flex-col justify-between ring-0">
    <div className="flex flex-col gap-1.5 items-start">
      <Skeleton className="h-5 w-12 rounded-full bg-zinc-800/80" />
      <Skeleton className="h-4 w-10 rounded-md bg-zinc-800/80" />
    </div>

    <CardContent className="p-0 flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-28 rounded-lg bg-zinc-800/80" />
        <Skeleton className="h-5 w-8 rounded-lg bg-zinc-800/80" />
      </div>
      <CardFooter className="p-0 border-none bg-transparent flex items-center justify-between">
        <Skeleton className="h-4 w-16 rounded-md bg-zinc-800/80" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-10 rounded-md bg-zinc-800/80" />
          <Skeleton className="h-4 w-12 rounded-md bg-zinc-800/80" />
        </div>
      </CardFooter>
    </CardContent>
  </Card>
);

const CardCharacter = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full my-6 select-none">
      {/* Grid: 2 columns mobile, 4 columns desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <CardCharacterSkeleton key={index} />
            ))
          : DummyCharacter.map((character) => (
              <CharacterCardItem key={character.id} character={character} />
            ))}
      </div>
    </div>
  );
};

export default CardCharacter;


