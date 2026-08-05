import BadgeFeature from "@/components/view/BadgeFeature";
import Banner from "@/components/view/Banner";
import CardCharacter from "@/components/view/CardCharacter";
import { getRecentPersonas } from "@/lib/db/queries/personas";
import { getUserFavoriteIds } from "@/lib/db/queries/favorites";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const ExplorePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const personas = await getRecentPersonas(20);
  const favoriteIds = session?.user
    ? await getUserFavoriteIds(session.user.id)
    : [];

  return (
    <section>
      <Banner />
      <BadgeFeature />
      <CardCharacter personas={personas} favoriteIds={favoriteIds} />
    </section>
  );
};

export default ExplorePage;
