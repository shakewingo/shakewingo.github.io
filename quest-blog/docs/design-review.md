# 当前设计与验收

## 命名与文案

- 主栏目统一为 Quest Log、About、Inventory；项目统一为 Rally、LLM-Wiki。
- 删除星球旁的重复链接、页眉页脚的装饰性小标题、阅读口号和项目编号。
- 首页只保留一个欢迎句，游戏氛围主要由像素星球与配色承载。
- Experience、Education、Research 等标签表示真实内容分类。
- 页脚保留 Have fun 和真实频道链接。

## LLM-Wiki

用户选择路线 A，当前公开范围为 Algorithm、Engineering、ML Course 三个语雀知识库，加上 Notion 的 Alisa’s LLM notebook。现在使用来源完全匹配的 82 篇笔记、232 条关系；排除 24 篇仍含未授权来源的笔记。后续同步方式见 README 与 knowledge-graph-plan.md。

- Relationships 改为自动换行的紧凑标签，每项仅显示关系方向、类型和关联笔记；完整关系保留在辅助标签与悬停提示中，点击可继续阅读。

## 验收记录

- ESLint、TypeScript / Next 静态构建通过。
- 文章摘要回归测试通过。
- 图谱数据测试覆盖：笔记正文非空、ID 唯一、关系端点、笔记内链接、布局边界、排除来源登记字段。
- 上一版 Chrome 中核验过节点阅读、深链接刷新、Connections、Graph / List、无结果搜索及重置。这些是筛选范围修改前的历史记录，不作为本次来源筛选的验收证据。
- 本次增加来源权限与内部链接回归测试，并核对快照全部笔记来源和静态产物。Notion 补充测试覆盖允许页面、同集合其他页面、与获准语雀来源混合、与未授权来源混合，以及 notion.com / notion.so / notion.site 链接。
- 第一版力学布局把节点挤到了边缘，已修正排斥力并规范化坐标；重新渲染布局检查节点分布。
- Chrome 可访问性树确认 Relationships 已变为单个可点击标签；验证 Reward Modeling → Direct Preference Optimization 跳转。截图工具返回空白，完整视觉和手机验收仍不列为通过。

## 发布方式

用户已审核并授权提交、发布。博客通过 master 分支的 GitHub Pages 工作流部署；LLM-Wiki 源仓库可见性不随博客发布改变。根目录与旧 Jekyll 目录的原有改动、个人简历文件不纳入此次博客提交。
