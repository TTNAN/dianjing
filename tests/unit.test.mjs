// 点睛单元测试：不依赖 DOM，只测词典 / 提示词组装这些纯逻辑。
// 跑法：node --test tests/unit.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { VOCAB, VISUAL, QUICK, TERM_INDEX, CONFLICTS, LIVE, STRUCTURAL } from "../src/vocab.js";
import { locate, buildPrompt } from "../src/prompt.js";
import { renderDemo, demoElementAt, structuralHtml } from "../src/demo.js";

const termCount = VOCAB.reduce((n, c) => n + c.terms.length, 0);

test("词典规模：7 类 27 词条，一眼对比 18 组", () => {
  assert.equal(VOCAB.length, 7);
  assert.equal(termCount, 27);
  assert.equal(VISUAL.length, 18);
});

test("所有词条 id 唯一，且一眼对比也进了索引", () => {
  const ids = [...VOCAB.flatMap((c) => c.terms.map((t) => t.id)), ...VISUAL.map((v) => v.id)];
  assert.equal(new Set(ids).size, ids.length);
  for (const v of VISUAL) assert.ok(TERM_INDEX[v.id], v.id);
});

test("快捷方向引用的词条都存在", () => {
  for (const q of QUICK) for (const id of q.terms) assert.ok(TERM_INDEX[id], id);
});

test("互斥对：两边都在词表里，且对称", () => {
  for (const [a, b] of CONFLICTS) {
    assert.ok(TERM_INDEX[a], a);
    assert.ok(TERM_INDEX[b], b);
    assert.notEqual(a, b);
  }
  const key = ([a, b]) => [a, b].sort().join("|");
  assert.equal(new Set(CONFLICTS.map(key)).size, CONFLICTS.length);
});

test("locate：九宫格 + 通栏", () => {
  assert.equal(locate({ x: 0, y: 0, w: 100, h: 100 }, 1000, 1000, "zh"), "左上");
  assert.equal(locate({ x: 400, y: 800, w: 200, h: 100 }, 1000, 1000, "zh"), "底部中间");
  assert.equal(locate({ x: 0, y: 800, w: 950, h: 100 }, 1000, 1000, "zh"), "底部通栏");
  assert.equal(locate({ x: 0, y: 800, w: 950, h: 100 }, 1000, 1000, "en"), "full-width, bottom of the screen");
});

function fakeState(regions) {
  return { image: { w: 780, h: 1688 }, regions };
}

