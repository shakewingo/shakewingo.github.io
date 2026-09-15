import Link from "next/link";
import { ArrowLeft, Orbit } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-lg">
        <Orbit
          className="mx-auto mb-8 h-16 w-16 text-[#c1e591]"
          aria-hidden="true"
        />
        <p className="mb-4 font-mono text-xs tracking-widest text-[#a2a9b5]">
          YING YAO · 404
        </p>
        <h1 className="mb-5 text-4xl font-semibold tracking-tight">
          A little off the map.
        </h1>
        <p className="mb-9 text-base leading-relaxed text-[#a2a9b5]">
          This page isn’t here, but there’s plenty to explore back on the
          planet.
        </p>
        <Link href="/" className="button primary">
          <ArrowLeft size={16} /> Back to the planet
        </Link>
      </div>
    </main>
  );
}
