// 任意 OpenAI 兼容的视觉模型接口（自带 Key，Key 只存在你自己的浏览器 localStorage）。
import { VOCAB } from "./vocab.js";

export const PROVIDERS = [
  { name: "OpenAI", baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini" },
  { name: "通义千问 (DashScope)", baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1", model: "qwen-vl-max" },
  { name: "智谱 GLM", baseUrl: "https://open.bigmodel.cn/api/paas/v4", model: "glm-4v-flash" },
  { name: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", model: "openai/gpt-4o-mini" },
  { name: "Gemini (OpenAI 兼容)", baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai", model: "gemini-2.0-flash" },
  { name: "本地 Ollama", baseUrl: "http://localhost:11434/v1", model: "llava" },
];

const KEY = "dianjing.settings";
export function loadSettings() {
  try { return { ...PROVIDERS[0], apiKey: "", ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { return { ...PROVIDERS[0], apiKey: "" }; }
}
export function saveSettings(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
export function hasModel(s) { return !!(s.baseUrl && s.model && (s.apiKey || /localhost|127\.0\.0\.1/.test(s.baseUrl))); }

async function chat(settings, messages) {
  const res = await fetch(settings.baseUrl.replace(/\/$/, "") + "/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(settings.apiKey ? { Authorization: "Bearer " + settings.apiKey } : {}),
    },
    body: JSON.stringify({ model: settings.model, messages, temperature: 0.7 }),
  });
  if (!res.ok) throw new Error(`模型接口返回 ${res.status}：${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export function parseJSON(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("模型没有返回 JSON：" + text.slice(0, 200));
  return JSON.parse(body.slice(start, end + 1));
}

const termList = () => VOCAB.flatMap((c) => c.terms.map((t) => `${t.id}: ${t.zh} / ${t.en}`)).join("\n");

// 1) 识别：这块区域是什么、现在长什么样、可能需要改什么
export async function recognize(settings, cropDataUrl, contextDataUrl) {
  const text = `你是资深 UI/UX 设计师。第一张图是用户在界面截图中圈出的区域，第二张图是整页截图（用于理解上下文）。
请识别圈出的元素，返回严格 JSON：
{
  "type_zh": "元素类型（如：底部导航栏、主按钮、商品卡片）",
  "type_en": "element type in English",
  "description": "一句话描述它当前的视觉样式（颜色、尺寸、圆角、文字、布局）",
  "issues": ["从设计角度看，它最可能的 1-3 个问题，用简短中文"],
  "suggested_terms": ["从下面词表中挑 2-4 个最合适的 id"]
}
词表：
${termList()}`;
  const content = [{ type: "text", text }, { type: "image_url", image_url: { url: cropDataUrl } }];
  if (contextDataUrl) content.push({ type: "image_url", image_url: { url: contextDataUrl } });
  return parseJSON(await chat(settings, [{ role: "user", content }]));
}

// 2) 多版本：按用户意图生成 3 个可预览的变体（自包含 HTML 片段）
export async function variants(settings, cropDataUrl, intentText, typeHint) {
  const text = `你是资深 UI 设计师兼前端工程师。图中是界面上的一个元素${typeHint ? `（${typeHint}）` : ""}。
用户想这样修改：
${intentText || "（用户没写具体要求，请给出 3 个不同方向的改进）"}

请给出 3 个风格明显不同、但都满足要求的方案，返回严格 JSON：
{
  "variants": [
    {
      "title": "方案名（4-8 个字）",
      "summary": "一句话说明这个方案的思路",
      "changes": ["具体改动，写成可执行的设计/CSS 语言，如：圆角 8px→16px"],
      "html": "一段自包含 HTML，只用内联 style，尽量还原图中元素的内容和文字，并应用该方案的修改；宽度 100%，不要 <script>，不要外部资源"
    }
  ]
}`;
  const out = parseJSON(await chat(settings, [{ role: "user", content: [{ type: "text", text }, { type: "image_url", image_url: { url: cropDataUrl } }] }]));
  return (out.variants || []).slice(0, 3);
}