test("buildPrompt：空区域不写，但编号沿用标注图上的原始序号", () => {
  const s = fakeState([
    { id: 1, x: 0, y: 0, w: 100, h: 50, terms: [], note: "", text: "" },
    { id: 2, x: 0, y: 1500, w: 700, h: 120, terms: ["floating-tabbar"], note: "", text: "首页" },
  ]);
  const out = buildPrompt(s, "zh");
  assert.match(out, /标出了 1 处/);
  assert.match(out, /## 2\. 元素 — 底部通栏/);
  assert.match(out, /框内文字：首页/);
  assert.doesNotMatch(out, /## 1\./);
});

test("buildPrompt：一个方向都没提时不输出空标题", () => {
  const s = fakeState([
    { id: 1, x: 0, y: 0, w: 100, h: 50, terms: [], note: "", text: "" },
  ]);
  const out = buildPrompt(s, "zh");
  assert.doesNotMatch(out, /## 1\./);
});

test("buildPrompt：英文版同样跳过空区域", () => {
  const s = fakeState([
    { id: 1, x: 0, y: 0, w: 100, h: 50, terms: [], note: "", text: "" },
    { id: 2, x: 0, y: 100, w: 100, h: 50, terms: ["contrast"], note: "", text: "" },
  ]);
  const out = buildPrompt(s, "en");
  assert.match(out, /marked 1 element/);
  assert.match(out, /## 2\. element/);
});

test("demo 默认渲染：布局锚点都在（搜索 y152、主卡、底栏）", () => {
  const svg = renderDemo();
  assert.match(svg, /x="20" y="152" width="290" height="52" rx="12"/);
  assert.match(svg, /x="20" y="300" width="350" height="230"/);
  assert.match(svg, /<rect x="0" y="776" width="390" height="68"/);
  assert.match(svg, /今日总览/);
});

test("demo 覆盖：主卡圆角改直角只动裁剪，不动锚点", () => {
  const a = renderDemo({ hero: { rx: 1 } });
  assert.match(a, /<clipPath id="hero"><rect x="20" y="300" width="350" height="230" rx="1"\/><\/clipPath>/);
  assert.match(a, /x="20" y="300" width="350" height="230"/);
  assert.notEqual(a, renderDemo());
});

test("demoElementAt：嵌套的、小元素先命中", () => {
  assert.equal(demoElementAt(300, 354), "statusPill");
  assert.equal(demoElementAt(48, 243), "pills");
  assert.equal(demoElementAt(100, 800), "tabbar");
  assert.equal(demoElementAt(195, 400), "hero");
  assert.equal(demoElementAt(10, 10), null);
});

test("LIVE：16 组参数类 + 2 组结构类，结构类不在 LIVE 里", () => {
  assert.equal(Object.keys(LIVE).length, 16);
  assert.equal(STRUCTURAL.length, 2);
  for (const id of STRUCTURAL) assert.ok(!LIVE[id], id);
  for (const id of Object.keys(LIVE)) assert.ok(TERM_INDEX[id], id);
});

test("structuralHtml：胶囊竖排的高度与条目数对得上", () => {
  const s = structuralHtml("pills", "col");
  assert.ok(s.html.includes("全部") && s.html.includes("今年"));
  assert.equal(s.height, 5 * 38 + 4 * 8 + 24);
  assert.equal(structuralHtml("hero", "col"), null);
});

// ---------- 画界面模式 ----------
import { PARTS, CATS, VARIANTS, TRANSITIONS, PALETTES, SHAPES, PLATFORMS, PLATFORM_LIBS, COMPONENTS, DENSITIES, FONT_SIZES, SHADOWS, themeFor, partAdjustSuffix, targetFor, targetSpec, seedSketchDoc, isLegacyRecipeSeed, describePart, buildSketchPrompt, screenById, partById, numWrap, thumbStyle, staggerDelay } from "../src/sketch.js";

test("画界面：零件表 16 种、5 类，每种都有中文名和默认标题", () => {
  assert.equal(Object.keys(PARTS).length, 16);
  assert.equal(CATS.length, 5);
  for (const [k, sp] of Object.entries(PARTS)) {
    assert.ok(sp.label, k);
    assert.ok(CATS.includes(sp.cat), k);
    assert.equal(typeof sp.defLabel, "string", k);
  }
});

test("画界面：种子是两页旅行记录，首页卡片连着详情页", () => {
  const doc = seedSketchDoc();
  assert.equal(doc.screens.length, 2);
  const home = screenById(doc, "s1");
  assert.equal(home.name, "首页");
  assert.equal(home.parts.length, 8);
  const card = home.parts.find((p) => p.kind === "card");
  assert.equal(card.label, "大理三日");
  assert.equal(card.action.to, "s2");
  assert.equal(card.action.transition, "slide");
  assert.equal(partById(doc, card.id).screen.id, "s1");
});

test("画界面：提示词含十段结构与跳转句", () => {
  const doc = seedSketchDoc();
  const pr = buildSketchPrompt(doc);
  for (const h of ["## 配色", "## 形状、字体与动效", "## 屏幕结构", "## 行为与屏幕跳转", "## 各组件的样式", "## 整体原则"]) {
    assert.ok(pr.includes(h), h);
  }
  assert.ok(pr.includes("大理三日"));
  assert.ok(pr.includes("跳转到详情页屏幕"));
  assert.ok(pr.includes("共有 2 个屏幕"));
  assert.ok(pr.includes("primaryContainer"));
});

test("画界面：旧种子识别——没动过的菜谱示例才认，自己改过的不认", () => {
  // 按旧菜谱种子的原样搭：标题菜谱、2 屏 14 个零件、卡片宫保鸡丁、按钮开始做饭
  const legacy = {
    title: "菜谱", theme: { palette: "blue", shape: "rounded" },
    screens: [
      { id: "s1", name: "首页", parts: [
        { id: "p1", kind: "topAppBar", label: "菜谱" },
        { id: "p2", kind: "searchBar", label: "搜索菜谱、食材" },
        { id: "p3", kind: "chipRow", label: "全部、川菜、粤菜、素食" },
        { id: "p4", kind: "card", label: "宫保鸡丁" },
        { id: "p5", kind: "listItem", label: "麻婆豆腐" },
        { id: "p6", kind: "listItem", label: "番茄炒蛋" },
        { id: "p7", kind: "listItem", label: "清蒸鲈鱼" },
        { id: "p8", kind: "bottomNav", label: "首页、菜谱、收藏、我的" },
      ] },
      { id: "s2", name: "详情页", parts: [
        { id: "p9", kind: "image", label: "" },
        { id: "p10", kind: "text", label: "宫保鸡丁" },
        { id: "p11", kind: "chipRow", label: "30 分钟、中辣、4 人份" },
        { id: "p12", kind: "text", label: "食材" },
        { id: "p13", kind: "text", label: "步骤" },
        { id: "p14", kind: "button", label: "开始做饭" },
      ] },
    ],
  };
  assert.equal(isLegacyRecipeSeed(legacy), true);
  // 只换主题也照样迁移（主题不算标记）
  assert.equal(isLegacyRecipeSeed({ ...legacy, theme: { palette: "green", shape: "square" } }), true);
  // 改标题、改卡片文案、加零件，任一处动过都不认
  assert.equal(isLegacyRecipeSeed({ ...legacy, title: "我的菜谱" }), false);
  assert.equal(isLegacyRecipeSeed(structuredClone(legacy)), true);
  const renamed = structuredClone(legacy);
  renamed.screens[0].parts[3].label = "鱼香肉丝";
  assert.equal(isLegacyRecipeSeed(renamed), false);
  const added = structuredClone(legacy);
  added.screens[0].parts.push({ id: "p15", kind: "text", label: "新零件" });
  assert.equal(isLegacyRecipeSeed(added), false);
  // 新种子（旅行记录）不认；空文档不认
  assert.equal(isLegacyRecipeSeed(seedSketchDoc()), false);
  assert.equal(isLegacyRecipeSeed(null), false);
  assert.equal(isLegacyRecipeSeed({ title: "菜谱", screens: [] }), false);
});

test("画界面：describePart 覆盖全部 16 种且不为空", () => {
  const all = Object.keys(PARTS).map((kind) => describePart({ kind, label: "测", supporting: "副", variant: "filled", selected: 0 }));
  assert.equal(all.length, 16);
  for (const d of all) assert.ok(d.length > 1, d);
  assert.ok(describePart({ kind: "card", label: "大理三日", supporting: "洱海", variant: "filled" }).includes("大理三日"));
});

test("画界面：主题与过渡表完整", () => {
  assert.equal(Object.keys(PALETTES).length, 3);
  assert.equal(SHAPES.length, 3);
  assert.equal(TRANSITIONS.length, 8);
  assert.ok(VARIANTS.some((v) => v.id === "filled"));
  assert.ok(PALETTES.blue.primary.startsWith("#"));
});

test("画界面：过渡表新增第 8 种「放大」，旧 expand 改名「居中放大」不撞车", () => {
  assert.ok(TRANSITIONS.some((t) => t.id === "zoom" && t.zh === "放大"));
  assert.ok(TRANSITIONS.some((t) => t.id === "expand" && t.zh === "居中放大"));
  assert.equal(new Set(TRANSITIONS.map((t) => t.zh)).size, 8);
});

test("动效：胶囊定位——宽度等于选中按钮，左缘 = 按钮左缘减 3px 内边距", () => {
  assert.deepEqual(thumbStyle(120, 3), { width: "120px", transform: "translateX(0px)" });
  assert.deepEqual(thumbStyle(90, 100), { width: "90px", transform: "translateX(97px)" });
});

test("动效：错峰延迟每项 40ms、零件封顶 200ms；18 张小图封顶 560ms，总长不超过 600ms", () => {
  assert.equal(staggerDelay(0), 0);
  assert.equal(staggerDelay(3), 120);
  assert.equal(staggerDelay(5), 200);
  assert.equal(staggerDelay(17, 40, 560), 560);
});

test("动效：数字包成带 data-n 的 span，无数字的文本原样不动", () => {
  assert.equal(numWrap("交通 600 元、住宿 900 元。"), `交通 <span class="sk-num" data-n="600">600</span> 元、住宿 <span class="sk-num" data-n="900">900</span> 元。`);
  assert.equal(numWrap("大理三日"), "大理三日");
  assert.ok(numWrap("2026.03").includes(`data-n="2026.03"`));
});

test("动效：文本零件带副标题字段，花费数字在检查器里可改、数字滚动才够得着", () => {
  assert.equal(PARTS.text.hasSupporting, true);
});

test("画界面：平台与组件库不是自由组合——小程序类四个库，ArkUI/Flutter 各自一套", () => {
  assert.equal(PLATFORMS.length, 6);
  for (const p of ["miniprogram", "uniapp", "taro"]) {
    assert.deepEqual(PLATFORM_LIBS[p].map((l) => l.id), ["vant", "tdesign", "antd-mobile", "nutui"]);
  }
  assert.deepEqual(PLATFORM_LIBS.arkui.map((l) => l.id), ["arkui"]);
  assert.deepEqual(PLATFORM_LIBS.flutter.map((l) => l.id), ["flutter"]);
  assert.deepEqual(PLATFORM_LIBS.web.map((l) => l.id), ["material"]);
  // 每个平台都有库可挂，没把选项放错地方
  for (const p of PLATFORMS) assert.ok(PLATFORM_LIBS[p.id].length >= 1, p.id);
});

test("画界面：targetFor 落回默认值——缺字段、不合法平台、不可能的组合", () => {
  assert.deepEqual(targetFor({}), { platform: "web", library: "material" });
  assert.deepEqual(targetFor({ target: { platform: "nope", library: "vant" } }), { platform: "web", library: "material" });
  // 鸿蒙配 Vant 是不可能的组合，落回 ArkUI 原生组件
  assert.deepEqual(targetFor({ target: { platform: "arkui", library: "vant" } }), { platform: "arkui", library: "arkui" });
  assert.deepEqual(targetFor({ target: { platform: "miniprogram", library: "tdesign" } }), { platform: "miniprogram", library: "tdesign" });
  // 种子默认就是 Web + Material 3，现有用户行为不动
  assert.deepEqual(seedSketchDoc().target, { platform: "web", library: "material" });
});

test("画界面：小程序 + Vant 提示词写 van-button，不写 Material 3", () => {
  const doc = seedSketchDoc();
  doc.target = { platform: "miniprogram", library: "vant" };
  const pr = buildSketchPrompt(doc);
  assert.ok(pr.includes("Vant Weapp"), pr.split("\n").slice(0, 4).join(" | "));
  assert.ok(pr.includes("van-button"));
  assert.ok(pr.includes("van-cell"));
  assert.ok(pr.includes("750rpx"));
  assert.ok(pr.includes("微信小程序"));
  assert.ok(!pr.includes("Material"));
  // 样式段带组件名、单位换成 rpx（56dp -> 112rpx）
  assert.ok(pr.includes("van-button：按钮高 112rpx"));
  assert.ok(pr.includes("van-search"));
  assert.ok(pr.includes("大理三日"));
});

test("画界面：鸿蒙 ArkUI 提示词写 ArkUI 原生组件", () => {
  const doc = seedSketchDoc();
  doc.target = { platform: "arkui", library: "arkui" };
  const pr = buildSketchPrompt(doc);
  assert.ok(pr.includes("鸿蒙 ArkUI"));
  assert.ok(pr.includes("ArkTS"));
  assert.ok(pr.includes("Button（标题"));
  assert.ok(pr.includes("Navigation"));
  assert.ok(!pr.includes("Material"));
  assert.ok(!pr.includes("412×892dp"));
  assert.ok(pr.includes("HarmonyOS Sans"));
});

test("画界面：Flutter 提示词写 Flutter Widgets", () => {
  const doc = seedSketchDoc();
  doc.target = { platform: "flutter", library: "flutter" };
  const pr = buildSketchPrompt(doc);
  assert.ok(pr.includes("Flutter Widgets"));
  assert.ok(pr.includes("ElevatedButton"));
  assert.ok(pr.includes("ListTile"));
  assert.ok(pr.includes("Dart"));
  assert.ok(!pr.includes("Material"));
  // 原则里也换成 Flutter 的组件体系
  assert.ok(pr.includes("组件使用 Flutter Widgets的标准组件"));
});

test("画界面：默认 Web 提示词与原来一字不差——Material 3、412×892dp、Web", () => {
  const doc = seedSketchDoc();
  const pr = buildSketchPrompt(doc);
  assert.ok(pr.startsWith("请用 Material 3 Expressive 的设计实现旅行记录。"));
  assert.ok(pr.includes("目标为竖屏手机（412×892dp）"));
  assert.ok(pr.includes("实现目标是 Web（在浏览器中运行的应用）。"));
  assert.ok(pr.includes("组件使用 Material Web 的标准组件"));
  assert.ok(pr.includes("屏幕边缘留 16dp"));
  assert.ok(!pr.includes("van-"));
  assert.ok(!pr.includes("t-button"));
});

test("画界面：describePart 按体系换组件名", () => {
  const btn = { kind: "button", label: "写游记", variant: "filled" };
  assert.ok(describePart(btn).includes("按钮"));
  assert.equal(describePart(btn, { platform: "miniprogram", library: "vant" }), "van-button（标题“写游记”，填充样式）");
  assert.equal(describePart(btn, { platform: "flutter", library: "flutter" }), "ElevatedButton（标题“写游记”，填充样式）");
  assert.equal(describePart(btn, { platform: "arkui", library: "arkui" }), "Button（标题“写游记”，填充样式）");
  assert.ok(describePart({ kind: "listItem", label: "京都樱花", supporting: "日本" }, { platform: "miniprogram", library: "tdesign" }).startsWith("t-cell"));
});

test("画界面：themeFor 归一化——缺项落回默认，老 shape 按 8/20/28 换算，圆角夹到 0–32", () => {
  assert.deepEqual(themeFor({}), { palette: "blue", radius: 20, density: "standard", font: "standard", shadow: "light" });
  assert.equal(themeFor({ theme: { palette: "green", shape: "square" } }).radius, 8);
  assert.equal(themeFor({ theme: { shape: "full" } }).radius, 28);
  assert.equal(themeFor({ theme: { shape: "rounded" } }).radius, 20);
  assert.equal(themeFor({ theme: { radius: 40 } }).radius, 32);
  assert.equal(themeFor({ theme: { radius: -5 } }).radius, 0);
  assert.equal(themeFor({ theme: { density: "nope", font: "nope", shadow: "nope", palette: "nope" } }).density, "standard");
  assert.equal(themeFor(seedSketchDoc()).radius, 20);
  assert.deepEqual(seedSketchDoc().theme, { palette: "blue", radius: 20, density: "standard", font: "standard", shadow: "light" });
});

test("画界面：调节进提示词——默认是标准字号/标准密度/轻阴影/圆角 20", () => {
  const pr = buildSketchPrompt(seedSketchDoc());
  assert.ok(pr.includes("圆角 20dp（按钮为胶囊形，卡片 20dp，对话框 28dp）。"));
  assert.ok(pr.includes("字号标准（正文 14dp，标题 17dp）。"));
  assert.ok(pr.includes("密度标准（零件间距 12dp），轻阴影。"));
});

test("画界面：调节进提示词——宽松+大字号+无阴影+圆角 0 写克制，圆角 28 写放大", () => {
  const doc = seedSketchDoc();
  doc.theme = { palette: "blue", radius: 0, density: "loose", font: "large", shadow: "none" };
  const pr = buildSketchPrompt(doc);
  assert.ok(pr.includes("圆角保持克制：整体缩小 M3 的形状比例"));
  assert.ok(pr.includes("字号大（正文 15dp，标题 18dp）。"));
  assert.ok(pr.includes("密度宽松（零件间距 20dp），无阴影。"));
  const doc2 = seedSketchDoc();
  doc2.theme.radius = 28;
  assert.ok(buildSketchPrompt(doc2).includes("圆角尽量放大：按钮、标签片和输入框为胶囊形，卡片和图片 32dp"));
  // 小程序平台：数值按 rpx 换算（20dp -> 40rpx，间距 12dp -> 24rpx）
  const doc3 = seedSketchDoc();
  doc3.target = { platform: "miniprogram", library: "vant" };
  const pr3 = buildSketchPrompt(doc3);
  assert.ok(pr3.includes("圆角 40rpx"));
  assert.ok(pr3.includes("零件间距 24rpx"));
  assert.ok(pr3.includes("字号标准（正文 28rpx，标题 34rpx）。"));
});

test("画界面：零件的对齐与透明度进提示词", () => {
  assert.equal(partAdjustSuffix({ kind: "text", label: "x" }), "");
  assert.equal(partAdjustSuffix({ align: "center" }), "，居中对齐");
  assert.equal(partAdjustSuffix({ align: "right", opacity: 0.6 }), "，右对齐，透明度 60%");
  assert.equal(partAdjustSuffix({ opacity: 1 }), "");
  const btn = describePart({ kind: "button", label: "写游记", variant: "filled", align: "center", opacity: 0.8 });
  assert.ok(btn.includes("“写游记”的填充按钮"));
  assert.ok(btn.includes("居中对齐"));
  assert.ok(btn.includes("透明度 80%"));
  const card = describePart({ kind: "card", label: "大理三日", supporting: "洱海", variant: "filled", align: "right" }, { platform: "miniprogram", library: "vant" });
  assert.ok(card.startsWith("van-card"));
  assert.ok(card.includes("右对齐"));
});

// ---------- 演示直接点改 ----------
import { DEMO_ELEMENTS, DEMO_NAMES, DEMO_CYCLES } from "../src/demo.js";

test("直接点改：14 个可见元素都有名、都有至少 2 个状态", () => {
  assert.equal(DEMO_ELEMENTS.length, 14);
  for (const el of DEMO_ELEMENTS) {
    assert.ok(DEMO_NAMES[el.id]?.zh, el.id);
    const cycle = DEMO_CYCLES[el.id];
    assert.ok(Array.isArray(cycle) && cycle.length >= 2, `${el.id} 至少 2 个状态`);
  }
});

test("直接点改：轮次里的词条都在词表里、都是参数类（进 LIVE），不含结构类", () => {
  for (const [elId, cycle] of Object.entries(DEMO_CYCLES)) {
    assert.equal(new Set(cycle).size, cycle.length, `${elId} 轮次里不重复`);
    for (const term of cycle) {
      assert.ok(TERM_INDEX[term], `${elId} 的 ${term} 在词表里`);
      assert.ok(LIVE[term], `${elId} 的 ${term} 是参数类`);
      assert.ok(!STRUCTURAL.includes(term), `${elId} 的 ${term} 不是结构类`);
    }
  }
});

test("选中改法：只给适用的——文字类和头像没有形状词条，底栏没有尺寸词条，每个改法都有中文名", () => {
  const SHAPE = ["v-round-to-square", "v-square-to-round", "v-box-to-pill", "v-square-to-circle"];
  const SCALE = ["v-small-to-big", "v-big-to-small"];
  for (const elId of ["title", "amount", "ordersTitle", "avatar"]) {
    assert.ok(!DEMO_CYCLES[elId].some((t) => SHAPE.includes(t)), `${elId} 不该有形状词条`);
  }
  assert.ok(!DEMO_CYCLES.tabbar.some((t) => SCALE.includes(t)), "底栏不该有尺寸词条");
  for (const [elId, cycle] of Object.entries(DEMO_CYCLES)) {
    for (const t of cycle) assert.ok(TERM_INDEX[t]?.zh, `${elId} 的 ${t} 有中文名，右边才能写出来`);
  }
});

test("直接点改：轮次里每个状态点下去，图都真变（没有空转的状态）", () => {
  const base = renderDemo();
  for (const [elId, cycle] of Object.entries(DEMO_CYCLES)) {
    for (const term of cycle) {
      const changed = renderDemo({ [elId]: LIVE[term] });
      assert.notEqual(changed, base, `${elId} 的 ${term} 没让图变`);
    }
  }
});

test("直接点改：内联 SVG 里 14 个元素组都挂了 data-el，悬停标题说的是选中不是直接改", () => {
  const svg = renderDemo({}, { search: "搜索栏：点一下选中", hero: "主卡：已选中，右边挑个改法" });
  assert.equal((svg.match(/data-el="/g) || []).length, 14);
  assert.ok(svg.includes('<g data-el="search"><title>搜索栏：点一下选中</title>'));
  assert.ok(svg.includes('<g data-el="hero"><title>主卡：已选中，右边挑个改法</title>'));
  // 没传标题时不挂空 title
  assert.ok(!renderDemo().includes("<title>"));
});

test("一眼对比小图：纯色 → 渐变的后一张是真渐变（不再全是蓝），通栏的前一张是满宽底栏", () => {
  const g = VISUAL.find((v) => v.id === "v-solid-to-gradient");
  assert.ok(g.after.includes("#ff4d8d") && g.after.includes("#2ee6d6"), "后态渐变里有粉有青，不再全蓝");
  assert.ok(!g.after.includes("#1761fd"), "后态不再是三段蓝");
  const f = VISUAL.find((v) => v.id === "v-full-to-inset");
  assert.ok(f.before.includes("left:0;right:0;bottom:0;height:16px"), "前态是满宽贴底的底栏");
  assert.ok(f.after.includes("left:6px;right:6px;bottom:4px") && f.after.includes("border-radius:99px"));
});
