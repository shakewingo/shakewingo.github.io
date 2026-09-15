import { ArrowLeft, Clock3, Orbit } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { getArticleReadingDetails } from "@/lib/reading";

type QuestLayoutProps = {
  children: ReactNode;
  slug: string;
  title: string;
  date: string;
  summary?: string;
};

export default async function QuestLayout({
  children,
  slug,
  title,
  date,
  summary,
}: QuestLayoutProps) {
  const { readingMinutes } = await getArticleReadingDetails(slug);
  const published = new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div
      id="article-top"
      className="article-shell min-h-screen bg-[#10131b] px-5 py-7 font-sans text-[#e8eee4] md:px-8 md:py-10"
    >
      <div className="mx-auto max-w-3xl">
        <header className="mb-16 flex items-center justify-between gap-5 border-b border-white/10 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-mono text-sm font-semibold tracking-wide text-[#dce8d5] transition-colors hover:text-[#c1e591]"
          >
            <Orbit size={21} className="text-[#c1e591]" aria-hidden="true" />{" "}
            Ying Yao
          </Link>
          <Link
            href="/#quests"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#b9c7b6] transition-colors hover:text-[#c1e591]"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Quest Log
          </Link>
        </header>

        <main>
          <article>
            <header className="article-header mb-12 border-b border-white/10 pb-10">
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-[#c1e591]">
                Quest Log
              </p>
              <h1 className="mb-6 text-4xl font-semibold leading-[1.15] tracking-tight text-[#f1f4e9] md:text-5xl">
                {title}
              </h1>
              {summary && (
                <p className="mb-7 text-lg leading-relaxed text-[#b9c7b6]">
                  {summary}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-[#a3b19f]">
                <span>Ying Yao</span>
                <time dateTime={date}>{published}</time>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={13} aria-hidden="true" /> {readingMinutes} min
                  read
                </span>
              </div>
            </header>

            <div className="article-prose prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[#e8eee4] prose-p:leading-[1.9] prose-p:text-[#c4cec0] prose-a:text-[#c1e591] prose-a:decoration-[#c1e591]/40 prose-a:underline-offset-4 prose-strong:text-[#edf2e9] prose-li:text-[#c4cec0] [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_p:has(.katex)]:overflow-x-auto [&_p:has(.katex)]:overflow-y-hidden md:prose-lg">
              {children}
            </div>
          </article>
        </main>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-8 font-mono text-xs text-[#a3b19f]">
          <Link
            href="/#quests"
            className="inline-flex items-center gap-2 text-[#c1e591] hover:underline"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back to Quest Log
          </Link>
          <span>Have fun.</span>
        </footer>
      </div>
    </div>
  );
}
