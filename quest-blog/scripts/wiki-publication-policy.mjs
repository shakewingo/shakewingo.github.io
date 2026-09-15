import path from "node:path";

// Owner-approved sources. Stable namespaces/page IDs prevent same-name matches.
export const publicBooks = [
  { provider: "yuque", id: "shakewin/woezs0", name: "Algorithm" },
  { provider: "yuque", id: "shakewin/sysgq3", name: "Engineering" },
  { provider: "yuque", id: "shakewin/fidaqi", name: "ML Course" },
  {
    provider: "notion",
    id: "collection://c9ccad4f-b605-83a6-8b25-07248ba4f85d",
    registryName: "Docs",
    name: "Alisa’s LLM notebook",
    sourceIds: ["notion:388cad4f-b605-8074-8c53-ff558a15beb0"],
  },
];

export function selectPublicNodes(nodes, sources) {
  const registry = new Map(sources.map((s) => [s.source_id, s]));
  if (registry.size !== sources.length) throw new Error("Duplicate source IDs");
  return nodes.flatMap((node) => {
    if (!Array.isArray(node.sources) || !node.sources.length) return [];
    const books = node.sources.map((id) => {
      const source = registry.get(id);
      return source
        ? publicBooks.find(
            (book) => book.provider === source.provider &&
              book.id === source.knowledge_base &&
              (book.registryName ?? book.name) === source.knowledge_base_name &&
              (!book.sourceIds || book.sourceIds.includes(source.source_id)),
          )
        : undefined;
    });
    // Every source must qualify, including notes spanning multiple approved books.
    if (books.some((book) => !book)) return [];
    return [{ ...node, knowledgeBases: publicBooks
      .filter((book) => books.includes(book)).map((book) => book.name) }];
  });
}

export function rewriteNoteLinks(body, notePath, paths, publicIds) {
  return body.replace(/\[([^\]]+)\]\(([^\s)]+\.md)(#[^)]*)?\)/g,
    (_, label, relative) => {
      const target = paths.get(path.posix.normalize(
        path.posix.join(path.posix.dirname(notePath), relative),
      ));
      if (!target) throw new Error(`Unresolved note link in ${notePath}: ${relative}`);
      // Keep the approved note's own prose, without exposing an unpublished URL/body.
      return publicIds.has(target) ? `[${label}](/garden/#${target})` : label;
    });
}

export function assertPublicSourceLinks(body) {
  for (const [raw] of body.matchAll(/https?:\/\/[^\s)>\]]+/g)) {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (["notion.so", "notion.site", "notion.com"].some(
      (domain) => host === domain || host.endsWith(`.${domain}`),
    )) {
      const pageId = url.pathname.replace(/\/$/, "").split("/").pop()
        ?.match(/(?:^|-)([a-f0-9]{32}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/i)?.[1]
        .replaceAll("-", "").toLowerCase();
      const approved = publicBooks.some((book) => book.provider === "notion" &&
        book.sourceIds.some((id) => id.slice("notion:".length).replaceAll("-", "") === pageId));
      if (!approved) throw new Error("Unapproved Notion source link in export");
    }
    if ((host === "yuque.com" || host.endsWith(".yuque.com")) &&
        !publicBooks.some((book) => book.provider === "yuque" && url.pathname.startsWith(`/${book.id}/`)))
      throw new Error("Unapproved Yuque source link in export");
  }
}
