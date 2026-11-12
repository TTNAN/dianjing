import { VOCAB, QUICK, TERM_INDEX, VISUAL, CONFLICTS, LIVE, STRUCTURAL } from "./vocab.js";
import { buildPrompt } from "./prompt.js";
import { PROVIDERS, loadSettings, saveSettings, hasModel, recognize, variants } from "./llm.js";
import { demoDataUrl, renderDemo, demoElementAt, structuralHtml } from "./demo.js";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const state = {
  image: null,          // { src, w, h }
  regions: [],          // { id, x, y, w, h, terms:[], note, text, recog, variants:[], chosen, busy }
  selected: null,
  lang: "zh",
  settings: loadSettings(),
  preview: null,        // { regionId, variantIdx }：把选中的方案贴回原图上；或 { regionId, localId }：结构类本地重排预览
  wipe: 100,            // 预览擦除位置 0-100，100 = 全是改后
  isDemo: false,        // 当前图是不是内置示例（只有它是活的，能按元素重绘）
  tweakSrc: null,       // 改后图的 PNG（显示层）；原图永远留在 #shot，裁剪/导出都用原图
  tweakChanged: false,  // 改后图与原图是否真有差别
  compare: "after",     // "after" 看改后 / "before" 看原图
};
window.__dianjing = state; // 供端到端测试读取
let nextId = 1;
let justCreated = null;

// ---------- 本地持久化：圈选自动保存，刷新还在 ----------
const SAVE_KEY = "dianjing.workspace.v1";
let saveTimer;
function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      if (!state.image) return;
      if (state.image.src.length > 3_500_000) return; // 图太大就不存了，免得爆 localStorage
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        image: state.image, regions: state.regions, selected: state.selected, lang: state.lang, isDemo: state.isDemo,
      }));
    } catch { /* 空间不足就静静跳过 */ }
  }, 400);
}
function loadSaved() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const d = JSON.parse(raw);
    if (!d?.image?.src || !Array.isArray(d.regions)) return false;
    state.image = d.image;
    state.isDemo = !!d.isDemo;
    state.regions = d.regions.map((r) => ({ text: "", chosen: null, variants: [], recog: null, busy: "", note: "", terms: [], ...r }));
    state.selected = d.selected ?? state.regions.at(-1)?.id ?? null;
    nextId = Math.max(0, ...state.regions.map((r) => r.id || 0)) + 1;
    if (d.lang) state.lang = d.lang;
    $("#shot").src = state.image.src;
    $("#empty").hidden = true;
    $("#canvas").hidden = false;
    $("#zoombar").hidden = false;
    document.body.classList.remove("no-image");
    document.querySelectorAll("#seg button").forEach((x) => x.classList.toggle("on", x.dataset.lang === state.lang));
    moveThumb();
    return true;
  } catch { return false; }
}
function clearWorkspace() {
  try { localStorage.removeItem(SAVE_KEY); } catch {}
  state.image = null; state.regions = []; state.selected = null; state.preview = null; nextId = 1;
  state.isDemo = false; state.tweakSrc = null; state.tweakChanged = false; state.compare = "after";
  zoom = "fit"; applyZoom();
  $("#shot").removeAttribute("src");
  $("#shotAfter").removeAttribute("src");
  $("#empty").hidden = false; $("#canvas").hidden = true; $("#zoombar").hidden = true; $("#previewbar").hidden = true;
  document.body.classList.add("no-image");
  renderAll();
}

// ---------- 图片载入 ----------
function rasterizeSvg(src, cb) {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = img.naturalWidth * 2; c.height = img.naturalHeight * 2;
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    cb(c.toDataURL("image/png"), c.width, c.height);
  };
  img.onerror = () => cb(null);
  img.src = src;
}
function loadImage(src, isDemo = false) {
  const img = new Image();
  img.onload = () => {
    // SVG 等矢量图先栅格化为 PNG，保证后续裁剪/导出一致
    if (src.startsWith("data:image/svg")) {
      rasterizeSvg(src, (png, w, h) => { if (png) finishLoad(png, w, h, isDemo); });
      return;
    }
    finishLoad(src, img.naturalWidth, img.naturalHeight, isDemo);
  };
  img.onerror = () => toast("图片读取失败");
  img.src = src;
}
function finishLoad(finalSrc, w, h, isDemo) {
    state.image = { src: finalSrc, w, h };
    state.isDemo = isDemo;
    state.regions = []; state.selected = null; state.preview = null; nextId = 1;
    state.tweakSrc = null; state.tweakChanged = false; state.compare = "after"; lastOvJson = "";
    zoom = "fit"; applyZoom();
    $("#shot").src = finalSrc;
    $("#shotAfter").removeAttribute("src");
    $("#empty").hidden = true;
    const cv = $("#canvas"); cv.hidden = false; cv.style.animation = "none"; cv.offsetHeight; cv.style.animation = "";
    $("#zoombar").hidden = false;
    document.body.classList.remove("no-image");
    $("#hint").classList.remove("gone");
    renderAll();
}
function loadFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const r = new FileReader();
  r.onload = () => loadImage(r.result);
  r.readAsDataURL(file);
}

