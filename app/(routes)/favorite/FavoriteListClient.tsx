"use client";

import { useState, useMemo } from "react";
import { Search, Heart, Compass } from "lucide-react";
import Link from "next/link";
import { Persona } from "@/lib/db/queries/personas";
import { CharacterCardItem } from "@/components/view/CardCharacter";
import { Button } from "@/components/ui/button";

interface FavoriteListClientProps {
  initialFavorites: Persona[];
}

export default function FavoriteListClient({
  initialFavorites,
}: FavoriteListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesList, setFavoritesList] = useState<Persona[]>(initialFavorites);

  // Handle optimistic favorite toggling on the favorites page
  const handleFavoriteToggle = (personaId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      // Remove from display list when unfavorited on the favorites page
      setFavoritesList((prev) => prev.filter((item) => item.id !== personaId));
    }
  };

  // Real-time client-side name search filtering
  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favoritesList;
    const query = searchQuery.toLowerCase().trim();
    return favoritesList.filter((character) =>
      character.name.toLowerCase().includes(query)
    );
  }, [favoritesList, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Typography */}
      <div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
          Favorite Character
        </h1>
        <p className="text-sm md:text-base text-zinc-400 mt-1">
          Your favorite character choices
        </p>
      </div>

      {/* Search Input Bar (Strictly no category dropdowns) */}
      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari karakter favorit..."
          className="w-full bg-zinc-900/80 border border-white/10 rounded-xl md:rounded-2xl pl-10 md:pl-11 pr-4 py-2.5 md:py-3 text-sm md:text-base text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
        />
      </div>

      {/* Main Content Grid & Empty States */}
      {favoritesList.length === 0 ? (
        /* Empty State: No Favorites saved yet */
        <div className="flex flex-col items-center justify-center p-8 md:p-14 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/40 backdrop-blur-sm my-8">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
            <Heart className="w-8 h-8 fill-pink-500/20" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            Belum Ada Karakter Favorit
          </h3>
          <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
            Anda belum menambahkan karakter ke daftar favorit. Jelajahi karakter dan tekan ikon hati untuk menyimpannya di sini.
          </p>
          <Link href="/">
            <Button className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-violet-600/25 transition-all flex items-center gap-2 cursor-pointer">
              <Compass className="w-4 h-4" />
              Jelajahi Karakter
            </Button>
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        /* Empty State: Search filter yielded no results */
        <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-3xl border border-zinc-800/60 bg-zinc-900/30 my-8">
          <Search className="w-10 h-10 text-zinc-500 mb-3" />
          <h3 className="text-lg md:text-xl font-semibold text-white mb-1">
            Karakter Tidak Ditemukan
          </h3>
          <p className="text-sm text-zinc-400 max-w-sm">
            Tidak ada karakter favorit yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
          </p>
        </div>
      ) : (
        /* Character Grid */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 pt-2">
          {filteredFavorites.map((character, index) => (
            <CharacterCardItem
              key={character.id}
              character={character}
              priority={index < 4}
              isFavorited={true}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
