// 点睛 · 画界面模式：照 m3e-canvas 的骨架做的中文版
// 改编来源：lnkiai/m3e-canvas（MIT），版权声明见仓库根目录 NOTICE。
// 拼 APP 页面（零件 → 屏幕）→ 点一下切页 → 整套设计生成提示词。
// 纯逻辑部分可单元测试；DOM 部分只在浏览器里跑（见文件下半段）。

// ---------- 零件表：16 种，分 5 类 ----------
export const CATS = ["操作", "导航", "容器", "输入", "内容"];
// spec: hasLabel 标题 / hasSupporting 副标题 / hasVariant 样式 / hasIcon 图标 / hasTabs 条目
export const PARTS = {
  button:     { cat: "操作", label: "按钮",       defLabel: "按钮",     hasLabel: true, hasIcon: true, hasVariant: true },
  chip:       { cat: "操作", label: "标签片",     defLabel: "标签",     hasLabel: true },
  chipRow:    { cat: "操作", label: "标签片组",   defLabel: "全部、国内、出境、周边", hasLabel: true, hasTabs: true },
  fab:        { cat: "操作", label: "悬浮按钮",   defLabel: "",         hasIcon: true },
  topAppBar:  { cat: "导航", label: "顶部应用栏", defLabel: "标题",     hasLabel: true, hasIcon: true },
  bottomNav:  { cat: "导航", label: "底部导航",   defLabel: "首页、发现、足迹、我的", hasLabel: true, hasTabs: true },
  searchBar:  { cat: "导航", label: "搜索栏",     defLabel: "搜索目的地、游记", hasLabel: true },
  tabs:       { cat: "导航", label: "标签页",     defLabel: "全部、进行中、已完成", hasLabel: true, hasTabs: true },
  card:       { cat: "容器", label: "卡片",       defLabel: "卡片标题", defSupporting: "这是卡片正文内容。", hasLabel: true, hasSupporting: true, hasVariant: true, media: true },
  listItem:   { cat: "容器", label: "列表项",     defLabel: "列表标题", defSupporting: "副标题", hasLabel: true, hasSupporting: true, hasIcon: true },
  box:        { cat: "容器", label: "容器框",     defLabel: "容器里的内容", hasLabel: true },
  textField:  { cat: "输入", label: "文本输入框", defLabel: "标签",     defSupporting: "辅助文本", hasLabel: true, hasSupporting: true },
  switch:     { cat: "输入", label: "开关",       defLabel: "开关",     hasLabel: true },
  text:       { cat: "内容", label: "文本",       defLabel: "一段文字", hasLabel: true, hasSupporting: true },
  image:      { cat: "内容", label: "图片",       defLabel: "" },
  divider:    { cat: "内容", label: "分割线",     defLabel: "" },
};
export const VARIANTS = [
  { id: "filled", zh: "填充" },
  { id: "tonal", zh: "色调" },
  { id: "elevated", zh: "浮起" },
  { id: "outlined", zh: "描边" },
  { id: "text", zh: "文字" },
];
export const variantZh = (v) => (VARIANTS.find((x) => x.id === v) || VARIANTS[0]).zh;
export const TRANSITIONS = [
  { id: "slide", zh: "从右侧滑入" },
  { id: "slideLeft", zh: "从左侧滑入" },
  { id: "slideUp", zh: "从底部滑入" },
  { id: "slideDown", zh: "从顶部滑入" },
  { id: "fade", zh: "淡入" },
  { id: "expand", zh: "居中放大" },
  { id: "zoom", zh: "放大" },
  { id: "none", zh: "无动画" },
];
export const transitionZh = (t) => (TRANSITIONS.find((x) => x.id === t) || TRANSITIONS[0]).zh;
export const ICONS = ["", "star", "home", "search", "add", "edit", "share", "favorite", "person", "settings", "menu", "arrow", "check"];

// ---------- 主题：3 套配色 + 3 档圆角 ----------
export const PALETTES = {
  blue: { zh: "蓝色", primary: "#0b57d0", onPrimary: "#ffffff", primaryContainer: "#d3e3fd", onPrimaryContainer: "#041e49", secondary: "#00639b", surface: "#f8f9ff", surfaceContainer: "#eceef4", surfaceContainerHigh: "#e6e8ee", onSurface: "#1a1c1e", onSurfaceVariant: "#43474e", outline: "#73777f", error: "#b3261e" },
  purple: { zh: "紫色", primary: "#6750a4", onPrimary: "#ffffff", primaryContainer: "#eaddff", onPrimaryContainer: "#21005d", secondary: "#625b71", surface: "#fef7ff", surfaceContainer: "#f3edf7", surfaceContainerHigh: "#ece6f0", onSurface: "#1d1b20", onSurfaceVariant: "#49454f", outline: "#79747e", error: "#b3261e" },
  green: { zh: "绿色", primary: "#146c2e", onPrimary: "#ffffff", primaryContainer: "#c4eed0", onPrimaryContainer: "#00210a", secondary: "#4c662a", surface: "#f7fbf1", surfaceContainer: "#ecefe3", surfaceContainerHigh: "#e6e9dd", onSurface: "#1a1c18", onSurfaceVariant: "#42493f", outline: "#727970", error: "#b3261e" },
};
export const SHAPES = [
  { id: "square", zh: "方形" },
  { id: "rounded", zh: "圆角" },
  { id: "full", zh: "全圆" },
];

// ---------- 调节：密度 / 字号 / 圆角 / 阴影（进提示词，实时作用到画布） ----------
export const DENSITIES = [
  { id: "compact", zh: "紧凑", gap: 6 },
  { id: "standard", zh: "标准", gap: 12 },
  { id: "loose", zh: "宽松", gap: 20 },
];
export const FONT_SIZES = [
  { id: "small", zh: "小", zoom: 0.92, body: 13, title: 16 },
  { id: "standard", zh: "标准", zoom: 1, body: 14, title: 17 },
  { id: "large", zh: "大", zoom: 1.1, body: 15, title: 18 },
];
export const SHADOWS = [
  { id: "none", zh: "无", phrase: "无阴影", value: "none", strong: "none" },
  { id: "light", zh: "轻", phrase: "轻阴影", value: "0 1px 2px rgba(16,24,40,.05)", strong: "0 8px 22px rgba(0,0,0,.12)" },
  { id: "heavy", zh: "重", phrase: "重阴影", value: "0 4px 12px rgba(16,24,40,.12)", strong: "0 16px 36px rgba(16,24,40,.22)" },
];
// 主题归一化：老文档只有 shape（方/圆/全圆）时按 8/20/28 换算成圆角数值；缺项落回默认值。
export function themeFor(doc) {
  const t = doc?.theme || {};
  const radius = typeof t.radius === "number" ? Math.max(0, Math.min(32, t.radius))
    : t.shape === "square" ? 8 : t.shape === "full" ? 28 : 20;
  const density = DENSITIES.some((d) => d.id === t.density) ? t.density : "standard";
  const font = FONT_SIZES.some((f) => f.id === t.font) ? t.font : "standard";
  const shadow = SHADOWS.some((s) => s.id === t.shadow) ? t.shadow : "light";
  const palette = PALETTES[t.palette] ? t.palette : "blue";
  return { palette, radius, density, font, shadow };
}
// 文本类零件的对齐；透明度所有零件都有。
export const ALIGN_KINDS = ["text", "card", "listItem", "button"];
export const ALIGN_ZH = { left: "左", center: "居中", right: "右" };
export function partAdjustSuffix(p) {
  let s = "";
  if (p.align && p.align !== "left") s += `，${ALIGN_ZH[p.align] || "左"}对齐`;
  if (p.opacity != null && p.opacity < 1) s += `，透明度 ${Math.round(p.opacity * 100)}%`;
  return s;
}

// ---------- 种子：一套中文旅行记录应用（首页 + 详情页） ----------
let __n = 0;
const nid = (p) => `${p}${++__n}`;
export function seedSketchDoc() {
  __n = 100;
  return {
    title: "旅行记录",
    brief: "记录每一次旅行的应用。",
    platform: "web",
    theme: { palette: "blue", radius: 20, density: "standard", font: "standard", shadow: "light" },
    target: { platform: "web", library: "material" },
    screens: [
      {
        id: "s1", name: "首页",
        parts: [
          { id: nid("p"), kind: "topAppBar", label: "旅行记录", icon: "search" },
          { id: nid("p"), kind: "searchBar", label: "搜索目的地、游记" },
          { id: nid("p"), kind: "chipRow", label: "全部、国内、出境、周边", selected: 0 },
          { id: nid("p"), kind: "card", label: "大理三日", supporting: "洱海 · 苍山 · 古城", variant: "filled", media: true, action: { to: "s2", transition: "slide" } },
          { id: nid("p"), kind: "listItem", label: "京都樱花", supporting: "日本 · 2026.03 · 5 天", icon: "star" },
          { id: nid("p"), kind: "listItem", label: "成都美食行", supporting: "四川 · 2026.02 · 3 天", icon: "star" },
          { id: nid("p"), kind: "listItem", label: "厦门海边漫步", supporting: "福建 · 2026.01 · 2 天", icon: "star" },
          { id: nid("p"), kind: "bottomNav", label: "首页、发现、足迹、我的", selected: 0 },
        ],
      },
      {
        id: "s2", name: "详情页",
        parts: [
          { id: nid("p"), kind: "image", label: "" },
          { id: nid("p"), kind: "text", label: "大理三日", supporting: "洱海边的慢时光，骑行、看云、逛古城。" },
          { id: nid("p"), kind: "chipRow", label: "3 天、云南、洱海", selected: -1 },
          { id: nid("p"), kind: "text", label: "行程", supporting: "第一天洱海骑行，第二天苍山索道，第三天古城夜市。" },
          { id: nid("p"), kind: "text", label: "花费", supporting: "交通 600 元、住宿 900 元、餐饮 450 元。" },
          { id: nid("p"), kind: "button", label: "写游记", variant: "filled", action: { to: "back", transition: "slideLeft" } },
        ],
      },
    ],
  };
}

// ---------- 旧种子识别：v0.5.4 之前内置的菜谱示例 ----------
// 只用来判断「存在浏览器里、没动过的旧示例」，以便打开时自动换成新种子。
// 认三处：标题「菜谱」、2 屏共 14 个零件、卡片「宫保鸡丁」+ 按钮「开始做饭」。
// 用户自己改过的设计（标题、关键零件、零件数有变）一律不认，绝不覆盖。
// 主题、辅助文案不算标记，改了主题也照样迁移。
export function isLegacyRecipeSeed(doc) {
  if (!doc || doc.title !== "菜谱" || !Array.isArray(doc.screens) || doc.screens.length !== 2) return false;
  const parts = doc.screens.flatMap((s) => s.parts || []);
  if (parts.length !== 14) return false;
  const has = (kind, label) => parts.some((p) => p.kind === kind && p.label === label);
  return has("card", "宫保鸡丁") && has("button", "开始做饭");
}

