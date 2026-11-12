// 把圈选区域 + 设计术语 + 选定方案，组装成给 AI 编程工具的提示词。
import { TERM_INDEX } from "./vocab.js";

export function locate(r, W, H, lang) {
  const cx = (r.x + r.w / 2) / W, cy = (r.y + r.h / 2) / H;
  const v = cy < 0.25 ? 0 : cy > 0.75 ? 2 : 1;
  const h = cx < 0.33 ? 0 : cx > 0.67 ? 2 : 1;
  const zh = [["左上", "顶部中间", "右上"], ["左侧", "中部", "右侧"], ["左下", "底部中间", "右下"]];
  const en = [["top-left", "top-center", "top-right"], ["middle-left", "center", "middle-right"], ["bottom-left", "bottom-center", "bottom-right"]];
  const fullWidth = r.w / W > 0.85;
  if (lang === "en") return fullWidth ? `full-width, ${["top", "middle", "bottom"][v]} of the screen` : en[v][h];
  return fullWidth ? `${["顶部", "中部", "底部"][v]}通栏` : zh[v][h];
}

export function buildPrompt(state, lang = "zh") {
  const { regions, image } = state;
  const W = image?.w || 1, H = image?.h || 1;
  const L = lang === "en";
  // 只有提了方向的区域才写进提示词（空框不写，避免给 AI 塞噪音）；
  // 标题保留它在标注图上的原始编号，两边才对得上。
  const active = regions
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => r.terms.length || r.note?.trim() || r.chosen != null || r.text?.trim());
  const out = [];
  out.push(L ? "# UI change request" : "# UI 修改请求");
  out.push(L
    ? `I marked ${active.length} element(s) on a ${W}×${H}px screenshot (attached as an annotated image; numbers match the boxes). Change ONLY these elements, keep everything else as is, and reuse the project's existing design tokens/components.`
    : `我在一张 ${W}×${H}px 的界面截图上标出了 ${active.length} 处要改的地方（标注图已附上，编号与框对应）。只修改这些元素，其余保持不变，并优先复用项目里已有的设计变量和组件。`);

  active.forEach(({ r, i }) => {
    out.push("");
    const type = L ? (r.recog?.type_en || "element") : (r.recog?.type_zh || "元素");
    out.push(`## ${i + 1}. ${type} — ${locate(r, W, H, lang)}`);
    out.push(L
      ? `- Box: x=${Math.round(r.x)}, y=${Math.round(r.y)}, w=${Math.round(r.w)}, h=${Math.round(r.h)} (px on the screenshot)`
      : `- 位置：x=${Math.round(r.x)}, y=${Math.round(r.y)}, 宽 ${Math.round(r.w)}, 高 ${Math.round(r.h)}（截图像素）`);
    if (r.recog?.description) out.push((L ? "- Currently: " : "- 现状：") + r.recog.description);
    if (r.text?.trim()) out.push((L ? "- Text in the region: " : "- 框内文字：") + r.text.trim());
    const terms = r.terms.map((id) => TERM_INDEX[id]).filter(Boolean);
    if (terms.length) {
      out.push(L ? "- Desired changes:" : "- 期望修改：");
      terms.forEach((t) => out.push(`  - ${t.prompt[lang]}`));
    }
    if (r.note?.trim()) out.push((L ? "- In my words: " : "- 我的原话：") + r.note.trim());
    const v = r.variants?.[r.chosen];
    if (v) {
      out.push((L ? `- Chosen direction: "${v.title}" — ` : `- 选定方案：「${v.title}」— `) + (v.summary || ""));
      (v.changes || []).forEach((c) => out.push(`  - ${c}`));
    }
  });

  out.push("");
  out.push(L
    ? "Before editing, find the component that renders each element (match by text and position). After editing, briefly list the files you changed."
    : "动手前先根据文字和位置找到渲染每个元素的组件；改完后简要列出你改了哪些文件。");
  return out.join("\n");
}
