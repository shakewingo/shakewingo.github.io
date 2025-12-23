import fs from 'node:fs/promises';
import path from 'node:path';

import type { Quest } from '@/components/GameApp';

export type QuestFrontmatter = {
  title: string;
  date: string;
  preview?: string;
  excerpt?: string;
  difficulty: string;
  difficultyColor: string;
};

const questsDirectory = path.join(process.cwd(), 'src', 'app', 'quests');

export async function getQuests(): Promise<Quest[]> {
  const entries = await fs.readdir(questsDirectory, { withFileTypes: true });

  const mdxQuests = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const slug = entry.name;
        const module = await import(`../app/quests/${slug}/page.mdx`);
        const metadata = module.metadata as QuestFrontmatter;

        const preview = metadata.preview ?? metadata.excerpt ?? '';
        const excerpt = metadata.excerpt ?? metadata.preview ?? '';
        return {
          slug,
          title: metadata.title,
          date: metadata.date,
          preview,
          excerpt,
          difficulty: metadata.difficulty,
          difficultyColor: metadata.difficultyColor,
        } satisfies Quest;
      })
  );

  const upcomingQuests: Quest[] = [
    {
      slug: '',
      title: 'The Dialectical Method',
      date: '2024-10-30',
      preview: 'Philosophy meets code structure.',
      excerpt: 'Exploring how Hegelian dialectics can apply to refactoring legacy codebases.',
      difficulty: 'Easy',
      difficultyColor: 'bg-green-500',
    },
  ];

  return [...mdxQuests, ...upcomingQuests].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
