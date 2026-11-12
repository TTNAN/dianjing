// 内置示例：一张"AI 生成的旅行 App"首页，打开即可试圈。
export const DEMO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844" font-family="-apple-system, 'SF Pro Display', 'PingFang SC', 'Microsoft YaHei', sans-serif">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#2b1b5a"/><stop offset=".45" stop-color="#8e4fb8"/><stop offset=".8" stop-color="#ff7a8a"/><stop offset="1" stop-color="#ffb38a"/></linearGradient>
  <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fe3e0"/><stop offset="1" stop-color="#1e8fb3"/></linearGradient>
  <linearGradient id="kyoto" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd7a8"/><stop offset="1" stop-color="#e8796b"/></linearGradient>
  <linearGradient id="ava" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8fb1"/><stop offset="1" stop-color="#8b6cff"/></linearGradient>
  <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#2b1b5a" flood-opacity=".14"/></filter>
  <filter id="sh2" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity=".08"/></filter>
  <clipPath id="hero"><rect x="20" y="300" width="350" height="230" rx="28"/></clipPath>
  <clipPath id="c1"><rect x="20" y="594" width="167" height="112" rx="20"/></clipPath>
  <clipPath id="c2"><rect x="203" y="594" width="167" height="112" rx="20"/></clipPath>
</defs>
<rect width="390" height="844" fill="#f7f5f2"/>
<text x="32" y="38" font-size="15" font-weight="600" fill="#1a1a1a">9:41</text>
<rect x="330" y="28" width="26" height="12" rx="3.5" fill="none" stroke="#1a1a1a" stroke-width="1.2"/><rect x="332.5" y="30.5" width="18" height="7" rx="1.5" fill="#1a1a1a"/>

<text x="24" y="92" font-size="14" fill="#8a8794">早上好 👋</text>
<text x="24" y="128" font-size="28" font-weight="800" fill="#16151c">去哪里走走？</text>
<circle cx="342" cy="104" r="22" fill="url(#ava)"/><text x="342" y="110" font-size="16" font-weight="700" fill="#fff" text-anchor="middle">C</text>

<rect x="20" y="152" width="290" height="52" rx="18" fill="#fff" filter="url(#sh2)"/>
<circle cx="47" cy="176" r="7" fill="none" stroke="#9a97a6" stroke-width="2"/><line x1="52" y1="181" x2="57" y2="186" stroke="#9a97a6" stroke-width="2" stroke-linecap="round"/>
<text x="68" y="183" font-size="14" fill="#a8a5b3">搜索目的地、酒店、体验</text>
<rect x="318" y="152" width="52" height="52" rx="18" fill="#16151c"/>
<g stroke="#fff" stroke-width="2" stroke-linecap="round"><line x1="334" y1="170" x2="354" y2="170"/><line x1="334" y1="178" x2="354" y2="178"/><line x1="334" y1="186" x2="354" y2="186"/></g>
<circle cx="340" cy="170" r="3" fill="#16151c" stroke="#fff" stroke-width="2"/><circle cx="349" cy="186" r="3" fill="#16151c" stroke="#fff" stroke-width="2"/>

<g font-size="13" font-weight="600">
  <rect x="20" y="224" width="62" height="38" rx="19" fill="#16151c"/><text x="51" y="248" fill="#fff" text-anchor="middle">全部</text>
  <rect x="90" y="224" width="74" height="38" rx="19" fill="#fff" stroke="#ebe8e4"/><text x="127" y="248" fill="#4a4856" text-anchor="middle">🏝 海岛</text>
  <rect x="172" y="224" width="74" height="38" rx="19" fill="#fff" stroke="#ebe8e4"/><text x="209" y="248" fill="#4a4856" text-anchor="middle">🏔 雪山</text>
  <rect x="254" y="224" width="74" height="38" rx="19" fill="#fff" stroke="#ebe8e4"/><text x="291" y="248" fill="#4a4856" text-anchor="middle">🏯 古镇</text>
  <rect x="336" y="224" width="74" height="38" rx="19" fill="#fff" stroke="#ebe8e4"/><text x="373" y="248" fill="#4a4856" text-anchor="middle">🌃 城市</text>
</g>

<g filter="url(#sh)">
<g clip-path="url(#hero)">
  <rect x="20" y="300" width="350" height="230" fill="url(#sky)"/>
  <g fill="#fff" opacity=".9"><circle cx="70" cy="330" r="1.2"/><circle cx="120" cy="318" r="1"/><circle cx="210" cy="336" r="1.4"/><circle cx="300" cy="322" r="1"/><circle cx="160" cy="350" r=".9"/><circle cx="250" cy="312" r="1.1"/></g>
  <path d="M20 360 C 90 330, 140 380, 210 345 S 330 330, 370 352 L370 380 C 300 360, 240 395, 170 372 S 60 370, 20 392 Z" fill="#7dffc4" opacity=".35"/>
  <circle cx="300" cy="420" r="26" fill="#ffd9a8" opacity=".9"/>
  <path d="M20 470 L95 400 L140 440 L205 375 L270 445 L310 415 L370 460 L370 530 L20 530 Z" fill="#3a2366" opacity=".85"/>
  <path d="M20 500 L80 455 L150 490 L220 440 L300 495 L370 470 L370 530 L20 530 Z" fill="#1f1340"/>
  <rect x="20" y="300" width="350" height="230" fill="url(#fade)"/>