// ---------- 一个零件一句话（进提示词） ----------
const q = (s) => `“${s}”`;
// 零件的关键信息（括号里的那部分）。Material 3 沿用下面的中文整句；
// 换了体系后，组件名 + 这段信息就是提示词里的零件描述。
export function partDetail(p) {
  const tabs = (p.label || "").split("、").filter(Boolean);
  switch (p.kind) {
    case "button": return `标题${q(p.label || "无标签")}，${variantZh(p.variant)}样式${p.icon ? `，带 ${p.icon} 图标` : ""}`;
    case "chip": return `标签${q(p.label)}`;
    case "chipRow": return `标签片组（${tabs.join("、")}${p.selected >= 0 ? `，当前选中第 ${p.selected + 1} 项` : ""}）`;
    case "fab": return `悬浮按钮${p.icon ? `，带 ${p.icon} 图标` : ""}`;
    case "topAppBar": return `标题${q(p.label)}`;
    case "bottomNav": return `${tabs.length}个项目（${tabs.map((t) => q(t)).join("、")}，当前选中第 ${(p.selected || 0) + 1} 项）`;
    case "searchBar": return `占位文案${q(p.label)}`;
    case "tabs": return `${tabs.length}个标签页（${tabs.join("、")}，当前选中第 ${(p.selected || 0) + 1} 项）`;
    case "card": return `标题${q(p.label)}${p.supporting ? `，正文${q(p.supporting)}` : ""}，${variantZh(p.variant)}样式`;
    case "listItem": return `标题${q(p.label)}${p.supporting ? `，副标题${q(p.supporting)}` : ""}`;
    case "box": return `内容${q(p.label)}`;
    case "textField": return `标签${q(p.label)}${p.supporting ? `，辅助文本${q(p.supporting)}` : ""}`;
    case "switch": return `${q(p.label)}，当前${p.checked ? "开启" : "关闭"}`;
    case "text": return p.supporting ? `标题${q(p.label)}，正文${q(p.supporting)}` : `文本${q(p.label)}`;
    case "image": return "图片占位";
    case "divider": return "分割线";
    default: return PARTS[p.kind]?.label || p.kind;
  }
}
export function describePart(p, target) {
  const cname = COMPONENTS[targetFor({ target }).library]?.[p.kind];
  const suffix = partAdjustSuffix(p);
  if (cname) return `${cname}（${partDetail(p)}${suffix}）`;
  const tabs = (p.label || "").split("、").filter(Boolean);
  const d = (() => {
  switch (p.kind) {
    case "button": return `${q(p.label || "无标签")}的${variantZh(p.variant)}按钮${p.icon ? `（带 ${p.icon} 图标）` : ""}`;
    case "chip": return `${q(p.label)}标签片`;
    case "chipRow": return `标签片组（${tabs.join("、")}${p.selected >= 0 ? `，当前选中第 ${p.selected + 1} 项` : ""}）`;
    case "fab": return `悬浮按钮${p.icon ? `（带 ${p.icon} 图标）` : ""}`;
    case "topAppBar": return `顶部应用栏（标题${q(p.label)}）`;
    case "bottomNav": return `${tabs.length}个项目的导航栏（${tabs.map((t) => q(t)).join("、")}，当前选中第 ${(p.selected || 0) + 1} 项）`;
    case "searchBar": return `搜索栏（占位文案${q(p.label)}）`;
    case "tabs": return `${tabs.length}个标签页（${tabs.join("、")}，当前选中第 ${(p.selected || 0) + 1} 项）`;
    case "card": return `${variantZh(p.variant)}卡片（标题${q(p.label)}${p.supporting ? `，正文${q(p.supporting)}` : ""}）`;
    case "listItem": return `列表项（标题${q(p.label)}${p.supporting ? `，副标题${q(p.supporting)}` : ""}）`;
    case "box": return `容器框（内容${q(p.label)}）`;
    case "textField": return `标签为${q(p.label)}的文本输入框${p.supporting ? `，辅助文本为${q(p.supporting)}` : ""}`;
    case "switch": return `开关（${q(p.label)}，当前${p.checked ? "开启" : "关闭"}）`;
    case "text": return p.supporting ? `文本${q(p.label)}，正文${q(p.supporting)}` : `文本${q(p.label)}`;
    case "image": return "图片占位";
    case "divider": return "分割线";
    default: return PARTS[p.kind]?.label || p.kind;
  }
  })();
  return d + suffix;
}

// ---------- 各组件的样式（只写画布上用到了的种类） ----------
const STYLE_NOTES = {
  topAppBar: "顶部应用栏高 64dp，标题用 titleLarge，左右图标 24dp。",
  bottomNav: "底部导航栏高 80dp，选中项带 64×32dp 胶囊指示器。",
  searchBar: "搜索栏高 56dp，胶囊形，左侧搜索图标。",
  button: "按钮高 56dp，胶囊形；主按钮用填充样式。",
  chip: "标签片高 32dp，选中项为填充样式。",
  chipRow: "标签片横向排成一行，间距 8dp，可横向滚动。",
  fab: "悬浮按钮 56dp 圆形，固定在内容右下角。",
  tabs: "标签页高 48dp，选中项下方带指示条。",
  card: "卡片圆角 20dp，图片 16:9，内容边距 16dp。",
  listItem: "列表项高 72dp，左侧图标 40dp，右侧箭头。",
  box: "容器框圆角 12dp，背景 surfaceContainerLow。",
  textField: "文本输入框高 56dp，描边样式，标签在框内上方。",
  switch: "开关宽 52dp，开启时用主色。",
  text: "正文用 bodyMedium，标题用 titleLarge。",
  image: "图片 16:9，圆角 20dp，加载失败时显示占位色。",
  divider: "分割线 1dp，颜色 outlineVariant。",
};

// ---------- 整体原则（改编自 m3e-canvas 的 GENERAL，取 7 条） ----------
const PRINCIPLES = [
  "先根据屏幕目的判断这是什么类型的应用，并实现该类应用通常应有的功能（新建、列表、详情、编辑、删除、搜索、设置等，视情况而定），即使草图中没有画出。",
  "把数据当作真实数据处理：用户创建的数据要持久化到浏览器（IndexedDB 等），重新加载后仍保留。不要放入虚拟或示例数据，没有数据时显示空状态提示。校验输入，删除和失败要有适当的确认或提示。",
  "草图没有写明的行为，根据屏幕目的和组件标签补全。未指定行为的按钮或项目要实现与其标签相符的操作（保存、发送、打开详情页等），不要什么都不做。",
  "布局只需保持意图（顺序、分组、相对位置），尺寸和间距可根据内容调整。若在真机上会出问题，宁可能用也不要死守草图。",
  "组件使用 Material Web 的标准组件，库里已有的组件不要自行绘制。",
  "颜色必须通过上面配色方案的角色名（primary、surfaceContainer 等）引用，不要写死颜色值。",
  "屏幕边缘留 16dp，组件之间 8〜16dp。可点击的组件加涟漪和轻微缩放反馈。“返回”反向播放进入时的过渡动画。",
];

