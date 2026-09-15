"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  ArrowLeft,
  ArrowUpRight,
  Focus,
  List,
  Minus,
  Network,
  Plus,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import {
  wiki,
  noteColors,
  noteTypes,
  relationNames,
  relatedNotes,
} from "@/lib/wiki";

const positions = new Map(wiki.nodes.map((n) => [n.id, n]));
const availableTypes = Object.entries(noteTypes).filter(([id]) => wiki.nodes.some((n) => n.type === id));
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const getSelection = () => window.location.hash.slice(1);
const serverSelection = () => "";

export default function WikiExplorer() {
  const selectedId = useSyncExternalStore(
    subscribe,
    getSelection,
    serverSelection,
  );
  const selected = positions.get(selectedId);
  const [query, setQuery] = useState("");
  const [book, setBook] = useState("");
  const [type, setType] = useState("");
  const [focusId, setFocusId] = useState("");
  const [view, setView] = useState<"graph" | "list">("graph");
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const drag = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const readerRef = useRef<HTMLElement>(null);
  const graphRef = useRef<HTMLElement>(null);
  const relationships = selected ? relatedNotes(selected.id) : [];
  const neighbors = new Set(relationships.flatMap((e) => [e.source, e.target]));
  const filtered = useMemo(() => {
    const focusNodes = focusId
      ? new Set(
          relatedNotes(focusId)
            .flatMap((e) => [e.source, e.target])
            .concat(focusId),
        )
      : null;
    const q = query.trim().toLocaleLowerCase();
    return wiki.nodes.filter(
      (n) =>
        (!q ||
          `${n.title} ${n.aliases.join(" ")} ${n.body}`
            .toLocaleLowerCase()
            .includes(q)) &&
        (!book || n.knowledgeBases.includes(book)) &&
        (!type || n.type === type) &&
        (!focusNodes || focusNodes.has(n.id)),
    );
  }, [query, book, type, focusId]);
  const visibleIds = new Set(filtered.map((n) => n.id));
  const visibleEdges = wiki.edges.filter(
    (e) => visibleIds.has(e.source) && visibleIds.has(e.target),
  );
  function select(id: string) {
    window.location.assign(`#${id}`);
    readerRef.current?.scrollTo({ top: 0 });
    if (window.matchMedia("(max-width: 760px)").matches)
      readerRef.current?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
  }
  function reset() {
    setQuery("");
    setBook("");
    setType("");
    setFocusId("");
    setViewport({ x: 0, y: 0, zoom: 1 });
  }
  function zoom(amount: number) {
    setViewport((v) => ({
      ...v,
      zoom: Math.max(0.6, Math.min(3, v.zoom + amount)),
    }));
  }
  return (
    <div className="wiki-page" id="top">
      <a className="skip-link" href="#wiki-content">
        Skip to content
      </a>
      <header className="wiki-nav">
        <Link href="/">Ying Yao</Link>
        <Link href="/#inventory">
          <ArrowLeft size={15} /> Inventory
        </Link>
      </header>
      <main id="wiki-content" className="wiki-main">
        <div className="wiki-heading">
          <div>
            <h1>LLM-Wiki</h1>
            <p>Connected notes from Yuque and Notion.</p>
          </div>
          <p className="wiki-count">
            {wiki.nodes.length} notes · {wiki.edges.length} relationships
            <br />
            <span>
              Updated {new Date(wiki.updatedAt).toISOString().slice(0, 10)}
            </span>
          </p>
        </div>
        <div className="wiki-toolbar">
          <label className="wiki-search">
            <Search size={17} />
            <input
              aria-label="Search notes"
              placeholder="Search notes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </label>
          <label className="wiki-filter">
            <span>Knowledge base</span>
            <select value={book} onChange={(e) => setBook(e.target.value)}>
              <option value="">All knowledge bases</option>
              {wiki.knowledgeBases.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="wiki-filter">
            <span>Type</span>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All notes</option>
              {availableTypes.map(([id, title]) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
          </label>
          <button className="wiki-reset" onClick={reset}>
            <RotateCcw size={15} /> Reset
          </button>
        </div>
        {focusId && (
          <div className="wiki-focus-state">
            Connections to {positions.get(focusId)?.title}
            <button onClick={() => setFocusId("")}>
              <X size={14} /> Clear
            </button>
          </div>
        )}
        <div className="wiki-workspace">
          <section
            ref={graphRef}
            className="wiki-graph-panel"
            aria-label="Notes explorer"
          >
            <div className="wiki-viewbar">
              <span role="status">
                {filtered.length} notes · {visibleEdges.length} relationships
              </span>
              <div>
                <button
                  aria-pressed={view === "graph"}
                  onClick={() => setView("graph")}
                >
                  <Network size={15} /> Graph
                </button>
                <button
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                >
                  <List size={15} /> List
                </button>
              </div>
            </div>
            {filtered.length === 0 ? (
              <div className="wiki-empty">
                <h2>No matching notes</h2>
                <p>Try another search or reset the filters.</p>
                <button className="button primary" onClick={reset}>
                  Reset filters
                </button>
              </div>
            ) : view === "list" ? (
              <div className="wiki-note-list">
                {filtered.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => select(n.id)}
                    aria-pressed={selectedId === n.id}
                  >
                    <i style={{ background: noteColors[n.type] }} />
                    <span>
                      {n.title}
                      <small>{noteTypes[n.type]}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="wiki-canvas">
                <svg
                  ref={svgRef}
                  viewBox="0 0 1200 800"
                  role="group"
                  aria-label="LLM-Wiki knowledge graph. Select a note to read it. Use the List view for a text alternative."
                  onPointerDown={(e) => {
                    if (
                      e.button !== 0 ||
                      (e.target as Element).closest("[data-node]")
                    )
                      return;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    drag.current = {
                      x: e.clientX,
                      y: e.clientY,
                      panX: viewport.x,
                      panY: viewport.y,
                    };
                  }}
                  onPointerMove={(e) => {
                    if (!drag.current) return;
                    const scale =
                      1200 /
                      (svgRef.current?.getBoundingClientRect().width || 1200);
                    setViewport((v) => ({
                      ...v,
                      x:
                        drag.current!.panX +
                        (e.clientX - drag.current!.x) * scale,
                      y:
                        drag.current!.panY +
                        (e.clientY - drag.current!.y) * scale,
                    }));
                  }}
                  onPointerUp={() => {
                    drag.current = null;
                  }}
                  onPointerCancel={() => {
                    drag.current = null;
                  }}
                >
                  <g
                    transform={`translate(${600 + viewport.x} ${400 + viewport.y}) scale(${viewport.zoom}) translate(-600 -400)`}
                  >
                    {visibleEdges.map((e, i) => {
                      const a = positions.get(e.source)!,
                        b = positions.get(e.target)!;
                      const active =
                        e.source === selectedId || e.target === selectedId;
                      return (
                        <line
                          key={i}
                          x1={a.x}
                          y1={a.y}
                          x2={b.x}
                          y2={b.y}
                          stroke={active ? "#d2bded" : "#687488"}
                          strokeWidth={active ? 2.6 : 1.2}
                          opacity={selected ? (active ? 0.9 : 0.15) : 0.4}
                        />
                      );
                    })}
                    {filtered.map((n) => {
                      const active = n.id === selectedId;
                      const near = neighbors.has(n.id);
                      const showLabel =
                        active || near || (!selected && n.type === "map");
                      return (
                        <g
                          data-node={n.id}
                          className="wiki-node"
                          key={n.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`${n.title}, ${noteTypes[n.type]}`}
                          aria-pressed={active}
                          onClick={() => select(n.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              select(n.id);
                            }
                          }}
                          opacity={selected && !near && !active ? 0.38 : 1}
                        >
                          <title>{n.title}</title>
                          <circle
                            className="node-hit"
                            cx={n.x}
                            cy={n.y}
                            r="22"
                            fill="transparent"
                          />
                          <circle
                            className="node-ring"
                            cx={n.x}
                            cy={n.y}
                            r={active ? 17 : 14}
                            fill="none"
                            stroke={active ? "#f6eaff" : "transparent"}
                            strokeWidth="2"
                          />
                          <circle
                            cx={n.x}
                            cy={n.y}
                            r={n.type === "map" ? 10 : 7}
                            fill={noteColors[n.type]}
                          />
                          {showLabel && (
                            <text
                              x={n.x + 14}
                              y={n.y + 4}
                              fill={active ? "#fff" : "#d1d7df"}
                              fontSize="13"
                              paintOrder="stroke"
                              stroke="#111722"
                              strokeWidth="4"
                              strokeLinejoin="round"
                            >
                              {n.title}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>
                <div className="wiki-zoom">
                  <button aria-label="Zoom in" onClick={() => zoom(0.25)}>
                    <Plus size={17} />
                  </button>
                  <button aria-label="Zoom out" onClick={() => zoom(-0.25)}>
                    <Minus size={17} />
                  </button>
                  <button
                    aria-label="Reset graph view"
                    onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })}
                  >
                    <Focus size={17} />
                  </button>
                </div>
              </div>
            )}
            <div className="wiki-legend">
              {availableTypes.map(([id, title]) => (
                <span key={id}>
                  <i style={{ background: noteColors[id] }} />
                  {title}
                </span>
              ))}
              <span className="wiki-graph-help">Select a note to read it.</span>
            </div>
          </section>
          <aside
            ref={readerRef}
            className="wiki-reader"
            aria-label="Selected note"
          >
            {selected ? (
              <article key={selected.id}>
                <div className="wiki-note-meta">
                  {noteTypes[selected.type]}
                  <button
                    onClick={() => {
                      setQuery("");
                      setBook("");
                      setType("");
                      setFocusId(selected.id);
                      setViewport({ x: 0, y: 0, zoom: 1 });
                      setView("graph");
                      if (window.matchMedia("(max-width: 760px)").matches)
                        graphRef.current?.scrollIntoView({
                          behavior: "instant",
                        });
                    }}
                  >
                    <Focus size={14} /> Connections
                  </button>
                </div>
                <h2>{selected.title}</h2>
                <div className="wiki-note-domains">
                  {selected.knowledgeBases.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setBook(d);
                        setFocusId("");
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="wiki-prose prose prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    skipHtml
                    components={{
                      a: ({ href, children }) =>
                        href?.startsWith("/garden/#") ? (
                          <a
                            href={href}
                            onClick={(e) => {
                              e.preventDefault();
                              select(href.split("#")[1]);
                            }}
                          >
                            {children}
                          </a>
                        ) : (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                    }}
                  >
                    {selected.body}
                  </ReactMarkdown>
                </div>
                {relationships.length > 0 && (
                  <section className="wiki-relationships">
                    <h3>Relationships</h3>
                    <div className="wiki-relation-tags">
                      {relationships.map((e) => {
                        const outgoing = e.source === selected.id;
                        const other = positions.get(outgoing ? e.target : e.source)!;
                        const relation = relationNames[e.type] ?? e.type;
                        const description = `${positions.get(e.source)?.title} → ${relation} → ${positions.get(e.target)?.title}`;
                        return (
                          <button
                            key={`${e.source}:${e.type}:${e.target}`}
                            onClick={() => select(other.id)}
                            title={description}
                            aria-label={description}
                          >
                            <span className="wiki-relation-type" aria-hidden="true">
                              {outgoing ? "→" : "←"} {relation}
                            </span>
                            <span>{other.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}
              </article>
            ) : (
              <div className="wiki-reader-intro">
                <Network size={32} />
                <h2>Select a note</h2>
                <p>
                  Click a node or choose a note from the list to read its
                  content and relationships.
                </p>
                <h3>Knowledge bases</h3>
                {wiki.knowledgeBases.map((name) => (
                  <button key={name} onClick={() => {
                    reset();
                    setBook(name);
                    setView("list");
                  }}>
                    {name}
                    <ArrowUpRight size={14} />
                  </button>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>
      <footer className="wiki-footer">
        <Link href="/#inventory">
          <ArrowLeft size={14} /> Inventory
        </Link>
        <span>Have fun.</span>
      </footer>
    </div>
  );
}
