import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { publicBooks, selectPublicNodes, rewriteNoteLinks, assertPublicSourceLinks } from "./wiki-publication-policy.mjs";

const sources = publicBooks.map((book, i) => ({
  source_id: book.sourceIds?.[0] ?? `yuque:${i}`, provider: book.provider, knowledge_base: book.id,
  knowledge_base_name: book.registryName ?? book.name, public: false,
}));
sources.push({ source_id: "other", provider: "yuque", knowledge_base: "shakewin/private", knowledge_base_name: "Algorithm" });
sources.push({ source_id: "notion", provider: "notion", knowledge_base: publicBooks[0].id, knowledge_base_name: "Algorithm" });
sources.push({ source_id: "renamed", provider: "yuque", knowledge_base: publicBooks[0].id, knowledge_base_name: "Different book" });
const notebook = sources.find((s) => s.provider === "notion");
sources.push({ ...notebook, source_id: "notion:11111111-1111-1111-1111-111111111111" });
const fixture = [
  { id: "approved", sources: ["yuque:0", "yuque:1", "yuque:2", notebook.source_id] },
  { id: "approved-notion", sources: [notebook.source_id] },
  { id: "other-notion-page", sources: ["notion:11111111-1111-1111-1111-111111111111"] },
  { id: "mixed-notion-private", sources: [notebook.source_id, "other"] },
  { id: "mixed", sources: ["yuque:0", "other"] },
  { id: "unknown", sources: ["yuque:0", "missing"] },
  { id: "notion", sources: ["notion"] },
  { id: "renamed", sources: ["renamed"] },
  { id: "empty", sources: [] }, { id: "absent" },
];
const allowed = selectPublicNodes(fixture, sources);
assert.deepEqual(allowed.map((n) => n.id), ["approved", "approved-notion"]);
assert.deepEqual(allowed[0].knowledgeBases, publicBooks.map((b) => b.name));
assert.throws(() => selectPublicNodes(fixture, [...sources, sources[0]]), /Duplicate/);
const paths = new Map([["wiki/concepts/a.md", "a"], ["wiki/concepts/b.md", "b"]]);
assert.equal(rewriteNoteLinks("[A](a.md#part) and [B](b.md)", "wiki/concepts/c.md", paths, new Set(["a"])), "[A](/garden/#a) and B");
assert.throws(() => rewriteNoteLinks("[C](missing.md)", "wiki/concepts/c.md", paths, new Set()), /Unresolved/);
for (const book of publicBooks.filter((book) => book.provider === "yuque"))
  assertPublicSourceLinks(`[source](https://www.yuque.com/${book.id}/note)`);
for (const url of [
  "https://app.notion.com/p/388cad4fb60580748c53ff558a15beb0",
  "https://www.notion.so/Alisas-book-388cad4fb60580748c53ff558a15beb0",
  "https://alisa.notion.site/388cad4f-b605-8074-8c53-ff558a15beb0?view=public",
]) assertPublicSourceLinks(url);
for (const url of ["https://app.notion.com/p/11111111111111111111111111111111", "https://www.notion.so/note?approved=388cad4fb60580748c53ff558a15beb0", "https://www.yuque.com/shakewin/private/note", "https://www.notion.so/note", "https://alice.notion.site/note", "https://www.yuque.com/shakewin/woezs0-other/note"])
  assert.throws(() => assertPublicSourceLinks(url), /Unapproved/);

const data = JSON.parse(
  await fs.readFile(
    new URL("../src/data/llm-wiki.json", import.meta.url),
    "utf8",
  ),
);
assert.equal(data.schemaVersion, 1);
assert.deepEqual(data.knowledgeBases, publicBooks.map((b) => b.name));
assert.ok(data.nodes.length > 0);
const ids = new Set(data.nodes.map((n) => n.id));
assert.equal(ids.size, data.nodes.length);
for (const node of data.nodes) {
  assert.match(node.id, /^[a-z0-9-]+$/);
  assert.ok(node.body.trim());
  assert.ok(node.knowledgeBases.length > 0);
  assert.ok(node.knowledgeBases.every((book) => data.knowledgeBases.includes(book)));
  assertPublicSourceLinks(node.body);
  assert.ok(!/\]\([^)]*\.md(?:#|\))/.test(node.body));
  assert.ok(node.summary.trim());
  assert.ok(Number.isFinite(node.x) && node.x >= 0 && node.x <= 1200);
  assert.ok(Number.isFinite(node.y) && node.y >= 0 && node.y <= 800);
  for (const prohibited of ["path", "sources", "credentials"])
    assert.ok(!(prohibited in node));
  assert.ok(!node.body.includes("BEGIN GENERATED OBSIDIAN LINKS"));
  for (const link of node.body.matchAll(/\/garden\/#([a-z0-9-]+)/g))
    assert.ok(ids.has(link[1]), `Unknown linked note ${link[1]}`);
}
const edgeKeys = new Set();
for (const e of data.edges) {
  assert.ok(ids.has(e.source) && ids.has(e.target));
  const key = JSON.stringify(e);
  assert.ok(!edgeKeys.has(key));
  edgeKeys.add(key);
}
const md = await fs.readFile(
  new URL("../src/components/GameApp.tsx", import.meta.url),
  "utf8",
);
for (const removed of [
  "MAKE YOURSELF",
  "WANDER A LITTLE",
  "THE WORKSHOP",
  "Field notes",
  "Explore the journal",
  "KNOWLEDGE GARDEN",
])
  assert.ok(!md.includes(removed));
assert.ok(md.includes("LLM-Wiki"));
console.log(
  `Wiki snapshot passed: ${data.nodes.length} non-empty notes, ${data.edges.length} valid relationships, working internal references, approved source scope, no private registry fields.`,
);
