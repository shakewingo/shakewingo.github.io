import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  articleProse,
  estimateReadingMinutes,
  getArticleReadingDetails,
  readingDetailsFromSource,
} from "../src/lib/reading.ts";

const mdx = `import Layout from './Layout'

export const metadata = {
  title: 'PRIVATE METADATA',

  description: 'THIS MUST NEVER BECOME AN EXCERPT',
}

export default ({ children }) => (
  <Layout>

    {children}
  </Layout>
)

# A visible heading

A **real** first paragraph with [a link](https://example.com) and \`inline code\`.

Second paragraph. {"invisible expression"}

Third paragraph stays outside the summary.

\`\`\`js
const hiddenCode = 'ignore this block';
\`\`\`

$$
\\theta = \\frac{1}{2}
$$
`;
const details = readingDetailsFromSource(mdx);
assert.equal(
  details.summary,
  "A real first paragraph with a link and inline code. Second paragraph.",
);
assert.equal(details.readingMinutes, 1);
const prose = articleProse(mdx);
assert.ok(prose.includes("A visible heading"));
assert.ok(prose.includes("Third paragraph stays outside the summary."));
for (const excluded of [
  "PRIVATE",
  "EXCERPT",
  "Layout",
  "children",
  "invisible expression",
  "hiddenCode",
  "theta",
]) {
  assert.ok(
    !prose.includes(excluded),
    `Unexpected authoring syntax in prose: ${excluded}`,
  );
}

const mixedOpening = `English ${"中文".repeat(220)}`;
assert.equal(
  readingDetailsFromSource(mixedOpening).summary,
  `${Array.from(mixedOpening).slice(0, 320).join("")}…`,
);
assert.equal(
  readingDetailsFromSource("中".repeat(400)).summary,
  `${"中".repeat(320)}…`,
);
assert.equal(
  readingDetailsFromSource(`${"a ".repeat(158)}lengthyword ends here`).summary,
  `${"a ".repeat(158).trim()}…`,
);
assert.equal(estimateReadingMinutes("word ".repeat(440)), 2);
assert.equal(estimateReadingMinutes("中".repeat(800)), 2);
assert.equal(estimateReadingMinutes("word ".repeat(220) + "中".repeat(400)), 2);
assert.equal(estimateReadingMinutes(""), 1);

const article = await readFile(
  new URL("../src/app/quests/gd-vs-ols/page.mdx", import.meta.url),
  "utf8",
);
const fromFile = await getArticleReadingDetails("gd-vs-ols");
assert.deepEqual(fromFile, readingDetailsFromSource(article));
assert.ok(fromFile.summary.startsWith("Gradient descent is a popular method"));
assert.equal(
  fromFile.readingMinutes,
  estimateReadingMinutes(articleProse(article)),
);
console.log(
  `Reading regressions passed: multiline metadata/layout, visible body, mixed-language truncation, word counts, shared article result (${fromFile.readingMinutes} min).`,
);
