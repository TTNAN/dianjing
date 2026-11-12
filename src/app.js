import { VOCAB, QUICK, TERM_INDEX } from "./vocab.js";
import { buildPrompt } from "./prompt.js";
import { PROVIDERS, loadSettings, saveSettings, hasModel, recognize, variants } from "./llm.js";
import { demoDataUrl } from "./demo.js";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const state = {
  image: null,          // { src, w, h }
  regions: [],          // { id, x, y, w, h, terms:[], note, recog, variants:[], chosen, busy }
  selected: null,
  lang: "zh",
  settings: loadSettings(),
};
let nextId = 1;
let justCreated = null;

// ---------- 图片载入 ----------
function loadImage(src) {
  const img = new Image();
  img.onload = () => {
    // SVG 等矢量图先栅格化为 PNG，保证后续裁剪/导出一致
    let finalSrc = src, w = img.naturalWidth, h = img.naturalHeight;
    if (src.startsWith("data:image/svg")) {
      const c = document.createElement("canvas");
      c.width = w * 2; c.height = h * 2;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      finalSrc = c.toDataURL("image/png"); w = c.width; h = c.height;
    }
    state.image = { src: finalSrc, w, h };
    state.regions = []; state.selected = null; nextId = 1;
    $("#shot").src = finalSrc;
    $("#empty").hidden = true;
    const cv = $("#canvas"); cv.hidden = false; cv.style.animation = "none"; cv.offsetHeight; cv.style.animation = "";
    $("#hint").classList.remove("gone");
    renderAll();
  };
  img.onerror = () => toast("图片读取失败");
  img.src = src;
}
function loadFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const r = new FileReader();
  r.onload = () => loadImage(r.result);
  r.readAsDataURL(file);
}

["#file", "#file2"].forEach((id) => $(id).addEventListener("change", (e) => loadFile(e.target.files[0])));
["#demo", "#demo2"].forEach((id) => $(id).addEventListener("click", () => loadImage(demoDataUrl())));
window.addEventListener("paste", (e) => {
  const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
  if (item) loadFile(item.getAsFile());
});
const stage = $("#stage");
stage.addEventListener("dragover", (e) => { e.preventDefault(); stage.classList.add("drag"); });
stage.addEventListener("dragleave", () => stage.classList.remove("drag"));
stage.addEventListener("drop", (e) => { e.preventDefault(); stage.classList.remove("drag"); loadFile(e.dataTransfer.files[0]); });

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
  if (!state.image || e.target.closest(".box")) return;
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
  const region = { id: nextId++, ...r, terms: [], note: "", recog: null, variants: [], chosen: null, busy: "" };
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
window.addEventListener("keydown", (e) => {
  if ((e.key === "Delete" || e.key === "Backspace") && state.selected && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) removeRegion(state.selected);
});
function removeRegion(id) {
  state.regions = state.regions.filter((r) => r.id !== id);
  state.selected = state.regions.at(-1)?.id ?? null;
  renderAll();
}
const current = () => state.regions.find((r) => r.id === state.selected);

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
    g.strokeStyle = "#ff3b6b"; g.lineWidth = lw;
    g.strokeRect(r.x * s, r.y * s, r.w * s, r.h * s);
    const R = lw * 6;
    g.fillStyle = "#ff3b6b"; g.beginPath(); g.arc(r.x * s, r.y * s, R, 0, Math.PI * 2); g.fill();
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
    r.note?.trim() ? "- 用户原话：" + r.note.trim() : "",
  ].filter(Boolean).join("\n");
  try {
    r.variants = await variants(state.settings, crop(r), intent, r.recog?.type_zh);
    r.chosen = null; r.fresh = true;
  } catch (err) { toast(err.message); }
  r.busy = ""; renderAll();
}

// ---------- 渲染 ----------
function renderAll() { renderBoxes(); renderTabs(); renderEditor(); renderPrompt(); }

