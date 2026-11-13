// 内置示例：一张"AI 生成的手机端数据看板"首页，打开即可试圈。
// 视觉按 BoardUI 的路子：白底＋浅灰卡＋一抹鲜蓝（#246FFF），克制精致，
// 多彩只出现在图表数据上。画布 390×844，关键区域坐标与端到端测试对齐，
// 改视觉时别动布局锚点：搜索栏 y152、分类 y224、主卡 20,300,350×230、
// 卡片 y594、底栏 y776。
//
// 活的示例：renderDemo(overrides) 按元素重绘。overrides = { [元素 id]: { 参: 值 } }。
// 圈中某个元素再点右侧"一眼对比"，改动就直接画进这张图里 —— 点一下，图上就变。
// 布局锚点（各元素的位置/尺寸）不受 overrides 影响，改的只是形状、填充、阴影这些视觉属性。
// 默认 renderDemo() 的渲染结果与旧的静态 DEMO_SVG 完全一致（只多了不参与渲染的 defs）。

const r2 = (n) => Math.round(n * 100) / 100;

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

// ---------- 直接点改：每个演示元素的状态轮次 ----------
// 点一下就换到下一个样子，走完一轮回到原样。状态复用一眼对比的词条
// （LIVE 参数），不另起一套；结构类（横排↔竖排、列表↔网格）不动整页
// 布局，不进这里。
export const DEMO_NAMES = {
  search: { zh: "搜索栏", en: "Search bar" },
  filter: { zh: "筛选按钮", en: "Filter button" },
  pills: { zh: "时间胶囊", en: "Time chips" },
  hero: { zh: "主卡", en: "Hero card" },
  order1: { zh: "订单卡片", en: "Order card" },
  order2: { zh: "订单卡片", en: "Order card" },
  tabbar: { zh: "底部导航栏", en: "Bottom tab bar" },
  statusPill: { zh: "状态胶囊", en: "Status pill" },
  shipPill: { zh: "已发货胶囊", en: "Shipped pill" },
  pendPill: { zh: "待处理胶囊", en: "Pending pill" },
  avatar: { zh: "头像", en: "Avatar" },
  title: { zh: "标题", en: "Heading" },
  amount: { zh: "金额", en: "Amount" },
  ordersTitle: { zh: "最近订单标题", en: "Recent orders heading" },
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

// 当前状态 → 下一个状态；走完一轮回到原样（null）。
export function nextDemoTerm(elId, currentTerm) {
  const cycle = DEMO_CYCLES[elId] || [];
  if (!currentTerm) return cycle[0] ?? null;
  const i = cycle.indexOf(currentTerm);
  if (i < 0) return cycle[0] ?? null;
  return cycle[i + 1] ?? null;
}

// 深色模式下各元素的颜色（浅色默认值见模板）
const DARK = {
  search: { fill: "#23202e", stroke: "#3a3747", ink: "#e8e8e8" },
  filter: { fill: "#23202e", stroke: "#3a3747", ink: "#e8e8e8" },
  pills: { fill: "#23202e", stroke: "#3a3747", ink: "#e8e8e8" },
  hero: { fill: "#23202e", ink: "#f2f2f2", sub: "#a1a1aa", grid: "#3a3747" },
  order1: { fill: "#23202e", stroke: "#3a3747", ink: "#f2f2f2", sub: "#a1a1aa", line: "#3a3747" },
  order2: { fill: "#23202e", stroke: "#3a3747", ink: "#f2f2f2", sub: "#a1a1aa", line: "#3a3747" },
  tabbar: { fill: "#23202e", stroke: "#3a3747", ink: "#e8e8e8" },
};

// 结构类改动的本地预览素材（横排↔竖排、列表↔网格）：
// 只有这三组元素有可重排的条目，其他元素点结构类词条时只写进提示词。
const STRUCT_ITEMS = {
  pills: { items: ["全部", "今日", "本周", "本月", "今年"], itemH: 38, kind: "chip" },
  orders: {
    items: [
      { name: "约翰", meta: "订单 #8241 · 今天", amount: "¥3,412", status: "已发货", done: true },
      { name: "阿斯彭", meta: "订单 #8238 · 今天", amount: "¥1,899", status: "待处理", done: false },
    ],
    itemH: 88, kind: "card",
  },
  tabbar: { items: ["总览", "订单", "数据", "我的"], itemH: 44, kind: "tab" },
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
      return `<span style="display:grid;place-items:center;border-radius:19px;font-size:13px;font-weight:600;background:${active ? "#246fff" : "#fff"};color:${active ? "#fff" : "#737373"};${active ? "" : "border:1px solid #ebebeb;"}">${it}</span>`;
    }
    if (s.kind === "card") {
      return `<div style="padding:12px 14px;border:1px solid #ebebeb;border-radius:14px;background:#fff;display:grid;gap:4px;align-content:center">` +
        `<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:14px">${it.name}</b><span style="font-size:11px;font-weight:700;padding:3px 9px;border-radius:11px;background:${it.done ? "#d8f999" : "#fff"};color:${it.done ? "#3c6300" : "#0a0a0a"};${it.done ? "" : "border:1px solid #ebebeb;"}">${it.status}</span></div>` +
        `<div style="font-size:11px;color:#737373">${it.meta}</div><b style="font-size:18px">${it.amount}</b></div>`;
    }
    const active = i === 0;
    return `<span style="display:grid;place-items:center;border-radius:12px;font-size:13px;font-weight:600;background:${active ? "#e8f0ff" : "#f7f7f7"};color:${active ? "#246fff" : "#737373"}">${it}</span>`;
  };
  const inner = s.items.map(cell).join("");
  const style = layout === "grid"
    ? `display:grid;grid-template-columns:1fr 1fr;gap:${gap}px;`
    : `display:flex;flex-direction:column;gap:${gap}px;`;
  const html = `<div style="${style}height:100%;box-sizing:border-box;padding:12px;background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.15);font-family:-apple-system,PingFang SC,sans-serif">${inner}</div>`;
  return { html, height: height + 24 };
}

