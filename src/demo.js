// 内置示例：一张"AI 生成的精品民宿 App"首页（山居 · 民宿），打开即可试改。
// 视觉：暖白纸色底、宋体标题、松针绿一抹强调、细线图标，图片用 SVG 画的
// 山峦光影代替照片（离线可用，不外链）。画布 390×844，关键区域坐标与端到端
// 测试对齐，改视觉时别动布局锚点：搜索栏 y152、分类 y224、主卡 20,300,350×230、
// 卡片 y594、底栏 y776。
//
// 活的示例：renderDemo(overrides) 按元素重绘。overrides = { [元素 id]: { 参: 值 } }。
// 选中某个元素再点右侧改法，改动就直接画进这张图里 —— 点一下，图上就变。
// 布局锚点（各元素的位置/尺寸）不受 overrides 影响，改的只是形状、填充、阴影这些视觉属性。

const r2 = (n) => Math.round(n * 100) / 100;

// ---------- 示例 App 的色板（暖中性 + 松针绿） ----------
export const DEMO_COLORS = {
  paper: "#F5F1EA", card: "#FBF9F5", ink: "#1E1C19", sub: "#8C857A",
  line: "#E6E0D5", accent: "#34463A", sage: "#E7ECE3", clay: "#B8875A",
};
const C = DEMO_COLORS;
const SERIF = "'Noto Serif SC','Source Han Serif SC','Songti SC','STSong',serif";
const SANS = "Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',system-ui,sans-serif";

// 圈选区域 → 元素的命中表（demo 坐标 390×844；嵌套的、小的元素在前，先命中）。
export const DEMO_ELEMENTS = [
  { id: "amount", rect: [38, 336, 190, 40] },
  { id: "statusPill", rect: [268, 342, 64, 24] },
  { id: "shipPill", rect: [34, 720, 64, 22] },
  { id: "pendPill", rect: [217, 720, 64, 22] },
  { id: "avatar", rect: [320, 82, 44, 44] },
  { id: "title", rect: [24, 100, 170, 36] },
  { id: "ordersTitle", rect: [24, 548, 200, 30] },
  { id: "search", rect: [20, 152, 290, 52] },
  { id: "filter", rect: [318, 152, 52, 52] },
  { id: "pills", rect: [20, 224, 350, 38] },
  { id: "hero", rect: [20, 300, 350, 230] },
  { id: "order1", rect: [20, 594, 167, 168] },
  { id: "order2", rect: [203, 594, 167, 168] },
  { id: "tabbar", rect: [0, 776, 390, 68] },
];

export function demoElementAt(cx, cy) {
  for (const e of DEMO_ELEMENTS) {
    const [x, y, w, h] = e.rect;
    if (cx >= x && cx <= x + w && cy >= y && cy <= y + h) return e.id;
  }
  return null;
}

// ---------- 选中后挑改法：每个演示元素适用的几个改法 ----------
// 点元素先选中，右边只列这元素的改法（2–4 个），点一个才变。
// 改法复用一眼对比的词条（LIVE 参数），不另起一套；结构类（横排↔竖排、
// 列表↔网格）不动整页布局，不进这里。每个改法点下去都真让图变，
// 文字类和头像不给形状词条，底栏不给尺寸词条。
export const DEMO_NAMES = {
  search: { zh: "搜索栏", en: "Search bar" },
  filter: { zh: "筛选按钮", en: "Filter button" },
  pills: { zh: "分类标签", en: "Category chips" },
  hero: { zh: "精选主卡", en: "Featured card" },
  order1: { zh: "预订卡片", en: "Booking card" },
  order2: { zh: "预订卡片", en: "Booking card" },
  tabbar: { zh: "底部导航栏", en: "Bottom tab bar" },
  statusPill: { zh: "余房胶囊", en: "Availability pill" },
  shipPill: { zh: "已确认胶囊", en: "Confirmed pill" },
  pendPill: { zh: "待付款胶囊", en: "Pending pill" },
  avatar: { zh: "头像", en: "Avatar" },
  title: { zh: "标题", en: "Heading" },
  amount: { zh: "价格", en: "Price" },
  ordersTitle: { zh: "栏目标题", en: "Section heading" },
};