["#file", "#file2"].forEach((id) => $(id).addEventListener("change", (e) => loadFile(e.target.files[0])));
["#demo", "#demo2"].forEach((id) => $(id).addEventListener("click", () => loadImage(demoDataUrl(), true)));
window.addEventListener("paste", (e) => {
  const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
  if (item) loadFile(item.getAsFile());
});
const stage = $("#stage");
stage.addEventListener("dragover", (e) => { e.preventDefault(); stage.classList.add("drag"); });
stage.addEventListener("dragleave", () => stage.classList.remove("drag"));
stage.addEventListener("drop", (e) => { e.preventDefault(); stage.classList.remove("drag"); loadFile(e.dataTransfer.files[0]); });

// ---------- 缩放：按钮 + Ctrl/⌘+滚轮 ----------
const ZOOM_STEPS = [0.5, 0.75, 1, 1.5, 2, 3];
let zoom = "fit";
function applyZoom() {
  const img = $("#shot");
  if (!state.image) return;
  if (zoom === "fit") { img.style.width = ""; img.style.maxHeight = ""; img.style.maxWidth = ""; }
  else { img.style.maxHeight = "none"; img.style.maxWidth = "none"; img.style.width = Math.round(state.image.w * zoom) + "px"; }
  const lab = $("#zoomLabel");
  if (lab) lab.textContent = zoom === "fit" ? "适应" : Math.round(zoom * 100) + "%";
}
function zoomStep(dir) {
  if (zoom === "fit") zoom = dir > 0 ? 1 : 0.75;
  else {
    const i = ZOOM_STEPS.indexOf(zoom);
    zoom = ZOOM_STEPS[clamp(i + dir, 0, ZOOM_STEPS.length - 1)];
  }
  applyZoom();
}
$("#zoomIn").onclick = () => zoomStep(1);
$("#zoomOut").onclick = () => zoomStep(-1);
$("#zoomFit").onclick = () => { zoom = "fit"; applyZoom(); };
stage.addEventListener("wheel", (e) => {
  if (!state.image || !(e.ctrlKey || e.metaKey)) return;
  e.preventDefault();
  zoomStep(e.deltaY < 0 ? 1 : -1);
}, { passive: false });

// ---------- 圈选 ----------
const overlay = $("#overlay");
let drag = null;
function toImg(e) {
  const rect = overlay.getBoundingClientRect();
  const sx = state.image.w / rect.width, sy = state.image.h / rect.height;
  return {
    x: Math.max(0, Math.min(state.image.w, (e.clientX - rect.left) * sx)),
    y: Math.max(0, Math.min(state.image.h, (e.clientY - rect.top) * sy)),
  };
}
overlay.addEventListener("pointerdown", (e) => {
  if (!state.image || e.target.closest(".box") || e.target.closest(".preview-layer")) return;
  overlay.setPointerCapture(e.pointerId);
  const p = toImg(e);
  drag = { x0: p.x, y0: p.y, el: document.createElement("div") };
  drag.el.className = "box drawing";
  drag.el.innerHTML = `<span class="size"></span>`;
  overlay.appendChild(drag.el);
  $("#hint").classList.add("gone");
});
overlay.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const p = toImg(e);
  drag.rect = { x: Math.min(p.x, drag.x0), y: Math.min(p.y, drag.y0), w: Math.abs(p.x - drag.x0), h: Math.abs(p.y - drag.y0) };
  place(drag.el, drag.rect);
  drag.el.firstChild.textContent = `${Math.round(drag.rect.w)} × ${Math.round(drag.rect.h)}`;
});
overlay.addEventListener("pointerup", () => {
  if (!drag) return;
  const r = drag.rect; drag.el.remove();
  const minPx = state.image.w / overlay.clientWidth * 8;
  drag = null;
  if (!r || r.w < minPx || r.h < minPx) return;
  const region = { id: nextId++, ...r, terms: [], note: "", text: "", recog: null, variants: [], chosen: null, busy: "" };
  state.regions.push(region);
  state.selected = region.id;
  justCreated = region.id;
  renderAll();
  if (hasModel(state.settings)) runRecognize(region);
});
function place(el, r) {
  el.style.left = (r.x / state.image.w) * 100 + "%";
  el.style.top = (r.y / state.image.h) * 100 + "%";
  el.style.width = (r.w / state.image.w) * 100 + "%";
  el.style.height = (r.h / state.image.h) * 100 + "%";
}

