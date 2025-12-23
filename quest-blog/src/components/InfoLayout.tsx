import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

type InfoLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function InfoLayout({ title, description, children }: InfoLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 uppercase font-bold text-sm"
        >
          <ChevronLeft size={16} /> Back to Map
        </Link>

        <section className="bg-slate-900 border-4 border-slate-800 p-6 md:p-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <header className="space-y-3 mb-8">
            <h1 className="text-3xl md:text-5xl font-black text-cyan-400 uppercase tracking-tight">{title}</h1>
            {description ? (
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">{description}</p>
            ) : null}
          </header>

          <div className="prose prose-invert prose-green max-w-none">{children}</div>
        </section>
      </div>
    </div>
  );
}
