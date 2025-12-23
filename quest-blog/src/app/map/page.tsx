import GameApp from '@/components/GameApp';
import { getQuests } from '@/lib/quests';

export const metadata = {
  title: "Shakewin's Quest Map",
  description: 'Jump straight into the active quest log and character stats.',
};

export default async function MapPage() {
  const quests = await getQuests();
  return <GameApp quests={quests} initialScreen="GAME" />;
}