// ---------- 目标平台与组件库 ----------
// 平台和组件库不是自由组合：Vant / TDesign / Ant Design Mobile / NutUI 覆盖小程序与 H5
// 一边；鸿蒙 ArkUI 与 Flutter 各有自己的组件体系，不套上面四个库。
export const PLATFORMS = [
  { id: "web", zh: "Web" },
  { id: "miniprogram", zh: "微信小程序" },
  { id: "uniapp", zh: "uni-app" },
  { id: "taro", zh: "Taro" },
  { id: "arkui", zh: "鸿蒙 ArkUI" },
  { id: "flutter", zh: "Flutter" },
];
const MINI_LIBS = [
  { id: "vant", zh: "Vant" },
  { id: "tdesign", zh: "TDesign" },
  { id: "antd-mobile", zh: "Ant Design Mobile" },
  { id: "nutui", zh: "NutUI" },
];
export const PLATFORM_LIBS = {
  web: [{ id: "material", zh: "Material 3" }],
  miniprogram: MINI_LIBS,
  uniapp: MINI_LIBS,
  taro: MINI_LIBS,
  arkui: [{ id: "arkui", zh: "ArkUI 原生组件" }],
  flutter: [{ id: "flutter", zh: "Flutter Widgets" }],
};
// 各体系的组件名：零件 kind → 该体系的组件名。Material 3 沿用中文描述，不进表。
export const COMPONENTS = {
  vant: {
    button: "van-button", chip: "van-tag", chipRow: "van-tag", card: "van-card",
    listItem: "van-cell", bottomNav: "van-tabbar", searchBar: "van-search", tabs: "van-tabs",
    topAppBar: "van-nav-bar", box: "van-cell-group", textField: "van-field", switch: "van-switch",
    text: "text", image: "van-image", divider: "van-divider", fab: "van-button",
  },
  tdesign: {
    button: "t-button", chip: "t-tag", chipRow: "t-tag", card: "t-cell-group",
    listItem: "t-cell", bottomNav: "t-tab-bar", searchBar: "t-search", tabs: "t-tabs",
    topAppBar: "t-navbar", box: "t-cell-group", textField: "t-input", switch: "t-switch",
    text: "text", image: "t-image", divider: "t-divider", fab: "t-fab",
  },
  "antd-mobile": {
    button: "Button", chip: "Tag", chipRow: "Tag", card: "Card",
    listItem: "List.Item", bottomNav: "TabBar", searchBar: "SearchBar", tabs: "Tabs",
    topAppBar: "NavBar", box: "List", textField: "Input", switch: "Switch",
    text: "Text", image: "Image", divider: "Divider", fab: "FloatingBubble",
  },
  nutui: {
    button: "nut-button", chip: "nut-tag", chipRow: "nut-tag", card: "nut-cell",
    listItem: "nut-cell", bottomNav: "nut-tabbar", searchBar: "nut-searchbar", tabs: "nut-tabs",
    topAppBar: "nut-navbar", box: "nut-cellgroup", textField: "nut-input", switch: "nut-switch",
    text: "text", image: "nut-image", divider: "nut-divider", fab: "nut-button",
  },
  arkui: {
    button: "Button", chip: "Button", chipRow: "Row", card: "Column",
    listItem: "ListItem", bottomNav: "Tabs", searchBar: "Search", tabs: "Tabs",
    topAppBar: "Navigation", box: "Column", textField: "TextInput", switch: "Toggle",
    text: "Text", image: "Image", divider: "Divider", fab: "Button",
  },
  flutter: {
    button: "ElevatedButton", chip: "Chip", chipRow: "Row", card: "Card",
    listItem: "ListTile", bottomNav: "BottomNavigationBar", searchBar: "TextField", tabs: "TabBar",
    topAppBar: "AppBar", box: "Container", textField: "TextField", switch: "Switch",
    text: "Text", image: "Image", divider: "Divider", fab: "FloatingActionButton",
  },
};
// 归一化目标：旧文档没有 target、不合法的平台或组件库（例如鸿蒙配 Vant）一律落回默认值。
export function targetFor(doc) {
  const t = doc?.target || {};
  const platform = PLATFORMS.some((p) => p.id === t.platform) ? t.platform : "web";
  const libs = PLATFORM_LIBS[platform];
  const library = libs.some((l) => l.id === t.library) ? t.library : libs[0].id;
  return { platform, library };
}
// 每个（平台，组件库）对应的提示词写法：设计体系、尺寸、目标、单位、字体。
export function targetSpec(target) {
  const { platform, library } = targetFor({ target });
  const platformName = (PLATFORMS.find((p) => p.id === platform) || PLATFORMS[0]).zh;
  // 组件库在提示词里的全名（小程序里 Vant 叫 Vant Weapp，uni-app / Taro 里就叫 Vant）
  const libName = library === "vant"
    ? (platform === "miniprogram" ? "Vant Weapp" : "Vant")
    : library === "tdesign"
    ? (platform === "miniprogram" ? "TDesign 小程序版" : "TDesign")
    : (PLATFORM_LIBS[platform].find((l) => l.id === library) || {}).zh || library;
  const base = { platform, library, platformName, libraryName: libName, componentLib: libName };
  switch (platform) {
    case "miniprogram": return { ...base, unit: "rpx", unitScale: 2, edge: "32rpx", gap: "16〜32rpx",
      fontLine: "排版使用微信小程序的系统字体（PingFang SC、system-ui）。",
      sizeLine: "目标为微信小程序，竖屏手机（设计稿 750rpx 宽），同时支持浅色和深色模式，并跟随设备的系统设置切换。",
      targetLine: "实现目标是微信小程序（WXML + WXSS + JS）。",
      designIntro: (title, brief) => `请用 ${libName}的组件实现${title}。${brief || ""}` };
    case "uniapp": return { ...base, unit: "rpx", unitScale: 2, edge: "32rpx", gap: "16〜32rpx",
      fontLine: "排版使用系统字体（PingFang SC、system-ui）。",
      sizeLine: "目标为 uni-app，竖屏手机（设计稿 750rpx 宽，可编译到微信小程序与 H5），同时支持浅色和深色模式，并跟随设备的系统设置切换。",
      targetLine: "实现目标是 uni-app（Vue 单文件组件，编译到微信小程序与 H5）。",
      designIntro: (title, brief) => `请用 ${libName}的组件实现${title}。${brief || ""}` };
    case "taro": return { ...base, unit: "rpx", unitScale: 2, edge: "32rpx", gap: "16〜32rpx",
      fontLine: "排版使用系统字体（PingFang SC、system-ui）。",
      sizeLine: "目标为 Taro，竖屏手机（设计稿 750rpx 宽，可编译到微信小程序与 H5），同时支持浅色和深色模式，并跟随设备的系统设置切换。",
      targetLine: "实现目标是 Taro（React，编译到微信小程序与 H5）。",
      designIntro: (title, brief) => `请用 ${libName}的组件实现${title}。${brief || ""}` };
    case "arkui": return { ...base, unit: "vp", unitScale: 1, edge: "16vp", gap: "8〜16vp",
      fontLine: "排版使用 HarmonyOS Sans。",
      sizeLine: "目标为鸿蒙手机（ArkTS，竖屏），同时支持浅色和深色模式，并跟随设备的系统设置切换。",
      targetLine: "实现目标是鸿蒙应用（ArkTS）。",
      designIntro: (title, brief) => `请用鸿蒙 ArkUI 的原生组件实现${title}。${brief || ""}` };
    case "flutter": return { ...base, unit: "逻辑像素", unitScale: 1, edge: "16 逻辑像素", gap: "8〜16 逻辑像素",
      fontLine: "排版使用 Flutter 默认字体（Roboto，中文回退 PingFang SC）。",
      sizeLine: "目标为手机应用（Flutter，竖屏），同时支持浅色和深色模式，并跟随设备的系统设置切换。",
      targetLine: "实现目标是 Flutter 应用（Dart，iOS 与安卓双端）。",
      designIntro: (title, brief) => `请用 Flutter Widgets 实现${title}。${brief || ""}` };
    default: return { ...base, unit: "dp", unitScale: 1, edge: "16dp", gap: "8〜16dp",
      componentLib: "Material Web",
      fontLine: "排版使用 M3 的标准字重，字体为 Roboto。",
      sizeLine: "目标为竖屏手机（412×892dp），同时支持浅色和深色模式，并跟随设备的系统设置切换。",
      targetLine: "实现目标是 Web（在浏览器中运行的应用）。",
      designIntro: (title, brief) => `请用 Material 3 Expressive 的设计实现${title}。${brief || ""}` };
  }
}
// 把样式说明里的 dp 数值换成目标平台的单位（rpx 按 750 宽换算 ×2）。
export function convertUnits(note, spec) {
  if (spec.unit === "dp") return note;
  return note.replace(/(\d+(?:\.\d+)?)dp/g, (_, n) => Math.round(+n * spec.unitScale) + spec.unit);
}

// ---------- 提示词生成：十段结构，中文 ----------
export function buildSketchPrompt(doc) {
  const theme = themeFor(doc);
  const pal = PALETTES[theme.palette];
  const radius = theme.radius;
  const spec = targetSpec(doc.target);
  const isMaterial = spec.library === "material";
  const L = [];
  L.push(spec.designIntro(doc.title, doc.brief));
  L.push(spec.sizeLine);
  L.push(spec.targetLine);
  L.push("下面的屏幕结构是传达意图的草图，不是最终规格。不要把它当静态图片照搬，而要做成这类应用通常应具备的功能齐全、真正可用的成品。");
  L.push("");
  L.push("## 配色");
  L.push(isMaterial
    ? `主题为${pal.zh}系。请在 Material 3 的浅色和深色配色方案中设置以下颜色，UI 的所有颜色都通过这些角色引用。`
    : `主题为${pal.zh}系。以下颜色是主题的配色值；在 ${spec.libraryName}里按主色、背景、文字、描边、错误的角色对应使用，UI 的所有颜色都通过这些角色引用。`);
  const row = (pairs) => `- ${pairs.map(([k, v]) => `${k} ${v}`).join(" / ")}`;
  L.push(row([["primary", pal.primary], ["onPrimary", pal.onPrimary], ["primaryContainer", pal.primaryContainer], ["onPrimaryContainer", pal.onPrimaryContainer]]));
  L.push(row([["secondary", pal.secondary], ["surface", pal.surface], ["surfaceContainer", pal.surfaceContainer], ["surfaceContainerHigh", pal.surfaceContainerHigh]]));
  L.push(row([["onSurface", pal.onSurface], ["onSurfaceVariant", pal.onSurfaceVariant], ["outline", pal.outline], ["error", pal.error]]));
  L.push("");
  L.push("## 形状、字体与动效");
  // 圆角现在是 0–32 的数值：两端沿用克制/放大的提法，中间直接写数值。
  const shapeLine = radius <= 8
    ? "圆角保持克制：整体缩小 M3 的形状比例（按钮和标签片 8〜12dp，卡片和图片 8dp，对话框约 12dp），不使用胶囊形。"
    : radius >= 28
    ? "圆角尽量放大：按钮、标签片和输入框为胶囊形，卡片和图片 32dp，对话框和面板约 40dp。"
    : `圆角 ${radius}dp（按钮为胶囊形，卡片 ${radius}dp，对话框 ${radius + 8}dp）。`;
  L.push(isMaterial ? shapeLine : convertUnits(shapeLine.replace("M3 Expressive 的", spec.libraryName + "的").replace("M3 的", spec.libraryName + "的"), spec));
  const fontSpec = FONT_SIZES.find((f) => f.id === theme.font) || FONT_SIZES[1];
  const densitySpec = DENSITIES.find((d) => d.id === theme.density) || DENSITIES[1];
  const shadowSpec = SHADOWS.find((s) => s.id === theme.shadow) || SHADOWS[1];
  const u = (n) => Math.round(n * spec.unitScale) + spec.unit;
  L.push(`${spec.fontLine}字号${fontSpec.zh}（正文 ${u(fontSpec.body)}，标题 ${u(fontSpec.title)}）。`);
  L.push(`密度${densitySpec.zh}（零件间距 ${u(densitySpec.gap)}），${shadowSpec.phrase}。`);
  L.push("动效使用平滑过渡，不回弹；屏幕过渡和状态变化保持轻快。");
  L.push("");
  L.push("## 屏幕结构");
  L.push(`共有 ${doc.screens.length} 个屏幕：${doc.screens.map((s) => s.name).join("、")}。`);
  for (const s of doc.screens) {
    const body = s.parts.length
      ? s.parts.map((p) => describePart(p, doc.target)).join("；")
      : "目前为空。";
    L.push(`${s.name}屏幕从上到下依次如下：${body}。`);
  }
  const actions = [];
  for (const s of doc.screens) {
    for (const p of s.parts) {
      if (!p.action?.to) continue;
      const name = p.label || PARTS[p.kind]?.label || p.kind;
      if (p.action.to === "back") actions.push(`${name}：点击后返回上一个屏幕（反向播放进入时的过渡动画）。`);
      else {
        const t = doc.screens.find((x) => x.id === p.action.to);
        if (t) actions.push(`${name}：点击后以${transitionZh(p.action.transition)}的方式跳转到${t.name}屏幕。`);
      }
    }
  }
  if (actions.length) {
    L.push("");
    L.push("## 行为与屏幕跳转");
    L.push(...actions);
  }
  const used = [...new Set(doc.screens.flatMap((s) => s.parts.map((p) => p.kind)))];
  L.push("");
  L.push("## 各组件的样式");
  L.push(isMaterial
    ? "以下是所用组件的参考。数值均为 M3 Expressive 的标准值，能用标准组件实现的就交给标准组件，并可根据内容适当调整。"
    : `以下是所用组件的参考（${spec.libraryName}）。数值单位为 ${spec.unit}，能用标准组件实现的就交给标准组件，并可根据内容适当调整。`);
  for (const k of used) if (STYLE_NOTES[k]) {
    const cname = COMPONENTS[spec.library]?.[k];
    const note = isMaterial ? STYLE_NOTES[k] : convertUnits(STYLE_NOTES[k], spec);
    L.push(cname ? `- ${cname}：${note}` : `- ${note}`);
  }
  L.push("");
  L.push("## 整体原则");
  // 原则里「Material Web 标准组件」和「16dp 边距」随目标体系换；Web + Material 3 原样不动。
  // 非 Material 时组件名后的「的」不加空格（“TDesign 小程序版 的”读着别扭）。
  const componentLine = isMaterial
    ? "组件使用 Material Web 的标准组件"
    : `组件使用 ${spec.componentLib}的标准组件`;
  PRINCIPLES.map((r) => r
    .replace("组件使用 Material Web 的标准组件", componentLine)
    .replace("屏幕边缘留 16dp，组件之间 8〜16dp", `屏幕边缘留 ${spec.edge}，组件之间 ${spec.gap}`))
    .forEach((r, i) => L.push(`${i + 1}. ${r}`));
  return L.join("\n");
}

