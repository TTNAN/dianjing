// 设计词典：把"说不清"的感觉翻译成 AI 听得懂的设计语言。
// 每个词条：id（唯一）、zh / en（名称）、hint（给人看的白话解释）、prompt（写进提示词的精确说法，中/英）。
// 欢迎通过 PR 扩充词条 —— 这是本项目最核心的开源资产。

export const VOCAB = [
  {
    id: "spacing", zh: "间距与密度", en: "Spacing & density",
    terms: [
      { id: "more-padding", zh: "内边距加大", en: "More padding", hint: "内容离边框远一点，透气", prompt: { zh: "增大内边距（padding），让内容更透气", en: "Increase inner padding so the content breathes" } },
      { id: "less-padding", zh: "更紧凑", en: "More compact", hint: "收紧空白，一屏放更多", prompt: { zh: "减小内边距和元素间距，使布局更紧凑、信息密度更高", en: "Reduce padding and gaps for a more compact, information-dense layout" } },
      { id: "even-gap", zh: "间距统一", en: "Consistent spacing", hint: "大小不一的空隙变整齐", prompt: { zh: "统一子元素间距，使用 8px 栅格（8/16/24）", en: "Make child spacing consistent on an 8px grid (8/16/24)" } },
      { id: "align", zh: "对齐", en: "Alignment", hint: "东倒西歪的东西排齐", prompt: { zh: "修正对齐：子元素左对齐 / 基线对齐，消除视觉错位", en: "Fix alignment: left/baseline-align children and remove visual misalignment" } },
    ],
  },
  {
    id: "hierarchy", zh: "层级与重点", en: "Hierarchy & emphasis",
    terms: [
      { id: "stronger-primary", zh: "主次更分明", en: "Clearer hierarchy", hint: "一眼看出哪个最重要", prompt: { zh: "强化视觉层级：主信息更大更粗，次要信息弱化为灰色小字", en: "Strengthen visual hierarchy: make primary info larger/bolder and secondary info smaller and muted" } },
      { id: "cta", zh: "更突出的主按钮", en: "Prominent CTA", hint: "让人一眼想点", prompt: { zh: "把它做成醒目的主行动按钮（CTA）：品牌色实心填充、足够大的点击区域（≥44px 高）", en: "Make it a prominent primary call-to-action: solid brand color fill, large tap target (≥44px tall)" } },
      { id: "de-emphasize", zh: "弱化", en: "De-emphasize", hint: "太抢眼了，收一收", prompt: { zh: "弱化该元素：改为次级/幽灵样式，降低颜色饱和度和字重", en: "De-emphasize: use a secondary/ghost style, lower saturation and font weight" } },
      { id: "group", zh: "分组", en: "Grouping", hint: "相关的东西放一起", prompt: { zh: "按相关性分组（格式塔接近原则），组内间距小、组间间距大，必要时加分隔线或卡片容器", en: "Group related items (Gestalt proximity): tight spacing within groups, larger between, add dividers or card containers if needed" } },
    ],
  },
  {
    id: "color", zh: "颜色与对比", en: "Color & contrast",
    terms: [
      { id: "contrast", zh: "对比度更高", en: "Higher contrast", hint: "字看不清", prompt: { zh: "提高文字与背景对比度，至少满足 WCAG AA（4.5:1）", en: "Increase text/background contrast to at least WCAG AA (4.5:1)" } },
      { id: "brand-color", zh: "用品牌色", en: "Use brand color", hint: "颜色和整体不搭", prompt: { zh: "颜色改用页面已有的品牌主色，避免引入新颜色", en: "Use the page's existing brand primary color; don't introduce new colors" } },
      { id: "softer", zh: "更柔和", en: "Softer palette", hint: "颜色太刺眼", prompt: { zh: "降低饱和度，使用更柔和的浅色背景和中性色", en: "Lower saturation; use softer tinted backgrounds and neutral tones" } },
      { id: "dark-mode", zh: "深色模式", en: "Dark mode", hint: "改成黑底", prompt: { zh: "适配深色模式：深灰背景（非纯黑）、降低白字亮度、保持对比度", en: "Adapt to dark mode: dark gray (not pure black) background, slightly dimmed white text, keep contrast" } },
    ],
  },
  {
    id: "type", zh: "文字排版", en: "Typography",
    terms: [
      { id: "bigger-title", zh: "标题更大", en: "Larger heading", hint: "标题没存在感", prompt: { zh: "放大标题字号并加粗（如 20→24px，600 字重），与正文拉开差距", en: "Enlarge and bolden the heading (e.g. 20→24px, weight 600) to separate it from body text" } },
      { id: "line-height", zh: "行距舒展", en: "Comfortable line height", hint: "字挤在一起", prompt: { zh: "正文行高调到 1.5–1.7，段落间增加间距", en: "Set body line-height to 1.5–1.7 and add paragraph spacing" } },
      { id: "truncate", zh: "文字截断", en: "Truncate text", hint: "文字太长撑破了", prompt: { zh: "长文本单行省略（ellipsis）或最多两行截断，避免撑破布局", en: "Truncate long text with ellipsis (single line or max two lines) so it doesn't break the layout" } },
    ],
  },
  {
    id: "shape", zh: "形状与质感", en: "Shape & depth",
    terms: [
      { id: "rounder", zh: "圆角更大", en: "Rounder corners", hint: "太方太硬", prompt: { zh: "增大圆角（如 4→12px），风格更友好", en: "Increase border radius (e.g. 4→12px) for a friendlier look" } },
      { id: "shadow", zh: "加投影/悬浮感", en: "Elevation", hint: "太平了，没层次", prompt: { zh: "加入柔和投影营造悬浮层次（低透明度、大模糊半径）", en: "Add a soft shadow for elevation (low opacity, large blur)" } },
      { id: "flat", zh: "扁平化", en: "Flatter", hint: "阴影边框太多太花", prompt: { zh: "去掉多余阴影和渐变，改用细描边或浅底色区分层级", en: "Remove extra shadows and gradients; use hairline borders or subtle fills instead" } },
      { id: "glass", zh: "毛玻璃", en: "Glassmorphism", hint: "半透明模糊的高级感", prompt: { zh: "使用半透明背景 + 背景模糊（backdrop-filter: blur）的毛玻璃效果", en: "Use a glassmorphism effect: translucent background with backdrop blur" } },
    ],
  },
  {
    id: "layout", zh: "布局结构", en: "Layout",
    terms: [
      { id: "floating-tabbar", zh: "悬浮式底栏", en: "Floating tab bar", hint: "底栏变成浮起来的胶囊", prompt: { zh: "把底部导航栏改为悬浮胶囊样式：离底部和两侧留边距、大圆角、投影，选中项高亮", en: "Turn the bottom navigation into a floating pill: inset from edges, large radius, shadow, highlighted active item" } },
      { id: "grid", zh: "改成网格", en: "Grid layout", hint: "列表改成一格一格", prompt: { zh: "将列表改为两列网格卡片布局，卡片等宽等高", en: "Convert the list to a two-column grid of equal-size cards" } },
      { id: "sticky", zh: "吸顶/固定", en: "Sticky", hint: "滚动时一直在", prompt: { zh: "滚动时固定该元素（position: sticky），并在吸顶后加底部阴影", en: "Make it sticky on scroll and add a bottom shadow once stuck" } },
      { id: "responsive", zh: "适配小屏", en: "Responsive", hint: "手机上显示坏了", prompt: { zh: "适配小屏：窄于 375px 时纵向堆叠，保证可点击区域和字号不缩太小", en: "Make it responsive: stack vertically below 375px, keep tap targets and font sizes usable" } },
    ],
  },
  {
    id: "style", zh: "整体风格", en: "Overall style",
    terms: [
      { id: "premium", zh: "更高级", en: "More premium", hint: "看起来廉价", prompt: { zh: "提升质感：克制的配色（1 个主色 + 中性色）、更多留白、更精细的字重层次、细腻的投影和圆角", en: "Make it feel premium: restrained palette (one accent + neutrals), generous whitespace, refined type weights, subtle shadows and radii" } },
      { id: "playful", zh: "更活泼", en: "More playful", hint: "太严肃了", prompt: { zh: "更活泼：更明亮的配色、更大的圆角、可加入插图或 emoji 点缀", en: "More playful: brighter colors, bigger radii, optional illustration or emoji accents" } },
      { id: "minimal", zh: "更简洁", en: "More minimal", hint: "东西太多太乱", prompt: { zh: "做减法：去掉装饰元素和非必要信息，只保留核心内容与操作", en: "Simplify: remove decoration and non-essential info, keep only core content and actions" } },
      { id: "micro-motion", zh: "加微动效", en: "Micro-interactions", hint: "点了没反馈", prompt: { zh: "加入微交互：hover/按下时轻微缩放或变色，过渡 150–200ms ease-out", en: "Add micro-interactions: subtle scale/color change on hover/press, 150–200ms ease-out transitions" } },
    ],
  },
];