// 移动 / 缩放已有的框：拖框体移动，拖四角手柄缩放
function startBoxDrag(e, r) {
  const handle = e.target.closest(".h");
  const corner = handle ? ["nw", "ne", "sw", "se"].find((c) => handle.classList.contains(c)) : null;
  const start = toImg(e);
  const orig = { x: r.x, y: r.y, w: r.w, h: r.h };
  const el = e.currentTarget;
  const minPx = state.image.w / overlay.clientWidth * 8;
  el.setPointerCapture(e.pointerId);
  let cur = { ...orig };
  const onMove = (ev) => {
    const p = toImg(ev);
    const dx = p.x - start.x, dy = p.y - start.y;
    cur = { ...orig };
    if (!corner) {
      cur.x = clamp(orig.x + dx, 0, state.image.w - orig.w);
      cur.y = clamp(orig.y + dy, 0, state.image.h - orig.h);
    } else {
      if (corner.includes("w")) { cur.x = clamp(orig.x + dx, 0, orig.x + orig.w - minPx); cur.w = orig.x + orig.w - cur.x; }
      if (corner.includes("e")) { cur.w = clamp(orig.w + dx, minPx, state.image.w - orig.x); }
      if (corner.includes("n")) { cur.y = clamp(orig.y + dy, 0, orig.y + orig.h - minPx); cur.h = orig.y + orig.h - cur.y; }
      if (corner.includes("s")) { cur.h = clamp(orig.h + dy, minPx, state.image.h - orig.y); }
    }
    place(el, cur);
  };
  const onUp = () => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerup", onUp);
    Object.assign(r, { x: Math.round(cur.x), y: Math.round(cur.y), w: Math.round(cur.w), h: Math.round(cur.h) });
    renderAll();
  };
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", onUp);
}
window.addEventListener("keydown", (e) => {
  // 只在焦点不在输入框/按钮上时响应，避免打字时误删
  if ((document.activeElement?.tagName || "BODY") !== "BODY") return;
  if ((e.key === "Delete" || e.key === "Backspace") && state.selected) { removeRegion(state.selected); return; }
  const r = current();
  if (r && e.key.startsWith("Arrow")) {
    e.preventDefault();
    const d = e.shiftKey ? 10 : 1;
    if (e.key === "ArrowLeft") r.x = clamp(r.x - d, 0, state.image.w - r.w);
    if (e.key === "ArrowRight") r.x = clamp(r.x + d, 0, state.image.w - r.w);
    if (e.key === "ArrowUp") r.y = clamp(r.y - d, 0, state.image.h - r.h);
    if (e.key === "ArrowDown") r.y = clamp(r.y + d, 0, state.image.h - r.h);
    renderAll();
  }
});
function removeRegion(id) {
  state.regions = state.regions.filter((r) => r.id !== id);
  if (state.preview?.regionId === id) state.preview = null;
  state.selected = state.regions.at(-1)?.id ?? null;
  renderAll();
}
const current = () => state.regions.find((r) => r.id === state.selected);

// ---------- 点一下就变：内置示例按元素重绘 ----------
// 圈中的区域 → 示例里的元素（区域中心落在哪个元素上；小元素先命中）。
// 只有内置示例是活的：上传的截图是像素，改不了本身，变化还是靠 AI 方案贴图看。
function elementAtRegion(r) {
  if (!state.isDemo) return null;
  const cx = (r.x + r.w / 2) / 2, cy = (r.y + r.h / 2) / 2; // 栅格化后是 2 倍坐标，除以 2 回到 demo 坐标
  return demoElementAt(cx, cy);
}
function computeDemoOverrides() {
  const map = {};
  for (const r of state.regions) {
    const el = elementAtRegion(r);
    if (!el) continue;
    for (const id of r.terms) {
      const live = LIVE[id];
      if (!live) continue;
      map[el] = { ...map[el], ...live };
    }
  }
  return map;
}
let tweakSeq = 0, lastOvJson = "";
function updateTweakVisibility() {
  const after = $("#shotAfter");
  after.hidden = !(state.tweakSrc && state.compare === "after");
  const btn = $("#compareBtn");
  btn.hidden = !state.tweakSrc;
  btn.textContent = state.compare === "after" ? "◐ 对比原图" : "◐ 看改后";
}
$("#compareBtn").onclick = () => {
  state.compare = state.compare === "after" ? "before" : "after";
  updateTweakVisibility();
};
// 按所有圈选重绘示例。返回改后图与原图是否真有差别
// （字符串没变 = 这个词条对这个元素没用，点它只会写进提示词）。
// 带 JSON 护栏：框拖动、方向键微调这些只调位置的操作不会反复重绘。
function refreshTweaks() {
  const after = $("#shotAfter");
  const ov = state.isDemo ? computeDemoOverrides() : {};
  const json = JSON.stringify(ov);
  if (json === lastOvJson) { updateTweakVisibility(); return state.tweakChanged; }
  lastOvJson = json;
  if (Object.keys(ov).length === 0) {
    state.tweakSrc = null; state.tweakChanged = false;
    after.removeAttribute("src");
    updateTweakVisibility();
    return false;
  }
  const changed = renderDemo(ov) !== renderDemo();
  state.tweakChanged = changed;
  if (!changed) {
    state.tweakSrc = null;
    after.removeAttribute("src");
    updateTweakVisibility();
    return false;
  }
  const seq = ++tweakSeq;
  rasterizeSvg(demoDataUrl(ov), (png) => {
    if (seq !== tweakSeq || !png) return;
    state.tweakSrc = png;
    state.compare = "after"; // 有新变化就亮出来看，别停在原图上
    after.src = png;
    updateTweakVisibility();
  });
  return true;
}