// ---------- 小工具（DOM 与测试共用） ----------
export const screenById = (doc, id) => doc.screens.find((s) => s.id === id);
export const partById = (doc, pid) => {
  for (const s of doc.screens) {
    const p = s.parts.find((x) => x.id === pid);
    if (p) return { screen: s, part: p };
  }
  return null;
};
export const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// 数字包一层 span（data-n 记原值），供花费等数值被改动时做滚动动画
export function numWrap(s) {
  return esc(s).replace(/(\d[\d,]*(?:\.\d+)?)/g, `<span class="sk-num" data-n="$1">$1</span>`);
}
// 胶囊定位的纯计算：底板宽度 = 选中按钮宽度，左缘 = 按钮左缘减 3px（容器内边距）
export function thumbStyle(width, left) {
  return { width: width + "px", transform: `translateX(${left - 3}px)` };
}
// 拖拽排序的纯计算：把零件移到目标位（目标位是拿掉它之后数组里的下标），返回新数组，不改原数组
export function reorderParts(parts, fromId, toIndex) {
  const from = parts.findIndex((p) => p.id === fromId);
  if (from < 0) return parts.slice();
  const next = parts.slice();
  const [moved] = next.splice(from, 1);
  const t = Math.max(0, Math.min(toIndex, next.length));
  next.splice(t, 0, moved);
  return next;
}
// 底栏钉在最后：拖动目标位不能越过底栏（底栏自己不参与拖拽，toIndex 是拿掉被拖零件后数组里的下标）
export function clampReorderIndex(parts, dragId, toIndex) {
  const rest = parts.filter((p) => p.id !== dragId);
  const nav = rest.findIndex((p) => p.kind === "bottomNav");
  if (nav < 0) return Math.max(0, Math.min(toIndex, rest.length));
  return Math.max(0, Math.min(toIndex, nav));
}
// 错峰延迟：每项间隔 step 毫秒，封顶 cap 毫秒（零件 200ms、18 张小图 560ms，总长都不超过 600ms）
export function staggerDelay(i, step = 40, cap = 200) { return Math.min(i * step, cap); }

// ---------- DOM 层（只在浏览器里跑） ----------
const SK_KEY = "dianjing.sketch.v1";
let __sn = 2;
const newScreenId = () => `s${++__sn}`;
const newPartId = () => nid("p");

const GLYPHS = { star: "★", home: "⌂", search: "⌕", add: "＋", edit: "✎", share: "⤴", favorite: "♥", person: "◯", settings: "⚙", menu: "☰", arrow: "→", check: "✓" };
const glyph = (name) => GLYPHS[name] || "";

