"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, Plus, Heart } from "lucide-react";
import { Persona } from "@/lib/db/queries/personas";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { useAuthModal } from "@/context/AuthModalContext";
import { useOptimistic, useTransition } from "react";
import { toggleFavoriteAction } from "@/lib/actions/favorite.actions";

interface CharacterCardItemProps {
  character: Persona;
  priority?: boolean;
  isFavorited?: boolean;
  onFavoriteToggle?: (personaId: string, newIsFavorited: boolean) => void;
}

// Reusable Character Card Component built with Shadcn UI Card primitives & Drizzle Persona Schema
export function CharacterCardItem({
  character,
  priority = false,
  isFavorited = false,
  onFavoriteToggle,
}: CharacterCardItemProps) {
  const { data: session } = useSession();
  const { openAuthModal } = useAuthModal();
  const [isPending, startTransition] = useTransition();

  const [optimisticIsFavorited, setOptimisticIsFavorited] = useOptimistic(
    isFavorited,
    (_current, nextState: boolean) => nextState
  );

  const handleCardClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      openAuthModal("signin");
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      openAuthModal("signin");
      return;
    }

    const nextState = !optimisticIsFavorited;
    startTransition(async () => {
      setOptimisticIsFavorited(nextState);
      if (onFavoriteToggle) {
        onFavoriteToggle(character.id, nextState);
      }
      const res = await toggleFavoriteAction(character.id);
      if (!res.success) {
        setOptimisticIsFavorited(optimisticIsFavorited);
      }
    });
  };

  return (
    <Link
      href={`/chat/${character.id}`}
      onClick={handleCardClick}
      className="block group rounded-2xl md:rounded-3xl"
    >
      <Card className="group relative w-full aspect-[3/4.4] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-violet-500 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(167,139,250,0.35)] bg-zinc-900 ring-0 p-0 gap-0">
        {/* Character Background Image */}
        <Image
          src={character.imageUrl}
          alt={character.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />

        {/* Dark Linear Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        {/* Top Header Overlay: Gender Tag + Heart Button */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
          {/* Gender Tag / Badge */}
          <span className="px-2.5 py-1 text-[10px] md:text-xs font-semibold rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-violet-300 capitalize tracking-wide">
            {character.gender}
          </span>

          {/* Heart Icon Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            disabled={isPending}
            title={optimisticIsFavorited ? "Hapus dari Favorit" : "Tambah ke Favorit"}
            className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:border-white/20 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group/heart focus:outline-none"
          >
            <Heart
              className={`w-4 h-4 md:w-4.5 md:h-4.5 transition-colors ${
                optimisticIsFavorited
                  ? "fill-pink-500 text-pink-500"
                  : "text-white/80 group-hover/heart:text-white"
              }`}
            />
          </button>
        </div>

        {/* Card Content Overlay */}
        <CardContent className="absolute bottom-0 inset-x-0 p-3.5 md:p-4 z-10 flex flex-col gap-1 text-white bg-transparent border-none">
          <CardHeader className="p-0 gap-0">
            <CardTitle className="flex items-baseline gap-1.5 p-0">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-violet-300 transition-colors">
                {character.name}
              </span>
              <span className="text-base md:text-xl font-medium text-zinc-300">
                {character.age}
              </span>
            </CardTitle>
          </CardHeader>

          <CardFooter className="p-0 border-none bg-transparent mt-0.5">
            <p className="text-xs text-zinc-300 font-normal line-clamp-2 w-full leading-relaxed">
              {character.description}
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </Link>
  );
}

// Clean Empty State Component when DB has no personas
export function EmptyPersonaState() {
  const { data: session } = useSession();
  const { openAuthModal } = useAuthModal();

  const handleCreateClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      openAuthModal("signin");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-14 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/40 backdrop-blur-sm my-6">
      <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
        <Sparkles className="w-8 h-8" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
        Belum Ada Karakter
      </h3>
      <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
        Belum ada persona AI yang tersimpan di database. Jadilah yang pertama
        untuk membuat karakter baru dan mulailah berinteraksi!
      </p>
      <Link href="/create" onClick={handleCreateClick}>
        <Button className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-violet-600/25 transition-all flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          Buat Karakter Sekarang
        </Button>
      </Link>
    </div>
  );
}

interface CardCharacterProps {
  personas: Persona[];
  favoriteIds?: string[];
  onFavoriteToggle?: (personaId: string, newIsFavorited: boolean) => void;
}

const CardCharacter = ({ personas, favoriteIds = [], onFavoriteToggle }: CardCharacterProps) => {
  if (!personas || personas.length === 0) {
    return <EmptyPersonaState />;
  }

  const favoriteSet = new Set(favoriteIds);

  return (
    <div className="w-full my-6 select-none">
      {/* Grid: 2 columns mobile, 4 columns desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {personas.map((character, index) => (
          <CharacterCardItem
            key={character.id}
            character={character}
            priority={index < 4}
            isFavorited={favoriteSet.has(character.id)}
            onFavoriteToggle={onFavoriteToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default CardCharacter;
