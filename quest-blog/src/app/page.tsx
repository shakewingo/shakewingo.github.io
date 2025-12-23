import GameApp from '@/components/GameApp';
import { getQuests } from '@/lib/quests';

export default async function HomePage() {
  const quests = await getQuests();
  return <GameApp quests={quests} />;
}
