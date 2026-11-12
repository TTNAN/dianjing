// 内置示例：一张"AI 生成的手机端数据看板"首页，打开即可试圈。
// 视觉按 BoardUI 的路子：白底＋浅灰卡＋一抹鲜蓝（#246FFF），克制精致，
// 多彩只出现在图表数据上。画布 390×844，关键区域坐标与端到端测试对齐，
// 改视觉时别动布局锚点：搜索栏 y152、分类 y224、主卡 20,300,350×230、
// 卡片 y594、底栏 y776。
export const DEMO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844" font-family="-apple-system, 'SF Pro Display', 'PingFang SC', 'Microsoft YaHei', sans-serif">
<defs>
  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b7fff" stop-opacity=".22"/><stop offset="1" stop-color="#2b7fff" stop-opacity=".02"/></linearGradient>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity=".05"/></filter>
  <filter id="sh2" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".04"/></filter>
  <clipPath id="hero"><rect x="20" y="300" width="350" height="230" rx="24"/></clipPath>
</defs>
<rect width="390" height="844" fill="#fff"/>
<text x="32" y="38" font-size="15" font-weight="600" fill="#0a0a0a">9:41</text>
<g fill="#0a0a0a"><rect x="288" y="35" width="3" height="5" rx="1"/><rect x="293" y="33" width="3" height="7" rx="1"/><rect x="298" y="31" width="3" height="9" rx="1"/><rect x="303" y="29" width="3" height="11" rx="1"/></g>
<g stroke="#0a0a0a" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M310 36 a10 10 0 0 1 16 0"/><path d="M312.5 38.5 a6.5 6.5 0 0 1 11 0"/></g>
<circle cx="318" cy="41" r="1.6" fill="#0a0a0a"/>
<rect x="330" y="28" width="26" height="12" rx="3.5" fill="none" stroke="#0a0a0a" stroke-width="1.2"/><rect x="332.5" y="30.5" width="18" height="7" rx="1.5" fill="#0a0a0a"/>

<text x="24" y="92" font-size="14" fill="#737373">早上好 👋</text>
<text x="24" y="128" font-size="28" font-weight="800" fill="#0a0a0a">今日总览</text>
<circle cx="342" cy="104" r="22" fill="#246fff"/><text x="342" y="110" font-size="16" font-weight="700" fill="#fff" text-anchor="middle">C</text>

<rect x="20" y="152" width="290" height="52" rx="12" fill="#fff" stroke="#ebebeb" filter="url(#sh2)"/>
<circle cx="47" cy="176" r="7" fill="none" stroke="#737373" stroke-width="2"/><line x1="52" y1="181" x2="57" y2="186" stroke="#737373" stroke-width="2" stroke-linecap="round"/>
<text x="68" y="183" font-size="14" fill="#737373">搜索订单、客户、商品</text>
<rect x="318" y="152" width="52" height="52" rx="12" fill="#fff" stroke="#ebebeb"/>
<g stroke="#0a0a0a" stroke-width="2" stroke-linecap="round"><line x1="334" y1="170" x2="354" y2="170"/><line x1="334" y1="178" x2="354" y2="178"/><line x1="334" y1="186" x2="354" y2="186"/></g>
<circle cx="340" cy="170" r="3" fill="#fff" stroke="#0a0a0a" stroke-width="2"/><circle cx="349" cy="186" r="3" fill="#fff" stroke="#0a0a0a" stroke-width="2"/>

<g font-size="13" font-weight="600">
  <rect x="20" y="224" width="56" height="38" rx="19" fill="#246fff"/><text x="48" y="248" fill="#fff" text-anchor="middle">全部</text>
  <rect x="84" y="224" width="68" height="38" rx="19" fill="#fff" stroke="#ebebeb"/><text x="118" y="248" fill="#737373" text-anchor="middle">今日</text>
  <rect x="160" y="224" width="68" height="38" rx="19" fill="#fff" stroke="#ebebeb"/><text x="194" y="248" fill="#737373" text-anchor="middle">本周</text>
  <rect x="236" y="224" width="68" height="38" rx="19" fill="#fff" stroke="#ebebeb"/><text x="270" y="248" fill="#737373" text-anchor="middle">本月</text>
  <rect x="312" y="224" width="68" height="38" rx="19" fill="#fff" stroke="#ebebeb"/><text x="346" y="248" fill="#737373" text-anchor="middle">今年</text>
</g>

