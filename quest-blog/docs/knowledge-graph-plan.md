# LLM-Wiki：路线 A 实现

## 当前公开范围

用户允许公开三个语雀知识库，并补充确认 Notion 的 Alisa’s LLM notebook 也已公开：

| 知识库 | 来源登记中的稳定标识 |
| --- | --- |
| Algorithm | `shakewin/woezs0` |
| Engineering | `shakewin/sysgq3` |
| ML Course | `shakewin/fidaqi` |
| Alisa’s LLM notebook（Notion） | `notion:388cad4f-b605-8074-8c53-ff558a15beb0` |

当前从 LLM-Wiki 提取 **82 篇笔记、232 条关系**。这些是已有知识库内容的概念整理，不是四个来源全部文档的镜像。

- 笔记必须具有来源，且每个来源均属于以上四项；同时核验 provider、稳定标识、来源登记名称。Notion 在登记中名为 Alisa’s book of LLMs，归属 Docs 集合；仅允许该笔记的准确 source ID，不放开整个 Docs 集合。
- 四个允许来源之间的混合引用可以纳入。仍排除 13 篇混合了未授权来源的笔记及 11 篇其他来源笔记，不纳入 Project Notes、其他 Notion 页面或未知来源。
- 关系两端必须都是允许公开的笔记，不虚构或补造关系。
- 每篇笔记附有知识库归属，可按 Algorithm、Engineering、ML Course、Alisa’s LLM notebook 筛选。
- 正文中指向已纳入笔记的链接转换为网页链接；未纳入笔记的引用保留为当前笔记的普通文字，不输出目标笔记正文或 URL。
- 正文若包含范围外的语雀或 Notion 来源链接，导出失败，要求先核对来源。

## 已实现

`/garden/` 展示真实图谱和 Markdown 正文，支持搜索、知识库/类型筛选、Graph / List、关系方向和类型、Connections、缩放、拖动、重置。链接如 `/garden/#paged-attention` 支持直接选中笔记和浏览器返回/前进。首页 Inventory 使用同一份数据生成预览。

## 数据与更新

快照：`src/data/llm-wiki.json`。范围策略：`scripts/wiki-publication-policy.mjs`。导出：`scripts/sync-wiki.mjs`。

```sh
npm run sync:wiki -- --repo /absolute/path/to/llm-wiki
npm test
npm run build
```

脚本读取 schema v2 图谱、wiki Markdown 和来源登记，完成筛选后原子替换网站快照。来源登记仅用于本地核验，不导出至浏览器。导出字段包括正文、概念信息、知识库名称、布局和关系；排除 frontmatter、生成关系块、工作区设置、同步报告、凭证和 Git 历史。ReactMarkdown 禁用原始 HTML。

图谱是构建时快照，不实时读取 Obsidian。笔记原始来源链接能否免登录打开，取决于语雀 / Notion 的公开设置；来源登记中的旧 public 状态不替代用户本次授权。

博客发布沿用 GitHub Pages 工作流，不修改 LLM-Wiki 源仓库、语雀或 Notion 可见性。公开整个 LLM-Wiki 仓库不属于当前执行范围。

## 验收

测试覆盖允许来源、混合来源、未知来源、空来源、同名不同标识、获准 Notion 页面、同集合未授权页面、Notion 多域名链接、来源链接限制、内部链接降级、有效边端点、正文、布局及快照结构。生产构建执行 TypeScript 校验。
