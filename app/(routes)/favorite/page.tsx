import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserFavoritePersonas } from "@/lib/db/queries/favorites";
import FavoriteListClient from "./FavoriteListClient";
import { Persona } from "@/lib/db/queries/personas";

export const metadata = {
  title: "Favorite Character | AI Roleplay",
  description: "Your favorite character choices",
};

const FavoritePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let favorites: Persona[] = [];

  if (session?.user) {
    favorites = await getUserFavoritePersonas(session.user.id);
  }

  return <FavoriteListClient initialFavorites={favorites} />;
};

export default FavoritePage;