<g filter="url(#sh)">
<g clip-path="url(#hero)">
  <rect x="20" y="300" width="350" height="230" fill="#f7f7f7"/>
  <text x="38" y="336" font-size="13" fill="#737373">总收入</text>
  <text x="38" y="368" font-size="30" font-weight="800" fill="#0a0a0a">¥48,290</text>
  <rect x="268" y="342" width="64" height="24" rx="12" fill="#d8f999"/>
  <text x="300" y="358" font-size="11" font-weight="700" fill="#3c6300" text-anchor="middle">+14.8%</text>
  <g stroke="#ebebeb" stroke-width="1"><line x1="36" y1="420" x2="354" y2="420"/><line x1="36" y1="455" x2="354" y2="455"/><line x1="36" y1="490" x2="354" y2="490"/></g>
  <path d="M48 463 L94 448 L140 456 L186 433 L232 443 L278 418 L324 426 L324 498 L48 498 Z" fill="url(#area)"/>
  <path d="M48 463 L94 448 L140 456 L186 433 L232 443 L278 418 L324 426" fill="none" stroke="#246fff" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="324" cy="426" r="4" fill="#246fff" stroke="#fff" stroke-width="2"/>
  <g font-size="10" fill="#737373" text-anchor="middle"><text x="48" y="518">周一</text><text x="94" y="518">周二</text><text x="140" y="518">周三</text><text x="186" y="518">周四</text><text x="232" y="518">周五</text><text x="278" y="518">周六</text><text x="324" y="518">周日</text></g>
</g>
</g>

<text x="24" y="572" font-size="19" font-weight="800" fill="#0a0a0a">最近订单</text>
<text x="366" y="572" font-size="13" fill="#246fff" text-anchor="end" font-weight="600">查看全部 →</text>

<g filter="url(#sh2)">
  <rect x="20" y="594" width="167" height="168" rx="20" fill="#fff" stroke="#ebebeb"/>
  <circle cx="52" cy="632" r="18" fill="#e8f0ff"/><text x="52" y="637" font-size="14" font-weight="700" fill="#246fff" text-anchor="middle">约</text>
  <text x="78" y="628" font-size="14" font-weight="700" fill="#0a0a0a">约翰</text>
  <text x="78" y="646" font-size="11" fill="#737373">订单 #8241 · 今天</text>
  <line x1="34" y1="672" x2="173" y2="672" stroke="#ebebeb"/>
  <text x="34" y="706" font-size="20" font-weight="800" fill="#0a0a0a">¥3,412</text>
  <rect x="34" y="720" width="64" height="22" rx="11" fill="#d8f999"/>
  <text x="66" y="735" font-size="11" font-weight="700" fill="#3c6300" text-anchor="middle">已发货</text>

  <rect x="203" y="594" width="167" height="168" rx="20" fill="#fff" stroke="#ebebeb"/>
  <circle cx="235" cy="632" r="18" fill="#f3e8ff"/><text x="235" y="637" font-size="14" font-weight="700" fill="#7f22fe" text-anchor="middle">阿</text>
  <text x="261" y="628" font-size="14" font-weight="700" fill="#0a0a0a">阿斯彭</text>
  <text x="261" y="646" font-size="11" fill="#737373">订单 #8238 · 今天</text>
  <line x1="217" y1="672" x2="356" y2="672" stroke="#ebebeb"/>
  <text x="217" y="706" font-size="20" font-weight="800" fill="#0a0a0a">¥1,899</text>
  <rect x="217" y="720" width="64" height="22" rx="11" fill="#fff" stroke="#ebebeb"/>
  <circle cx="229" cy="731" r="3.5" fill="#615fff"/>
  <text x="256" y="735" font-size="11" font-weight="700" fill="#0a0a0a" text-anchor="middle">待处理</text>
</g>

<rect x="0" y="776" width="390" height="68" fill="#fff"/>
<line x1="0" y1="776" x2="390" y2="776" stroke="#ebebeb"/>
<g font-size="10" text-anchor="middle" font-weight="600">
  <path d="M38 800 l11 -9 l11 9 v10 h-22z" fill="#246fff"/><text x="49" y="826" fill="#246fff">总览</text>
  <g stroke="#737373" stroke-width="2" stroke-linecap="round"><line x1="141" y1="792" x2="153" y2="792"/><line x1="141" y1="799" x2="153" y2="799"/><line x1="141" y1="806" x2="149" y2="806"/></g>
  <circle cx="137" cy="792" r="1.8" fill="#737373"/><circle cx="137" cy="799" r="1.8" fill="#737373"/><circle cx="137" cy="806" r="1.8" fill="#737373"/>
  <text x="146" y="826" fill="#737373">订单</text>
  <g fill="#737373"><rect x="235" y="801" width="4" height="9" rx="1.5"/><rect x="242" y="796" width="4" height="14" rx="1.5"/><rect x="249" y="799" width="4" height="11" rx="1.5"/></g>
  <line x1="233" y1="812" x2="255" y2="812" stroke="#737373" stroke-width="2" stroke-linecap="round"/>
  <text x="243" y="826" fill="#737373">数据</text>
  <circle cx="340" cy="795" r="5.5" fill="none" stroke="#737373" stroke-width="2.2"/><path d="M330 810 a10 8 0 0 1 20 0" fill="none" stroke="#737373" stroke-width="2.2"/><text x="340" y="826" fill="#737373">我的</text>
</g>
</svg>`;

export function demoDataUrl() {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(DEMO_SVG);
}