// ---------- 裁剪 ----------
function crop(r, pad = 12) {
  const img = $("#shot");
  const x = Math.max(0, r.x - pad), y = Math.max(0, r.y - pad);
  const w = Math.min(state.image.w - x, r.w + pad * 2), h = Math.min(state.image.h - y, r.h + pad * 2);
  const scale = Math.min(1, 1024 / Math.max(w, h));
  const c = document.createElement("canvas");
  c.width = Math.round(w * scale); c.height = Math.round(h * scale);
  c.getContext("2d").drawImage(img, x, y, w, h, 0, 0, c.width, c.height);
  return c.toDataURL("image/png");
}
function annotated(maxW = Infinity) {
  const img = $("#shot");
  const s = Math.min(1, maxW / state.image.w);
  const c = document.createElement("canvas");
  c.width = Math.round(state.image.w * s); c.height = Math.round(state.image.h * s);
  const g = c.getContext("2d");
  g.drawImage(img, 0, 0, c.width, c.height);
  const lw = Math.max(2, c.width / 250);
  state.regions.forEach((r, i) => {
    g.strokeStyle = "#246fff"; g.lineWidth = lw;
    g.strokeRect(r.x * s, r.y * s, r.w * s, r.h * s);
    const R = lw * 6;
    g.fillStyle = "#246fff"; g.beginPath(); g.arc(r.x * s, r.y * s, R, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#fff"; g.font = `bold ${R * 1.2}px sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(String(i + 1), r.x * s, r.y * s + 1);
  });
  return c;
}

// ---------- AI ----------
async function runRecognize(r) {
  r.busy = "recog"; renderBoxes(); renderEditor();
  try {
    r.recog = await recognize(state.settings, crop(r), annotated(1024).toDataURL("image/jpeg", 0.8));
    (r.recog.suggested_terms || []).forEach((id) => { if (TERM_INDEX[id] && !r.terms.includes(id)) r.terms.push(id); });
  } catch (err) { toast(err.message); }
  r.busy = ""; renderAll();
}
async function runVariants(r) {
  r.busy = "variants"; renderEditor();
  const intent = [
    ...r.terms.map((id) => "- " + TERM_INDEX[id].prompt.zh),
    r.text?.trim() ? "- 框内文字：" + r.text.trim() : "",
    r.note?.trim() ? "- 用户原话：" + r.note.trim() : "",
  ].filter(Boolean).join("\n");
  try {
    r.variants = await variants(state.settings, crop(r), intent, r.recog?.type_zh);
    r.chosen = null; r.fresh = true;
  } catch (err) { toast(err.message); }
  r.busy = ""; renderAll();
}

// ---------- 渲染 ----------
function renderAll() { renderBoxes(); renderTabs(); renderEditor(); renderPrompt(); renderPreview(); refreshTweaks(); saveState(); }

function renderBoxes() {
  overlay.querySelectorAll(".box:not(.drawing)").forEach((b) => b.remove());
  state.regions.forEach((r, i) => {
    const b = document.createElement("div");
    b.className = "box" + (r.id === state.selected ? " sel" : "") + (r.busy === "recog" ? " scanning" : "") + (r.id === justCreated ? " pop ripple" : "");
    b.innerHTML = `<span class="num">${i + 1}</span>` + (r.id === state.selected
      ? `<i class="h nw"></i><i class="h ne"></i><i class="h sw"></i><i class="h se"></i>` : "");
    if (r.id !== justCreated) b.querySelector(".num").style.animation = "none";
    place(b, r);
    b.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      if (state.selected !== r.id) { state.selected = r.id; renderAll(); return; }
      startBoxDrag(e, r);
    });
    overlay.appendChild(b);
  });
  justCreated = null;
}
function renderTabs() {
  $("#count").textContent = state.regions.length ? `${state.regions.length} 处` : "";
  const box = $("#regionTabs");
  const ids = state.regions.map((r) => r.id).join(",");
  const fresh = box.dataset.ids !== ids; box.dataset.ids = ids;
  box.innerHTML = state.regions.map((r, i) =>
    `<button class="tab ${r.id === state.selected ? "on" : ""}" data-id="${r.id}">${i + 1} · ${esc(r.recog?.type_zh || "区域")}</button>`).join("");
  if (!fresh) box.querySelectorAll(".tab").forEach((t) => t.style.animation = "none");
  box.querySelectorAll(".tab").forEach((t) => t.onclick = () => { state.selected = +t.dataset.id; renderAll(); });
}

