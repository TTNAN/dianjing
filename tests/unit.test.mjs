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
import { PARTS, CATS, VARIANTS, TRANSITIONS, PALETTES, SHAPES, seedSketchDoc, describePart, buildSketchPrompt, screenById, partById } from "../src/sketch.js";

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

test("画界面：describePart 覆盖全部 16 种且不为空", () => {
  const all = Object.keys(PARTS).map((kind) => describePart({ kind, label: "测", supporting: "副", variant: "filled", selected: 0 }));
  assert.equal(all.length, 16);
  for (const d of all) assert.ok(d.length > 1, d);
  assert.ok(describePart({ kind: "card", label: "大理三日", supporting: "洱海", variant: "filled" }).includes("大理三日"));
});

test("画界面：主题与过渡表完整", () => {
  assert.equal(Object.keys(PALETTES).length, 3);
  assert.equal(SHAPES.length, 3);
  assert.equal(TRANSITIONS.length, 7);
  assert.ok(VARIANTS.some((v) => v.id === "filled"));
  assert.ok(PALETTES.blue.primary.startsWith("#"));
});
