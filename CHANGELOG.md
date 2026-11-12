# 更新日志 / Changelog

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
