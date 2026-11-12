// 点睛 · 画界面模式：照 m3e-canvas 的骨架做的中文版
// 拼 APP 页面（零件 → 屏幕）→ 点一下切页 → 整套设计生成提示词。
// 纯逻辑部分可单元测试；DOM 部分只在浏览器里跑（见文件下半段）。

// ---------- 零件表：16 种，分 5 类 ----------
export const CATS = ["操作", "导航", "容器", "输入", "内容"];
// spec: hasLabel 标题 / hasSupporting 副标题 / hasVariant 样式 / hasIcon 图标 / hasTabs 条目
export const PARTS = {
  button:     { cat: "操作", label: "按钮",       defLabel: "按钮",     hasLabel: true, hasIcon: true, hasVariant: true },
  chip:       { cat: "操作", label: "标签片",     defLabel: "标签",     hasLabel: true },
  chipRow:    { cat: "操作", label: "标签片组",   defLabel: "全部、川菜、粤菜、素食", hasLabel: true, hasTabs: true },
  fab:        { cat: "操作", label: "悬浮按钮",   defLabel: "",         hasIcon: true },
  topAppBar:  { cat: "导航", label: "顶部应用栏", defLabel: "标题",     hasLabel: true, hasIcon: true },
  bottomNav:  { cat: "导航", label: "底部导航",   defLabel: "首页、菜谱、收藏、我的", hasLabel: true, hasTabs: true },
  searchBar:  { cat: "导航", label: "搜索栏",     defLabel: "搜索菜谱、食材", hasLabel: true },
  tabs:       { cat: "导航", label: "标签页",     defLabel: "全部、进行中、已完成", hasLabel: true, hasTabs: true },
  card:       { cat: "容器", label: "卡片",       defLabel: "卡片标题", defSupporting: "这是卡片正文内容。", hasLabel: true, hasSupporting: true, hasVariant: true, media: true },
  listItem:   { cat: "容器", label: "列表项",     defLabel: "列表标题", defSupporting: "副标题", hasLabel: true, hasSupporting: true, hasIcon: true },
  box:        { cat: "容器", label: "容器框",     defLabel: "容器里的内容", hasLabel: true },
  textField:  { cat: "输入", label: "文本输入框", defLabel: "标签",     defSupporting: "辅助文本", hasLabel: true, hasSupporting: true },
  switch:     { cat: "输入", label: "开关",       defLabel: "开关",     hasLabel: true },
  text:       { cat: "内容", label: "文本",       defLabel: "一段文字", hasLabel: true },
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
  { id: "expand", zh: "放大" },
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

// ---------- 种子：一套中文菜谱应用（首页 + 详情页） ----------
let __n = 0;
const nid = (p) => `${p}${++__n}`;
export function seedSketchDoc() {
  __n = 100;
  return {
    title: "菜谱",
    brief: "保存和搜索菜谱的应用。",
    platform: "web",
    theme: { palette: "blue", shape: "rounded" },
    screens: [
      {
        id: "s1", name: "首页",
        parts: [
          { id: nid("p"), kind: "topAppBar", label: "菜谱", icon: "search" },
          { id: nid("p"), kind: "searchBar", label: "搜索菜谱、食材" },
          { id: nid("p"), kind: "chipRow", label: "全部、川菜、粤菜、素食", selected: 0 },
          { id: nid("p"), kind: "card", label: "宫保鸡丁", supporting: "鸡腿肉、花生、干辣椒", variant: "filled", media: true, action: { to: "s2", transition: "slide" } },
          { id: nid("p"), kind: "listItem", label: "麻婆豆腐", supporting: "川菜 · 微辣 · 15 分钟", icon: "star" },
          { id: nid("p"), kind: "listItem", label: "番茄炒蛋", supporting: "家常 · 10 分钟", icon: "star" },
          { id: nid("p"), kind: "listItem", label: "清蒸鲈鱼", supporting: "粤菜 · 25 分钟", icon: "star" },
          { id: nid("p"), kind: "bottomNav", label: "首页、菜谱、收藏、我的", selected: 0 },
        ],
      },
      {
        id: "s2", name: "详情页",
        parts: [
          { id: nid("p"), kind: "image", label: "" },
          { id: nid("p"), kind: "text", label: "宫保鸡丁", supporting: "鸡腿肉、花生、干辣椒，酸甜微辣，米饭杀手。" },
          { id: nid("p"), kind: "chipRow", label: "30 分钟、中辣、4 人份", selected: -1 },
          { id: nid("p"), kind: "text", label: "食材", supporting: "鸡腿肉 300 克、花生米 50 克、干辣椒 8 个、葱姜蒜适量。" },
          { id: nid("p"), kind: "text", label: "步骤", supporting: "鸡丁上浆，炸花生米，爆香调料，收汁出锅。" },
          { id: nid("p"), kind: "button", label: "开始做饭", variant: "filled", action: { to: "back", transition: "slideLeft" } },
        ],
      },
    ],
  };
}

// ---------- 一个零件一句话（进提示词） ----------
const q = (s) => `“${s}”`;
export function describePart(p) {
  const tabs = (p.label || "").split("、").filter(Boolean);
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

// ---------- 提示词生成：十段结构，中文 ----------
export function buildSketchPrompt(doc) {
  const pal = PALETTES[doc.theme?.palette] || PALETTES.blue;
  const shape = (SHAPES.find((s) => s.id === doc.theme?.shape) || SHAPES[1]).zh;
  const L = [];
  L.push(`请用 Material 3 Expressive 的设计实现${doc.title}。${doc.brief || ""}`);
  L.push("目标为竖屏手机（412×892dp），同时支持浅色和深色模式，并跟随设备的系统设置切换。");
  L.push("实现目标是 Web（在浏览器中运行的应用）。");
  L.push("下面的屏幕结构是传达意图的草图，不是最终规格。不要把它当静态图片照搬，而要做成这类应用通常应具备的功能齐全、真正可用的成品。");
  L.push("");
  L.push("## 配色");
  L.push(`主题为${pal.zh}系。请在 Material 3 的浅色和深色配色方案中设置以下颜色，UI 的所有颜色都通过这些角色引用。`);
  const row = (pairs) => `- ${pairs.map(([k, v]) => `${k} ${v}`).join(" / ")}`;
  L.push(row([["primary", pal.primary], ["onPrimary", pal.onPrimary], ["primaryContainer", pal.primaryContainer], ["onPrimaryContainer", pal.onPrimaryContainer]]));
  L.push(row([["secondary", pal.secondary], ["surface", pal.surface], ["surfaceContainer", pal.surfaceContainer], ["surfaceContainerHigh", pal.surfaceContainerHigh]]));
  L.push(row([["onSurface", pal.onSurface], ["onSurfaceVariant", pal.onSurfaceVariant], ["outline", pal.outline], ["error", pal.error]]));
  L.push("");
  L.push("## 形状、字体与动效");
  L.push(shape === "方形"
    ? "圆角保持克制：整体缩小 M3 的形状比例（按钮和标签片 8〜12dp，卡片和图片 8dp，对话框约 12dp），不使用胶囊形。"
    : shape === "全圆"
    ? "圆角尽量放大：按钮、标签片和输入框为胶囊形，卡片和图片 32dp，对话框和面板约 40dp。"
    : "圆角沿用 M3 Expressive 的默认值（按钮为胶囊形，卡片 20dp，对话框 28dp）。");
  L.push("排版使用 M3 的标准字重，字体为 Roboto。");
  L.push("动效使用平滑过渡，不回弹；屏幕过渡和状态变化保持轻快。");
  L.push("");
  L.push("## 屏幕结构");
  L.push(`共有 ${doc.screens.length} 个屏幕：${doc.screens.map((s) => s.name).join("、")}。`);
  for (const s of doc.screens) {
    const body = s.parts.length
      ? s.parts.map(describePart).join("；")
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
  L.push("以下是所用组件的参考。数值均为 M3 Expressive 的标准值，能用标准组件实现的就交给标准组件，并可根据内容适当调整。");
  for (const k of used) if (STYLE_NOTES[k]) L.push(`- ${STYLE_NOTES[k]}`);
  L.push("");
  L.push("## 整体原则");
  PRINCIPLES.forEach((r, i) => L.push(`${i + 1}. ${r}`));
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

  const state = { doc: null, screenId: "s1", partId: null, preview: null, booted: false };
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
      state.doc = d.doc;
      state.screenId = screenById(state.doc, d.screenId) ? d.screenId : state.doc.screens[0].id;
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
    save();
    renderAll();
    toast("已恢复到菜谱示例");
  }

  // ---------- 零件渲染 ----------
  function partHTML(p, preview = false) {
    const sel = !preview && state.partId === p.id ? " sel" : "";
    const tap = preview && p.action?.to ? " tap" : "";
    const link = p.action?.to
      ? `<i class="sk-link">→ ${p.action.to === "back" ? "返回" : (screenById(state.doc, p.action.to)?.name || "")}</i>`
      : "";
    const tabs = (p.label || "").split("、").filter(Boolean);
    switch (p.kind) {
      case "topAppBar": return `<div class="sk-part sk-topbar${sel}${tap}" data-pid="${p.id}"><b>${esc(p.label)}</b><span>${glyph(p.icon) || "⋮"}</span>${link}</div>`;
      case "searchBar": return `<div class="sk-part sk-search${sel}${tap}" data-pid="${p.id}">⌕ ${esc(p.label)}${link}</div>`;
      case "chipRow": return `<div class="sk-part sk-chips${sel}${tap}" data-pid="${p.id}">${tabs.map((t, i) => `<span class="${i === p.selected ? "on" : ""}">${esc(t)}</span>`).join("")}${link}</div>`;
      case "card": return `<div class="sk-part sk-card v-${p.variant || "filled"}${sel}${tap}" data-pid="${p.id}">${p.media !== false ? `<div class="sk-card-media"></div>` : ""}<b>${esc(p.label)}</b><span>${esc(p.supporting || "")}</span>${link}</div>`;
      case "listItem": return `<div class="sk-part sk-list${sel}${tap}" data-pid="${p.id}"><i class="th">${esc((p.label || "?")[0])}</i><span class="tx"><b>${esc(p.label)}</b><s>${esc(p.supporting || "")}</s></span><em>›</em>${link}</div>`;
      case "button": return `<div class="sk-part sk-btn v-${p.variant || "filled"}${sel}${tap}" data-pid="${p.id}">${p.icon ? glyph(p.icon) + " " : ""}${esc(p.label)}${link}</div>`;
      case "fab": return `<div class="sk-part sk-fabrow${sel}${tap}" data-pid="${p.id}"><span class="sk-fab">${glyph(p.icon) || "＋"}</span>${link}</div>`;
      case "bottomNav": return `<div class="sk-part sk-nav${sel}${tap}" data-pid="${p.id}">${tabs.map((t, i) => `<span class="${i === (p.selected || 0) ? "on" : ""}">${esc(t)}</span>`).join("")}${link}</div>`;
      case "tabs": return `<div class="sk-part sk-tabs${sel}${tap}" data-pid="${p.id}">${tabs.map((t, i) => `<span class="${i === (p.selected || 0) ? "on" : ""}">${esc(t)}</span>`).join("")}${link}</div>`;
      case "textField": return `<div class="sk-part sk-textfield${sel}${tap}" data-pid="${p.id}"><label>${esc(p.label)}</label><div class="in">${esc(p.supporting || "请输入…")}</div>${link}</div>`;
      case "switch": return `<div class="sk-part sk-switchrow${sel}${tap}" data-pid="${p.id}"><span>${esc(p.label)}</span><i class="tgl ${p.checked ? "on" : ""}"></i>${link}</div>`;
      case "text": return `<div class="sk-part sk-text${sel}${tap}" data-pid="${p.id}"><b>${esc(p.label)}</b>${p.supporting ? `<span>${esc(p.supporting)}</span>` : ""}${link}</div>`;
      case "image": return `<div class="sk-part sk-image${sel}${tap}" data-pid="${p.id}">图片${link}</div>`;
      case "box": return `<div class="sk-part sk-box${sel}${tap}" data-pid="${p.id}">${esc(p.label)}${link}</div>`;
      case "divider": return `<div class="sk-part sk-divider${sel}${tap}" data-pid="${p.id}">${link}</div>`;
      default: return `<div class="sk-part${sel}" data-pid="${p.id}">${esc(PARTS[p.kind]?.label || p.kind)}</div>`;
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
      <p class="muted small" style="margin-top:14px;line-height:1.7">点一下就加进当前屏幕，位置在最下面；选中零件后在右边改它。拖拽排序下一版再加。</p>`;
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
  }
  function renderCanvas() {
    const cv = $("#skCanvas");
    cv.innerHTML = `
      <div class="sk-phones">
        ${state.doc.screens.map((s) => `
          <div class="sk-phone-col ${s.id === state.screenId ? "on" : ""}" data-sid="${s.id}">
            <div class="sk-phone-label"><b>${esc(s.name)}</b> · ${s.parts.length} 个零件</div>
            <div class="sk-phone"><div class="sk-notch"></div><div class="sk-viewport">${screenHTML(s)}</div></div>
          </div>`).join("")}
      </div>
      <div class="sk-flow">
        ${state.doc.screens.map((s) => s.parts.filter((p) => p.action?.to && p.action.to !== "back").map((p) => {
          const t = screenById(state.doc, p.action.to);
          return t ? `<span>${esc(s.name)} · ${esc(p.label || PARTS[p.kind].label)} → ${esc(t.name)}（${transitionZh(p.action.transition)}）</span>` : "";
        }).join("")).join("") || `<span class="muted">还没有跳转：在右边检查器的「触发」里给卡片或按钮连一页</span>`}
      </div>`;
    cv.querySelectorAll(".sk-phone-col").forEach((col) => col.addEventListener("click", (e) => {
      const part = e.target.closest(".sk-part");
      state.screenId = col.dataset.sid;
      state.partId = part ? part.dataset.pid : null;
      save(); renderCanvas(); renderInspector();
    }));
  }
  function field(label, inner) {
    return `<div class="sk-field"><label>${label}</label>${inner}</div>`;
  }
  function renderInspector() {
    const panel = $("#skPanel");
    const p = currentPart();
    const s = currentScreen();
    let html = "";
    if (p) {
      const spec = PARTS[p.kind];
      const idx = s.parts.indexOf(p);
      html += `<section class="card">
        <header class="step-h"><span class="n">1</span><h3>${spec.label}</h3><span class="count">${esc(s.name)}</span></header>
        <div class="itabs" id="skITabs">
          <button class="on" data-itab="design">设计</button>
          <button data-itab="trigger">触发</button>
        </div>
        <div id="skITabDesign">
          ${spec.hasLabel ? field("标题", `<input type="text" id="skFLabel" value="${esc(p.label)}">`) : ""}
          ${spec.hasSupporting ? field("副标题", `<input type="text" id="skFSup" value="${esc(p.supporting || "")}">`) : ""}
          ${spec.hasTabs ? field("条目（用 、 分隔）", `<input type="text" id="skFTabs" value="${esc(p.label)}">`) : ""}
          ${spec.hasVariant ? field("样式", `<div class="sk-styleseg" id="skFVar">${VARIANTS.map((v) => `<button class="${p.variant === v.id ? "on" : ""}" data-v="${v.id}">${v.zh}</button>`).join("")}</div>`) : ""}
          ${spec.hasIcon ? field("图标", `<select id="skFIcon">${ICONS.map((ic) => `<option value="${ic}" ${p.icon === ic ? "selected" : ""}>${ic || "无"}</option>`).join("")}</select>`) : ""}
          ${p.kind === "card" ? field(`圆角 <span class="val">${p.radius ?? 20}dp</span>`, `<input type="range" id="skFRadius" min="0" max="40" value="${p.radius ?? 20}">`) : ""}
          <div class="row">
            <button class="btn sm" id="skMoveUp" ${idx <= 0 ? "disabled" : ""}>↑ 上移</button>
            <button class="btn sm" id="skMoveDown" ${idx >= s.parts.length - 1 ? "disabled" : ""}>↓ 下移</button>
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
        ${field("圆角", `<div class="sk-styleseg" id="skFShape">${SHAPES.map((v) => `<button class="${state.doc.theme.shape === v.id ? "on" : ""}" data-shape="${v.id}">${v.zh}</button>`).join("")}</div>`)}
      </section>`;
    }
    html += `<section class="card">
      <header class="step-h"><span class="n">${p ? "2" : "3"}</span><h3>提示词</h3></header>
      <div class="prompt-wrap"><textarea id="skPrompt" spellcheck="false" readonly></textarea></div>
      <div class="row">
        <button class="btn primary grow" id="skCopy"><span class="l1">复制提示词</span><span class="l2">✓ 已复制</span></button>
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
    on("#skMoveUp", "click", () => movePart(p, -1));
    on("#skMoveDown", "click", () => movePart(p, 1));
    on("#skDelPart", "click", () => {
      s.parts = s.parts.filter((x) => x.id !== p.id);
      state.partId = null; save(); renderCanvas(); renderInspector();
    });
    on("#skDelScreen", "click", () => deleteScreen(s.id));
    const tabs = $("#skITabs");
    if (tabs) tabs.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $$("#skITabs button").forEach((x) => x.classList.toggle("on", x === b));
      const trig = b.dataset.itab === "trigger";
      $("#skITabDesign").hidden = trig;
      $("#skITabTrigger").hidden = !trig;
    });
    const vseg = $("#skFVar");
    if (vseg) vseg.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      p.variant = b.dataset.v; save(); renderCanvas(); renderInspector(); renderPromptText();
    });
    const shseg = $("#skFShape");
    if (shseg) shseg.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      state.doc.theme.shape = b.dataset.shape; save(); applyTheme(); renderInspector(); renderPromptText();
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
    const root = $("#sketchRoot");
    root.style.setProperty("--sk-primary", pal.primary);
    root.style.setProperty("--sk-primary-soft", pal.primaryContainer);
    root.style.setProperty("--sk-radius", state.doc.theme.shape === "square" ? "8px" : state.doc.theme.shape === "full" ? "28px" : "20px");
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
  }
  function movePart(p, d) {
    const s = currentScreen();
    const i = s.parts.indexOf(p);
    const j = i + d;
    if (i < 0 || j < 0 || j >= s.parts.length) return;
    [s.parts[i], s.parts[j]] = [s.parts[j], s.parts[i]];
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
      btn.classList.add("done");
      setTimeout(() => btn.classList.remove("done"), 1600);
      toast("已复制，可粘贴给 Claude Code / Codex / Cursor");
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
    state.preview = null;
    document.body.classList.remove("sk-previewing");
    $("#skStage").classList.remove("previewing");
  }
  function renderPlayer(anim = "") {
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
          <button class="btn sm" id="skPlayerClose">关闭预览</button>
        </div>`;
      stage.appendChild(player);
      $("#skPlayerClose").addEventListener("click", exitPreview);
      $("#skPlayerBack").addEventListener("click", () => {
        if (state.preview.stack.length > 1) {
          state.preview.stack.pop();
          renderPlayer("anim-back");
        }
      });
      $("#skPlayerVp").addEventListener("click", (e) => {
        const el = e.target.closest(".sk-part");
        if (!el) return;
        const found = partById(state.doc, el.dataset.pid);
        if (!found) return;
        const a = found.part.action;
        if (!a?.to) { toast("这个元素没有设置点击操作，在右边检查器的「触发」里连一页"); return; }
        if (a.to === "back") {
          if (state.preview.stack.length > 1) { state.preview.stack.pop(); renderPlayer("anim-back"); }
          return;
        }
        if (screenById(state.doc, a.to)) {
          state.preview.stack.push(a.to);
          renderPlayer("anim-" + (a.transition || "slide"));
        }
      });
    }
    const cur = state.preview.stack[state.preview.stack.length - 1];
    const s = screenById(state.doc, cur) || state.doc.screens[0];
    const vp = $("#skPlayerVp");
    vp.innerHTML = screenHTML(s, true);
    vp.classList.remove("anim-slide", "anim-slideLeft", "anim-slideUp", "anim-slideDown", "anim-fade", "anim-expand", "anim-back", "anim-none");
    if (anim) { void vp.offsetWidth; vp.classList.add(anim); }
    $("#skPlayerName").textContent = `${s.name}（第 ${state.preview.stack.length} 层）`;
    $("#skPlayerBack").disabled = state.preview.stack.length <= 1;
  }

  // ---------- 模式切换 ----------
  function setMode(mode) {
    const sketch = mode === "sketch";
    document.body.classList.toggle("mode-sketch", sketch);
    $$("#modeSeg button").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
    moveModeThumb();
    if (sketch && !state.booted) {
      state.booted = true;
      if (!load()) { state.doc = seedSketchDoc(); state.screenId = state.doc.screens[0].id; }
      state.partId = null;
      applyTheme();
      renderParts(); renderScreenbar(); renderCanvas(); renderInspector();
    }
  }
  function moveModeThumb() {
    const on = $('#modeSeg button.on');
    const th = $("#modeSeg .seg-thumb");
    if (!on || !th) return;
    th.style.width = on.offsetWidth + "px";
    th.style.transform = `translateX(${on.offsetLeft - 3}px)`;
  }

  function renderAll() {
    renderScreenbar(); renderCanvas(); renderInspector();
  }
  function boot() {
    $$("#modeSeg button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
    moveModeThumb();
    window.addEventListener("resize", moveModeThumb);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
}