// 一句话快捷方向：不懂术语也能点
export const QUICK = [
  { zh: "更高级", en: "More premium", terms: ["premium", "shadow", "even-gap"] },
  { zh: "更紧凑", en: "More compact", terms: ["less-padding", "even-gap"] },
  { zh: "更醒目", en: "Stand out", terms: ["cta", "contrast"] },
  { zh: "更简洁", en: "Cleaner", terms: ["minimal", "flat"] },
  { zh: "看不清", en: "Hard to read", terms: ["contrast", "line-height"] },
  { zh: "太乱了", en: "Too messy", terms: ["align", "group", "even-gap"] },
];

export const TERM_INDEX = Object.fromEntries(
  VOCAB.flatMap((cat) => cat.terms.map((t) => [t.id, { ...t, category: cat }]))
);

// 互斥方向：同时选会让提示词自相矛盾，选其一时自动取消另一个
export const CONFLICTS = [
  ["v-round-to-square", "v-square-to-round"],
  ["v-fill-to-outline", "v-outline-to-fill"],
  ["v-small-to-big", "v-big-to-small"],
  ["more-padding", "less-padding"],
];

// ---------- 一眼对比：前 → 后的小图示，点一下就懂 ----------
const C = "#246fff";
const el = (style, inner = "") => `<i class="m" style="${style}">${inner}</i>`;
const bar = (s = "") => `<b style="display:block;background:rgba(255,255,255,.85);border-radius:2px;${s}"></b>`;
const base = `width:34px;height:22px;background:${C};`;

