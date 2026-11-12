# 更新日志 / Changelog

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