function renderBoxes() {
  overlay.querySelectorAll(".box:not(.drawing)").forEach((b) => b.remove());
  state.regions.forEach((r, i) => {
    const b = document.createElement("div");
    b.className = "box" + (r.id === state.selected ? " sel" : "") + (r.busy === "recog" ? " scanning" : "") + (r.id === justCreated ? " pop ripple" : "");
    b.innerHTML = `<span class="num">${i + 1}</span>`;
    if (r.id !== justCreated) b.querySelector(".num").style.animation = "none";
    place(b, r);
    b.addEventListener("pointerdown", (e) => { e.stopPropagation(); if (state.selected !== r.id) { state.selected = r.id; renderAll(); } });
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
  $("#editor").querySelectorAll(".chip[data-t]").forEach((c) => {
    const on = r.terms.includes(c.dataset.t);
    if (on !== c.classList.contains("on")) { c.classList.toggle("on", on); bump(c); }
  });
}

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
        <button class="btn sm ${r.chosen === k ? "primary" : ""}"><span>${r.chosen === k ? "✓ 已选用" : "选这个"}</span></button></div>
      </div>`).join("");
  r.fresh = false;

  ed.innerHTML = `
    <div ${R()}><div class="recog">${recogHTML}
      <div class="row" style="margin-top:6px">
        <button class="btn sm" id="recogBtn" ${ai && r.busy !== "recog" ? "" : "disabled"}><span>${r.busy === "recog" ? "识别中…" : r.recog ? "重新识别" : "✦ AI 识别"}</span></button>
        <button class="btn sm danger" id="delBtn"><span>删除此框</span></button>
      </div></div></div>

    <div ${R()}><h4>一句话方向 <span class="muted">不懂术语就点这里</span></h4>
    <div class="chips">${QUICK.map((q, k) => `<button class="chip quick" data-q="${k}">${q.zh}</button>`).join("")}</div></div>

    <div ${R()}><h4>设计词典 <span class="muted">悬停看白话 · ✦ AI 推荐</span></h4></div>
    ${VOCAB.map((cat) => `
      <div ${R()}><div class="cat"><div class="catname">${cat.zh}</div><div class="chips">
        ${cat.terms.map((t) => `<button class="chip ${r.terms.includes(t.id) ? "on" : ""} ${suggested.has(t.id) ? "star" : ""}" data-t="${t.id}" data-tip="${esc(t.hint)}">${t.zh}</button>`).join("")}
      </div></div></div>`).join("")}

    <div ${R()}><h4>用你自己的话补充</h4>
    <textarea id="note" rows="2" placeholder="比如：这个底栏看起来很廉价，想要像苹果那样">${esc(r.note)}</textarea></div>

    <div ${R()}><h4>三个方案预览</h4>
    <div class="row" style="margin-top:0">
      <button class="btn ${ai ? "primary" : ""}" id="varBtn" ${ai && r.busy !== "variants" ? "" : "disabled"}><span>${r.busy === "variants" ? "正在设计 3 个方案…" : r.variants.length ? "↻ 重新生成" : "✦ 生成 3 个方案"}</span></button>
      ${ai ? "" : `<span class="muted small">需要先在 ⚙ 填写模型</span>`}
    </div>
    <div class="variants">${variantsHTML}</div></div>
  `;
  ed.querySelectorAll(".chip[data-t]").forEach((c) => c.onclick = () => {
    const id = c.dataset.t;
    r.terms = r.terms.includes(id) ? r.terms.filter((x) => x !== id) : [...r.terms, id];
    syncChips(r); renderPrompt();
  });
  ed.querySelectorAll(".chip.quick").forEach((c) => c.onclick = () => {
    bump(c);
    QUICK[+c.dataset.q].terms.forEach((id) => { if (!r.terms.includes(id)) r.terms.push(id); });
    syncChips(r); renderPrompt();
  });
  ed.querySelector("#note").oninput = (e) => { r.note = e.target.value; renderPrompt(false); };
  ed.querySelector("#recogBtn").onclick = () => runRecognize(r);
  ed.querySelector("#delBtn").onclick = () => removeRegion(r.id);
  ed.querySelector("#varBtn").onclick = () => runVariants(r);
  ed.querySelectorAll(".variant[data-v]").forEach((v) => v.querySelector("button").onclick = () => {
    const k = +v.dataset.v; r.chosen = r.chosen === k ? null : k; renderEditor(); renderPrompt();
  });
}

function renderPrompt(flash = true) {
  const has = state.regions.some((r) => r.terms.length || r.note?.trim() || r.chosen != null);
  const next = has ? buildPrompt(state, state.lang) : "";
  const ta = $("#prompt");
  if (ta.value === next) return;
  ta.value = next;
  if (flash && next) { const w = ta.parentElement; w.classList.remove("flash"); w.offsetWidth; w.classList.add("flash"); }
}

// ---------- 输出 ----------
function moveThumb() {
  const on = $("#seg .on"), th = $(".seg-thumb");
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
$("#download").onclick = () => {
  if (!state.image) return toast("还没有截图");
  annotated().toBlob((blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "dianjing-annotated.png"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
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

renderAll();
