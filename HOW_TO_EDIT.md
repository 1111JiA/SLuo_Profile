# 如何修改个人网站

网站使用普通 HTML、CSS 和 JavaScript，无需安装软件或运行构建工具。

**日常文字、日期、技能等级、链接和图片路径都在 `content.js`。** GitHub 仓库首页的介绍另在 `README.md` 中维护。

## 在 GitHub 上修改

1. 打开 [SLuo_Profile 仓库](https://github.com/1111JiA/SLuo_Profile)。
2. 打开 `content.js`，点击铅笔图标 **Edit this file**。
3. 修改双引号内的文字，保留引号、逗号和括号。
4. 点击 **Commit changes**，提交到 `main`。
5. 在 **Actions** 中确认最新一次发布显示绿色勾号，再刷新[个人网站](https://1111jia.github.io/SLuo_Profile/)。

只在电脑上保存文件不会自动更新线上网站。需要提交并上传到 GitHub；也可以直接使用上述网页编辑方式。

## 内容分区

| `content.js` 注释编号 | 修改内容 |
| --- | --- |
| 01 | 浏览器标题、页面描述、语言 |
| 02 | 邮箱、LinkedIn、GitHub、CV 链接 |
| 03 | 导航文字；保留 `target` 中的栏目地址 |
| 04 | 姓名、当前身份、About Me 正文 |
| 05 | MSJ Furniture 与 FERO CASA 的日期、职位、工作内容 |
| 06 | 学历、成绩、论文说明，以及 LMU 学历下的研究链接 |
| 07 | 工具、技能等级、语言及兴趣 |
| 08 | 联系方式按钮的文字和页脚 |
| 09 | 肖像图片路径、替代文字、裁切设置 |
| 10 | 菜单与无障碍提示等界面文字 |

网站只有四个主栏目：Home、Experience、Education & Skills、Contact。研究入口放在 LMU 学历下；研究文件仍保存在 `research/` 中。

## 修改文字时注意

- 通常只改双引号里的内容，例如 `"level": "Intermediate"`。
- 一段文字对应一个字符串。不要在字符串中直接换行。
- 英文单引号可以直接使用；文字中的双引号要写成 `\"`。
- 用 `""` 保留空字段，不要删除字段名。
- 添加经历时，复制一整个 `{ ... }` 条目，再修改其中的文字。相邻条目之间保留逗号。
- 技能等级使用与简历一致的表述，例如 `"Basic"` 或 `"Intermediate"`。

## 肖像照片

进入仓库的 `assets` 文件夹，选择 **Add file → Upload files**，上传 `portrait.jpg` 并提交。缺少照片或图片无法读取时，网站会显示整洁的占位框。

如果使用其他文件名，在第 09 节修改 `src`，并更新 `alt` 描述。文件名大小写和扩展名必须一致。`fit: "cover"` 会裁切填满画框；可以调整 `position`，例如 `"center top"`。

旧研究图仍保存在仓库中，用于研究 README。个人照片画廊不再单独显示。

## CV 下载目前关闭

按你的要求，第 02 节保留 `"resume": ""`。页面上的 CV 按钮显示为不可用，不会链接到未确认公开的简历。

以后确定公开版本时：

1. 上传 PDF 到 `assets/resume.pdf`。
2. 将第 02 节改为 `"resume": "assets/resume.pdf"`。
3. 提交后，导航及 Contact 中的 CV 按钮会一起生效，在新标签页中打开 PDF。

网站文字与 PDF 不会自动同步。修改履历时，记得分别更新两处。

## 修改邮箱与外部链接

邮箱填写完整地址，网站会自动生成邮件链接。点击后会打开访问者设置的邮件应用。

LinkedIn 和 GitHub 填写完整的 `https://` 地址。两处研究链接在第 06 节对应学历的 `research` 列表中修改。

## 本地预览和恢复

双击 `index.html` 可以预览。修改后保存并刷新；Mac 可用 **Command + Shift + R** 强制刷新。

页面空白时，先撤销最近一次改动，检查是否缺少引号、逗号或括号。建议大改之前备份 `content.js`。使用 TextEdit 时选择纯文本格式并关闭智能引号，避免保存成 `.txt` 或富文本。

`script.js` 控制展示和交互，`styles.css` 控制外观，`index.html` 加载文件。日常改内容不需要编辑这三个文件。

## GitHub Pages

发布配置位于 `.github/workflows/pages.yml`。GitHub 的 **Settings → Pages → Source** 使用 **GitHub Actions**；提交到 `main` 后会自动发布。

- [个人网站](https://1111jia.github.io/SLuo_Profile/)
- [项目总览](https://github.com/1111JiA/SLuo_Profile)
- [跨国环保行为研究](https://github.com/1111JiA/SLuo_Profile/tree/main/research/cross-national-environmental-behaviour)
- [Reddit 研究](https://github.com/1111JiA/SLuo_Profile/tree/main/research/reddit-organic-food-research)