export const DEMO_CYCLES = {
  search: ["v-round-to-square", "v-solid-to-gradient", "v-flat-to-float"],
  filter: ["v-square-to-circle", "v-solid-to-gradient"],
  pills: ["v-small-to-big", "v-fill-to-outline", "v-tight-to-loose"],
  hero: ["v-round-to-square", "v-light-to-dark", "v-solid-to-gradient", "v-full-to-inset"],
  order1: ["v-round-to-square", "v-solid-to-gradient", "v-flat-to-float"],
  order2: ["v-big-to-small", "v-solid-to-gradient", "v-flat-to-float"],
  tabbar: ["v-full-to-inset", "v-light-to-dark", "v-solid-to-gradient"],
  statusPill: ["v-fill-to-outline", "v-solid-to-gradient", "v-small-to-big"],
  shipPill: ["v-fill-to-outline", "v-solid-to-gradient"],
  pendPill: ["v-outline-to-fill", "v-solid-to-gradient"],
  avatar: ["v-solid-to-gradient", "v-fill-to-outline", "v-small-to-big"],
  title: ["v-small-to-big", "v-left-to-center", "v-text-to-icon"],
  amount: ["v-small-to-big", "v-left-to-center", "v-text-to-icon"],
  ordersTitle: ["v-small-to-big", "v-left-to-center", "v-text-to-icon"],
};

// 深色模式下各元素的颜色（浅色默认值见模板）
const DK = { fill: "#22211E", stroke: "#34322D", ink: "#EEE9E0", sub: "#9A9389", line: "#34322D" };
const DARK = {
  search: DK, filter: DK, pills: DK,
  hero: { fill: DK.fill, ink: "#F3EEE6", sub: DK.sub, grid: DK.line },
  order1: DK, order2: DK, tabbar: DK,
};
const ICON = "✦ "; // 「纯文字 → 图标+文字」的图标

// 结构类改动的本地预览素材（横排↔竖排、列表↔网格）：
// 只有这三组元素有可重排的条目，其他元素点结构类词条时只写进提示词。
const STRUCT_ITEMS = {
  pills: { items: ["全部", "山野", "湖畔", "古镇", "海边"], itemH: 38, kind: "chip" },
  orders: {
    items: [
      { name: "竹里山房", meta: "莫干山 · 11.22 入住", amount: "¥2,560", status: "已确认", done: true },
      { name: "云水茶寮", meta: "景迈山 · 12.03 入住", amount: "¥1,899", status: "待付款", done: false },
    ],
    itemH: 88, kind: "card",
  },
  tabbar: { items: ["首页", "发现", "行程", "我的"], itemH: 44, kind: "tab" },
};

// 结构类预览的 HTML + 高度（demo 像素）；app.js 再 ×2 换算成图上的像素。
export function structuralHtml(elementId, layout) {
  const s = STRUCT_ITEMS[elementId];
  if (!s) return null;
  const gap = 8;
  const rows = layout === "grid" ? Math.ceil(s.items.length / 2) : s.items.length;
  const height = rows * s.itemH + (rows - 1) * gap;
  const cell = (it, i) => {
    if (s.kind === "chip") {
      const active = i === 0;
      return `<span style="display:grid;place-items:center;border-radius:19px;font-size:13px;font-weight:500;background:${active ? C.accent : C.card};color:${active ? C.paper : C.sub};${active ? "" : `border:1px solid ${C.line};`}">${it}</span>`;
    }
    if (s.kind === "card") {
      return `<div style="padding:12px 14px;border:1px solid ${C.line};border-radius:14px;background:${C.card};display:grid;gap:4px;align-content:center">` +
        `<div style="display:flex;justify-content:space-between;align-items:center"><b style="font:600 14px ${SERIF};color:${C.ink}">${it.name}</b><span style="font-size:11px;font-weight:500;padding:3px 9px;border-radius:11px;background:${it.done ? C.sage : C.card};color:${it.done ? C.accent : C.ink};${it.done ? "" : `border:1px solid ${C.line};`}">${it.status}</span></div>` +
        `<div style="font-size:11px;color:${C.sub}">${it.meta}</div><b style="font:600 18px ${SERIF};color:${C.ink}">${it.amount}</b></div>`;
    }
    const active = i === 0;
    return `<span style="display:grid;place-items:center;border-radius:12px;font-size:13px;font-weight:500;background:${active ? C.sage : C.paper};color:${active ? C.accent : C.sub}">${it}</span>`;
  };
  const inner = s.items.map(cell).join("");
  const style = layout === "grid"
    ? `display:grid;grid-template-columns:1fr 1fr;gap:${gap}px;`
    : `display:flex;flex-direction:column;gap:${gap}px;`;
  const html = `<div style="${style}height:100%;box-sizing:border-box;padding:12px;background:${C.card};border-radius:16px;box-shadow:0 1px 2px rgba(20,20,20,.04),0 12px 32px rgba(20,20,20,.12);font-family:${SANS}">${inner}</div>`;
  return { html, height: height + 24 };
}