</g>
<rect x="36" y="316" width="62" height="28" rx="14" fill="#fff" fill-opacity=".22" stroke="#fff" stroke-opacity=".35"/>
<text x="67" y="335" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">★ 4.9</text>
<circle cx="338" cy="330" r="18" fill="#fff" fill-opacity=".22" stroke="#fff" stroke-opacity=".35"/>
<path d="M338 338 l-7-7a4.2 4.2 0 0 1 7-4.6a4.2 4.2 0 0 1 7 4.6z" fill="#fff"/>
<text x="38" y="470" font-size="13" fill="#fff" fill-opacity=".8">冰岛 · 雷克雅未克</text>
<text x="38" y="498" font-size="22" font-weight="800" fill="#fff">追一场极光</text>
<text x="38" y="518" font-size="12" fill="#fff" fill-opacity=".8">7 天 6 晚 · ¥8,999 起</text>
<rect x="262" y="482" width="92" height="34" rx="17" fill="#fff"/>
<text x="308" y="504" font-size="13" font-weight="700" fill="#16151c" text-anchor="middle">立即预订</text>
</g>

<text x="24" y="572" font-size="19" font-weight="800" fill="#16151c">热门目的地</text>
<text x="366" y="572" font-size="13" fill="#8b6cff" text-anchor="end" font-weight="600">查看全部 →</text>

<g filter="url(#sh2)">
  <rect x="20" y="594" width="167" height="168" rx="20" fill="#fff"/>
  <g clip-path="url(#c1)"><rect x="20" y="594" width="167" height="112" fill="url(#sea)"/>
    <path d="M20 670 q20 -8 42 0 t42 0 t42 0 t42 0 v40 h-168z" fill="#fff" opacity=".25"/>
    <path d="M20 684 q20 -8 42 0 t42 0 t42 0 t42 0 v30 h-168z" fill="#fff" opacity=".35"/>
    <circle cx="150" cy="626" r="14" fill="#fff6c9"/></g>
  <text x="34" y="730" font-size="15" font-weight="700" fill="#16151c">马尔代夫</text>
  <text x="34" y="750" font-size="12" fill="#8a8794">水屋 · ¥12,800 起</text>

  <rect x="203" y="594" width="167" height="168" rx="20" fill="#fff"/>
  <g clip-path="url(#c2)"><rect x="203" y="594" width="167" height="112" fill="url(#kyoto)"/>
    <g fill="#8c2f2a"><rect x="245" y="640" width="84" height="8" rx="2"/><rect x="252" y="654" width="70" height="5"/><rect x="258" y="648" width="7" height="58"/><rect x="309" y="648" width="7" height="58"/></g>
    <circle cx="340" cy="618" r="10" fill="#fff" opacity=".7"/></g>
  <text x="217" y="730" font-size="15" font-weight="700" fill="#16151c">京都</text>
  <text x="217" y="750" font-size="12" fill="#8a8794">赏枫季 · ¥4,299 起</text>
</g>

<rect x="0" y="776" width="390" height="68" fill="#fff"/>
<line x1="0" y1="776" x2="390" y2="776" stroke="#ebe8e4"/>
<g font-size="10" text-anchor="middle" font-weight="600">
  <path d="M38 800 l11 -9 l11 9 v10 h-22z" fill="#16151c"/><text x="49" y="826" fill="#16151c">首页</text>
  <circle cx="146" cy="800" r="10" fill="none" stroke="#a8a5b3" stroke-width="2"/><path d="M146 794 l3 6 l-3 6 l-3 -6z" fill="#a8a5b3"/><text x="146" y="826" fill="#a8a5b3">发现</text>
  <path d="M243 808 l-8-8a5 5 0 0 1 8-5.5a5 5 0 0 1 8 5.5z" fill="none" stroke="#a8a5b3" stroke-width="2"/><text x="243" y="826" fill="#a8a5b3">收藏</text>
  <circle cx="340" cy="795" r="5" fill="none" stroke="#a8a5b3" stroke-width="2"/><path d="M330 810 a10 8 0 0 1 20 0" fill="none" stroke="#a8a5b3" stroke-width="2"/><text x="340" y="826" fill="#a8a5b3">我的</text>
</g>
</svg>`;

export function demoDataUrl() {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(DEMO_SVG);
}