if (typeof document !== "undefined") {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const state = { doc: null, screenId: "s1", partId: null, preview: null, booted: false, enteredOnce: false, deleting: false, orderUndo: [] };
  const lastNums = new Map(); // 每个零件上一次渲染时的数字，供数字滚动比对增减
  // 数字滚动：数值被改动时按增减方向给新值加滚入类（变大从下方进、变小从上方进）
  function rollNumbers() {
    document.querySelectorAll("#skCanvas .sk-part").forEach((partEl) => {
      const nums = [...partEl.querySelectorAll(".sk-num")].map((s) => parseFloat(String(s.dataset.n).replace(/,/g, "")));
      const prev = lastNums.get(partEl.dataset.pid);
      if (prev) {
        partEl.querySelectorAll(".sk-num").forEach((s, i) => {
          if (prev[i] != null && prev[i] !== nums[i]) s.classList.add(nums[i] > prev[i] ? "roll-up" : "roll-down");
        });
      }
      lastNums.set(partEl.dataset.pid, nums);
    });
  }
  let toastTimer = null;
  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }
  const currentScreen = () => screenById(state.doc, state.screenId) || state.doc.screens[0];
  const currentPart = () => (state.partId ? partById(state.doc, state.partId)?.part || null : null);

  function save() {
    try {
      localStorage.setItem(SK_KEY, JSON.stringify({ doc: state.doc, screenId: state.screenId }));
    } catch {}
  }
  function load() {
    try {
      const raw = localStorage.getItem(SK_KEY);
      if (!raw) return false;
      const d = JSON.parse(raw);
      if (!d?.doc?.screens?.length) return false;
      // 旧种子迁移：存的是没动过的菜谱示例 -> 换成新种子（旅行记录）；自己改过的设计一律不动
      if (isLegacyRecipeSeed(d.doc)) {
        state.doc = seedSketchDoc();
        state.screenId = state.doc.screens[0].id;
        save();
      } else {
        state.doc = d.doc;
        state.screenId = screenById(state.doc, d.screenId) ? d.screenId : state.doc.screens[0].id;
      }
      // 旧文档没有 target（或写了不可能的组合）-> 落回默认值，随下一次保存写回去
      state.doc.target = targetFor(state.doc);
      // 旧文档的主题只有 shape（方/圆/全圆）-> 按 8/20/28 换算成圆角数值，缺项补默认值
      state.doc.theme = themeFor(state.doc);
      // 续上 id 计数器，避免新零件撞 id
      let max = 100;
      for (const s of state.doc.screens) {
        const sm = +String(s.id).replace(/\D/g, "") || 0;
        __sn = Math.max(__sn, sm);
        for (const p of s.parts) {
          const m = +String(p.id).replace(/\D/g, "") || 0;
          max = Math.max(max, m);
        }
      }
      __n = max;
      return true;
    } catch { return false; }
  }
  function resetAll() {
    state.doc = seedSketchDoc();
    state.screenId = state.doc.screens[0].id;
    state.partId = null;
    state.preview = null;
    state.orderUndo = [];
    save();
    renderAll();
    toast("已恢复到旅行记录示例");
  }

  // ---------- 零件渲染 ----------
  function partHTML(p, preview = false) {
    // 对齐与透明度：行内样式，画布和预览共用同一份渲染
    const pst = (p.align && p.align !== "left" ? `text-align:${p.align};` : "") + (p.opacity != null && p.opacity < 1 ? `opacity:${p.opacity};` : "");
    const sel = !preview && state.partId === p.id ? " sel" : "";
    const tap = preview && p.action?.to ? " tap" : "";
    const link = p.action?.to
      ? `<i class="sk-link">→ ${p.action.to === "back" ? "返回" : (screenById(state.doc, p.action.to)?.name || "")}</i>`
      : "";
    const tabs = (p.label || "").split("、").filter(Boolean);
    switch (p.kind) {
      case "topAppBar": return `<div class="sk-part sk-topbar${sel}${tap}" data-pid="${p.id}" style="${pst}"><b>${esc(p.label)}</b><span>${glyph(p.icon) || "⋮"}</span>${link}</div>`;
      case "searchBar": return `<div class="sk-part sk-search${sel}${tap}" data-pid="${p.id}" style="${pst}">⌕ ${esc(p.label)}${link}</div>`;
      case "chipRow": return `<div class="sk-part sk-chips${sel}${tap}" data-pid="${p.id}" style="${pst}">${tabs.map((t, i) => `<span class="${i === p.selected ? "on" : ""}">${esc(t)}</span>`).join("")}${link}</div>`;
      case "card": return `<div class="sk-part sk-card v-${p.variant || "filled"}${sel}${tap}" data-pid="${p.id}" style="${pst}">${p.media !== false ? `<div class="sk-card-media"></div>` : ""}<b>${esc(p.label)}</b><span>${numWrap(p.supporting || "")}</span>${link}</div>`;
      case "listItem": return `<div class="sk-part sk-list${sel}${tap}" data-pid="${p.id}" style="${pst}"><i class="th">${esc((p.label || "?")[0])}</i><span class="tx"><b>${esc(p.label)}</b><s>${numWrap(p.supporting || "")}</s></span><em>›</em>${link}</div>`;
      case "button": return `<div class="sk-part sk-btn v-${p.variant || "filled"}${sel}${tap}" data-pid="${p.id}" style="${pst}">${p.icon ? glyph(p.icon) + " " : ""}${esc(p.label)}${link}</div>`;
      case "fab": return `<div class="sk-part sk-fabrow${sel}${tap}" data-pid="${p.id}" style="${pst}"><span class="sk-fab">${glyph(p.icon) || "＋"}</span>${link}</div>`;
      case "bottomNav": return `<div class="sk-part sk-nav${sel}${tap}" data-pid="${p.id}" style="${pst}">${tabs.map((t, i) => `<span class="${i === (p.selected || 0) ? "on" : ""}">${esc(t)}</span>`).join("")}${link}</div>`;
      case "tabs": return `<div class="sk-part sk-tabs${sel}${tap}" data-pid="${p.id}" style="${pst}">${tabs.map((t, i) => `<span class="${i === (p.selected || 0) ? "on" : ""}">${esc(t)}</span>`).join("")}${link}</div>`;
      case "textField": return `<div class="sk-part sk-textfield${sel}${tap}" data-pid="${p.id}" style="${pst}"><label>${esc(p.label)}</label><div class="in">${esc(p.supporting || "请输入…")}</div>${link}</div>`;
      case "switch": return `<div class="sk-part sk-switchrow${sel}${tap}" data-pid="${p.id}" style="${pst}"><span>${esc(p.label)}</span><i class="tgl ${p.checked ? "on" : ""}"></i>${link}</div>`;
      case "text": return `<div class="sk-part sk-text${sel}${tap}" data-pid="${p.id}" style="${pst}"><b>${numWrap(p.label)}</b>${p.supporting ? `<span>${numWrap(p.supporting)}</span>` : ""}${link}</div>`;
      case "image": return `<div class="sk-part sk-image${sel}${tap}" data-pid="${p.id}" style="${pst}">图片${link}</div>`;
      case "box": return `<div class="sk-part sk-box${sel}${tap}" data-pid="${p.id}" style="${pst}">${esc(p.label)}${link}</div>`;
      case "divider": return `<div class="sk-part sk-divider${sel}${tap}" data-pid="${p.id}" style="${pst}">${link}</div>`;
      default: return `<div class="sk-part${sel}" data-pid="${p.id}" style="${pst}">${esc(PARTS[p.kind]?.label || p.kind)}</div>`;
    }
  }
  function screenHTML(s, preview = false) {
    const inner = s.parts.map((p) => partHTML(p, preview)).join("");
    return `<div class="sk-status"><span>9:41</span><span>5G ▂▄▆ █</span></div><div class="sk-screen-body">${inner}</div>`;
  }

  // ---------- 渲染 ----------
  function renderParts() {
    const root = $("#skParts");
    root.innerHTML = `
      <div class="sk-search">⌕ <input id="skPartSearch" placeholder="搜索组件"></div>
      ${CATS.map((c) => `
        <h3>${c}</h3>
        <div class="sk-pgrid">
          ${Object.entries(PARTS).filter(([, sp]) => sp.cat === c).map(([kind, sp]) => `
            <button class="sk-part-card" data-kind="${kind}" title="点一下加进当前屏">
              <span class="pv pv-${kind}"></span><span>${sp.label}</span>
            </button>`).join("")}
        </div>`).join("")}
      <p class="muted small" style="margin-top:14px;line-height:1.7">点一下就加进当前屏幕，位置在最下面；选中零件后在右边改它。拖动零件（触屏拖左边的把手）就能换顺序，右边也有 ↑ ↓ 按钮。</p>`;
    $$(".sk-part-card", root).forEach((b) => b.addEventListener("click", () => addPart(b.dataset.kind)));
    const si = $("#skPartSearch", root);
    si.addEventListener("input", () => {
      const kw = si.value.trim();
      $$(".sk-part-card", root).forEach((b) => {
        b.style.display = !kw || b.textContent.includes(kw) ? "" : "none";
      });
    });
  }
  function renderScreenbar() {
    const bar = $("#skScreenbar");
    bar.innerHTML = `
      ${state.doc.screens.map((s) => `
        <button class="sk-stab ${s.id === state.screenId ? "on" : ""}" data-sid="${s.id}">${esc(s.name)}
          ${state.doc.screens.length > 1 ? `<i data-del="${s.id}" title="删除这页">×</i>` : ""}
        </button>`).join("")}
      <button class="sk-stab add" id="skAddScreen">＋ 添加屏幕</button>
      <span style="flex:1"></span>
      <button class="btn sm" id="skPreviewBtn">▶ 预览切页</button>`;
    $$(".sk-stab[data-sid]", bar).forEach((b) => b.addEventListener("click", (e) => {
      if (e.target.dataset.del) return;
      state.screenId = b.dataset.sid;
      state.partId = null;
      save(); renderCanvas(); renderInspector();
    }));
    $$("[data-del]", bar).forEach((x) => x.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteScreen(x.dataset.del);
    }));
    $("#skAddScreen").addEventListener("click", addScreen);
    $("#skPreviewBtn").addEventListener("click", enterPreview);
    renderDisplaybar();
  }
  function renderCanvas() {
    const cv = $("#skCanvas");
    cv.innerHTML = `
      <div class="sk-phones">
        ${state.doc.screens.map((s) => `
          <div class="sk-phone-col ${s.id === state.screenId ? "on" : ""}" data-sid="${s.id}">
            <div class="sk-phone-label"><b>${esc(s.name)}</b> · ${s.parts.length} 个零件</div>
            <div class="sk-phone"><div class="sk-notch"></div><div class="sk-viewport">${screenHTML(s)}</div><div class="sk-more" hidden>↓ 还有更多内容</div></div>
          </div>`).join("")}
      </div>
      <div class="sk-flow">
        ${state.doc.screens.map((s) => s.parts.filter((p) => p.action?.to && p.action.to !== "back").map((p) => {
          const t = screenById(state.doc, p.action.to);
          return t ? `<span>${esc(s.name)} · ${esc(p.label || PARTS[p.kind].label)} → ${esc(t.name)}（${transitionZh(p.action.transition)}）</span>` : "";
        }).join("")).join("") || `<span class="muted">还没有跳转：在右边检查器的「触发」里给卡片或按钮连一页</span>`}
      </div>`;
    cv.querySelectorAll(".sk-phone-col").forEach((col) => col.addEventListener("click", (e) => {
      if (dragSuppressClick) { dragSuppressClick = false; return; } // 刚拖完的这次点击不算选中
      const part = e.target.closest(".sk-part");
      state.screenId = col.dataset.sid;
      state.partId = part ? part.dataset.pid : null;
      save(); renderCanvas(); renderInspector();
    }));
    // 内容超出手机框时，底栏上方给一个「还有更多内容」提示，滚到底自动消失
    cv.querySelectorAll(".sk-phone-col").forEach((col) => {
      const vp = col.querySelector(".sk-viewport");
      const more = col.querySelector(".sk-more");
      if (!vp || !more) return;
      const update = () => { more.hidden = !(vp.scrollHeight > vp.clientHeight + 4 && vp.scrollTop < vp.scrollHeight - vp.clientHeight - 4); };
      vp.addEventListener("scroll", update);
      update();
    });
    // 拖拽排序：只在当前屏的手机框里。把手挂在每个零件上（底栏除外），拖起来换顺序
    const activeCol = cv.querySelector(".sk-phone-col.on");
    const avp = activeCol?.querySelector(".sk-viewport");
    if (avp) {
      avp.querySelectorAll(".sk-screen-body .sk-part:not(.sk-nav)").forEach((el) => {
        const g = document.createElement("i");
        g.className = "sk-grip";
        g.title = "拖动换顺序";
        g.textContent = "⠿";
        el.appendChild(g);
      });
      attachPartDrag(avp);
    }
    rollNumbers();
  }

  // ---------- 拖拽排序：Pointer Events，鼠标和触屏同一套 ----------
  // 鼠标：零件身上按住拖；触屏：只认把手（零件身上滑动还是滚画布，互不干扰）。
  // 拖起来后零件留在原位变半透明（占位），一条蓝线标出松手后的落点；松手才真正换顺序。
  let dragSuppressClick = false;
  function attachPartDrag(vp) {
    vp.addEventListener("pointerdown", (e) => {
      if (state.preview) return;
      const partEl = e.target.closest(".sk-part");
      if (!partEl || !vp.contains(partEl)) return;
      const found = partById(state.doc, partEl.dataset.pid);
      if (!found || found.part.kind === "bottomNav") return; // 底栏钉在最后，不参与拖拽
      const onGrip = !!e.target.closest(".sk-grip");
      if (e.pointerType === "touch" && !onGrip) return; // 触屏只认把手
      const drag = {
        pid: partEl.dataset.pid, pointerId: e.pointerId,
        startX: e.clientX, startY: e.clientY, lastY: e.clientY,
        started: false, targetIndex: -1, line: null, raf: 0,
      };
      const TH = 6; // 挪过 6px 才算拖，没拖起来就是一次点击
      const updateDropLine = (clientY) => {
        const parts = [...vp.querySelectorAll(".sk-screen-body .sk-part")].filter((el) => el.dataset.pid !== drag.pid);
        const vr = vp.getBoundingClientRect();
        let t = parts.length;
        for (let i = 0; i < parts.length; i++) {
          const pr = parts[i].getBoundingClientRect();
          if (clientY < pr.top + pr.height / 2) { t = i; break; }
        }
        t = clampReorderIndex(currentScreen().parts, drag.pid, t);
        drag.targetIndex = t;
        let y;
        if (t < parts.length) {
          const pr = parts[t].getBoundingClientRect();
          y = pr.top - vr.top + vp.scrollTop;
        } else if (parts.length) {
          const pr = parts[parts.length - 1].getBoundingClientRect();
          y = pr.bottom - vr.top + vp.scrollTop;
        } else {
          y = 0;
        }
        drag.line.style.top = (y - 2) + "px";
      };
      const autoScroll = () => {
        if (!drag.started || !vp.isConnected) return;
        const vr = vp.getBoundingClientRect();
        const near = 56;
        if (drag.lastY < vr.top + near) vp.scrollTop -= 8;
        else if (drag.lastY > vr.bottom - near) vp.scrollTop += 8;
        else { drag.raf = requestAnimationFrame(autoScroll); return; }
        updateDropLine(drag.lastY);
        drag.raf = requestAnimationFrame(autoScroll);
      };
      const cleanup = () => {
        cancelAnimationFrame(drag.raf);
        drag.line?.remove();
        partEl.classList.remove("sk-dragging");
        vp.classList.remove("sk-dragging-on");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
      };
      const onMove = (ev) => {
        if (ev.pointerId !== drag.pointerId || !vp.isConnected) return;
        drag.lastY = ev.clientY;
        if (!drag.started) {
          if (Math.abs(ev.clientX - drag.startX) < TH && Math.abs(ev.clientY - drag.startY) < TH) return;
          drag.started = true;
          drag.line = document.createElement("div");
          drag.line.className = "sk-drop-line";
          vp.appendChild(drag.line);
          partEl.classList.add("sk-dragging");
          vp.classList.add("sk-dragging-on");
          try { vp.setPointerCapture(ev.pointerId); } catch {}
          drag.raf = requestAnimationFrame(autoScroll);
        }
        updateDropLine(ev.clientY);
      };
      const onUp = (ev) => {
        if (ev.pointerId !== drag.pointerId) return;
        const wasDragging = drag.started;
        const t = drag.targetIndex;
        cleanup();
        if (!wasDragging) return; // 没拖起来就是一次点击，交给原有的选中逻辑
        dragSuppressClick = true;
        setTimeout(() => { dragSuppressClick = false; }, 250);
        const s = currentScreen();
        const from = s.parts.findIndex((p) => p.id === drag.pid);
        if (from < 0 || t < 0 || t === from) return; // 落回原位就不动
        pushOrderUndo();
        s.parts = reorderParts(s.parts, drag.pid, t);
        state.partId = drag.pid;
        save(); renderCanvas(); renderInspector();
      };
      const onCancel = (ev) => { if (ev.pointerId === drag.pointerId) cleanup(); };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
    });
  }
  function field(label, inner) {
    return `<div class="sk-field"><label>${label}</label>${inner}</div>`;
  }
  function renderInspector() {
    const panel = $("#skPanel");
    const p = currentPart();
    const s = currentScreen();
    const theme = themeFor(state.doc);
    let html = "";
    if (p) {
      const spec = PARTS[p.kind];
      const idx = s.parts.indexOf(p);
      html += `<section class="card">
        <header class="step-h"><span class="n">1</span><h3>${spec.label}</h3><span class="count">${esc(s.name)}</span></header>
        <div class="itabs" id="skITabs">
          <i class="seg-thumb"></i>
          <button class="on" data-itab="design">设计</button>
          <button data-itab="trigger">触发</button>
        </div>
        <div id="skITabDesign">
          ${spec.hasLabel ? field("标题", `<input type="text" id="skFLabel" value="${esc(p.label)}">`) : ""}
          ${spec.hasSupporting ? field("副标题", `<input type="text" id="skFSup" value="${esc(p.supporting || "")}">`) : ""}
          ${spec.hasTabs ? field("条目（用 、 分隔）", `<input type="text" id="skFTabs" value="${esc(p.label)}">`) : ""}
          ${spec.hasVariant ? field("样式", `<div class="sk-styleseg" id="skFVar">${VARIANTS.map((v) => `<button class="${p.variant === v.id ? "on" : ""}" data-v="${v.id}">${v.zh}</button>`).join("")}</div>`) : ""}
          ${spec.hasIcon ? field("图标", `<select id="skFIcon">${ICONS.map((ic) => `<option value="${ic}" ${p.icon === ic ? "selected" : ""}>${ic || "无"}</option>`).join("")}</select>`) : ""}
          ${ALIGN_KINDS.includes(p.kind) ? field("对齐", `<div class="sk-styleseg" id="skFAlign">${[["left", "左"], ["center", "中"], ["right", "右"]].map(([v, zh]) => `<button class="${(p.align || "left") === v ? "on" : ""}" data-v="${v}">${zh}</button>`).join("")}</div>`) : ""}
          ${field(`透明度 <span class="val">${Math.round((p.opacity ?? 1) * 100)}%</span>`, `<input type="range" id="skFOpacity" min="20" max="100" value="${Math.round((p.opacity ?? 1) * 100)}">`)}
          ${p.kind === "card" ? field(`圆角 <span class="val">${p.radius ?? 20}dp</span>`, `<input type="range" id="skFRadius" min="0" max="40" value="${p.radius ?? 20}">`) : ""}
          <div class="row">
            <button class="btn sm" id="skMoveUp" ${idx <= 0 || p.kind === "bottomNav" ? "disabled" : ""}>↑ 上移</button>
            <button class="btn sm" id="skMoveDown" ${idx >= s.parts.length - 1 || p.kind === "bottomNav" || s.parts[idx + 1]?.kind === "bottomNav" ? "disabled" : ""}>↓ 下移</button>
            <button class="btn sm" id="skUndoOrder" ${state.orderUndo.length ? "" : "disabled"}>⟲ 撤销排序</button>
            <button class="btn sm danger" id="skDelPart">删除</button>
          </div>
        </div>
        <div id="skITabTrigger" hidden>
          ${field("点击操作", `<select id="skFAction">
            <option value="">无</option>
            ${state.doc.screens.filter((x) => x.id !== s.id).map((x) => `<option value="${x.id}" ${p.action?.to === x.id ? "selected" : ""}>跳转到「${esc(x.name)}」</option>`).join("")}
            <option value="back" ${p.action?.to === "back" ? "selected" : ""}>返回</option>
          </select>`)}
          ${field("过渡动画", `<select id="skFTrans">${TRANSITIONS.map((t) => `<option value="${t.id}" ${(p.action?.transition || "slide") === t.id ? "selected" : ""}>${t.zh}</option>`).join("")}</select>`)}
          <div class="note">点这个零件会按上面选的过渡切页。正式版里，下拉框能选你画的任何一页。</div>
        </div>
      </section>`;
    } else {
      html += `<section class="card">
        <header class="step-h"><span class="n">1</span><h3>${esc(s.name)}</h3><span class="count">${s.parts.length} 个零件</span></header>
        ${field("屏幕名称", `<input type="text" id="skFScreenName" value="${esc(s.name)}">`)}
        ${state.doc.screens.length > 1 ? `<div class="row"><button class="btn sm danger" id="skDelScreen">删除这页</button></div>` : ""}
      </section>
      <section class="card">
        <header class="step-h"><span class="n">2</span><h3>主题与应用</h3></header>
        ${field("应用名称", `<input type="text" id="skFTitle" value="${esc(state.doc.title)}">`)}
        ${field("一句话简介", `<input type="text" id="skFBrief" value="${esc(state.doc.brief || "")}">`)}
        ${field("主色", `<select id="skFPalette">${Object.entries(PALETTES).map(([k, v]) => `<option value="${k}" ${state.doc.theme.palette === k ? "selected" : ""}>${v.zh}</option>`).join("")}</select>`)}
        ${field("目标平台", `<select id="skFTarget">${PLATFORMS.map((p) => `<option value="${p.id}" ${targetFor(state.doc).platform === p.id ? "selected" : ""}>${p.zh}</option>`).join("")}</select>`)}
        ${field("组件库", `<select id="skFLibrary">${PLATFORM_LIBS[targetFor(state.doc).platform].map((l) => `<option value="${l.id}" ${targetFor(state.doc).library === l.id ? "selected" : ""}>${l.zh}</option>`).join("")}</select>`)}
      </section>
      <section class="card">
        <header class="step-h"><span class="n">3</span><h3>调节</h3></header>
        ${field("密度", `<div class="sk-styleseg" id="skFDensity">${DENSITIES.map((d) => `<button class="${theme.density === d.id ? "on" : ""}" data-v="${d.id}">${d.zh}</button>`).join("")}</div>`)}
        ${field("字号", `<div class="sk-styleseg" id="skFFont">${FONT_SIZES.map((f) => `<button class="${theme.font === f.id ? "on" : ""}" data-v="${f.id}">${f.zh}</button>`).join("")}</div>`)}
        ${field(`圆角 <span class="val">${theme.radius}px</span>`, `<input type="range" id="skFThemeRadius" min="0" max="32" value="${theme.radius}">`)}
        ${field("阴影", `<div class="sk-styleseg" id="skFShadow">${SHADOWS.map((s) => `<button class="${theme.shadow === s.id ? "on" : ""}" data-v="${s.id}">${s.zh}</button>`).join("")}</div>`)}
      </section>`;
    }
    html += `<section class="card">
      <header class="step-h"><span class="n">${p ? "2" : "4"}</span><h3>提示词</h3></header>
      <div class="prompt-wrap"><textarea id="skPrompt" spellcheck="false" readonly></textarea></div>
      <div class="row">
        <button class="btn primary grow" id="skCopy"><span class="l1">复制提示词</span><span class="l2"><svg class="check-draw" viewBox="0 0 16 16"><path pathLength="1" d="M3 8.5 L6.5 12 L13 4.5"/></svg> 已复制</span></button>
        <button class="btn danger" id="skReset"><span>重新开始</span></button>
      </div>
      <p class="muted small">提示词跟着画布实时生成，粘贴给 Claude Code、Codex、Cursor，直接生成能跑的应用。设计自动保存在浏览器里，刷新还在。</p>
    </section>`;
    panel.innerHTML = html;
    bindInspector(p, s);
    renderPromptText();
  }
  function bindInspector(p, s) {
    const on = (id, ev, fn) => { const el = $(id); if (el) el.addEventListener(ev, fn); };
    const refresh = () => { save(); renderCanvas(); renderPromptText(); };
    on("#skFLabel", "input", (e) => { p.label = e.target.value; refresh(); });
    on("#skFSup", "input", (e) => { p.supporting = e.target.value; refresh(); });
    on("#skFTabs", "input", (e) => { p.label = e.target.value; refresh(); });
    on("#skFIcon", "change", (e) => { p.icon = e.target.value; refresh(); });
    on("#skFRadius", "input", (e) => { p.radius = +e.target.value; e.target.closest(".sk-field").querySelector(".val").textContent = p.radius + "dp"; refresh(); });
    on("#skFAction", "change", (e) => {
      p.action = e.target.value ? { to: e.target.value, transition: p.action?.transition || "slide" } : undefined;
      refresh(); renderInspector();
    });
    on("#skFTrans", "change", (e) => { if (p.action) p.action.transition = e.target.value; refresh(); });
    on("#skFScreenName", "input", (e) => { s.name = e.target.value; save(); renderScreenbar(); renderCanvas(); renderPromptText(); });
    on("#skFTitle", "input", (e) => { state.doc.title = e.target.value; save(); renderPromptText(); });
    on("#skFBrief", "input", (e) => { state.doc.brief = e.target.value; save(); renderPromptText(); });
    on("#skFPalette", "change", (e) => { state.doc.theme.palette = e.target.value; save(); applyTheme(); renderPromptText(); });
    // 换平台后组件库跟着变：当前库不属于新平台时落到该平台的第一个库，不出现不可能的组合
    on("#skFTarget", "change", (e) => {
      const t = targetFor(state.doc);
      t.platform = e.target.value;
      t.library = PLATFORM_LIBS[t.platform][0].id;
      state.doc.target = t;
      save(); renderInspector(); renderPromptText();
    });
    on("#skFLibrary", "change", (e) => {
      state.doc.target = { ...targetFor(state.doc), library: e.target.value };
      save(); renderPromptText();
    });
    // 调节：改的是整套设计，变量实时生效，提示词跟着变
    const seg = (id, key) => {
      const g = $(id);
      if (g) g.addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b) return;
        state.doc.theme[key] = b.dataset.v; save(); applyTheme(); renderInspector(); renderPromptText();
      });
    };
    seg("#skFDensity", "density");
    seg("#skFFont", "font");
    seg("#skFShadow", "shadow");
    on("#skFThemeRadius", "input", (e) => {
      state.doc.theme.radius = +e.target.value;
      e.target.closest(".sk-field").querySelector(".val").textContent = state.doc.theme.radius + "px";
      save(); applyTheme(); renderPromptText();
    });
    // 零件的对齐与透明度
    on("#skFAlign", "click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      p.align = b.dataset.v; save(); renderCanvas(); renderInspector(); renderPromptText();
    });
    on("#skFOpacity", "input", (e) => {
      p.opacity = +e.target.value / 100;
      e.target.closest(".sk-field").querySelector(".val").textContent = e.target.value + "%";
      save(); renderCanvas(); renderPromptText();
    });
    on("#skMoveUp", "click", () => movePart(p, -1));
    on("#skMoveDown", "click", () => movePart(p, 1));
    on("#skUndoOrder", "click", undoOrder);
    on("#skDelPart", "click", () => {
      // 删除反向：先收起 225ms、淡出 160ms，下面的行补上来，再真正删掉
      const el = document.querySelector(`.sk-phone-col.on [data-pid="${p.id}"]`);
      const doDelete = () => {
        s.parts = s.parts.filter((x) => x.id !== p.id);
        state.partId = null; state.deleting = false; save(); renderCanvas(); renderInspector();
      };
      if (!el || reduceMotion() || state.deleting) { if (!state.deleting) doDelete(); return; }
      state.deleting = true;
      const wrap = document.createElement("div");
      wrap.className = "sk-enter-wrap open closing";
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
      el.classList.add("sk-leaving");
      requestAnimationFrame(() => wrap.classList.remove("open"));
      setTimeout(doDelete, 240);
    });
    on("#skDelScreen", "click", () => deleteScreen(s.id));
    const tabs = $("#skITabs");
    if (tabs) tabs.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $$("#skITabs button").forEach((x) => x.classList.toggle("on", x === b));
      const trig = b.dataset.itab === "trigger";
      $("#skITabDesign").hidden = trig;
      $("#skITabTrigger").hidden = !trig;
      placeITabThumb(true);
    });
    placeITabThumb(false);
    const vseg = $("#skFVar");
    if (vseg) vseg.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      p.variant = b.dataset.v; save(); renderCanvas(); renderInspector(); renderPromptText();
    });
    on("#skCopy", "click", copyPrompt);
    on("#skReset", "click", resetAll);
  }
  function renderPromptText() {
    const ta = $("#skPrompt");
    if (ta) ta.value = buildSketchPrompt(state.doc);
  }
  function applyTheme() {
    const pal = PALETTES[state.doc.theme.palette] || PALETTES.blue;
    const theme = themeFor(state.doc);
    const root = $("#sketchRoot");
    root.style.setProperty("--sk-primary", pal.primary);
    root.style.setProperty("--sk-primary-soft", pal.primaryContainer);
    root.style.setProperty("--sk-radius", theme.radius + "px");
    root.style.setProperty("--sk-gap", (DENSITIES.find((d) => d.id === theme.density)?.gap || 12) + "px");
    root.style.setProperty("--sk-zoom", String(FONT_SIZES.find((f) => f.id === theme.font)?.zoom || 1));
    const sh = SHADOWS.find((s) => s.id === theme.shadow) || SHADOWS[1];
    root.style.setProperty("--sk-shadow", sh.value);
    root.style.setProperty("--sk-shadow-strong", sh.strong);
  }

  // ---------- 展示设置：只管怎么看，不进设计文档、不进提示词 ----------
  const DISPLAY_KEY = "dianjing.sketch.display.v1";
  const display = { frame: "hole", zoom: "fit", bg: "warm", dur: "standard", autoplay: false };
  function loadDisplay() {
    try {
      const d = JSON.parse(localStorage.getItem(DISPLAY_KEY) || "{}");
      if (["notch", "hole", "none"].includes(d.frame)) display.frame = d.frame;
      if (["fit", "100"].includes(d.zoom)) display.zoom = d.zoom;
      if (["warm", "dark", "grid"].includes(d.bg)) display.bg = d.bg;
      if (["fast", "standard", "slow"].includes(d.dur)) display.dur = d.dur;
      if (typeof d.autoplay === "boolean") display.autoplay = d.autoplay;
    } catch {}
  }
  function saveDisplay() { try { localStorage.setItem(DISPLAY_KEY, JSON.stringify(display)); } catch {} }
  function applyDisplay() {
    document.body.classList.remove("sk-frame-notch", "sk-frame-hole", "sk-frame-none");
    document.body.classList.add("sk-frame-" + display.frame);
    const stage = $("#skStage");
    stage.classList.toggle("sk-zoom-100", display.zoom === "100");
    stage.classList.toggle("sk-bg-dark", display.bg === "dark");
    stage.classList.toggle("sk-bg-grid", display.bg === "grid");
    const dur = { fast: ".25s", standard: ".42s", slow: ".7s" }[display.dur] || ".42s";
    $("#sketchRoot").style.setProperty("--sk-dur", dur);
  }
  function renderDisplaybar() {
    const bar = $("#skDisplaybar");
    if (!bar) return;
    const seg = (id, opts, cur) => `<div class="sk-styleseg" id="${id}">${opts.map(([v, zh]) => `<button class="${cur === v ? "on" : ""}" data-v="${v}">${zh}</button>`).join("")}</div>`;
    bar.innerHTML = `
      <div class="sk-dgroup"><label>设备框</label>${seg("skDFrame", [["notch", "iPhone 刘海"], ["hole", "安卓挖孔"], ["none", "无框"]], display.frame)}</div>
      <div class="sk-dgroup"><label>缩放</label>${seg("skDZoom", [["fit", "适配"], ["100", "100%"]], display.zoom)}</div>
      <div class="sk-dgroup"><label>背景</label>${seg("skDBg", [["warm", "暖灰"], ["dark", "深灰"], ["grid", "网格纸"]], display.bg)}</div>`;
    bar.querySelectorAll(".sk-styleseg").forEach((g) => g.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (g.id === "skDFrame") display.frame = b.dataset.v;
      else if (g.id === "skDZoom") display.zoom = b.dataset.v;
      else if (g.id === "skDBg") display.bg = b.dataset.v;
      saveDisplay(); applyDisplay(); renderDisplaybar();
    }));
  }

  // ---------- 错峰入场 ----------
  const reduceMotion = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  // 新零件入场：先临时包进一格 grid（0fr → 1fr 展开 400ms），零件本身同时上方滑入 400ms、淡入 240ms；
  // 错峰每项 40ms 起，延迟封顶 200ms，总长不超 600ms；动画结束拆掉临时壳，恢复原结构。
  function enterParts(els, staggerMs = 40) {
    if (reduceMotion() || !els.length) return;
    const wraps = els.map((el, i) => {
      const d = staggerDelay(i, staggerMs);
      const wrap = document.createElement("div");
      wrap.className = "sk-enter-wrap";
      wrap.style.transitionDelay = `${d}ms`;
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
      el.style.animationDelay = `${d}ms, ${d}ms`;
      el.classList.add("sk-entering");
      return wrap;
    });
    requestAnimationFrame(() => wraps.forEach((w) => w.classList.add("open")));
    setTimeout(() => {
      wraps.forEach((wrap) => {
        const part = wrap.firstElementChild;
        if (!part) return;
        wrap.replaceWith(part);
        part.classList.remove("sk-entering");
        part.style.animationDelay = "";
      });
    }, 400 + 200 + 80);
  }
  // 首屏第一次打开：主角（hero 卡）先到，其余按阅读顺序一个接一个跟上；只播一次
  function firstScreenEntrance() {
    if (state.enteredOnce || reduceMotion()) return;
    state.enteredOnce = true;
    const vp = document.querySelector(".sk-phone-col.on .sk-viewport");
    if (!vp) return;
    const els = [...vp.querySelectorAll(".sk-part")];
    const hero = els.find((el) => el.classList.contains("sk-card"));
    enterParts(hero ? [hero, ...els.filter((el) => el !== hero)] : els, 40);
  }

  // ---------- 操作 ----------
  function addPart(kind) {
    const spec = PARTS[kind];
    const s = currentScreen();
    const p = { id: newPartId(), kind, label: spec.defLabel, supporting: spec.defSupporting || "", icon: kind === "fab" ? "add" : "", variant: "filled", selected: 0 };
    if (spec.hasTabs) p.selected = 0;
    if (kind === "card") p.media = true;
    // 有底栏时新零件插在底栏前面，别跑到它下面去
    const navIdx = s.parts.findIndex((x) => x.kind === "bottomNav");
    if (navIdx >= 0) s.parts.splice(navIdx, 0, p); else s.parts.push(p);
    state.partId = p.id;
    save(); renderCanvas(); renderInspector();
    // 新零件插在底栏前面，可能在可视区下面——把它滚到视野里（留出底栏的高度）
    const vp = document.querySelector(".sk-phone-col.on .sk-viewport");
    const el = vp?.querySelector(`[data-pid="${p.id}"]`);
    if (vp && el) {
      const nav = vp.querySelector(".sk-nav");
      const navH = nav ? nav.getBoundingClientRect().height : 0;
      const r = el.getBoundingClientRect(), vr = vp.getBoundingClientRect();
      const bottomEdge = vr.bottom - navH - 8;
      if (r.bottom > bottomEdge) vp.scrollTop += r.bottom - bottomEdge;
      else if (r.top < vr.top) vp.scrollTop -= vr.top - r.top + 8;
    }
    // 新零件从 0 行高展开、上方滑入、淡入
    if (el) enterParts([el], 0);
  }
  function movePart(p, d) {
    const s = currentScreen();
    if (p.kind === "bottomNav") return; // 底栏钉在最后，不参与排序
    const i = s.parts.indexOf(p);
    const j = i + d;
    if (i < 0 || j < 0 || j >= s.parts.length) return;
    if (s.parts[j]?.kind === "bottomNav") return; // 别把底栏顶出最后一位
    pushOrderUndo();
    s.parts = reorderParts(s.parts, p.id, j);
    save(); renderCanvas(); renderInspector();
  }
  // 排序的单步撤销：换顺序前把当前屏的零件顺序拍下来，撤销时按 id 拼回去
  // （快照之后删掉的零件不复活、之后新加的留在最后，只还原顺序）
  function pushOrderUndo() {
    const s = currentScreen();
    state.orderUndo.push({ screenId: s.id, order: s.parts.map((p) => p.id) });
    if (state.orderUndo.length > 20) state.orderUndo.shift();
  }
  function undoOrder() {
    const snap = state.orderUndo.pop();
    if (!snap) return;
    const s = screenById(state.doc, snap.screenId) || state.doc.screens[0];
    const byId = new Map(s.parts.map((p) => [p.id, p]));
    const restored = snap.order.map((id) => byId.get(id)).filter(Boolean);
    for (const p of s.parts) if (!snap.order.includes(p.id)) restored.push(p);
    s.parts = restored;
    state.screenId = s.id;
    state.partId = null;
    save(); renderCanvas(); renderInspector();
  }
  function addScreen() {
    const id = newScreenId();
    const n = state.doc.screens.length + 1;
    state.doc.screens.push({
      id, name: `屏幕 ${n}`,
      parts: [
        { id: newPartId(), kind: "topAppBar", label: `屏幕 ${n}`, icon: "" },
        { id: newPartId(), kind: "text", label: "这一页是空的，点左侧零件往里加。", supporting: "" },
      ],
    });
    state.screenId = id;
    state.partId = null;
    save(); renderScreenbar(); renderCanvas(); renderInspector();
    toast(`已加${state.doc.screens.length}个屏幕的第 ${n} 页`);
  }
  function deleteScreen(id) {
    if (state.doc.screens.length <= 1) return;
    state.doc.screens = state.doc.screens.filter((s) => s.id !== id);
    for (const s of state.doc.screens) for (const p of s.parts) if (p.action?.to === id) p.action = undefined;
    if (state.screenId === id) state.screenId = state.doc.screens[0].id;
    state.partId = null;
    save(); renderScreenbar(); renderCanvas(); renderInspector();
  }
  function copyPrompt() {
    const btn = $("#skCopy");
    const text = buildSketchPrompt(state.doc);
    const done = () => {
      if (btn.classList.contains("done")) return; // 已在完成态时不重播勾号
      btn.classList.add("done");
      setTimeout(() => btn.classList.remove("done"), 1600);
      toast("已复制：提示词已在剪贴板，粘贴给 Claude Code / Codex / Cursor 即可生成应用");
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(() => { fallbackCopy(text); done(); });
    else { fallbackCopy(text); done(); }
  }
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch {}
    document.body.removeChild(ta);
  }

  // ---------- 预览播放器 ----------
  function enterPreview() {
    if (!state.doc.screens.length) return;
    state.preview = { stack: [state.screenId] };
    document.body.classList.add("sk-previewing");
    $("#skStage").classList.add("previewing");
    renderPlayer();
    toast("预览中：点有跳转的零件切页，返回可后退");
  }
  function exitPreview() {
    clearTimeout(autoTimer);
    state.preview = null;
    document.body.classList.remove("sk-previewing");
    $("#skStage").classList.remove("previewing");
  }
  // 自动播放：每 2.5 秒沿当前页第一个跳转前进，没有跳转就去下一页，到最后一页停住
  let autoTimer = null;
  function syncPlayerbar() {
    $$("#skPlayerDur button").forEach((b) => b.classList.toggle("on", b.dataset.v === display.dur));
    const auto = $("#skPlayerAuto");
    if (auto) { auto.classList.toggle("on", display.autoplay); auto.textContent = display.autoplay ? "⏸ 自动播放中" : "▶ 自动播放"; }
  }
  function scheduleAuto() {
    clearTimeout(autoTimer);
    if (!state.preview || !display.autoplay) return;
    autoTimer = setTimeout(() => {
      if (!state.preview) return;
      const cur = state.preview.stack[state.preview.stack.length - 1];
      const s = screenById(state.doc, cur) || state.doc.screens[0];
      const next = s.parts.find((p) => p.action?.to && p.action.to !== "back" && screenById(state.doc, p.action.to));
      if (next) {
        const el = document.querySelector(`#skPlayerVp [data-pid="${next.id}"]`);
        forwardTo(next, el);
      } else {
        const i = state.doc.screens.indexOf(s);
        if (i >= 0 && i < state.doc.screens.length - 1) {
          state.preview.stack.push(state.doc.screens[i + 1].id);
          renderPlayer("anim-slide");
        }
      }
    }, 2500);
  }
  // 前进：放大（zoom）过渡时，把被点卡片的中心当作放大原点，并记下离开前的滚动位置供返回时恢复
  function forwardTo(part, el) {
    const a = part.action;
    if (!a?.to || a.to === "back") return;
    if (!screenById(state.doc, a.to)) return;
    const vp = $("#skPlayerVp");
    const trans = a.transition || "slide";
    let origin = null;
    if (trans === "zoom" && el && vp) {
      const r = el.getBoundingClientRect();
      const vr = vp.getBoundingClientRect();
      origin = { cx: r.left - vr.left + r.width / 2, cy: r.top - vr.top + r.height / 2, scrollTop: vp.scrollTop };
      state.preview.zoom = origin;
    } else {
      state.preview.zoom = null;
    }
    state.preview.stack.push(a.to);
    renderPlayer("anim-" + trans, origin);
  }
  // 后退：放大的进入是精确逆过程——当前屏先朝原卡片中心缩回、淡出，再切回上一屏并恢复滚动位置
  function goBack() {
    if (!state.preview || state.preview.stack.length <= 1 || state.preview.animating) return;
    const zoom = state.preview.zoom;
    state.preview.stack.pop();
    if (zoom) {
      const vp = $("#skPlayerVp");
      if (!vp) { renderPlayer(""); return; }
      state.preview.animating = true;
      vp.classList.remove("anim-slide", "anim-slideLeft", "anim-slideUp", "anim-slideDown", "anim-fade", "anim-expand", "anim-zoom", "anim-zoom-out", "anim-back", "anim-none");
      vp.style.transformOrigin = `${zoom.cx}px ${zoom.cy}px`;
      void vp.offsetWidth;
      vp.classList.add("anim-zoom-out");
      setTimeout(() => {
        if (!state.preview) return;
        state.preview.zoom = null;
        state.preview.animating = false;
        renderPlayer("");
        const vp2 = $("#skPlayerVp");
        if (vp2) { vp2.scrollTop = zoom.scrollTop; vp2.style.transformOrigin = ""; }
      }, 380);
    } else {
      renderPlayer("anim-back");
    }
  }
  function renderPlayer(anim = "", origin = null) {
    const stage = $("#skStage");
    let player = $(".sk-player", stage);
    if (!player) {
      player = document.createElement("div");
      player.className = "sk-player";
      player.innerHTML = `
        <div class="sk-player-phone"><div class="sk-notch"></div><div class="sk-viewport" id="skPlayerVp"></div></div>
        <div class="sk-playerbar">
          <button class="btn sm" id="skPlayerBack">← 返回</button>
          <span class="muted small" id="skPlayerName"></span>
          <span class="muted small">过渡</span>
          <div class="sk-styleseg" id="skPlayerDur">
            <button data-v="fast">快</button><button data-v="standard">标准</button><button data-v="slow">慢</button>
          </div>
          <button class="btn sm" id="skPlayerAuto">▶ 自动播放</button>
          <button class="btn sm" id="skPlayerClose">关闭预览</button>
        </div>`;
      stage.appendChild(player);
      $("#skPlayerClose").addEventListener("click", exitPreview);
      $("#skPlayerDur").addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b) return;
        display.dur = b.dataset.v; saveDisplay(); applyDisplay(); syncPlayerbar();
      });
      $("#skPlayerAuto").addEventListener("click", () => {
        display.autoplay = !display.autoplay; saveDisplay(); syncPlayerbar();
        if (display.autoplay) scheduleAuto(); else clearTimeout(autoTimer);
      });
      $("#skPlayerBack").addEventListener("click", goBack);
      // 点击涟漪：从触点扩散，抬起手指时消退
      $("#skPlayerVp").addEventListener("pointerdown", (e) => {
        const el = e.target.closest(".sk-part");
        if (!el) return;
        const r = el.getBoundingClientRect();
        const rip = document.createElement("i");
        rip.className = "sk-ripple";
        const size = Math.max(r.width, r.height) * 2;
        rip.style.width = rip.style.height = size + "px";
        rip.style.left = (e.clientX - r.left - size / 2) + "px";
        rip.style.top = (e.clientY - r.top - size / 2) + "px";
        el.appendChild(rip);
        let gone = false;
        const remove = () => { if (gone) return; gone = true; rip.remove(); };
        const fade = () => { rip.classList.add("fade"); setTimeout(remove, 220); };
        el.addEventListener("pointerup", fade, { once: true });
        el.addEventListener("pointerleave", fade, { once: true });
        setTimeout(remove, 900);
      });
      $("#skPlayerVp").addEventListener("click", (e) => {
        if (state.preview.animating) return; // 过渡进行中不响应，避免双击错位
        const el = e.target.closest(".sk-part");
        if (!el) return;
        const found = partById(state.doc, el.dataset.pid);
        if (!found) return;
        const a = found.part.action;
        if (!a?.to) { toast("这个元素没有设置点击操作，在右边检查器的「触发」里连一页"); return; }
        if (a.to === "back") { goBack(); return; }
        forwardTo(found.part, el);
      });
    }
    const cur = state.preview.stack[state.preview.stack.length - 1];
    const s = screenById(state.doc, cur) || state.doc.screens[0];
    const vp = $("#skPlayerVp");
    vp.innerHTML = screenHTML(s, true);
    vp.classList.remove("anim-slide", "anim-slideLeft", "anim-slideUp", "anim-slideDown", "anim-fade", "anim-expand", "anim-zoom", "anim-zoom-out", "anim-back", "anim-none");
    vp.style.transformOrigin = "";
    if (anim) {
      if (anim === "anim-zoom" && origin) vp.style.transformOrigin = `${origin.cx}px ${origin.cy}px`;
      void vp.offsetWidth;
      vp.classList.add(anim);
      if (anim === "anim-zoom") {
        state.preview.animating = true;
        setTimeout(() => { if (state.preview) state.preview.animating = false; }, 380);
      }
    }
    $("#skPlayerName").textContent = `${s.name}（第 ${state.preview.stack.length} 层）`;
    $("#skPlayerBack").disabled = state.preview.stack.length <= 1;
    syncPlayerbar();
    scheduleAuto();
  }

  // ---------- 模式切换 ----------
  // ---------- 滑动胶囊：把 .seg-thumb 放到容器里选中的按钮上（模式切换器、检查器标签页共用） ----------
  // 宽度不同时宽度也一起过渡；首次放置、窗口缩放、字体加载完都直接放到位，不从 0 宽长出来。
  // （v0.5.4 的教训：样式没到就量尺寸会量错，所以只在布局稳定后量，且每次布局变化都重放位）
  function placeThumb(containerSel, animate = true) {
    const seg = $(containerSel);
    const th = seg?.querySelector(".seg-thumb");
    const on = seg?.querySelector("button.on");
    if (!seg || !th || !on || !on.offsetWidth) return;
    if (!animate) th.classList.add("no-anim");
    const st = thumbStyle(on.offsetWidth, on.offsetLeft);
    th.style.width = st.width;
    th.style.transform = st.transform;
    if (!animate) { void th.offsetWidth; th.classList.remove("no-anim"); }
  }
  const placeModeThumb = (animate = true) => placeThumb("#modeSeg", animate);
  const placeITabThumb = (animate = true) => placeThumb("#skITabs", animate);
  function setMode(mode) {
    const sketch = mode === "sketch";
    document.body.classList.toggle("mode-sketch", sketch);
    $$("#modeSeg button").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
    placeModeThumb(true);
    if (sketch && !state.booted) {
      state.booted = true;
      if (!load()) { state.doc = seedSketchDoc(); state.screenId = state.doc.screens[0].id; }
      state.partId = null;
      applyTheme();
      renderParts(); renderScreenbar(); renderCanvas(); renderInspector();
      firstScreenEntrance();
    }
  }
  function renderAll() {
    renderScreenbar(); renderCanvas(); renderInspector();
  }
  function boot() {
    loadDisplay();
    applyDisplay();
    $$("#modeSeg button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
    // 首次放置等一帧再量（样式到位后）；样式、字体、窗口变化后都直接重放位
    requestAnimationFrame(() => placeModeThumb(false));
    if (document.fonts?.ready) document.fonts.ready.then(() => placeModeThumb(false));
    window.addEventListener("load", () => placeModeThumb(false));
    window.addEventListener("resize", () => placeModeThumb(false));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
}
