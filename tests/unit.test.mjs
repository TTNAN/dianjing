// 点睛单元测试：不依赖 DOM，只测词典 / 提示词组装这些纯逻辑。
// 跑法：node --test tests/unit.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { VOCAB, VISUAL, QUICK, TERM_INDEX, CONFLICTS } from "../src/vocab.js";
import { locate, buildPrompt } from "../src/prompt.js";

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