function bump(el) { el.classList.remove("bump"); el.offsetWidth; el.classList.add("bump"); }
function syncChips(r) {
  $("#editor").querySelectorAll("[data-t]").forEach((c) => {
    const on = r.terms.includes(c.dataset.t);
    if (on !== c.classList.contains("on")) { c.classList.toggle("on", on); bump(c); }
  });
  $("#editor").querySelectorAll(".chip.quick").forEach((c) => {
    const on = QUICK[+c.dataset.q].terms.every((id) => r.terms.includes(id));
    if (on !== c.classList.contains("on")) { c.classList.toggle("on", on); bump(c); }
  });
}

// 把选中的方案贴回原截图：覆盖在对应区域上，滑块擦除对比改前改后。
// 结构类（横排↔竖排、列表↔网格）没有 AI 方案，改用本地重排预览，同一条对比条。
function renderPreview() {
  document.querySelectorAll(".preview-layer").forEach((n) => n.remove());
  const bar = $("#previewbar");
  const r = state.preview ? state.regions.find((x) => x.id === state.preview.regionId) : null;
  if (!r) { bar.hidden = true; return; }
  if (state.preview.localId) {
    const el = elementAtRegion(r);
    const spec = el ? structuralHtml(el, state.preview.localId === "v-row-to-col" ? "col" : "grid") : null;
    if (!spec) { bar.hidden = true; return; }
    const d = document.createElement("div");
    d.className = "preview-layer";
    d.innerHTML = `<iframe sandbox="" loading="lazy" srcdoc="${esc(`<!doctype html><meta charset=utf-8><body style='margin:0;background:transparent;font-family:-apple-system,PingFang SC,sans-serif'>${spec.html}</body>`)}"></iframe><i class="wipe"></i>`;
    place(d, r);
    d.style.height = (spec.height * 2 / state.image.h * 100) + "%"; // 重排比框高，按内容高度展开
    overlay.appendChild(d);
    bar.hidden = false;
    $("#pvTitle").textContent = `正在预览：「${TERM_INDEX[state.preview.localId]?.zh || ""}」（本地）`;
    applyWipe();
    return;
  }
  const v = r?.variants?.[state.preview.variantIdx];
  if (!r || !v) { bar.hidden = true; return; }
  const d = document.createElement("div");
  d.className = "preview-layer";
  d.innerHTML = `<iframe sandbox="" loading="lazy" srcdoc="${esc(`<!doctype html><meta charset=utf-8><body style='margin:0;background:transparent;font-family:-apple-system,PingFang SC,sans-serif'>${v.html || ""}</body>`)}"></iframe><i class="wipe"></i>`;
  place(d, r);
  overlay.appendChild(d);
  bar.hidden = false;
  $("#pvTitle").textContent = `正在预览：「${v.title}」`;
  applyWipe();
}
function applyWipe() {
  const p = state.wipe ?? 100;
  document.querySelectorAll(".preview-layer").forEach((d) => {
    d.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
    const w = d.querySelector(".wipe");
    if (w) w.style.left = p + "%";
  });
  const range = $("#wipeRange");
  if (range) range.value = p;
  const lab = $("#wipeLabel");
  if (lab) lab.textContent = p + "%";
}
$("#wipeRange").addEventListener("input", (e) => { state.wipe = +e.target.value; applyWipe(); });
$("#pvClose").onclick = () => { state.preview = null; renderPreview(); };