// ---------- 山峦光影：SVG 画的"照片"（离线可用） ----------
// 画在 300×160 的坐标里，按目标框缩放；mode：day 晨光 / dusk 暮色 / night 夜色
const ART = {
  day: { sky: ["#E7D9C4", "#F3EBDF"], sun: "#E5B489", far: "#BDB8A6", mid: "#8E9784", near: "#4D5D4F", mist: "#FBF7F0" },
  dusk: { sky: ["#D9C2A8", "#EFE2D2"], sun: "#C9805A", far: "#B3A796", mid: "#857A6C", near: "#4F463E", mist: "#F6EEE4" },
  night: { sky: ["#1B212C", "#3A3F4A"], sun: "#EDE6D6", far: "#3C4250", mid: "#2B313C", near: "#191E26", mist: "#5A606C" },
};
function art(P, key, x, y, w, h, rx, mode = "day") {
  const a = ART[mode] || ART.day;
  const id = `${P}art-${key}`;
  const sx = r2(w / 300), sy = r2(h / 160);
  return `<clipPath id="${id}c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath>` +
    `<linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a.sky[0]}"/><stop offset="1" stop-color="${a.sky[1]}"/></linearGradient>` +
    `<linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a.mist}" stop-opacity="0"/><stop offset=".5" stop-color="${a.mist}" stop-opacity=".55"/><stop offset="1" stop-color="${a.mist}" stop-opacity="0"/></linearGradient>` +
    `<g clip-path="url(#${id}c)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}s)"/>` +
    `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">` +
    `<circle cx="214" cy="54" r="17" fill="${a.sun}" opacity=".85"/>` +
    `<path d="M0 104 C34 84 62 70 98 86 C128 100 150 62 190 58 C228 54 262 82 300 76 V160 H0Z" fill="${a.far}"/>` +
    `<rect x="0" y="88" width="300" height="30" fill="url(#${id}m)"/>` +
    `<path d="M0 126 C46 104 82 110 122 120 C162 130 198 96 238 100 C268 103 284 114 300 110 V160 H0Z" fill="${a.mid}"/>` +
    `<path d="M0 148 C58 130 108 136 158 144 C208 152 250 134 300 138 V160 H0Z" fill="${a.near}"/>` +
    `</g></g>`;
}

