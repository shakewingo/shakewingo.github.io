import fs from "node:fs/promises";
import path from "node:path";
import { createProcessor } from "@mdx-js/mdx";
import remarkMath from "remark-math";

type ContentNode = {
  type: string;
  value?: string;
  children?: ContentNode[];
};

const processor = createProcessor({ remarkPlugins: [remarkMath] });
const excludedNodes = new Set([
  "mdxjsEsm",
  "mdxFlowExpression",
  "mdxTextExpression",
  "code",
  "math",
  "inlineMath",
  "html",
  "definition",
]);
const blockNodes = new Set([
  "paragraph",
  "heading",
  "listItem",
  "blockquote",
  "tableRow",
]);

function parseArticle(source: string): ContentNode {
  // This site uses ESM metadata; also tolerate conventional YAML frontmatter.
  return processor.parse(source.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, ""));
}

function nodeProse(node: ContentNode): string {
  if (excludedNodes.has(node.type)) return "";
  if (node.type === "text" || node.type === "inlineCode")
    return node.value ?? "";
  if (node.type === "break") return " ";

  const text = node.children?.map(nodeProse).join("") ?? "";
  return blockNodes.has(node.type) ? `${text}\n\n` : text;
}

function normalizedProse(tree: ContentNode): string {
  return nodeProse(tree)
    .replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, "\n\n")
    .trim();
}

/** Read actual prose nodes, excluding MDX code, metadata and formula source. */
export function articleProse(source: string): string {
  return normalizedProse(parseArticle(source));
}

export function estimateReadingMinutes(prose: string): number {
  // Count unspaced CJK characters separately from whitespace-delimited words.
  const cjkPattern =
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
  const cjkCharacters = prose.match(cjkPattern)?.length ?? 0;
  const words =
    prose
      .replace(cjkPattern, " ")
      .match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(words / 220 + cjkCharacters / 400));
}

function openingParagraphs(tree: ContentNode): string[] {
  if (excludedNodes.has(tree.type)) return [];
  if (tree.type === "paragraph") {
    const text = nodeProse(tree).replace(/\s+/g, " ").trim();
    return text ? [text] : [];
  }
  return tree.children?.flatMap(openingParagraphs) ?? [];
}

function truncateSummary(text: string, limit = 320): string {
  const characters = Array.from(text);
  if (characters.length <= limit) return text;

  let excerpt = characters.slice(0, limit).join("");
  // Only finish a partial Latin word; Chinese text has no whitespace boundaries.
  const latinWordCharacter = /[\p{Script=Latin}\p{N}'’-]/u;
  if (
    latinWordCharacter.test(characters[limit - 1]) &&
    latinWordCharacter.test(characters[limit])
  ) {
    const wholeWords = excerpt
      .replace(/[\p{Script=Latin}\p{N}'’-]+$/u, "")
      .trimEnd();
    if (wholeWords) excerpt = wholeWords;
  }
  return `${excerpt.trimEnd()}…`;
}

export function readingDetailsFromSource(source: string) {
  const tree = parseArticle(source);
  const prose = normalizedProse(tree);
  const opening = openingParagraphs(tree).slice(0, 2).join(" ");
  return {
    readingMinutes: estimateReadingMinutes(prose),
    summary: truncateSummary(opening),
  };
}

export async function getArticleReadingDetails(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Invalid article slug: ${slug}`);
  }

  const source = await fs.readFile(
    path.join(process.cwd(), "src", "app", "quests", slug, "page.mdx"),
    "utf8",
  );
  return readingDetailsFromSource(source);
}