function renderEditor() {
  const r = current(); const ed = $("#editor");
  if (!r) {
    ed.dataset.rid = ""; ed.className = "";
    ed.innerHTML = `<div class="placeholder"><div class="ico"></div>${state.image ? "在左侧截图上按住拖拽，<br>圈出第一个想改的地方。" : "还没有截图。<br>上传一张，或者先看看示例。"}</div>`;
    return;
  }
  const animate = ed.dataset.rid !== String(r.id);
  ed.dataset.rid = r.id;
  ed.className = animate ? "animate" : "";
  const prevDetails = ed.querySelector("#vocabDetails");
  const vocabOpen = prevDetails?.open || false;
  const vocabQ = prevDetails?.querySelector("#vocabSearch")?.value || "";
  const ai = hasModel(state.settings);
  const suggested = new Set(r.recog?.suggested_terms || []);
  let i = 0; const R = () => `class="rise" style="--i:${i++}"`;

  const recogHTML = r.busy === "recog"
    ? `<div class="skel w60"></div><div class="skel w90"></div><div class="skel w75"></div>`
    : r.recog
      ? `<div class="type">${esc(r.recog.type_zh)}<span>${esc(r.recog.type_en || "")}</span></div>
         <div class="desc">${esc(r.recog.description)}</div>
         ${(r.recog.issues || []).length ? `<ul class="issues">${r.recog.issues.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}`
      : `<div class="desc">${ai ? "让 AI 认一认这是什么、哪里不对。" : "在 ⚙ 里填入模型，即可自动识别元素并推荐修改方向。"}</div>`;

  const variantsHTML = r.busy === "variants"
    ? [0, 1, 2].map((k) => `<div class="variant skeleton" style="--i:${k}"><div class="skel w60"></div><div class="skel w90"></div></div>`).join("")
    : r.variants.map((v, k) => `
      <div class="variant ${r.fresh ? "fresh" : ""} ${r.chosen === k ? "on" : ""}" data-v="${k}" style="--i:${k}">
        <iframe sandbox="" loading="lazy" srcdoc="${esc(`<!doctype html><meta charset=utf-8><body style='margin:0;padding:14px;font-family:-apple-system,PingFang SC,sans-serif;background:#f3f2f7'>${v.html || ""}</body>`)}"></iframe>
        <div class="vbody"><div class="vmeta"><b>${esc(v.title)}</b><div>${esc(v.summary)}</div></div>
        <button class="btn sm ${r.chosen === k ? "primary" : ""}"><span>${r.chosen === k ? "✓ 已选用 · 图上预览中" : "选这个"}</span></button></div>
      </div>`).join("");
  r.fresh = false;

  ed.innerHTML = `
    <div ${R()}><div class="recog">${recogHTML}
      <div class="row" style="margin-top:6px">
        <button class="btn sm" id="recogBtn" ${ai && r.busy !== "recog" ? "" : "disabled"}><span>${r.busy === "recog" ? "识别中…" : r.recog ? "重新识别" : "✦ AI 识别"}</span></button>
        <button class="btn sm danger" id="delBtn"><span>删除此框</span></button>
      </div></div></div>

    <div ${R()}><h4>框的位置 <span class="muted">拖框可移动 · 拖四角可缩放 · 方向键微调</span></h4>
    <div class="coords">
      ${[["x", "X"], ["y", "Y"], ["w", "宽"], ["h", "高"]].map(([k, lab]) => `<label>${lab}<input type="number" data-coord="${k}" value="${Math.round(r[k])}" min="0"></label>`).join("")}
    </div></div>

    <div ${R()}><h4>一句话方向 <span class="muted">不懂术语就点这里 · 再点取消</span></h4>
    <div class="chips">${QUICK.map((q, k) => `<button class="chip quick ${q.terms.every((id) => r.terms.includes(id)) ? "on" : ""}" data-q="${k}">${q.zh}</button>`).join("")}</div></div>

    <div ${R()}><h4>一眼对比 <span class="muted">${state.isDemo ? "点一下，图上直接变，也写进提示词" : "点一下，前 → 后就写进提示词"}</span></h4>
    <div class="vsgrid">${VISUAL.map((v) => `<button class="vs ${r.terms.includes(v.id) ? "on" : ""} ${suggested.has(v.id) ? "star" : ""}" data-t="${v.id}" title="${esc(v.prompt.zh)}">
      <span class="pair"><span class="fr">${v.before}</span><span class="arr">→</span><span class="fr">${v.after}</span></span>
      <span class="vl">${v.zh}</span></button>`).join("")}</div></div>

    <div ${R()}><details class="vocab-details" id="vocabDetails" ${vocabOpen ? "open" : ""}>
      <summary>设计词典 <span class="muted">27 个词条 · 悬停看白话 · ✦ AI 推荐</span></summary>
      <input id="vocabSearch" placeholder="搜词条，如：圆角、投影、留白…" value="${esc(vocabQ)}">
      ${VOCAB.map((cat) => `
      <div class="cat" data-cat><div class="catname">${cat.zh}</div><div class="chips">
        ${cat.terms.map((t) => `<button class="chip ${r.terms.includes(t.id) ? "on" : ""} ${suggested.has(t.id) ? "star" : ""}" data-t="${t.id}" data-tip="${esc(t.hint)}">${t.zh}</button>`).join("")}
      </div></div>`).join("")}
    </details></div>

    <div ${R()}><h4>用你自己的话补充</h4>
    <input id="regionText" placeholder="框里的文字，如：立即预订（帮 AI 在代码里定位）" value="${esc(r.text || "")}">
    <textarea id="note" rows="2" placeholder="比如：这个底栏看起来很廉价，想要像苹果那样">${esc(r.note)}</textarea></div>

    <div ${R()}><h4>三个方案预览 <span class="muted">选一个，直接贴到原图上对比</span></h4>
    <div class="row" style="margin-top:0">
      <button class="btn ${ai ? "primary" : ""}" id="varBtn" ${ai && r.busy !== "variants" ? "" : "disabled"}><span>${r.busy === "variants" ? "正在设计 3 个方案…" : r.variants.length ? "↻ 重新生成" : "✦ 生成 3 个方案"}</span></button>
      ${ai ? "" : `<span class="muted small">需要先在 ⚙ 填写模型</span>`}
    </div>
    <div class="variants">${variantsHTML}</div></div>
  `;
  ed.querySelectorAll("[data-t]").forEach((c) => c.onclick = () => {
    const id = c.dataset.t;
    let added = false;
    if (!r.terms.includes(id)) {
      // 互斥方向自动取消相反的那一个，不让提示词自相矛盾
      for (const [a, b] of CONFLICTS) {
        const other = a === id ? b : b === id ? a : null;
        if (other && r.terms.includes(other)) {
          r.terms = r.terms.filter((x) => x !== other);
          toast(`已取消相反的「${TERM_INDEX[other]?.zh || other}」`);
        }
      }
      r.terms = [...r.terms, id];
      added = true;
    } else {
      r.terms = r.terms.filter((x) => x !== id);
    }
    syncChips(r); renderPrompt();
    // 结构类：本地重排预览（不动像素，改布局）
    if (STRUCTURAL.includes(id)) {
      if (added) {
        const el = elementAtRegion(r);
        const layout = id === "v-row-to-col" ? "col" : "grid";
        if (el && structuralHtml(el, layout)) {
          state.preview = { regionId: r.id, localId: id };
          state.wipe = 100;
        } else {
          if (state.preview?.localId === id && state.preview?.regionId === r.id) state.preview = null;
          toast(`「${TERM_INDEX[id]?.zh}」对这个元素没有可换的布局，已写进提示词`);
        }
      } else if (state.preview?.localId === id && state.preview?.regionId === r.id) {
        state.preview = null;
      }
      renderPreview();
      return;
    }
    // 参数类：内置示例上直接画出来；这个元素上看不出变化时说一声，提示词照样记
    if (LIVE[id]) {
      const changed = refreshTweaks();
      if (added && state.isDemo && !changed) toast(`「${TERM_INDEX[id]?.zh}」在这个元素上看不出变化，已写进提示词`);
      return;
    }
    refreshTweaks();
  });
  ed.querySelectorAll(".chip.quick").forEach((c) => c.onclick = () => {
    bump(c);
    const q = QUICK[+c.dataset.q];
    const all = q.terms.every((id) => r.terms.includes(id));
    r.terms = all
      ? r.terms.filter((id) => !q.terms.includes(id))
      : [...r.terms, ...q.terms.filter((id) => !r.terms.includes(id))];
    syncChips(r); renderPrompt(); refreshTweaks();
  });
  ed.querySelectorAll("[data-coord]").forEach((inp) => inp.onchange = () => {
    const k = inp.dataset.coord;
    let v = Math.max(0, +inp.value || 0);
    if (k === "w" || k === "h") v = Math.max(8, v);
    if (k === "x") v = clamp(v, 0, state.image.w - r.w);
    if (k === "y") v = clamp(v, 0, state.image.h - r.h);
    if (k === "w") v = clamp(v, 8, state.image.w - r.x);
    if (k === "h") v = clamp(v, 8, state.image.h - r.y);
    r[k] = Math.round(v);
    renderAll();
  });
  const applyVocabFilter = (q) => {
    const query = q.trim().toLowerCase();
    ed.querySelectorAll(".vocab-details [data-t]").forEach((c) => {
      const t = TERM_INDEX[c.dataset.t];
      const hay = `${t?.zh || ""} ${t?.en || ""} ${t?.hint || ""}`.toLowerCase();
      c.style.display = !query || hay.includes(query) ? "" : "none";
    });
    ed.querySelectorAll(".vocab-details [data-cat]").forEach((cat) => {
      cat.style.display = [...cat.querySelectorAll("[data-t]")].some((c) => c.style.display !== "none") ? "" : "none";
    });
  };
  const vs = ed.querySelector("#vocabSearch");
  if (vs) {
    vs.oninput = () => applyVocabFilter(vs.value);
    if (vocabQ) applyVocabFilter(vocabQ);
  }
  ed.querySelector("#regionText").oninput = (e) => { r.text = e.target.value; renderPrompt(false); saveState(); };
  ed.querySelector("#note").oninput = (e) => { r.note = e.target.value; renderPrompt(false); saveState(); };
  ed.querySelector("#recogBtn").onclick = () => runRecognize(r);
  ed.querySelector("#delBtn").onclick = () => removeRegion(r.id);
  ed.querySelector("#varBtn").onclick = () => runVariants(r);
  ed.querySelectorAll(".variant[data-v]").forEach((v) => v.querySelector("button").onclick = () => {
    const k = +v.dataset.v;
    r.chosen = r.chosen === k ? null : k;
    if (r.chosen != null) { state.preview = { regionId: r.id, variantIdx: r.chosen }; state.wipe = 100; }
    else if (state.preview?.regionId === r.id) state.preview = null;
    renderEditor(); renderPrompt(); renderPreview();
  });
}

function renderPrompt(flash = true) {
  const has = state.regions.some((r) => r.terms.length || r.note?.trim() || r.text?.trim() || r.chosen != null);
  const next = has ? buildPrompt(state, state.lang) : "";
  const ta = $("#prompt");
  if (ta.value === next) return;
  ta.value = next;
  if (flash && next) { const w = ta.parentElement; w.classList.remove("flash"); w.offsetWidth; w.classList.add("flash"); }
}

// ---------- 输出 ----------
function moveThumb() {
  const on = $("#seg .on"), th = $(".seg-thumb");
  if (!on || !th) return;
  th.style.width = on.offsetWidth + "px"; th.style.transform = `translateX(${on.offsetLeft - 3}px)`;
}
document.querySelectorAll("#seg button").forEach((b) => b.onclick = () => {
  state.lang = b.dataset.lang;
  document.querySelectorAll("#seg button").forEach((x) => x.classList.toggle("on", x === b));
  moveThumb(); renderPrompt();
});
requestAnimationFrame(moveThumb);
$("#copy").onclick = async () => {
  const t = $("#prompt").value;
  if (!t) return toast("先圈选并选一个修改方向");
  try { await navigator.clipboard.writeText(t); } catch { const ta = $("#prompt"); ta.select(); document.execCommand("copy"); ta.setSelectionRange(0, 0); ta.blur(); }
  const btn = $("#copy"); btn.classList.add("done");
  setTimeout(() => btn.classList.remove("done"), 1600);
};
function downloadAnnotated() {
  if (!state.image) return toast("还没有截图");
  annotated().toBlob((blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "dianjing-annotated.png"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
}
$("#download").onclick = downloadAnnotated;
$("#copyBoth").onclick = async () => {
  const t = $("#prompt").value;
  if (!t) return toast("先圈选并选一个修改方向");
  const blob = await new Promise((res) => annotated().toBlob(res));
  try {
    const item = new ClipboardItem({
      "text/plain": new Blob([t], { type: "text/plain" }),
      "image/png": blob,
    });
    await navigator.clipboard.write([item]);
    toast("已复制提示词与标注图，粘贴到 AI 工具里");
  } catch {
    try { await navigator.clipboard.writeText(t); } catch { /* ignore */ }
    downloadAnnotated();
    toast("已复制提示词，标注图已下载（当前浏览器不支持图文同贴）");
  }
};
$("#clearAll").onclick = () => {
  if (!state.image) return;
  if (confirm("清空当前截图和所有圈选？")) { clearWorkspace(); toast("已清空"); }
};

// ---------- 设置 ----------
const dlg = $("#settings");
$("#provider").innerHTML = `<option value="">自定义</option>` + PROVIDERS.map((p, i) => `<option value="${i}">${p.name}</option>`).join("");
$("#provider").onchange = (e) => {
  const p = PROVIDERS[+e.target.value]; if (!p) return;
  $("#baseUrl").value = p.baseUrl; $("#model").value = p.model;
};
$("#settingsBtn").onclick = () => {
  const s = state.settings;
  $("#baseUrl").value = s.baseUrl || ""; $("#model").value = s.model || ""; $("#apiKey").value = s.apiKey || "";
  $("#provider").value = String(PROVIDERS.findIndex((p) => p.baseUrl === s.baseUrl)).replace("-1", "");
  dlg.showModal();
};
$("#saveSettings").onclick = () => {
  state.settings = { baseUrl: $("#baseUrl").value.trim(), model: $("#model").value.trim(), apiKey: $("#apiKey").value.trim() };
  saveSettings(state.settings);
  toast(hasModel(state.settings) ? "已保存，AI 功能已开启" : "已保存");
  updateDot(); renderEditor();
};
function updateDot() { $("#aiDot").classList.toggle("on", hasModel(state.settings)); }
updateDot();

// 卡片边缘跟随鼠标的高光
document.addEventListener("pointermove", (e) => {
  document.querySelectorAll(".card").forEach((c) => {
    const b = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - b.left + "px");
    c.style.setProperty("--my", e.clientY - b.top + "px");
  });
});

let toastTimer;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

document.body.classList.add("no-image");
const restored = loadSaved();
if (restored) setTimeout(() => toast("已恢复上次的圈选"), 400);
renderAll();
