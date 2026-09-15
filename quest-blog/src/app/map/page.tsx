import GameApp from "@/components/GameApp";
import { getQuests } from "@/lib/quests";

export const metadata = {
  title: "Explore",
  description: "Notes, projects, and a little about Ying Yao.",
};

export default async function MapPage() {
  const quests = await getQuests();
  return <GameApp quests={quests} />;
}
