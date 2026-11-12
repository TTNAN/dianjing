# 更新日志 / Changelog

## v0.5.5 (2026-11-12)
- 旧种子自动迁移：v0.5.4 只换了种子（新用户看到旅行记录），但之前打开过画界面的浏览器里还存着旧的菜谱设计，种子换了也动不了它。打开时如果存的是「没动过的菜谱示例」（标题菜谱、2 屏 14 个零件、卡片宫保鸡丁、按钮开始做饭全对上），就自动换成旅行记录；自己改过标题、关键零件或零件数的设计一律不动。单元 19/19，真机三态（旧种子迁过来、改过的留原样、全新进旅行）全过
- README 视频改走附件库：仓库里的 mp4 在 README 里永远只是下载链接（GitHub 只给 user-attachments 的链接渲染播放器）。视频已传到附件库，README 中英文改贴裸链接，渲染确认是 `<video controls>` 播放器；注意附件要被已提交的内容引用过一次才公开，光传完关掉草稿会 404；PAT 调上传口子被拒 401，只认浏览器登录

- Old seed auto-migration: v0.5.4 only changed the seed (new visitors got the travel journal), but browsers that had opened sketch mode before still held the saved recipe design — a new seed never touches it. On open, a saved doc that is still the untouched recipe example (title 菜谱， 2 screens, 14 parts, card 宫保鸡丁， button 开始做饭） is swapped for the travel journal; any design you edited (title, key parts, part count) is left alone. Unit 19/19; live three-state check passed

## v0.5.4 (2026-11-12)
- 黑块根治：模式切换的黑底不再是靠 JS 量尺寸再推过去的滑块（样式晚到一步就会量错、再也不纠正，「图」字右半边伸到灰底上就是这么来的）。现在选中按钮本身就是黑底（纯 CSS），黑块永远等于按钮盒子，量不错的可能没了
- 内置示例换成旅行记录：画界面的种子示例从菜谱应用改成旅行记录应用（首页：大理三日卡片 + 京都樱花、成都美食行、厦门海边漫步；详情页：行程、花费、写游记），零件库的默认文案同步换成旅行口径；文档截图与演示视频同步重录
- 演示视频重压到 1MB 以内：3.07MB 时 GitHub 不给内联预览（“we can't show files that are this big”），现 0.97MB、960×618、15fps

- Black pill, fixed for real: the mode-switch thumb is no longer a JS-measured slider (a late stylesheet made it measure the wrong width once and never correct it — that's how the 图 glyph ended up half past the black edge). The selected button is now black by pure CSS, so the pill always equals the button's own box
- Seed example is now a travel journal: sketch mode's built-in app changed from recipes to a travel journal (home: 大理三日 card + three trips; detail: 行程、花费、写游记), part-library defaults switched to travel wording; docs screenshots and demo video re-recorded

## v0.5.3 (2026-11-12)
- 手机顶栏再改：v0.5.1 那版在 390 宽是一行塞进去的，总宽 386、只剩 4px 余量，真机字体稍大就得挤爆。现在手机上模式切换永远独占一行、拉满整宽，两按钮各占一半（以后加第三个模式也放得下），320 / 360 / 390 三档均无重叠、无横向溢出

- Mobile header, round two: the v0.5.1 header still squeezed everything onto one row at 390px (386px of content, 4px of slack) — any font scaling on a real phone would overflow it. On phones the mode switch now always takes its own full-width row, the two buttons split it 50/50 (a third mode would fit too). Verified at 320 / 360 / 390px: no overlap, no horizontal overflow

## v0.5.2 (2026-11-12)
- 样式加版本戳：v0.5.1 的修复已经在线上，但手机浏览器还攥着部署前的旧样式（截图里「载入示例」和 Dianjing 还在就是证据），光靠刷新不一定重新下载。现在 CSS 和 JS 链接都带上 `?v=0.5.2`，地址一变浏览器必须拉新的，以后每次发版改一位数就行

- Cache-busting asset URLs: the v0.5.1 fix was live, but phone browsers can keep serving the pre-deploy stylesheet (the stale screenshot still showed the demo button and the Dianjing wordmark that the new CSS hides). CSS and JS links now carry `?v=0.5.2`, so a new deploy always fetches fresh

## v0.5.1 (2026-11-12)
- 手机端顶栏修好：之前顶栏不换行，v0.5 新加的模式切换把总宽推到 600 多，390px 的手机上品牌、切换、按钮全叠在一起。现在窄屏（≤960px）顶栏可换行、切换单独居中一行（放得下时仍在一行），品牌只留 logo + 点睛，顶栏的「载入示例」收起来（空状态里还有「先看看示例」）；画界面在手机上改为零件库、画布、检查器上下堆叠
- 端到端加了 390px 手机检查：空状态、示例、画界面、预览四态均无横向溢出

- Mobile header fixed: the top bar never wrapped, and the v0.5 mode switch pushed its total width past 600px, so brand, switch and buttons all piled up on a 390px phone. Below 960px the bar now wraps (switch on its own centered row when needed), the brand keeps only logo + 点睛， and the header demo button is hidden (the empty state still has one). Sketch mode stacks parts / canvas / inspector vertically on phones
- E2E now includes a 390px mobile check: no horizontal overflow in empty, demo, sketch or preview states

## v0.5 (2026-11-12)
- 新模式「画界面」：顶栏「改截图 / 画界面」切换，照 m3e-canvas 的骨架做的中文版——16 种中文零件点一下加进屏幕，卡片、按钮可在触发里连跳转（7 种过渡动画），点「预览切页」进播放器，点一下滑到下一页、返回退栈
- 整套设计实时生成十段结构的中提示词（配色、形状字体动效、屏幕结构、行为跳转、组件样式、整体原则），一键复制给 Claude Code / Codex / Cursor；主题可选蓝/紫/绿三套配色与方/圆/全圆三档圆角
- 内置一套中文菜谱示例（首页 → 详情页），新屏幕自带状态栏与引导，零件加在底栏前面；设计自动保存在浏览器里，刷新还在
- 改截图模式原样不动（v0.4 的全部流程回归通过）

- New mode "画界面" (Sketch screens): switch modes in the top bar — a Chinese take on m3e-canvas. 16 Chinese parts, click to add to the current screen; cards and buttons link to other screens (7 transitions); the preview player plays the tap-through flow with a history stack
- The whole design generates a live 10-section Chinese prompt (colors, shape/type/motion, screen structure, behavior & navigation, component styles, principles) — one click to copy into Claude Code / Codex / Cursor; 3 palettes (blue/purple/green) × 3 corner styles; autosaved to the browser
- Ships with a Chinese recipe example app (Home → Detail); new screens come with a status bar and guidance; new parts insert above the bottom nav
- The annotate mode is untouched (v0.4 flows all pass regression)

## v0.4 (2026-11-12)
- 点一下就变：内置示例是活的——圈中元素后，点右侧「一眼对比」里的建议（圆角→直角、实心→描边、放大、变深色……），改动直接画进图里，立刻看得见；再点一下取消；左下角「◐ 对比原图」可在原图和改后之间切换
- 横排变竖排、列表变网格这两类改布局的，点一下在原位置弹出本地重排预览，滑块擦除对比
- 提示词照样实时生成，和图上的变化同步
- 上传的截图是像素、改不了本身，那边仍靠 AI 方案贴图看变化（词条照样写进提示词）

- Click to change: the built-in demo is live — circle an element, click a suggestion in "一眼对比" (round → square, solid → outline, bigger, darker…), and the change is drawn right into the picture; click again to undo; "◐ 对比原图" at the bottom left flips between original and changed
- Layout changes (row → column, list → grid) pop a local re-layout preview in place, with the wipe slider
- Prompts still generate live, in sync with what's on screen
- Uploaded screenshots are pixels and can't be restyled — there, AI variants remain the way to see the change (terms still go into the prompt)

## v0.3 (2026-11-12)
- 工具页改成浅色：白底＋浅灰卡＋鲜蓝 #246FFF（按 BoardUI 实测配色），深色毛玻璃、极光背景、噪点全部拿掉；选中态改成黑色滑动胶囊（EasyUI 的路子）
- 暖灰画布（Oil UI 的路子）：舞台与面板改成浅暖灰 #F4F3F0，卡片换成白底＋细边框；模型设置改成右侧抽屉；“圈出想改的地方”提示加了引导脉冲
- Logo 换成取景眼：眼睛＋四角取景框；favicon 用 16px 下的简化眼睛
- 标注框、按钮、眼睛 logo、标注图导出颜色全部换成蓝色

- Light theme for the tool page: white + light-gray cards + vivid blue #246FFF (BoardUI palette); dark glass, aurora and grain removed; selected states use a black sliding capsule (EasyUI)
- Selection boxes, buttons, the eye logo and annotated-image export are all blue now

## v0.2 (2026-11-12)
- 方案贴回原图：选中的方案直接覆盖在原截图对应区域上，滑块擦除对比改前改后
- 框选可改：拖框体移动、拖四角缩放、方向键微调（Shift ×10）、数字坐标输入、Ctrl/⌘+滚轮缩放
- 界面收敛：单主色（粉→珊瑚）、眼睛 logo、设计词典默认收起+搜索、快捷方向可开关、空状态提示词框瘦身
- 示例界面重做：旅行 App 示例换成 BoardUI 风格的手机端数据看板（收入折线图、订单卡片、状态徽章），按 BoardUI 实测配色：白底＋浅灰卡＋鲜蓝 #246FFF
- 一眼对比小图放大加深（平面→悬浮等弱差异项已加重），白话气泡改为折行限宽、不再盖住下一行
- 提示词更准：框内文字写进提示词、没提方向的空区域不写、互斥方向自动取消相反项
- 自动保存：圈选结果存浏览器 localStorage，刷新还在；新增文字+标注图一并复制
- 测试从录屏升级为断言：端到端覆盖圈选/识别/互斥/贴图/移动/缩放/持久化/复制，新增 8 个单元测试

- Variants now preview in place on the original screenshot, with a wipe slider to compare before/after
- Boxes can be moved, corner-resized, arrow-key nudged and numerically edited; Ctrl/⌘+wheel zooms
- Visual restraint: single accent (pink→coral), eye logo, collapsible searchable vocabulary, toggleable quick directions, slimmer empty state
- Demo rebuilt: the travel app example is now a BoardUI-style mobile dashboard (revenue chart, order cards, status pills), using BoardUI's measured palette: white + light-gray cards + vivid blue #246FFF
- Visual tweaks enlarged with stronger after-states; vocabulary tooltips now wrap instead of covering the next row
- Better prompts: region text included, empty regions skipped, conflicting directions auto-cancelled
- Autosave to localStorage; one-click copy of prompt text plus annotated image
- Tests now assert: e2e covers circling/recognition/conflicts/in-place preview/move/zoom/persistence/copy, plus 8 unit tests

## v0.1 (2026-11-12)
- 首个公开版本：截图圈选、一句话方向、一眼对比（18 张前→后图示）、设计词典（7 类 27 词条）、AI 识别、三方案预览、中英提示词、标注图导出
- 深色毛玻璃界面与全流程动效，内置旅行 App 示例

- First public release: screenshot circling, one-tap directions, 18 visual before→after tweaks, 27-term design vocabulary, AI recognition, three live variations, bilingual prompt output and annotated image export
- Dark glass UI with motion throughout; built-in travel app example