export const VISUAL = [
  { id: "v-round-to-square", zh: "圆角 → 直角", en: "Rounded → Sharp", before: el(base + "border-radius:10px"), after: el(base + "border-radius:1px"),
    prompt: { zh: "形状：圆角改为直角（border-radius 0–2px），更硬朗利落", en: "Shape: change rounded corners to sharp corners (border-radius 0–2px)" } },
  { id: "v-square-to-round", zh: "直角 → 圆角", en: "Sharp → Rounded", before: el(base + "border-radius:1px"), after: el(base + "border-radius:10px"),
    prompt: { zh: "形状：直角改为圆角（border-radius 12–16px），更柔和友好", en: "Shape: change sharp corners to rounded (border-radius 12–16px)" } },
  { id: "v-box-to-pill", zh: "方框 → 胶囊", en: "Box → Pill", before: el(base + "border-radius:3px"), after: el(`width:40px;height:20px;background:${C};border-radius:99px`),
    prompt: { zh: "形状：改为胶囊形（border-radius: 9999px），左右内边距加大", en: "Shape: make it a pill (border-radius: 9999px) with wider horizontal padding" } },
  { id: "v-square-to-circle", zh: "方形 → 圆形", en: "Square → Circle", before: el(`width:24px;height:24px;background:${C};border-radius:4px`), after: el(`width:24px;height:24px;background:${C};border-radius:50%`),
    prompt: { zh: "形状：改为正圆（宽高相等，border-radius: 50%），常用于头像/图标按钮", en: "Shape: make it a perfect circle (equal width/height, border-radius: 50%)" } },
  { id: "v-fill-to-outline", zh: "实心 → 描边", en: "Filled → Outline", before: el(base + "border-radius:6px"), after: el(`width:34px;height:22px;border:2px solid ${C};border-radius:6px;background:transparent`),
    prompt: { zh: "样式：实心填充改为描边（透明背景 + 1.5px 主色边框 + 主色文字）", en: "Style: change solid fill to outline (transparent bg, 1.5px brand-color border and text)" } },
  { id: "v-outline-to-fill", zh: "描边 → 实心", en: "Outline → Filled", before: el(`width:34px;height:22px;border:2px solid ${C};border-radius:6px`), after: el(base + "border-radius:6px"),
    prompt: { zh: "样式：描边改为实心填充（主色背景 + 白色文字），更突出", en: "Style: change outline to solid fill (brand-color bg, white text)" } },
  { id: "v-flat-to-float", zh: "平面 → 悬浮", en: "Flat → Elevated", before: el("width:34px;height:22px;background:#fff;border-radius:6px;border:1.5px solid #bbb"), after: el("width:34px;height:22px;background:#fff;border-radius:6px;box-shadow:0 10px 18px rgba(36,111,255,.45);transform:translateY(-4px)"),
    prompt: { zh: "层次：去掉边框，加柔和投影让它浮起来（如 0 8px 24px rgba(0,0,0,.12)）", en: "Depth: remove border, add a soft shadow to lift it (e.g. 0 8px 24px rgba(0,0,0,.12))" } },
  { id: "v-border-to-none", zh: "有边框 → 无边框", en: "Bordered → Borderless", before: el("width:34px;height:22px;background:#fff;border:1.5px solid #999;border-radius:6px"), after: el("width:34px;height:22px;background:#d6e4ff;border-radius:6px"),
    prompt: { zh: "样式：去掉边框，改用浅色底色区分区域", en: "Style: remove the border; use a subtle tinted background instead" } },
  { id: "v-row-to-col", zh: "横排 → 竖排", en: "Row → Column", before: el("display:flex;gap:3px", bar("width:9px;height:14px;background:" + C) + bar("width:9px;height:14px;background:" + C) + bar("width:9px;height:14px;background:" + C)), after: el("display:flex;flex-direction:column;gap:3px", bar("width:24px;height:5px;background:" + C) + bar("width:24px;height:5px;background:" + C) + bar("width:24px;height:5px;background:" + C)),
    prompt: { zh: "布局：子元素由横向排列改为纵向堆叠（flex-direction: column）", en: "Layout: stack children vertically instead of horizontally (flex-direction: column)" } },
  { id: "v-list-to-grid", zh: "列表 → 网格", en: "List → Grid", before: el("display:flex;flex-direction:column;gap:2px", bar("width:30px;height:5px;background:" + C) + bar("width:30px;height:5px;background:" + C) + bar("width:30px;height:5px;background:" + C) + bar("width:30px;height:5px;background:" + C)), after: el("display:grid;grid-template-columns:1fr 1fr;gap:3px", bar("width:12px;height:10px;background:" + C) + bar("width:12px;height:10px;background:" + C) + bar("width:12px;height:10px;background:" + C) + bar("width:12px;height:10px;background:" + C)),
    prompt: { zh: "布局：单列列表改为两列网格（grid-template-columns: 1fr 1fr）", en: "Layout: change single-column list to a two-column grid" } },
  { id: "v-left-to-center", zh: "左对齐 → 居中", en: "Left → Center", before: el("width:38px;display:flex;flex-direction:column;align-items:flex-start;gap:3px", bar("width:28px;height:4px;background:" + C) + bar("width:16px;height:4px;background:" + C)), after: el("width:38px;display:flex;flex-direction:column;align-items:center;gap:3px", bar("width:28px;height:4px;background:" + C) + bar("width:16px;height:4px;background:" + C)),
    prompt: { zh: "对齐：内容改为水平居中（text-align / align-items: center）", en: "Alignment: center the content horizontally" } },
  { id: "v-small-to-big", zh: "小 → 大", en: "Small → Large", before: el(`width:22px;height:14px;background:${C};border-radius:4px`), after: el(`width:40px;height:26px;background:${C};border-radius:6px`),
    prompt: { zh: "尺寸：整体放大约 1.5 倍（高度、字号、内边距同比例）", en: "Size: scale up ~1.5× (height, font size and padding proportionally)" } },
  { id: "v-big-to-small", zh: "大 → 小", en: "Large → Small", before: el(`width:40px;height:26px;background:${C};border-radius:6px`), after: el(`width:22px;height:14px;background:${C};border-radius:4px`),
    prompt: { zh: "尺寸：整体缩小约 0.7 倍，降低存在感", en: "Size: scale down to ~0.7× to reduce its weight" } },
  { id: "v-tight-to-loose", zh: "挤 → 松", en: "Tight → Airy", before: el("display:flex;gap:1px", bar("width:8px;height:16px;background:" + C) + bar("width:8px;height:16px;background:" + C) + bar("width:8px;height:16px;background:" + C)), after: el("display:flex;gap:6px", bar("width:8px;height:16px;background:" + C) + bar("width:8px;height:16px;background:" + C) + bar("width:8px;height:16px;background:" + C)),
    prompt: { zh: "间距：子元素之间的间距加大一倍（如 8px → 16px）", en: "Spacing: double the gap between children (e.g. 8px → 16px)" } },
  { id: "v-light-to-dark", zh: "浅底 → 深底", en: "Light → Dark", before: el("width:34px;height:22px;background:#fff;border-radius:6px;border:1px solid #ddd", bar("width:16px;height:3px;margin:9px auto;background:#333")), after: el("width:34px;height:22px;background:#1d1b26;border-radius:6px", bar("width:16px;height:3px;margin:9px auto;background:#eee")),
    prompt: { zh: "配色：浅色背景改为深色背景（#1C1B22 左右），文字改为浅色", en: "Color: switch to a dark background (~#1C1B22) with light text" } },
  { id: "v-solid-to-gradient", zh: "纯色 → 渐变", en: "Solid → Gradient", before: el(base + "border-radius:6px"), after: el("width:34px;height:22px;border-radius:6px;background:linear-gradient(120deg,#ff4d8d,#8b5cff,#2ee6d6)"),
    prompt: { zh: "配色：纯色背景改为品牌色线性渐变（约 120°，两到三个相邻色）", en: "Color: replace solid fill with a brand linear gradient (~120°, 2–3 adjacent hues)" } },
  { id: "v-text-to-icon", zh: "纯文字 → 图标+文字", en: "Text → Icon + text", before: el(`width:40px;height:22px;background:${C};border-radius:6px;color:#fff;font:700 9px/22px sans-serif;text-align:center`, "Aa"), after: el(`width:40px;height:22px;background:${C};border-radius:6px;color:#fff;font:700 9px/22px sans-serif;text-align:center`, "★ Aa"),
    prompt: { zh: "内容：在文字左侧加一个语义相关的线性图标（16–20px，与文字间距 6px）", en: "Content: add a relevant line icon to the left of the label (16–20px, 6px gap)" } },
  { id: "v-full-to-inset", zh: "通栏 → 内缩悬浮", en: "Full-width → Inset", before: `<i class="m frame-pos" style="position:absolute;left:0;right:0;bottom:0;height:16px;background:${C}"></i>`, after: `<i class="m frame-pos" style="position:absolute;left:6px;right:6px;bottom:4px;height:12px;background:${C};border-radius:99px;box-shadow:0 4px 8px rgba(36,111,255,.4)"></i>`,
    prompt: { zh: "布局：贴边通栏改为四周留边距的悬浮条（左右 16px、底部 12px、大圆角、投影）", en: "Layout: turn the edge-to-edge bar into an inset floating bar (16px sides, 12px bottom, large radius, shadow)" } },
];