export function renderDemo(overrides = {}, titles = {}, opts = {}) {
  const P = opts.prefix || ""; // 同一页面放两份示例（首屏缩略 + 画布）时给 id 加前缀，免得渐变/裁剪撞名
  const o = (id) => overrides[id] || {};
  // 悬停提示：每个可点元素组里挂一个 <title>，鼠标放上去就知道下一点会变成什么
  const escT = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const titleFor = (id) => titles[id] ? `<title>${escT(titles[id])}</title>` : "";
  // rx 的 "pill"/"circle" 按元素当前尺寸换算
  const rxVal = (id, v, w, h) => v === "pill" ? Math.round(h / 2) : v === "circle" ? Math.round(Math.min(w, h) / 2) : v;
  // 放大：按元素尺寸夹住，免得 1.5 倍撑破画布；缩小不夹
  const clampScale = (id, s) => {
    if (!s || s <= 1) return s ?? 1;
    const el = DEMO_ELEMENTS.find((e) => e.id === id);
    if (!el) return s;
    const [, , w, h] = el.rect;
    return Math.min(s, (390 - 16) / w, (844 - 16) / h);
  };
  const scaleAttr = (id, cx, cy) => {
    const v = r2(clampScale(id, o(id).scale));
    return v === 1 ? "" : ` transform="translate(${cx} ${cy}) scale(${v}) translate(${-cx} ${-cy})"`;
  };
  const grad = `url(#${P}brandGrad)`;
  const F = (id) => `url(#${P}${id})`;

  // ---------- 标题 / 价格 / 栏目标题（纯文字：字号、对齐、图标） ----------
  const titleFs = r2(28 * (o("title").scale ?? 1));
  const titleCx = o("title").align === "center" ? 195 : 24;
  const titleAnchor = o("title").align === "center" ? ` text-anchor="middle"` : "";
  const amountFs = r2(30 * (o("amount").scale ?? 1));
  const amountCx = (o("amount").align === "center" || o("hero").align === "center") ? 195 : 38;
  const amountAnchor = (o("amount").align === "center" || o("hero").align === "center") ? ` text-anchor="middle"` : "";
  const ordersTitleFs = r2(19 * (o("ordersTitle").scale ?? 1));
  const ordersTitleCx = o("ordersTitle").align === "center" ? 195 : 24;
  const ordersTitleAnchor = o("ordersTitle").align === "center" ? ` text-anchor="middle"` : "";

  // ---------- 搜索栏 ----------
  const searchDk = DARK.search, sO = o("search");
  const searchFill = sO.gradient ? grad : (sO.fill ?? (sO.dark ? searchDk.fill : C.card));
  const searchStroke = sO.stroke ?? (sO.dark ? searchDk.stroke : C.line);
  const searchInk = sO.ink ?? (sO.gradient ? "#fff" : (sO.dark ? searchDk.ink : C.sub));
  const searchFilter = sO.shadow === "strong" ? ` filter="${F("shStrong")}"` : ` filter="${F("sh2")}"`;

  // ---------- 筛选按钮 ----------
  const filterDk = DARK.filter, fO = o("filter");
  const filterFill = fO.gradient ? grad : (fO.fill ?? (fO.dark ? filterDk.fill : C.card));
  const filterStroke = fO.stroke ?? (fO.dark ? filterDk.stroke : C.line);
  const filterInk = fO.ink ?? (fO.gradient ? "#fff" : (fO.dark ? filterDk.ink : C.ink));
  const filterKnob = fO.gradient ? "#5E6B5F" : (filterFill === "none" ? C.paper : filterFill);
  const filterFilter = fO.shadow === "strong" ? ` filter="${F("sh2")}"` : "";

  // ---------- 分类标签 ----------
  const PILL_LABELS = STRUCT_ITEMS.pills.items;
  const PILL_W = [58, 64, 64, 64, 64];
  const pO = o("pills");
  const pillsLoose = pO.gap === "loose";
  const pillsGap = pillsLoose ? 12 : 8;
  const pillsH = Math.round((pillsLoose ? 44 : 38) * (pO.scale ?? 1));
  const pillsRx = rxVal("pills", pO.rx ?? 19, 350, pillsH);
  const pillsFillOv = pO.fill, pillsInkOv = pO.ink;
  const pillsActiveFill = pO.gradient ? grad : (pillsFillOv ?? C.accent);
  const pillsInactiveFill = pO.gradient ? grad : (pillsFillOv ?? (pO.dark ? DARK.pills.fill : C.card));
  const pillsActiveInk = pO.gradient ? "#fff" : (pillsInkOv ?? C.paper);
  const pillsInactiveInk = pO.gradient ? "#fff" : (pillsInkOv ?? (pO.dark ? DARK.pills.ink : C.sub));
  const pillsStroke = pO.stroke ?? (pO.dark ? DARK.pills.stroke : C.line);
  const pillsFont = r2(13 * (pO.scale ?? 1));
  let pillsXs = [20];
  for (let i = 1; i < 5; i++) pillsXs.push(pillsXs[i - 1] + PILL_W[i - 1] + pillsGap);
  const pillsRowW = pillsXs[4] + PILL_W[4] - 20;
  if (pO.align === "center") {
    const shift = Math.round((390 - pillsRowW) / 2) - 20;
    pillsXs = pillsXs.map((x) => x + shift);
  }
  const pillsFilter = pO.shadow === "strong" ? ` filter="${F("shStrong")}"` : "";
  const pillsBlock = [`<g font-size="${pillsFont}" font-weight="500"${pillsFilter}>`,
    ...PILL_LABELS.map((label, i) => {
      const active = i === 0;
      const x = pillsXs[i], w = PILL_W[i];
      const fill = active ? pillsActiveFill : pillsInactiveFill;
      const ink = active ? pillsActiveInk : pillsInactiveInk;
      const st = active ? (pO.stroke ? ` stroke="${pO.stroke}"` : "") : ` stroke="${pillsStroke}"`;
      const text = (pO.icon ? ICON : "") + label;
      return `  <rect x="${x}" y="224" width="${w}" height="${pillsH}" rx="${pillsRx}" fill="${fill}"${st}/><text x="${x + w / 2}" y="${224 + pillsH / 2 + 4.5}" fill="${ink}" text-anchor="middle" letter-spacing=".5">${text}</text>`;
    }),
    `</g>`].join("\n");

  // ---------- 精选主卡 ----------
  const hO = o("hero");
  const heroRx = rxVal("hero", hO.rx ?? 20, 350, 230);
  const heroFloat = hO.floating;
  const heroX = heroFloat ? 28 : 20;
  const heroW = heroFloat ? 334 : 350;
  const heroFill = hO.gradient ? grad : (hO.fill ?? (hO.dark ? DARK.hero.fill : C.card));
  const heroStroke = hO.stroke ? ` stroke="${hO.stroke}" stroke-width="2"` : (hO.dark || hO.gradient ? "" : ` stroke="${C.line}" stroke-width="2"`);
  const heroFilter = hO.shadow === "strong" ? ` filter="${F("shStrong")}"` : ` filter="${F("sh")}"`;
  const heroLightBg = heroFill === C.card || heroFill === "none";
  const heroInk = heroLightBg ? C.ink : "#fff";
  const heroSub = heroLightBg ? C.sub : (hO.dark ? DARK.hero.sub : "rgba(255,255,255,.78)");
  const heroTitleX = hO.align === "center" ? 195 : 38;
  const heroTitleAnchor = hO.align === "center" ? ` text-anchor="middle"` : "";
  const artX = heroX + 16, artW = heroW - 32, artY = 388, artH = 126;
  const artRx = Math.max(0, Math.min(14, heroRx - 6));
  const artMode = hO.dark ? "night" : "day";
  const statusPill = o("statusPill");
  const statusRx = rxVal("statusPill", statusPill.rx ?? 12, 64, 24);
  const statusFill = statusPill.gradient ? grad : (statusPill.fill ?? C.sage);
  const statusStroke = statusPill.stroke ? ` stroke="${statusPill.stroke}"` : "";
  const statusInk = statusPill.ink ?? (statusPill.fill === C.accent || statusPill.gradient ? "#fff" : C.accent);
  const amountText = (o("amount").icon ? ICON : "") + "¥1,280";
  const heroTitleText = (hO.icon ? ICON : "") + "本周精选 · 莫干山";

  // ---------- 预订卡片 ----------
  const ordGap = (o("order1").gap === "loose" || o("order2").gap === "loose") ? 24 : 16;
  const ordDx = ordGap - 16;
  const orderBlock = (id, x, mode, name, meta, amount, pill) => {
    const oo = o(id);
    const dk = DARK[id];
    const rx = rxVal(id, oo.rx ?? 18, 167, 168);
    const fill = oo.gradient ? grad : (oo.fill ?? (oo.dark ? dk.fill : C.card));
    const stroke = oo.stroke ?? (oo.dark ? dk.stroke : C.line);
    const ink = oo.ink ?? (oo.dark ? dk.ink : (oo.gradient ? "#fff" : C.ink));
    const sub = oo.dark ? dk.sub : (oo.gradient ? "rgba(255,255,255,.78)" : C.sub);
    const line = oo.dark ? dk.line : (oo.gradient ? "rgba(255,255,255,.28)" : C.line);
    const fl = oo.floating;
    const x2 = fl ? x + 8 : x, w2 = fl ? 167 - 16 : 167;
    const shadow = oo.shadow === "strong" ? ` filter="${F("shStrong")}"` : "";
    const cx = x + 167 / 2, cy = 594 + 168 / 2;
    const nameText = (oo.icon ? ICON : "") + name;
    const pillId = id === "order1" ? "shipPill" : "pendPill";
    const pillRx = rxVal(pillId, (id === "order1" ? o("shipPill").rx : o("pendPill").rx) ?? 11, 64, 22);
    const pFill = id === "order1"
      ? (o("shipPill").gradient ? grad : (o("shipPill").fill ?? C.sage))
      : (o("pendPill").gradient ? grad : (o("pendPill").fill ?? C.card));
    const pStroke = id === "order1"
      ? (o("shipPill").stroke ? ` stroke="${o("shipPill").stroke}"` : "")
      : (o("pendPill").stroke ? ` stroke="${o("pendPill").stroke}"` : ` stroke="${C.line}"`);
    const pInk = id === "order1"
      ? (o("shipPill").ink ?? (o("shipPill").fill === C.accent || o("shipPill").gradient ? "#fff" : C.accent))
      : (o("pendPill").ink ?? (o("pendPill").gradient ? "#fff" : C.ink));
    const dot = id === "order2" && !o("pendPill").gradient && o("pendPill").fill !== C.accent ? C.clay : "#fff";
    return `  <g${scaleAttr(id, cx, cy)}>\n` +
      `  <rect x="${x2}" y="594" width="${w2}" height="168" rx="${rx}" fill="${fill}" stroke="${stroke}"${shadow}/>\n` +
      `  ${art(P, id, x + 14, 610, 40, 40, 10, mode)}\n` +
      `  <text x="${x + 64}" y="626" font-family="${SERIF}" font-size="15" font-weight="600" fill="${ink}">${nameText}</text>\n` +
      `  <text x="${x + 64}" y="644" font-size="11" fill="${sub}">${meta}</text>\n` +
      `  <line x1="${x + 14}" y1="666" x2="${x + 153}" y2="666" stroke="${line}"/>\n` +
      `  <text x="${x + 14}" y="702" font-family="${SERIF}" font-size="20" font-weight="600" fill="${ink}">${amount}<tspan font-family="${SANS}" font-size="11" font-weight="400" fill="${sub}" dx="4">2 晚</tspan></text>\n` +
      `  <g data-el="${pillId}">${titleFor(pillId)}<g${scaleAttr(pillId, x + 46, 731)}><rect x="${x + 14}" y="720" width="64" height="22" rx="${pillRx}" fill="${pFill}"${pStroke}/>\n` +
      (id === "order1"
        ? `  <text x="${x + 46}" y="735" font-size="11" font-weight="500" fill="${pInk}" text-anchor="middle">${pill}</text>`
        : `  <circle cx="${x + 26}" cy="731" r="3" fill="${dot}"/>\n  <text x="${x + 52}" y="735" font-size="11" font-weight="500" fill="${pInk}" text-anchor="middle">${pill}</text>`) +
      `</g></g>\n  <path d="M${x + 146} 727 l4 4 l-4 4" fill="none" stroke="${sub}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>\n  </g>`;
  };

  // ---------- 底栏 ----------
  const tO = o("tabbar");
  const tabDark = tO.dark;
  const tabFill = tO.gradient ? grad : (tO.fill ?? (tabDark ? DARK.tabbar.fill : C.card));
  const tabHair = tO.stroke ?? (tabDark ? DARK.tabbar.stroke : C.line);
  const tabInk = tO.ink ?? (tabDark ? DARK.tabbar.ink : (tO.gradient ? "rgba(255,255,255,.72)" : C.sub));
  const tabActive = tO.gradient ? "#fff" : (tabDark ? "#C9D6C4" : C.accent);
  const tabFs = r2(10 * (tO.scale ?? 1));
  const tabFilter = tO.shadow === "strong" ? ` filter="${F("sh2")}"` : "";
  const tabItems = (dy) => `
<g font-size="${tabFs}" text-anchor="middle" font-weight="500" letter-spacing=".5">
  <g fill="none" stroke="${tabActive}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><path d="M40 ${802 + dy} l9 -8 l9 8 v9 h-18z"/><path d="M46 ${811 + dy} v-5 h6 v5"/></g><text x="49" y="${828 + dy}" fill="${tabActive}">${tO.icon ? ICON : ""}首页</text>
  <g fill="none" stroke="${tabInk}" stroke-width="1.5" stroke-linejoin="round"><circle cx="146" cy="${802 + dy}" r="9"/><path d="M149.5 ${798.5 + dy} l-2 5.5 l-5.5 2 l2 -5.5z"/></g>
  <text x="146" y="${828 + dy}" fill="${tabInk}">发现</text>
  <g fill="none" stroke="${tabInk}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><rect x="234" y="${794 + dy}" width="18" height="17" rx="3"/><path d="M234 ${800 + dy} h18 M239 ${791 + dy} v5 M247 ${791 + dy} v5"/></g>
  <text x="243" y="${828 + dy}" fill="${tabInk}">行程</text>
  <g fill="none" stroke="${tabInk}" stroke-width="1.5" stroke-linecap="round"><circle cx="340" cy="${798 + dy}" r="4.5"/><path d="M331 ${811 + dy} a9 7 0 0 1 18 0"/></g><text x="340" y="${828 + dy}" fill="${tabInk}">我的</text>
</g>`;
  const tabbarBlock = tO.floating
    ? `<rect x="16" y="788" width="358" height="54" rx="27" fill="${tabFill}" filter="${F("shStrong")}"/>${tabItems(10)}`
    : `<rect x="0" y="776" width="390" height="68" fill="${tabFill}"${tabFilter}/>\n<line x1="0" y1="776" x2="390" y2="776" stroke="${tabHair}"/>${tabItems(0)}`;

  // ---------- 头像 ----------
  const aO = o("avatar");
  const avatarFill = aO.gradient ? grad : (aO.fill ?? C.ink);
  const avatarStroke = aO.stroke ? ` stroke="${aO.stroke}" stroke-width="1.5"` : "";
  const avatarInk = aO.ink ?? (aO.gradient ? "#fff" : C.paper);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844" font-family="${SANS}">
<defs>
  <linearGradient id="${P}brandGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E3F34"/><stop offset=".55" stop-color="#6F6655"/><stop offset="1" stop-color="#B98D66"/></linearGradient>
  <filter id="${P}sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#1E1C19" flood-opacity=".04"/><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#1E1C19" flood-opacity=".06"/></filter>
  <filter id="${P}sh2" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#1E1C19" flood-opacity=".04"/></filter>
  <filter id="${P}shStrong" x="-20%" y="-20%" width="140%" height="170%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1E1C19" flood-opacity=".06"/><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#1E1C19" flood-opacity=".14"/></filter>
  <clipPath id="${P}hero"><rect x="${heroX}" y="300" width="${heroW}" height="230" rx="${heroRx}"/></clipPath>
</defs>
<rect width="390" height="844" fill="${C.paper}"/>
<text x="32" y="38" font-size="15" font-weight="600" fill="${C.ink}">9:41</text>
<g fill="${C.ink}"><rect x="288" y="35" width="3" height="5" rx="1"/><rect x="293" y="33" width="3" height="7" rx="1"/><rect x="298" y="31" width="3" height="9" rx="1"/><rect x="303" y="29" width="3" height="11" rx="1"/></g>
<g stroke="${C.ink}" stroke-width="1.5" fill="none" stroke-linecap="round"><path d="M310 36 a10 10 0 0 1 16 0"/><path d="M312.5 38.5 a6.5 6.5 0 0 1 11 0"/></g>
<circle cx="318" cy="41" r="1.5" fill="${C.ink}"/>
<rect x="330" y="28" width="26" height="12" rx="3.5" fill="none" stroke="${C.ink}" stroke-width="1.1"/><rect x="332.5" y="30.5" width="18" height="7" rx="1.5" fill="${C.ink}"/>

<text x="24" y="86" font-size="10.5" fill="${C.sub}" letter-spacing="2.4">SHANJU · 山居民宿</text>
<g data-el="title">${titleFor("title")}<text x="${titleCx}" y="128" font-family="${SERIF}" font-size="${titleFs}" font-weight="600" fill="${C.ink}" letter-spacing="-.3"${titleAnchor}>${o("title").icon ? ICON : ""}寻一处山居</text></g>
<g data-el="avatar">${titleFor("avatar")}<g${scaleAttr("avatar", 342, 104)}><circle cx="342" cy="104" r="22" fill="${avatarFill}"${avatarStroke}/><text x="342" y="110" font-family="${SERIF}" font-size="17" font-weight="600" fill="${avatarInk}" text-anchor="middle">C</text></g>${aO.icon ? `<text x="360" y="88" font-size="11" fill="${C.accent}">✦</text>` : ""}</g>

<g data-el="search">${titleFor("search")}<g${scaleAttr("search", 165, 178)}><rect x="20" y="152" width="290" height="52" rx="${rxVal("search", sO.rx ?? 12, 290, 52)}" fill="${searchFill}" stroke="${searchStroke}"${searchFilter}/>
<circle cx="46" cy="177" r="6.5" fill="none" stroke="${searchInk}" stroke-width="1.5"/><line x1="51" y1="182" x2="55.5" y2="186.5" stroke="${searchInk}" stroke-width="1.5" stroke-linecap="round"/>
<text x="68" y="182.5" font-size="14" fill="${searchInk}">${sO.icon ? ICON : ""}搜索目的地、山居、茶室</text></g></g>
<g data-el="filter">${titleFor("filter")}<g${scaleAttr("filter", 344, 178)}><rect x="318" y="152" width="52" height="52" rx="${rxVal("filter", fO.rx ?? 12, 52, 52)}" fill="${filterFill}" stroke="${filterStroke}"${filterFilter}/>
<g stroke="${filterInk}" stroke-width="1.5" stroke-linecap="round"><line x1="334" y1="171" x2="354" y2="171"/><line x1="334" y1="185" x2="354" y2="185"/></g>
<circle cx="340" cy="171" r="3" fill="${filterKnob}" stroke="${filterInk}" stroke-width="1.5"/><circle cx="349" cy="185" r="3" fill="${filterKnob}" stroke="${filterInk}" stroke-width="1.5"/></g>${fO.icon ? `<text x="362" y="164" font-size="11" fill="${C.accent}">✦</text>` : ""}</g>

<g data-el="pills">${titleFor("pills")}${pillsBlock}</g>

<g data-el="hero">${titleFor("hero")}<g${heroFilter}${scaleAttr("hero", 195, 415)}>
<g clip-path="url(#${P}hero)">
  <rect x="${heroX}" y="300" width="${heroW}" height="230" fill="${heroFill}"${heroStroke}/>
  <text x="${heroTitleX}" y="334" font-size="11.5" fill="${heroSub}" letter-spacing="1.2"${heroTitleAnchor}>${heroTitleText}</text>
  <g data-el="amount">${titleFor("amount")}<text x="${amountCx}" y="370" font-family="${SERIF}" font-size="${amountFs}" font-weight="600" fill="${heroInk}" letter-spacing="-.4"${amountAnchor}>${amountText}<tspan font-family="${SANS}" font-size="12" font-weight="400" fill="${heroSub}" dx="6" letter-spacing="0">/ 晚起</tspan></text></g>
  <g data-el="statusPill">${titleFor("statusPill")}<g${scaleAttr("statusPill", 300, 354)}><rect x="268" y="342" width="64" height="24" rx="${statusRx}" fill="${statusFill}"${statusStroke}/>
  <text x="300" y="358" font-size="11" font-weight="500" fill="${statusInk}" text-anchor="middle">余 2 间</text></g></g>
  ${art(P, "hero", artX, artY, artW, artH, artRx, artMode)}
  <text x="${artX + 14}" y="${artY + artH - 14}" font-family="${SERIF}" font-size="13" font-weight="600" fill="#fff">竹里山房</text>
  <text x="${artX + artW - 14}" y="${artY + artH - 14}" font-size="11" fill="rgba(255,255,255,.88)" text-anchor="end">评分 4.96</text>
</g>
</g></g>

<g data-el="ordersTitle">${titleFor("ordersTitle")}<text x="${ordersTitleCx}" y="572" font-family="${SERIF}" font-size="${ordersTitleFs}" font-weight="600" fill="${C.ink}"${ordersTitleAnchor}>${o("ordersTitle").icon ? ICON : ""}为你留的房</text></g>
<text x="366" y="571" font-size="12" fill="${C.sub}" text-anchor="end">查看全部</text>

<g filter="${F("sh2")}">
<g data-el="order1">${titleFor("order1")}${orderBlock("order1", 20, "day", "竹里山房", "莫干山 · 11.22", "¥2,560", "已确认")}</g>
<g data-el="order2">${titleFor("order2")}${orderBlock("order2", 203 + ordDx, "dusk", "云水茶寮", "景迈山 · 12.03", "¥1,899", "待付款")}</g>
</g>

<g data-el="tabbar">${titleFor("tabbar")}${tabbarBlock}</g>
</svg>`;
}

export const DEMO_SVG = renderDemo();

export function demoDataUrl(overrides) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(renderDemo(overrides || {}));
}
