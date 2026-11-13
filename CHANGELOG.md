# 更新日志 / Changelog

## v0.5.7 (2026-11-13)

- 演示改玩法：图本身就能点改，点一下元素直接换下一个样子，不用再圈选、不用再翻 18 格小图；搜索栏、胶囊、主卡、订单卡、底栏、头像、文字，每个都能改
- 演示只留一条操作条：点图提示、已改几处、撤销、重置、复制提示词；一眼对比、设计词典和提示词框在演示里收起来了，自己传的截图不受影响
- 复制提示词一次拿中英两份；点错了可以撤销，改乱了可以一键重置
- 一眼对比的两张小图修好了：纯色 → 渐变的后一张真能看出渐变，通栏 → 内缩悬浮的前一张不再画残

- Demo is now directly editable: click any element on the image to switch it to its next look — no more circling, no more 18-tile grid; search bar, chips, hero card, order cards, tab bar, avatar and text can all be changed
- The demo view now has a single action bar: hint, change count, undo, reset and copy prompt; visual tweaks, vocab and the prompt box are hidden for the demo, while uploaded screenshots keep the full flow
- Copy prompt now gives both Chinese and English in one go; undo a misclick, reset everything with one tap
- Fixed two visual-tweak thumbnails: solid → gradient now clearly shows a gradient, and full-width → inset no longer renders a broken bar

## v0.5.6 (2026-11-12)

- 顶栏与空状态：模式切换器在两个模式下都居中，不再跳动；空状态下顶栏不再重复出现上传截图 / 载入示例按钮
- 一眼对比的小图和画界面的卡片图都换成品牌蓝色
- 画界面：内容太多时底栏固定在手机框底部，超出的部分会提示「还有更多内容」；新加的零件自动滚到眼前；跳转徽章只在悬停或选中时出现
- 画界面：目标平台与组件库可选，提示词按所选体系写组件名——微信小程序、uni-app、Taro 配 Vant、TDesign、Ant Design Mobile、NutUI，鸿蒙用 ArkUI 原生组件，Flutter 用 Flutter Widgets；默认仍是 Web + Material 3，老设计不受影响
- 画界面：画布上方能换设备框、缩放和背景；检查器新增「调节」（密度、字号、圆角滑条 0–32 px、阴影），实时作用到画布并写进提示词；零件能调对齐和透明度；预览里能调过渡时长和自动播放
- 手机外框改成居中打孔摄像头，和提示词里的 Material 3 方向一致
- 缓存修复：升级后浏览器一定拉新的 JS，不会再显示旧界面；画界面模式的改编来源是 m3e-canvas，见 NOTICE 文件

- Top bar and empty state: the mode switch is centered in both modes and no longer jumps; the header no longer repeats the upload / demo buttons in the empty state
- Visual tweaks and the sketch card artwork are now brand blue
- Sketch mode: with many parts the bottom bar stays pinned to the phone frame, an overflow hint appears, newly added parts scroll into view, and navigation badges only show on hover or selection
- The phone frame now has a centered punch-hole camera, matching the Material 3 direction in the prompt
- Cache fix: after an update the browser always fetches fresh JS; Sketch mode credits m3e-canvas as its adaptation source (see NOTICE)

## v0.5.5 (2026-11-12)

- 画界面示例换成旅行记录；之前打开过画界面的人再打开，会自动看到新示例，自己改过的设计不受影响
- README 里的演示视频可以直接播放了

- The sketch example is now a travel journal; if you opened sketch mode before, it switches over automatically — your own edits are untouched
- The demo video in the README now plays inline

## v0.5.4 (2026-11-12)

- 手机上模式切换的选中底色不再错位
- 画界面示例换成旅行记录（首页大理三日 + 三个行程；详情页行程、花费、写游记）
- 演示视频压到 1MB 以内，打开更快

- The mode-switch pill no longer misaligns on phones
- The sketch example is a travel journal (home: 大理三日 card + three trips; detail: itinerary, costs, write a journal)
- The demo video is now under 1MB and opens faster

