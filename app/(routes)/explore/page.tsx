import BadgeFeature from "@/components/view/BadgeFeature";
import Banner from "@/components/view/Banner";
import CardCharacter from "@/components/view/CardCharacter";
import { getRecentPersonas } from "@/lib/db/queries/personas";

const ExplorePage = async () => {
  const personas = await getRecentPersonas(20);

  return (
    <section>
      <Banner />
      <BadgeFeature />
      <CardCharacter personas={personas} />
    </section>
  );
};

export default ExplorePage;
