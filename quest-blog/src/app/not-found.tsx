import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-slate-900 border-4 border-red-500 p-10 text-center space-y-6 shadow-[0_0_30px_rgba(248,113,113,0.3)]">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto animate-pulse" />
        <h1 className="text-4xl font-black uppercase tracking-tight text-red-400">Quest Failed</h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          The path you selected is blocked by mysterious forces. Double-check the quest log or return to the base camp.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-black px-6 py-3 font-bold uppercase tracking-wide transition-colors"
        >
          <Home className="w-4 h-4" />
          Return to Map
        </Link>
      </div>
    </div>
  );
}
