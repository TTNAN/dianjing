<div align="center">

<img src="favicon.svg" width="56" alt="点睛" />

# 点睛 Dianjing

**圈出来，说清楚。**

AI 生成的界面总差那么一点。把截图拖进来，圈出你觉得不对的地方，<br/>
点睛把「感觉」翻译成设计师的语言，让你先看到改完的样子，<br/>
再交给 Cursor、Claude Code、Trae、通义灵码一段一次就能听懂的提示词。

[**在线试用 →**](https://ttnan.github.io/dianjing/) &nbsp;·&nbsp; [English](README.en.md) &nbsp;·&nbsp; MIT 开源 &nbsp;·&nbsp; 零构建、纯前端

<br/>

![点睛 · 首页](docs/redesign/01-empty.png)

</div>

---

## 名字的由来

**画龙点睛**：一幅画最后点上眼睛，整条龙才活过来。

AI 写出来的界面往往有八十分，剩下的二十分差在一个圆角、一层投影、一处留白。你看得出不对，却说不清哪里不对。点睛帮你把这一笔点准。

## 两个模式

### 一 · 改截图：圈出来，说清楚

![改截图](docs/redesign/02-demo-selected.png)

- **圈选**：上传、拖入或 ⌘/Ctrl + V 粘贴任意截图（网页、安卓、iOS、小程序、设计稿都行），拖一下框住想改的元素。框可以移动、缩放、用方向键微调，Ctrl/⌘ + 滚轮放大看细节。
- **转译**：「更高级」「太乱了」这类一句话方向，加上 7 大类 27 个词条的设计词典（间距、层级、颜色、排版、质感、布局、风格），悬停就能看到白话解释。
- **一眼对比**：18 组「前 → 后」小图，比如圆角 → 直角、实心 → 描边、浅底 → 深底、通栏 → 内缩悬浮，不懂术语也能一眼看懂。互斥的方向会自动取消。
- **预览**：在内置示例上点一个元素，右侧只列出它适用的 2–4 种改法，点一下图就直接变，可以撤销、重置，也能对比原图。上传自己的截图时，可以让 AI 生成三个方案，贴回原图后拖滑块对比改前改后。
- **交付**：中英文提示词一键复制，包含坐标、语义位置、框内文字和编号标注图。没给方向的框不会写进提示词。

### 二 · 画界面：拼出来，一次说全

![画界面](docs/redesign/03-sketch.png)

- **16 种中文零件**：按钮、标签片、卡片、列表项、底部导航等，点一下就加进屏幕，在画布上拖动排序。
- **连跳转、切页预览**：卡片和按钮可以连到其他屏幕（7 种过渡动画），点「预览切页」就能像真 App 一样点着走。
- **五套风格包**：一键切换整套审美，包括字体搭配、配色、圆角、阴影、动效。提示词里会写出具体规范，AI 才能把「高级」做出来。
- **面向国内生态**：目标平台可选微信小程序、uni-app、Taro、鸿蒙 ArkUI、Flutter；组件库可选 Vant、TDesign、Ant Design Mobile、NutUI。提示词按所选体系的组件名来写。
- **自动保存**：设计保存在浏览器里，刷新后还在。

![五套风格包](docs/redesign/04-style-packs.png)

| 风格包 | 气质 |
|---|---|
| 极简 Minimal | 苹果式克制 · 白底 · 大圆角 · 轻投影 |
| 编辑杂志 Editorial | 米白 · 宋体大标题 · 直角细线 |
| 东方 Oriental | 宣纸 · 墨 · 朱砂 · 宋体 |
| 暗夜奢华 Noir | 近黑 · 香槟金 · 衬线 |
| 柔光玻璃 Soft Glass | 浅彩渐变 · 毛玻璃卡片 |

## 动效演示

![演示](docs/redesign/demo.gif)

[高清 mp4](docs/redesign/demo.mp4)

## 为什么做这个

能帮 AI「定位」元素的工具已经很多了（React Grab、Agentation、stagewise、ComposeBridge……），但它们只解决了**改哪里**。真正卡住大多数人的是**改成什么**：你觉得底栏「很廉价」，却说不出「悬浮胶囊、大圆角、柔和投影、选中项实心高亮」。

| | 定位类工具 | 点睛 |
|---|---|---|
| 告诉 AI 改哪个元素 | ✅ | ✅ 截图坐标 + 语义位置 + 编号标注图 |
| 把模糊感受翻译成设计术语 | ❌ | ✅ 设计词典 + AI 识别推荐 |
| 不懂术语也能表达 | ❌ | ✅ 一眼对比，点一下就懂 |
| 改之前先看效果 | ❌ | ✅ 点一下图就变 / 三个方案贴图对比 |
| 需要源码或特定框架 | 需要 | **不需要**，任何截图都行 |

## 生成的提示词长什么样

```
# UI 修改请求
我在一张 780×1688px 的界面截图上标出了 1 处要改的地方（标注图已附上，编号与框对应）。只修改这些元素，其余保持不变，并优先复用项目里已有的设计变量和组件。

## 1. 底部导航栏 — 底部通栏
- 位置：x=4, y=1532, 宽 772, 高 152（截图像素）
- 现状：白色通栏底栏，灰色线性图标
- 期望修改：
  - 布局：贴边通栏改为四周留边距的悬浮条（左右 16px、底部 12px、大圆角、投影）
  - 提升质感：克制的配色、更多留白、更精细的字重层次、细腻的投影和圆角
- 我的原话：看起来很廉价，想要像苹果那样

动手前先根据文字和位置找到渲染每个元素的组件；改完后简要列出你改了哪些文件。
```

## AI 模型（可选）

不配置模型，圈选、词典、一眼对比、点一下就变、画界面、提示词输出都能用。

填入任意 **OpenAI 兼容的视觉模型**后，会多出两个功能：**AI 识别**（自动认出元素，指出问题并推荐改法）和**三个方案预览**。支持 OpenAI、通义千问、智谱 GLM、Gemini、OpenRouter 和本地 Ollama。API Key 只保存在你自己的浏览器里，请求直接发往你选的服务商，不经过任何第三方服务器。

## 快速开始

直接打开 **[在线试用](https://ttnan.github.io/dianjing/)**，点「先看看示例」。

本地运行，无需构建，也无需安装依赖：

```bash
git clone https://github.com/TTNAN/dianjing.git
cd dianjing
python3 -m http.server 8000   # 或 npx serve
# 打开 http://localhost:8000
```

> 项目使用 ES Modules，请通过本地服务器打开，不要直接双击 `index.html`。也可以一键部署到 GitHub Pages、Vercel、Netlify。

## 目录结构

```
index.html           页面骨架
favicon.svg          图标
assets/fonts/        字体子集（Noto Serif SC + Inter，SIL OFL），离线、国内都能加载
src/app.js           改截图：圈选、检查器、点一下就变、动效
src/demo.js          内置示例「山居 · 民宿」（SVG，可按元素重绘）
src/vocab.js         设计词典 + 一眼对比（最欢迎 PR 的地方）
src/prompt.js        提示词组装（中 / 英）
src/llm.js           OpenAI 兼容接口：识别 + 三方案
src/sketch.js        画界面：零件、屏幕、风格包、提示词生成
src/styles.css       全局视觉：宣纸 · 墨 · 朱砂
src/sketch.css       画界面样式
tests/unit.test.mjs  单元测试
tests/e2e.py         Playwright 端到端测试与录屏
```

## 测试

```bash
node --test tests/unit.test.mjs   # 单元测试
python3 -m http.server 8766       # 在仓库根目录起静态服务
python3 tests/e2e.py              # 需已安装 playwright + chromium
```

## 路线图

- [x] 截图圈选、设计词典、一眼对比、三方案预览、提示词输出
- [x] 点一下就变：在示例上直接改图，按元素过滤改法
- [x] 画界面：零件、跳转、切页预览，支持国内平台和组件库
- [x] v0.6 界面重做（宣纸 · 墨 · 朱砂）、五套风格包
- [ ] 浏览器插件：在任意网页上直接圈选，不用截图
- [ ] MCP Server：让 Claude Code / Cursor 直接读取圈选结果
- [ ] 接入 React Grab、Agentation、ComposeBridge 等定位工具，补上源码位置
- [ ] 安卓：通过 adb 截屏 + 无障碍树，自动获取真机界面
- [ ] 更多风格包，词典扩充到动效、表单、数据可视化、无障碍

完整更新记录见 [CHANGELOG](CHANGELOG.md)。

## 参与贡献

最有价值的贡献是扩充 `src/vocab.js`：

- **设计词典词条**：`hint`（白话解释）+ `prompt.zh` / `prompt.en`（精确说法）
- **一眼对比**：`before` / `after`（两段迷你图示）+ `prompt`
- **风格包**：在 `src/sketch.js` 里加一套字体、配色、圆角、阴影、动效规范

欢迎提 Issue 和 PR。

## 许可

[MIT](LICENSE) © 2026 Caesar T

画界面模式参考了 [lnkiai/m3e-canvas](https://github.com/lnkiai/m3e-canvas)（MIT），字体使用 Noto Serif SC 与 Inter（SIL OFL）。改编来源与版权声明见 [NOTICE](NOTICE)。
