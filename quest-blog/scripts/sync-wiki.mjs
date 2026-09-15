import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { publicBooks, selectPublicNodes, rewriteNoteLinks, assertPublicSourceLinks } from "./wiki-publication-policy.mjs";

const project = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const repoArg = process.argv.indexOf("--repo");
let temporary;
const repo =
  repoArg >= 0
    ? path.resolve(process.argv[repoArg + 1])
    : (temporary = await fs.mkdtemp(path.join(os.tmpdir(), "llm-wiki-")));
try {
  if (temporary)
    execFileSync(
      "git",
      [
        "clone",
        "--depth",
        "1",
        "https://github.com/shakewingo/llm-wiki.git",
        repo,
      ],
      { stdio: "inherit" },
    );
  const graph = JSON.parse(
    await fs.readFile(path.join(repo, "generated/graph.json"), "utf8"),
  );
  if (graph.schema_version !== 2)
    throw new Error("Unsupported wiki graph schema");
  const registry = JSON.parse(
    await fs.readFile(path.join(repo, "sources/registry.json"), "utf8"),
  );
  const publicNodes = selectPublicNodes(graph.nodes, registry.sources);
  const publicIds = new Set(publicNodes.map((n) => n.id));
  if (!publicNodes.length) throw new Error("No notes match the approved knowledge sources");
  const paths = new Map(graph.nodes.map((n) => [n.path, n.id]));
  const ids = new Set(graph.nodes.map((n) => n.id));
  if (ids.size !== graph.nodes.length) throw new Error("Duplicate wiki IDs");
  const nodes = await Promise.all(
    publicNodes.map(async (n, index) => {
      if (
        !/^[a-z0-9-]+$/.test(n.id) ||
        !/^wiki\/(concepts|maps|comparisons|interview)\/[a-z0-9-]+\.md$/.test(
          n.path,
        )
      )
        throw new Error("Invalid wiki path or ID");
      let body = (await fs.readFile(path.join(repo, n.path), "utf8"))
        .replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, "")
        .replace(
          /<!-- BEGIN GENERATED OBSIDIAN LINKS -->[\s\S]*?<!-- END GENERATED OBSIDIAN LINKS -->/g,
          "",
        )
        .replace(/^# .+\r?\n/, "")
        .trim();
      assertPublicSourceLinks(body);
      body = rewriteNoteLinks(body, n.path, paths, publicIds);
      const summary =
        body
          .split(/\n\s*\n/)
          .find((p) => !/^(#|[-*] |\d+\. )/.test(p))
          ?.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
          .replace(/\s+/g, " ")
          .trim() ?? "";
      const angle = index * 2.3999632297;
      const radius = 40 + 290 * Math.sqrt(index / publicNodes.length);
      return {
        id: n.id,
        title: n.title,
        type: n.type,
        domains: n.domains,
        aliases: n.aliases,
        knowledgeBases: n.knowledgeBases,
        summary,
        body,
        x: 600 + Math.cos(angle) * radius * 1.4,
        y: 400 + Math.sin(angle) * radius,
      };
    }),
  );
  const edges = graph.edges.flatMap((e) => {
    if (!ids.has(e.source) || !ids.has(e.target))
      throw new Error("Unresolved graph edge");
    return publicIds.has(e.source) && publicIds.has(e.target)
      ? [{ source: e.source, target: e.target, type: e.type }] : [];
  });
  // Deterministic layout computed once on export: no continuous motion in the browser.
  const byId = new Map(nodes.map((n, i) => [n.id, i]));
  for (let step = 0; step < 360; step++) {
    const force = nodes.map((n) => ({
      x: (600 - n.x) * 0.005,
      y: (400 - n.y) * 0.005,
    }));
    for (let a = 0; a < nodes.length; a++)
      for (let b = a + 1; b < nodes.length; b++) {
        const dx = nodes[a].x - nodes[b].x,
          dy = nodes[a].y - nodes[b].y,
          d2 = Math.max(64, dx * dx + dy * dy);
        const amount = 6000 / (d2 * Math.sqrt(d2));
        force[a].x += dx * amount;
        force[a].y += dy * amount;
        force[b].x -= dx * amount;
        force[b].y -= dy * amount;
      }
    for (const edge of edges) {
      const a = byId.get(edge.source),
        b = byId.get(edge.target);
      const dx = nodes[b].x - nodes[a].x,
        dy = nodes[b].y - nodes[a].y,
        d = Math.max(1, Math.hypot(dx, dy));
      const amount = ((d - 95) * 0.015) / d;
      force[a].x += dx * amount;
      force[a].y += dy * amount;
      force[b].x -= dx * amount;
      force[b].y -= dy * amount;
    }
    const cooling = 1 - step / 430;
    nodes.forEach((n, i) => {
      n.x += Math.max(-12, Math.min(12, force[i].x)) * cooling;
      n.y += Math.max(-12, Math.min(12, force[i].y)) * cooling;
    });
  }
  const minX=Math.min(...nodes.map(n=>n.x)),maxX=Math.max(...nodes.map(n=>n.x));
  const minY=Math.min(...nodes.map(n=>n.y)),maxY=Math.max(...nodes.map(n=>n.y));
  nodes.forEach(n=>{
    n.x=Math.round(90+(n.x-minX)/(maxX-minX||1)*910);
    n.y=Math.round(80+(n.y-minY)/(maxY-minY||1)*640);
  });
  const commit = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repo,
    encoding: "utf8",
  }).trim();
  const updatedAt = execFileSync(
    "git",
    ["log", "-1", "--format=%cI", "--", "wiki", "generated/graph.json", "sources/registry.json"],
    { cwd: repo, encoding: "utf8" },
  ).trim();
  const data = {
    schemaVersion: 1,
    knowledgeBases: publicBooks.map((book) => book.name),
    repository: "https://github.com/shakewingo/llm-wiki",
    commit,
    updatedAt,
    nodes,
    edges,
  };
  // Explicit fields only. No source registry, credentials, Obsidian settings or Git history.
  const output = path.join(project, "src/data/llm-wiki.json");
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output + ".tmp", JSON.stringify(data, null, 2) + "\n");
  await fs.rename(output + ".tmp", output);
  console.log(
    `LLM-Wiki: ${nodes.length} notes (${graph.nodes.length - nodes.length} excluded by source scope), ${edges.length} relationships, commit ${commit.slice(0, 7)}. Saved ${output}`,
  );
} finally {
  if (temporary) await fs.rm(temporary, { recursive: true, force: true });
}
