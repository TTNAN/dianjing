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