for (const v of VISUAL) TERM_INDEX[v.id] = { ...v, category: { id: "visual", zh: "一眼对比", en: "Visual tweaks" } };

// 点一下就变：每个"一眼对比"词条在内置示例上的本地改动（参数对象），
// 圈中元素后点一下，直接画进图里；再点一次取消。
// 结构类（横排↔竖排、列表↔网格）要动整页布局，本地改用重排预览，不进这里。
export const STRUCTURAL = ["v-row-to-col", "v-list-to-grid"];
export const LIVE = {
  "v-round-to-square": { rx: 1 },
  "v-square-to-round": { rx: 16 },
  "v-box-to-pill": { rx: "pill" },
  "v-square-to-circle": { rx: "circle" },
  "v-fill-to-outline": { fill: "none", stroke: "#246fff", ink: "#246fff" },
  "v-outline-to-fill": { fill: "#246fff", stroke: "none", ink: "#fff" },
  "v-flat-to-float": { shadow: "strong" },
  "v-border-to-none": { stroke: "none", fill: "#f7f7f7" },
  "v-left-to-center": { align: "center" },
  "v-small-to-big": { scale: 1.5 },
  "v-big-to-small": { scale: 0.7 },
  "v-tight-to-loose": { gap: "loose" },
  "v-light-to-dark": { dark: true },
  "v-solid-to-gradient": { gradient: true },
  "v-text-to-icon": { icon: true },
  "v-full-to-inset": { floating: true },
};
