import fs from "node:fs/promises";
import path from "node:path";

import { getArticleReadingDetails } from "@/lib/reading";

export type Quest = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  readingMinutes: number;
};

export type QuestFrontmatter = {
  title: string;
  date: string;
  summary?: string;
};

const questsDirectory = path.join(process.cwd(), "src", "app", "quests");

export async function getQuests(): Promise<Quest[]> {
  const entries = await fs.readdir(questsDirectory, { withFileTypes: true });

  const mdxQuests = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const slug = entry.name;
        const [module, reading] = await Promise.all([
          import(`../app/quests/${slug}/page.mdx`),
          getArticleReadingDetails(slug),
        ]);
        const metadata = module.metadata as QuestFrontmatter;

        return {
          slug,
          title: metadata.title,
          date: metadata.date,
          summary: metadata.summary?.trim() || reading.summary,
          readingMinutes: reading.readingMinutes,
        } satisfies Quest;
      }),
  );

  return mdxQuests.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