export function renderDemo(overrides = {}, titles = {}) {
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

  // ---------- 标题 / 金额 / 最近订单（纯文字：字号、对齐、图标） ----------
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
  const searchFill = sO.gradient ? "url(#brandGrad)" : (sO.fill ?? (sO.dark ? searchDk.fill : "#fff"));
  const searchStroke = sO.stroke ?? (sO.dark ? searchDk.stroke : "#ebebeb");
  const searchInk = sO.ink ?? (sO.gradient ? "#fff" : (sO.dark ? searchDk.ink : "#737373"));
  const searchFilter = sO.shadow === "strong" ? ` filter="url(#shStrong)"` : ` filter="url(#sh2)"`;

  // ---------- 筛选按钮 ----------
  const filterDk = DARK.filter, fO = o("filter");
  const filterFill = fO.gradient ? "url(#brandGrad)" : (fO.fill ?? (fO.dark ? filterDk.fill : "#fff"));
  const filterStroke = fO.stroke ?? (fO.dark ? filterDk.stroke : "#ebebeb");
  const filterInk = fO.ink ?? (fO.gradient ? "#fff" : (fO.dark ? filterDk.ink : "#0a0a0a"));
  const filterFilter = fO.shadow === "strong" ? ` filter="url(#sh2)"` : "";

  // ---------- 时间胶囊 ----------
  const PILL_LABELS = ["全部", "今日", "本周", "本月", "今年"];
  const PILL_W = [56, 68, 68, 68, 68];
  const pO = o("pills");
  const pillsLoose = pO.gap === "loose";
  const pillsGap = pillsLoose ? 12 : 8;
  const pillsH = Math.round((pillsLoose ? 44 : 38) * (pO.scale ?? 1));
  const pillsRx = rxVal("pills", pO.rx ?? 19, 350, pillsH);
  const pillsFillOv = pO.fill, pillsInkOv = pO.ink;
  const pillsActiveFill = pO.gradient ? "url(#brandGrad)" : (pillsFillOv ?? "#246fff");
  const pillsInactiveFill = pO.gradient ? "url(#brandGrad)" : (pillsFillOv ?? (pO.dark ? DARK.pills.fill : "#fff"));
  const pillsActiveInk = pO.gradient ? "#fff" : (pillsInkOv ?? "#fff");
  const pillsInactiveInk = pO.gradient ? "#fff" : (pillsInkOv ?? (pO.dark ? DARK.pills.ink : "#737373"));
  const pillsStroke = pO.stroke ?? (pO.dark ? DARK.pills.stroke : "#ebebeb");
  const pillsFont = r2(13 * (pO.scale ?? 1));
  let pillsXs = [20];
  for (let i = 1; i < 5; i++) pillsXs.push(pillsXs[i - 1] + PILL_W[i - 1] + pillsGap);
  const pillsRowW = pillsXs[4] + PILL_W[4] - 20;
  if (pO.align === "center") {
    const shift = Math.round((390 - pillsRowW) / 2) - 20;
    pillsXs = pillsXs.map((x) => x + shift);
  }
  const pillsFilter = pO.shadow === "strong" ? ` filter="url(#shStrong)"` : "";
  const pillsBlock = [`<g font-size="${pillsFont}" font-weight="600"${pillsFilter}>`,
    ...PILL_LABELS.map((label, i) => {
      const active = i === 0;
      const x = pillsXs[i], w = PILL_W[i];
      const fill = active ? pillsActiveFill : pillsInactiveFill;
      const ink = active ? pillsActiveInk : pillsInactiveInk;
      const st = active ? (pO.stroke ? ` stroke="${pO.stroke}"` : "") : ` stroke="${pillsStroke}"`;
      const text = (pO.icon ? "★ " : "") + label;
      return `  <rect x="${x}" y="224" width="${w}" height="${pillsH}" rx="${pillsRx}" fill="${fill}"${st}/><text x="${x + w / 2}" y="${224 + pillsH / 2 + 5}" fill="${ink}" text-anchor="middle">${text}</text>`;
    }),
    `</g>`].join("\n");

  // ---------- 主卡 ----------
  const hO = o("hero");
  const heroRx = rxVal("hero", hO.rx ?? 24, 350, 230);
  const heroFloat = hO.floating;
  const heroX = heroFloat ? 28 : 20;
  const heroW = heroFloat ? 334 : 350;
  const heroFill = hO.gradient ? "url(#brandGrad)" : (hO.fill ?? (hO.dark ? DARK.hero.fill : "#f7f7f7"));
  const heroStroke = hO.stroke ? ` stroke="${hO.stroke}"` : "";
  const heroFilter = hO.shadow === "strong" ? ` filter="url(#shStrong)"` : ` filter="url(#sh)"`;
  const heroLightBg = heroFill === "#f7f7f7" || heroFill === "none";
  const heroInk = heroLightBg ? "#0a0a0a" : "#fff";
  const heroSub = heroLightBg ? "#737373" : (hO.dark ? DARK.hero.sub : "#e8f0ff");
  const heroGrid = heroLightBg ? "#ebebeb" : (hO.dark ? DARK.hero.grid : "rgba(255,255,255,.25)");
  const heroTitleX = hO.align === "center" ? 195 : 38;
  const heroTitleAnchor = hO.align === "center" ? ` text-anchor="middle"` : "";
  const statusPill = o("statusPill");
  const statusRx = rxVal("statusPill", statusPill.rx ?? 12, 64, 24);
  const statusFill = statusPill.gradient ? "url(#brandGrad)" : (statusPill.fill ?? "#d8f999");
  const statusStroke = statusPill.stroke ? ` stroke="${statusPill.stroke}"` : "";
  const statusInk = statusPill.ink ?? (statusPill.fill === "#246fff" || statusPill.gradient ? "#fff" : "#3c6300");
  const amountText = (o("amount").icon ? "★ " : "") + "¥48,290";
  const heroTitleText = (hO.icon ? "★ " : "") + "总收入";

  // ---------- 订单卡片 ----------
  const ordGap = (o("order1").gap === "loose" || o("order2").gap === "loose") ? 24 : 16;
  const ordDx = ordGap - 16;
  const orderBlock = (id, x, avatarFill, avatarInk, char, name, meta, amount, pill) => {
    const oo = o(id);
    const dk = DARK[id];
    const rx = rxVal(id, oo.rx ?? 20, 167, 168);
    const fill = oo.gradient ? "url(#brandGrad)" : (oo.fill ?? (oo.dark ? dk.fill : "#fff"));
    const stroke = oo.stroke ?? (oo.dark ? dk.stroke : "#ebebeb");
    const ink = oo.ink ?? (oo.dark ? dk.ink : "#0a0a0a");
    const sub = oo.dark ? dk.sub : "#737373";
    const line = oo.dark ? dk.line : "#ebebeb";
    const fl = oo.floating;
    const rx2 = rx, x2 = fl ? x + 8 : x, w2 = fl ? 167 - 16 : 167;
    const shadow = oo.shadow === "strong" ? ` filter="url(#shStrong)"` : "";
    const cx = x + 167 / 2, cy = 594 + 168 / 2;
    const nameText = (oo.icon ? "★ " : "") + name;
    const pillId = id === "order1" ? "shipPill" : "pendPill";
    const pillRx = rxVal(pillId, (id === "order1" ? o("shipPill").rx : o("pendPill").rx) ?? 11, 64, 22);
    const pFill = id === "order1"
      ? (o("shipPill").gradient ? "url(#brandGrad)" : (o("shipPill").fill ?? "#d8f999"))
      : (o("pendPill").gradient ? "url(#brandGrad)" : (o("pendPill").fill ?? "#fff"));
    const pStroke = id === "order1"
      ? (o("shipPill").stroke ? ` stroke="${o("shipPill").stroke}"` : "")
      : (o("pendPill").stroke ? ` stroke="${o("pendPill").stroke}"` : ` stroke="#ebebeb"`);
    const pInk = id === "order1"
      ? (o("shipPill").ink ?? (o("shipPill").fill === "#246fff" || o("shipPill").gradient ? "#fff" : "#3c6300"))
      : (o("pendPill").ink ?? "#0a0a0a");
    return `  <g${scaleAttr(id, cx, cy)}>\n` +
      `  <rect x="${x2}" y="594" width="${w2}" height="168" rx="${rx2}" fill="${fill}" stroke="${stroke}"${shadow}/>\n` +
      `  <circle cx="${x + 32}" cy="632" r="18" fill="${avatarFill}"/><text x="${x + 32}" y="637" font-size="14" font-weight="700" fill="${avatarInk}" text-anchor="middle">${char}</text>\n` +
      `  <text x="${x + 58}" y="628" font-size="14" font-weight="700" fill="${ink}">${nameText}</text>\n` +
      `  <text x="${x + 58}" y="646" font-size="11" fill="${sub}">${meta}</text>\n` +
      `  <line x1="${x + 14}" y1="672" x2="${x + 153}" y2="672" stroke="${line}"/>\n` +
      `  <text x="${x + 14}" y="706" font-size="20" font-weight="800" fill="${ink}">${amount}</text>\n` +
      `  <g data-el="${pillId}">${titleFor(pillId)}<g${scaleAttr(pillId, x + 46, 731)}><rect x="${x + 14}" y="720" width="64" height="22" rx="${pillRx}" fill="${pFill}"${pStroke}/>\n` +
      (id === "order1"
        ? `  <text x="${x + 46}" y="735" font-size="11" font-weight="700" fill="${pInk}" text-anchor="middle">${pill}</text>`
        : `  <circle cx="${x + 26}" cy="731" r="3.5" fill="#615fff"/>\n  <text x="${x + 53}" y="735" font-size="11" font-weight="700" fill="${pInk}" text-anchor="middle">${pill}</text>`) +
      `</g></g>\n  </g>`;
  };
  const ordersFilterAttr = ` filter="url(#sh2)"`;

  // ---------- 底栏 ----------
  const tO = o("tabbar");
  const tabDark = tO.dark;
  const tabFill = tO.gradient ? "url(#brandGrad)" : (tO.fill ?? (tabDark ? DARK.tabbar.fill : "#fff"));
  const tabHair = tO.stroke ?? (tabDark ? DARK.tabbar.stroke : "#ebebeb");
  const tabInk = tO.ink ?? (tabDark ? DARK.tabbar.ink : "#737373");
  const tabActive = tO.gradient ? "#fff" : "#246fff";
  const tabFs = r2(10 * (tO.scale ?? 1));
  const tabFilter = tO.shadow === "strong" ? ` filter="url(#sh2)"` : "";
  const tabItems = (dy) => `
<g font-size="${tabFs}" text-anchor="middle" font-weight="600">
  <path d="M38 ${800 + dy} l11 -9 l11 9 v10 h-22z" fill="${tabActive}"/><text x="49" y="${826 + dy}" fill="${tabActive}">${tO.icon ? "★ " : ""}总览</text>
  <g stroke="${tabInk}" stroke-width="2" stroke-linecap="round"><line x1="141" y1="${792 + dy}" x2="153" y2="${792 + dy}"/><line x1="141" y1="${799 + dy}" x2="153" y2="${799 + dy}"/><line x1="141" y1="${806 + dy}" x2="149" y2="${806 + dy}"/></g>
  <circle cx="137" cy="${792 + dy}" r="1.8" fill="${tabInk}"/><circle cx="137" cy="${799 + dy}" r="1.8" fill="${tabInk}"/><circle cx="137" cy="${806 + dy}" r="1.8" fill="${tabInk}"/>
  <text x="146" y="${826 + dy}" fill="${tabInk}">订单</text>
  <g fill="${tabInk}"><rect x="235" y="${801 + dy}" width="4" height="9" rx="1.5"/><rect x="242" y="${796 + dy}" width="4" height="14" rx="1.5"/><rect x="249" y="${799 + dy}" width="4" height="11" rx="1.5"/></g>
  <line x1="233" y1="${812 + dy}" x2="255" y2="${812 + dy}" stroke="${tabInk}" stroke-width="2" stroke-linecap="round"/>
  <text x="243" y="${826 + dy}" fill="${tabInk}">数据</text>
  <circle cx="340" cy="${795 + dy}" r="5.5" fill="none" stroke="${tabInk}" stroke-width="2.2"/><path d="M330 ${810 + dy} a10 8 0 0 1 20 0" fill="none" stroke="${tabInk}" stroke-width="2.2"/><text x="340" y="${826 + dy}" fill="${tabInk}">我的</text>
</g>`;
  const tabbarBlock = tO.floating
    ? `<rect x="16" y="790" width="358" height="52" rx="26" fill="${tabFill}" filter="url(#shStrong)"/>${tabItems(12)}`
    : `<rect x="0" y="776" width="390" height="68" fill="${tabFill}"${tabFilter}/>\n<line x1="0" y1="776" x2="390" y2="776" stroke="${tabHair}"/>${tabItems(0)}`;

  // ---------- 头像 ----------
  const aO = o("avatar");
  const avatarR = 22;
  const avatarFs = 16;
  const avatarFill = aO.gradient ? "url(#brandGrad)" : (aO.fill ?? "#246fff");
  const avatarStroke = aO.stroke ? ` stroke="${aO.stroke}" stroke-width="2"` : "";
  const avatarInk = aO.ink ?? "#fff";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844" font-family="-apple-system, 'SF Pro Display', 'PingFang SC', 'Microsoft YaHei', sans-serif">
<defs>
  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b7fff" stop-opacity=".22"/><stop offset="1" stop-color="#2b7fff" stop-opacity=".02"/></linearGradient>
  <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4d8d"/><stop offset=".5" stop-color="#8b5cff"/><stop offset="1" stop-color="#2ee6d6"/></linearGradient>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity=".05"/></filter>
  <filter id="sh2" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".04"/></filter>
  <filter id="shStrong" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000" flood-opacity=".14"/></filter>
  <clipPath id="hero"><rect x="${heroX}" y="300" width="${heroW}" height="230" rx="${heroRx}"/></clipPath>
</defs>
<rect width="390" height="844" fill="#fff"/>
<text x="32" y="38" font-size="15" font-weight="600" fill="#0a0a0a">9:41</text>
<g fill="#0a0a0a"><rect x="288" y="35" width="3" height="5" rx="1"/><rect x="293" y="33" width="3" height="7" rx="1"/><rect x="298" y="31" width="3" height="9" rx="1"/><rect x="303" y="29" width="3" height="11" rx="1"/></g>
<g stroke="#0a0a0a" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M310 36 a10 10 0 0 1 16 0"/><path d="M312.5 38.5 a6.5 6.5 0 0 1 11 0"/></g>
<circle cx="318" cy="41" r="1.6" fill="#0a0a0a"/>
<rect x="330" y="28" width="26" height="12" rx="3.5" fill="none" stroke="#0a0a0a" stroke-width="1.2"/><rect x="332.5" y="30.5" width="18" height="7" rx="1.5" fill="#0a0a0a"/>

<text x="24" y="92" font-size="14" fill="#737373">早上好 👋</text>
<g data-el="title">${titleFor("title")}<text x="${titleCx}" y="128" font-size="${titleFs}" font-weight="800" fill="#0a0a0a"${titleAnchor}>${o("title").icon ? "★ " : ""}今日总览</text></g>
<g data-el="avatar">${titleFor("avatar")}<g${scaleAttr("avatar", 342, 104)}><circle cx="342" cy="104" r="${avatarR}" fill="${avatarFill}"${avatarStroke}/><text x="342" y="110" font-size="${avatarFs}" font-weight="700" fill="${avatarInk}" text-anchor="middle">C</text></g>${aO.icon ? `<text x="358" y="90" font-size="12" fill="#246fff">★</text>` : ""}</g>

<g data-el="search">${titleFor("search")}<g${scaleAttr("search", 165, 178)}><rect x="20" y="152" width="290" height="52" rx="${rxVal("search", sO.rx ?? 12, 290, 52)}" fill="${searchFill}" stroke="${searchStroke}"${searchFilter}/>
<circle cx="47" cy="176" r="7" fill="none" stroke="${searchInk}" stroke-width="2"/><line x1="52" y1="181" x2="57" y2="186" stroke="${searchInk}" stroke-width="2" stroke-linecap="round"/>
<text x="68" y="183" font-size="14" fill="${searchInk}">${sO.icon ? "★ " : ""}搜索订单、客户、商品</text></g></g>
<g data-el="filter">${titleFor("filter")}<g${scaleAttr("filter", 344, 178)}><rect x="318" y="152" width="52" height="52" rx="${rxVal("filter", fO.rx ?? 12, 52, 52)}" fill="${filterFill}" stroke="${filterStroke}"${filterFilter}/>
<g stroke="${filterInk}" stroke-width="2" stroke-linecap="round"><line x1="334" y1="170" x2="354" y2="170"/><line x1="334" y1="178" x2="354" y2="178"/><line x1="334" y1="186" x2="354" y2="186"/></g>
<circle cx="340" cy="170" r="3" fill="#fff" stroke="${filterInk}" stroke-width="2"/><circle cx="349" cy="186" r="3" fill="#fff" stroke="${filterInk}" stroke-width="2"/></g>${fO.icon ? `<text x="362" y="164" font-size="11" fill="#246fff">★</text>` : ""}</g>

<g data-el="pills">${titleFor("pills")}${pillsBlock}</g>

<g data-el="hero">${titleFor("hero")}<g${heroFilter}${scaleAttr("hero", 195, 415)}>
<g clip-path="url(#hero)">
  <rect x="${heroX}" y="300" width="${heroW}" height="230" fill="${heroFill}"${heroStroke}/>
  <text x="${heroTitleX}" y="336" font-size="13" fill="${heroSub}"${heroTitleAnchor}>${heroTitleText}</text>
  <g data-el="amount">${titleFor("amount")}<text x="${amountCx}" y="368" font-size="${amountFs}" font-weight="800" fill="${heroInk}"${amountAnchor}>${amountText}</text></g>
  <g data-el="statusPill">${titleFor("statusPill")}<g${scaleAttr("statusPill", 300, 354)}><rect x="268" y="342" width="64" height="24" rx="${statusRx}" fill="${statusFill}"${statusStroke}/>
  <text x="300" y="358" font-size="11" font-weight="700" fill="${statusInk}" text-anchor="middle">+14.8%</text></g></g>
  <g stroke="${heroGrid}" stroke-width="1"><line x1="36" y1="420" x2="354" y2="420"/><line x1="36" y1="455" x2="354" y2="455"/><line x1="36" y1="490" x2="354" y2="490"/></g>
  <path d="M48 463 L94 448 L140 456 L186 433 L232 443 L278 418 L324 426 L324 498 L48 498 Z" fill="url(#area)"/>
  <path d="M48 463 L94 448 L140 456 L186 433 L232 443 L278 418 L324 426" fill="none" stroke="#246fff" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="324" cy="426" r="4" fill="#246fff" stroke="#fff" stroke-width="2"/>
  <g font-size="10" fill="${heroSub}" text-anchor="middle"><text x="48" y="518">周一</text><text x="94" y="518">周二</text><text x="140" y="518">周三</text><text x="186" y="518">周四</text><text x="232" y="518">周五</text><text x="278" y="518">周六</text><text x="324" y="518">周日</text></g>
</g>
</g></g>

<g data-el="ordersTitle">${titleFor("ordersTitle")}<text x="${ordersTitleCx}" y="572" font-size="${ordersTitleFs}" font-weight="800" fill="#0a0a0a"${ordersTitleAnchor}>${o("ordersTitle").icon ? "★ " : ""}最近订单</text></g>
<text x="366" y="572" font-size="13" fill="#246fff" text-anchor="end" font-weight="600">查看全部 →</text>

<g${ordersFilterAttr}>
<g data-el="order1">${titleFor("order1")}${orderBlock("order1", 20, "#e8f0ff", "#246fff", "约", "约翰", "订单 #8241 · 今天", "¥3,412", "已发货")}</g>
<g data-el="order2">${titleFor("order2")}${orderBlock("order2", 203 + ordDx, "#f3e8ff", "#7f22fe", "阿", "阿斯彭", "订单 #8238 · 今天", "¥1,899", "待处理")}</g>
</g>

<g data-el="tabbar">${titleFor("tabbar")}${tabbarBlock}</g>
</svg>`;
}

export const DEMO_SVG = renderDemo();

export function demoDataUrl(overrides) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(renderDemo(overrides || {}));
}