## v0.5.3 (2026-11-12)

- 手机上模式切换永远独占一行、拉满整宽，两个按钮各占一半

- On phones the mode switch always takes its own full-width row, split 50/50

## v0.5.2 (2026-11-12)

- 升级后浏览器一定拉新的样式和脚本，不会再显示旧界面

- After an update the browser always fetches fresh styles and scripts

## v0.5.1 (2026-11-12)

- 手机端顶栏修好：品牌、切换、按钮不再叠在一起；画界面在手机上改为零件库、画布、检查器上下堆叠

- Mobile header fixed: brand, switch and buttons no longer pile up; sketch mode stacks parts, canvas and inspector vertically on phones

## v0.5 (2026-11-12)

- 新模式「画界面」：16 种中文零件点一下加进屏幕，卡片、按钮可以连跳转（7 种过渡动画），点「预览切页」进播放器，点一下滑到下一页、返回退栈
- 整套设计实时生成十段结构中文提示词，一键复制给 Claude Code / Codex / Cursor
- 主题可选蓝/紫/绿三套配色与方/圆/全圆三档圆角；设计自动保存在浏览器里
- 内置一套中文菜谱示例（首页 → 详情页）；改截图模式原样不动

- New mode "画界面" (Sketch screens): 16 Chinese parts, click to add to the current screen; cards and buttons link to other screens (7 transitions); the preview player plays the tap-through flow with a history stack
- The whole design generates a live 10-section Chinese prompt — one click to copy into Claude Code / Codex / Cursor
- 3 palettes (blue/purple/green) × 3 corner styles; autosaved to the browser
- Ships with a Chinese recipe example app (Home → Detail); the annotate mode is untouched

## v0.4 (2026-11-12)

- 点一下就变：内置示例上点「一眼对比」里的建议，改动直接画进图里，再点一下取消；左下角可以对比原图和改后
- 横排变竖排、列表变网格这两类改布局的，点一下在原位置弹出本地重排预览，滑块擦除对比

- Click to change: on the built-in demo, tap a suggestion in "一眼对比" and the change is drawn right into the picture; tap again to undo; compare original vs changed at the bottom left
- Layout changes (row → column, list → grid) pop a local re-layout preview in place, with the wipe slider

## v0.3 (2026-11-12)

- 工具页改成浅色：白底、浅灰卡、鲜蓝 #246FFF；舞台与面板改成浅暖灰，模型设置改成右侧抽屉
- Logo 换成取景眼；标注框、按钮、标注图导出颜色全部换成蓝色

- Light theme for the tool page: white + light-gray cards + vivid blue #246FFF; warm-gray canvas; model settings moved to a right-side drawer
- New viewfinder-eye logo; selection boxes, buttons and annotated-image export are all blue now

## v0.2 (2026-11-12)

- 选中的方案直接贴回原图上，滑块擦除对比改前改后
- 框可以拖动、缩放、方向键微调，也可以输数字坐标；Ctrl/⌘ + 滚轮缩放看细节
- 词典默认收起、可搜索；快捷方向可开关；框里能填文字，提示词里带上它
- 自动保存：圈选结果存浏览器，刷新还在；文字 + 标注图可以一次复制

- The chosen variation now previews in place on the original screenshot, with a wipe slider to compare before/after
- Boxes can be moved, corner-resized, arrow-key nudged and numerically edited; Ctrl/⌘+wheel zooms
- Vocabulary is collapsible and searchable; quick directions are toggleable; region text goes into the prompt
- Autosave to the browser; one-click copy of prompt text plus annotated image

## v0.1 (2026-11-12)

- 首个公开版本：截图圈选、一句话方向、一眼对比（18 张）、设计词典（7 类 27 词条）、AI 识别、三方案预览、中英提示词、标注图导出

- First public release: screenshot circling, one-tap directions, 18 visual before→after tweaks, 27-term design vocabulary, AI recognition, three live variations, bilingual prompt output and annotated image export
