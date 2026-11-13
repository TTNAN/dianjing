"""点睛端到端测试：跑在 http://localhost:8766/ 上，模型请求被拦截成固定假数据。
跑法：
  python3 -m http.server 8766   # 在仓库根目录
  python3 tests/e2e.py
断言失败或页面报错都会让脚本以非零退出码结束，只截图不算通过。

两条主线：
  演示（内置示例）：点元素先选中，右边只列它适用的改法，点改法才变；
    一眼对比、设计词典、提示词框在演示里不出现，只留操作条。
  真截图（上传的平图片）：圈选 + AI 识别 + 词条/对比格子那套原样保留。
"""
import json, asyncio, sys, os
from playwright.async_api import async_playwright
REC = {"type_zh":"底部导航栏","type_en":"Bottom tab bar","description":"白色通栏底栏，灰色线性图标，选中项蓝色，顶部细灰线","issues":["线性图标偏细，小尺寸下识别度一般","选中态只有颜色区分，缺少其他层次"],"suggested_terms":["floating-tabbar","premium"]}
VAR = {"variants":[
 {"title":"悬浮胶囊","summary":"底栏浮起成胶囊，选中项实心高亮","changes":["左右下各留 16px","圆角 28px","阴影 0 8px 24px rgba(0,0,0,.12)"],"html":"<div style='margin:16px;background:#fff;border-radius:28px;box-shadow:0 8px 24px rgba(0,0,0,.12);display:flex;justify-content:space-around;padding:10px'><span style='background:#3b5bdb;color:#fff;border-radius:20px;padding:8px 16px'>总览</span><span style='padding:8px'>订单</span><span style='padding:8px'>数据</span><span style='padding:8px'>我的</span></div>"},
 {"title":"毛玻璃通栏","summary":"保留通栏，半透明模糊","changes":["背景 rgba(255,255,255,.7)","backdrop-filter: blur(20px)"],"html":"<div style='background:rgba(255,255,255,.7);display:flex;justify-content:space-around;padding:16px;border-top:1px solid #eee'><b style='color:#3b5bdb'>总览</b><span>订单</span><span>数据</span><span>我的</span></div>"},
 {"title":"极简指示条","summary":"去掉图标底色，选中项下方小圆点","changes":["图标线性化","选中项 4px 圆点指示"],"html":"<div style='background:#fff;display:flex;justify-content:space-around;padding:16px'><b>总览•</b><span style='color:#999'>订单</span><span style='color:#999'>数据</span><span style='color:#999'>我的</span></div>"}]}

async def state(pg):
  return await pg.evaluate("() => { const s = window.__dianjing; return { regions: s.regions, selected: s.selected, preview: s.preview, lang: s.lang, isDemo: s.isDemo, demoHistory: s.demoHistory.length }; }")

async def svg_visual(pg):
  # 只比看得见的部分：去掉悬停提示 <title> 和选中描边的 class="sel"
  return await pg.evaluate("() => document.querySelector('#demoSvg').innerHTML.replace(/<title>[^<]*<\\/title>/g, '').replace(/ class=\"sel\"/g, '')")

async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch()
    ctx = await b.new_context(viewport={"width":1400,"height":900}, record_video_dir="./tmp-video", record_video_size={"width":1400,"height":900})
    pg = await ctx.new_page()
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type=="error" and errs.append(m.text))
    async def handle(route):
      body = json.loads(route.request.post_data)
      txt = body["messages"][0]["content"][0]["text"]
      out = REC if "识别圈出的元素" in txt else VAR
      await asyncio.sleep(1.5); await route.fulfill(json={"choices":[{"message":{"content":"```json\n"+json.dumps(out,ensure_ascii=False)+"\n```"}}]})
    await pg.route("https://fake.api/v1/chat/completions", handle)
    await pg.goto("http://localhost:8766/")
    await pg.wait_for_timeout(3500); await pg.screenshot(path="./tmp-e0.png")
    assert await pg.locator("body.no-image").count() == 1, "空状态下 body 应带 no-image"
    await pg.evaluate("localStorage.setItem('dianjing.settings', JSON.stringify({baseUrl:'https://fake.api/v1',model:'x',apiKey:'k'}))")
    await pg.reload(); await pg.wait_for_timeout(300)
    # ---- 演示：点一下选中、再挑适用改法 ----
    await pg.click("#demo2"); await pg.wait_for_timeout(1300)  # 空状态下顶栏的 #demo 已隐藏，改走首屏的「先看看示例」
    assert await pg.locator("#zoombar").is_visible(), "载入截图后缩放条应出现"
    assert await pg.locator("#demoSvg svg").count() == 1, "演示应以内联 SVG 进画布"
    assert await pg.locator("#demoSvg [data-el]").count() == 14, "演示 14 个元素都应是可点节点"
    assert await pg.locator("#shot").is_hidden(), "演示不走光栅化，#shot 应隐藏"
    assert await pg.locator("body.demo-mode").count() == 1, "演示应挂 demo-mode"
    assert await pg.locator(".vsgrid").count() == 0, "演示里 18 格对比应收起来"
    assert await pg.locator("#vocabDetails").count() == 0, "演示里设计词典应收起来"
    assert await pg.locator(".prompt-card").is_hidden(), "演示里提示词卡应收起来"
    assert await pg.locator(".demo-bar").count() == 1, "演示只留一条操作条"
    assert await pg.locator(".demo-chip").count() == 0, "没选中时右边不应有改法"
    assert "看看它能怎么改" in (await pg.locator(".demo-hint").inner_text())
    assert (await pg.locator(".demo-count").inner_text()) == "已改 0 处"
    assert await pg.locator("#demoUndo").is_disabled(), "没改之前撤销应禁用"
    assert await pg.locator("#demoCopy").is_disabled(), "没改之前复制应禁用"
    await pg.screenshot(path="./tmp-e1.png")
    # 点搜索栏：只选中、不改图；右边出现它自己的 3 个改法
    svg0 = await svg_visual(pg)
    await pg.locator('#demoSvg [data-el="search"]').click(); await pg.wait_for_timeout(400)
    assert await svg_visual(pg) == svg0, "点选中不应改图"
    assert (await pg.locator(".demo-count").inner_text()) == "已改 0 处"
    assert await pg.locator('#demoSvg [data-el="search"].sel').count() == 1, "选中的元素应描边高亮"
    assert "已选中「搜索栏」" in (await pg.locator(".demo-hint").inner_text())
    chips = await pg.locator(".demo-chip").all_inner_texts()
    assert chips == ["圆角 → 直角", "纯色 → 渐变", "平面 → 悬浮"], chips
    # 点改法才变：圆角 → 直角，图变、计数变、标出变化、提示词跟着变
    await pg.locator('.demo-chip[data-term="v-round-to-square"]').click(); await pg.wait_for_timeout(400)
    assert await svg_visual(pg) != svg0, "点改法后 SVG 应变"
    assert (await pg.locator(".demo-count").inner_text()) == "已改 1 处"
    assert "搜索栏：圆角 → 直角" in (await pg.locator(".demo-last").inner_text())
    assert "on" in (await pg.locator('.demo-chip[data-term="v-round-to-square"]').get_attribute("class") or "")
    s = await state(pg)
    assert s["regions"][0]["demoEl"] == "search" and s["regions"][0]["terms"] == ["v-round-to-square"], s["regions"]
    prompt = await pg.locator("#prompt").input_value()
    assert "圆角改为直角" in prompt and "搜索栏" in prompt, prompt
    # 再点一次已生效的改法：恢复原样，计数归零
    await pg.locator('.demo-chip[data-term="v-round-to-square"]').click(); await pg.wait_for_timeout(300)
    s = await state(pg); assert s["regions"] == [], s["regions"]
    assert (await pg.locator(".demo-count").inner_text()) == "已改 0 处"
    assert "已恢复原样" in (await pg.locator(".demo-last").inner_text())
    # 再点同一个元素：取消选中，改法收起来
    await pg.locator('#demoSvg [data-el="search"]').click(); await pg.wait_for_timeout(300)
    assert await pg.locator(".demo-chip").count() == 0, "取消选中后改法应收起来"
    assert await pg.locator('#demoSvg [data-el="search"].sel').count() == 0
    # 点空白处也取消选中：先选中主卡（4 个改法），再点搜索栏和胶囊之间的空隙
    await pg.locator('#demoSvg [data-el="hero"]').click(); await pg.wait_for_timeout(300)
    assert await pg.locator(".demo-chip").count() == 4, "主卡应有 4 个改法"
    box = await pg.locator("#demoSvg svg").bounding_box()
    await pg.mouse.click(box["x"] + 195/390*box["width"], box["y"] + 214/844*box["height"]); await pg.wait_for_timeout(300)
    assert await pg.locator(".demo-chip").count() == 0, "点空白处应取消选中"
    # 点两个元素、改两处，再撤销一步、重置
    await pg.locator('#demoSvg [data-el="hero"]').click(); await pg.wait_for_timeout(300)
    await pg.locator('.demo-chip[data-term="v-light-to-dark"]').click(); await pg.wait_for_timeout(300)
    await pg.locator('#demoSvg [data-el="tabbar"]').click(); await pg.wait_for_timeout(300)
    await pg.locator('.demo-chip[data-term="v-full-to-inset"]').click(); await pg.wait_for_timeout(300)
    assert (await pg.locator(".demo-count").inner_text()) == "已改 2 处"
    await pg.click("#demoUndo"); await pg.wait_for_timeout(400)
    assert (await pg.locator(".demo-count").inner_text()) == "已改 1 处"
    s = await state(pg); assert [r["demoEl"] for r in s["regions"]] == ["hero"], s["regions"]
    await pg.click("#demoReset"); await pg.wait_for_timeout(400)
    assert (await pg.locator(".demo-count").inner_text()) == "已改 0 处"
    # 复制：改两处后点复制，按钮变已复制，提示词里两处都在
    await pg.locator('#demoSvg [data-el="search"]').click(); await pg.wait_for_timeout(300)
    await pg.locator('.demo-chip[data-term="v-solid-to-gradient"]').click(); await pg.wait_for_timeout(300)
    await pg.locator('#demoSvg [data-el="pills"]').click(); await pg.wait_for_timeout(300)
    await pg.locator('.demo-chip[data-term="v-tight-to-loose"]').click(); await pg.wait_for_timeout(300)
    await pg.click("#demoCopy"); await pg.wait_for_timeout(500)
    assert "done" in (await pg.locator("#demoCopy").get_attribute("class") or "")
    prompt = await pg.locator("#prompt").input_value()
    assert "搜索栏" in prompt and "时间胶囊" in prompt, prompt
    await pg.screenshot(path="./tmp-e2.png")
    # 演示的改动能持久化：刷新后还在（且是按元素记的，不是圈选框），选中状态不保留
    await pg.wait_for_timeout(900)
    await pg.reload(); await pg.wait_for_timeout(800)
    s = await state(pg)
    assert s["isDemo"] and len(s["regions"]) == 2, s
    assert sorted(r["demoEl"] for r in s["regions"]) == ["pills", "search"], s["regions"]
    assert await pg.locator(".demo-chip").count() == 0, "刷新后选中不保留"
    assert await pg.locator(".box").count() == 0, "演示不画圈选框"
    # ---- 真截图：上传一张平图片，走圈选 + AI 识别 + 词条/对比格子 ----
    await pg.set_input_files("#file", "docs/screenshot.png")
    await pg.wait_for_timeout(1000)
    assert await pg.locator("#shot").is_visible(), "真图应走 img"
    assert await pg.locator("#demoSvg svg").count() == 0, "真图没有内联 SVG"
    assert await pg.locator("body.demo-mode").count() == 0, "真图不挂 demo-mode"
    s = await state(pg)
    assert not s["isDemo"] and s["regions"] == [], s
    img = await pg.evaluate("() => { const s = window.__dianjing; return { w: s.image.w, h: s.image.h }; }")
    assert (img["w"], img["h"]) == (1400, 900), img
    box = await pg.locator("#overlay").bounding_box()
    # 在图上圈一条顶部横条（分数 0.02,0.10 → 0.50,0.30）
    await pg.mouse.move(box["x"]+0.02*box["width"], box["y"]+0.10*box["height"]); await pg.mouse.down()
    await pg.mouse.move(box["x"]+0.50*box["width"], box["y"]+0.30*box["height"], steps=20)
    await pg.mouse.up(); await pg.wait_for_timeout(500)
    await pg.screenshot(path="./tmp-e3.png")
    await pg.wait_for_function("window.__dianjing.regions[0]?.recog?.type_zh === '底部导航栏'", timeout=8000)
    s = await state(pg)
    assert len(s["regions"]) == 1, s
    r = s["regions"][0]
    assert tuple(round(r[k]) for k in ("x", "y", "w", "h")) == (28, 90, 672, 180), r
    assert "floating-tabbar" in r["terms"] and "premium" in r["terms"], r["terms"]
    assert await pg.locator(".vsgrid").count() == 1, "真图应有 18 格对比"
    assert await pg.locator("#vocabDetails").count() == 1, "真图应有设计词典"
    assert await pg.locator(".prompt-card").is_visible(), "真图应有提示词卡"
    # 快捷方向可开关：点“更高级”补齐三项，再点一次全部取消
    await pg.locator(".chip.quick").first.click(); await pg.wait_for_timeout(300)
    s = await state(pg); assert "shadow" in s["regions"][0]["terms"], s["regions"][0]["terms"]
    await pg.locator(".chip.quick").first.click(); await pg.wait_for_timeout(300)
    s = await state(pg)
    assert "premium" not in s["regions"][0]["terms"] and "shadow" not in s["regions"][0]["terms"], s["regions"][0]["terms"]
    # 互斥方向：选了圆角→直角，再选直角→圆角，前者应被自动取消
    await pg.locator('.vs[data-t="v-round-to-square"]').click(); await pg.wait_for_timeout(300)
    await pg.locator('.vs[data-t="v-square-to-round"]').click(); await pg.wait_for_timeout(300)
    s = await state(pg)
    assert "v-square-to-round" in s["regions"][0]["terms"], s["regions"][0]["terms"]
    assert "v-round-to-square" not in s["regions"][0]["terms"], s["regions"][0]["terms"]
    await pg.locator(".vsgrid").scroll_into_view_if_needed(); await pg.wait_for_timeout(500)
    await pg.locator('.vs[data-t="v-full-to-inset"]').hover(); await pg.wait_for_timeout(400)
    await pg.screenshot(path="./tmp-e7.png")
    await pg.locator('.vs[data-t="v-full-to-inset"]').click(); await pg.wait_for_timeout(500)
    s = await state(pg)
    assert "v-full-to-inset" in s["regions"][0]["terms"], s["regions"][0]["terms"]
    assert await pg.locator("#shotAfter").is_hidden(), "真图点格子不画改后图层"
    # 框内文字进提示词，帮 AI 在代码里定位
    await pg.fill("#regionText", "总览 订单 数据 我的")
    await pg.fill("#note","看起来很廉价，想要像苹果那样")
    await pg.wait_for_timeout(300)
    prompt = await pg.locator("#prompt").input_value()
    assert "框内文字：总览 订单 数据 我的" in prompt, prompt
    await pg.click("#varBtn"); await pg.wait_for_timeout(600)
    await pg.locator(".panel").evaluate("e=>e.scrollTo({top:900,behavior:'smooth'})"); await pg.screenshot(path="./tmp-e4.png")
    await pg.wait_for_function("window.__dianjing.regions[0]?.variants?.length === 3", timeout=8000)
    assert await pg.locator(".variant").count() == 3
    await pg.locator(".variant").first.locator("button").click(); await pg.wait_for_timeout(700)
    s = await state(pg)
    assert s["regions"][0]["chosen"] == 0, s["regions"][0]
    assert s["preview"] == {"regionId": s["regions"][0]["id"], "variantIdx": 0}, s["preview"]
    assert await pg.locator(".preview-layer").count() == 1, "选中的方案应贴回原图上"
    assert await pg.locator("#previewbar").is_visible(), "预览对比条应出现"
    await pg.screenshot(path="./tmp-e8.png")
    # 拖框体移动（向左拖够远，x 应 clamp 到 0），再用方向键微调
    info = await pg.evaluate("""() => { const s = window.__dianjing; const r = s.regions[0];
      const o = document.querySelector('#overlay').getBoundingClientRect();
      return { r, ox: o.x, oy: o.y, ow: o.width, oh: o.height, iw: s.image.w, ih: s.image.h }; }""")
    cx = info["ox"] + (info["r"]["x"] + info["r"]["w"]/2) / info["iw"] * info["ow"]
    cy = info["oy"] + (info["r"]["y"] + info["r"]["h"]/2) / info["ih"] * info["oh"]
    drag = (info["r"]["x"] / info["iw"]) * info["ow"] + 40  # 拖过左边缘，x 钳到 0
    await pg.mouse.move(cx, cy); await pg.mouse.down()
    await pg.mouse.move(cx - drag, cy, steps=10); await pg.mouse.up(); await pg.wait_for_timeout(300)
    s = await state(pg); assert s["regions"][0]["x"] == 0, s["regions"][0]
    await pg.mouse.click(cx - drag, cy)  # 点一下框体，把焦点还给画布
    for _ in range(3): await pg.keyboard.press("ArrowRight"); await pg.wait_for_timeout(120)
    s = await state(pg); assert s["regions"][0]["x"] == 3, s["regions"][0]
    # 拖右下角手柄缩小（向左上拖，宽应减小）
    h = await pg.locator(".box.sel .h.se").bounding_box()
    w0 = s["regions"][0]["w"]
    await pg.mouse.move(h["x"]+h["width"]/2, h["y"]+h["height"]/2); await pg.mouse.down()
    await pg.mouse.move(h["x"]+h["width"]/2-30, h["y"]+h["height"]/2-20, steps=10); await pg.mouse.up(); await pg.wait_for_timeout(300)
    s = await state(pg); assert s["regions"][0]["w"] < w0 - 20, (w0, s["regions"][0]["w"])
    # 缩放：放大到 100%，再回到适应
    await pg.click("#zoomIn"); await pg.wait_for_timeout(300)
    assert (await pg.locator("#zoomLabel").inner_text()) == "100%"
    await pg.click("#zoomFit"); await pg.wait_for_timeout(300)
    assert (await pg.locator("#zoomLabel").inner_text()) == "适应"
    await pg.locator(".panel").evaluate("e=>e.scrollTo({top:0,behavior:'smooth'})"); await pg.wait_for_timeout(300)
    await pg.screenshot(path="./tmp-e5.png")
    await pg.locator(".panel").evaluate("e=>e.scrollTo({top:900,behavior:'smooth'})"); await pg.wait_for_timeout(300)
    await pg.screenshot(path="./tmp-e6.png")
    await pg.click("#copy"); await pg.wait_for_timeout(500)
    assert "done" in (await pg.locator("#copy").get_attribute("class") or "")
    await pg.locator(".panel").evaluate("e=>e.scrollTo({top:99999,behavior:'smooth'})"); await pg.wait_for_timeout(1500)
    await pg.screenshot(path="./tmp-e9.png")
    # 持久化：等保存防抖落盘后刷新，圈选应还在
    await pg.wait_for_timeout(900)
    await pg.reload(); await pg.wait_for_timeout(800)
    s = await state(pg)
    assert len(s["regions"]) == 1, s
    assert s["regions"][0]["recog"]["type_zh"] == "底部导航栏", s["regions"][0]
    prompt = await pg.locator("#prompt").input_value()
    assert "底部导航栏" in prompt and "框内文字" in prompt, prompt
    await pg.screenshot(path="./tmp-e10.png")
    # ---- 画界面模式 ----
    await pg.click('#modeSeg button[data-mode="sketch"]'); await pg.wait_for_timeout(500)
    assert await pg.locator("#sketchRoot").is_visible(), "画界面模式应显示"
    assert await pg.locator("body.mode-sketch").count() == 1, "切到画界面后 body 应带 mode-sketch"
    assert await pg.locator(".sk-stab[data-sid]").count() == 2, "种子应有首页、详情页两页"
    await pg.screenshot(path="./tmp-s0.png")
    # 点零件加进当前屏
    before = await pg.locator(".sk-phone-col.on .sk-part").count()
    await pg.locator('.sk-part-card[data-kind="button"]').click(); await pg.wait_for_timeout(300)
    after = await pg.locator(".sk-phone-col.on .sk-part").count()
    assert after == before + 1, (before, after)
    # 选中零件后检查器出现，改标题实时同步到手机
    assert await pg.locator("#skFLabel").count() == 1
    await pg.fill("#skFLabel", "马上出发"); await pg.wait_for_timeout(300)
    assert "马上出发" in (await pg.locator(".sk-phone-col.on .sk-btn").inner_text())
    assert "大理三日" in (await pg.locator("#skPrompt").input_value())
    # 触发：把新按钮连到详情页，提示词应多一行跳转
    await pg.locator("#skITabs button[data-itab='trigger']").click(); await pg.wait_for_timeout(200)
    await pg.select_option("#skFAction", "s2"); await pg.wait_for_timeout(300)
    assert "跳转到详情页屏幕" in (await pg.locator("#skPrompt").input_value())
    await pg.screenshot(path="./tmp-s1.png")
    # 预览：点卡片滑到详情页，返回退回，关闭回到编辑
    await pg.click("#skPreviewBtn"); await pg.wait_for_timeout(500)
    assert await pg.locator(".sk-player").is_visible()
    await pg.locator("#skPlayerVp .sk-card").click(); await pg.wait_for_timeout(600)
    assert "详情页" in (await pg.locator("#skPlayerName").inner_text())
    await pg.screenshot(path="./tmp-s2.png")
    await pg.click("#skPlayerBack"); await pg.wait_for_timeout(500)
    assert "首页" in (await pg.locator("#skPlayerName").inner_text())
    await pg.click("#skPlayerClose"); await pg.wait_for_timeout(300)
    assert not await pg.locator(".sk-player").is_visible()
    # 复制提示词
    await pg.click("#skCopy"); await pg.wait_for_timeout(500)
    assert "done" in (await pg.locator("#skCopy").get_attribute("class") or "")
    # 持久化：刷新后画界面里新加的按钮还在；回改截图，老模式的圈选也还在
    await pg.wait_for_timeout(500)
    await pg.reload(); await pg.wait_for_timeout(500)
    await pg.click('#modeSeg button[data-mode="sketch"]'); await pg.wait_for_timeout(500)
    assert "马上出发" in (await pg.locator("#skPrompt").input_value())
    await pg.click('#modeSeg button[data-mode="annotate"]'); await pg.wait_for_timeout(300)
    s = await state(pg)
    assert len(s["regions"]) == 1, s
    # ---- 手机端（390px）----
    mctx = await b.new_context(viewport={"width":390,"height":844})
    mpg = await mctx.new_page()
    merrs=[]; mpg.on("pageerror", lambda e: merrs.append(str(e)))
    await mpg.goto("http://localhost:8766/")
    await mpg.wait_for_timeout(1000)
    w = await mpg.evaluate("() => document.documentElement.scrollWidth")
    assert w <= 390, f"手机空状态横向溢出 {w}"
    assert await mpg.locator("#demo").is_hidden(), "窄屏顶栏的载入示例应隐藏"
    assert await mpg.locator(".top").bounding_box() and (await mpg.locator(".top").bounding_box())["height"] <= 120, "手机顶栏不应超过两行"
    await mpg.click("#demo2"); await mpg.wait_for_timeout(1000)
    assert (await mpg.evaluate("() => document.documentElement.scrollWidth")) <= 390
    assert await mpg.locator(".demo-bar").count() == 1, "手机演示也应只有操作条"
    await mpg.locator('#demoSvg [data-el="search"]').click(); await mpg.wait_for_timeout(500)
    assert await mpg.locator(".demo-chip").count() == 3, "手机点元素也应出现它自己的改法"
    await mpg.locator('.demo-chip[data-term="v-round-to-square"]').click(); await mpg.wait_for_timeout(400)
    assert (await mpg.locator(".demo-count").inner_text()) == "已改 1 处"
    await mpg.click('#modeSeg button[data-mode="sketch"]'); await mpg.wait_for_timeout(700)
    assert (await mpg.evaluate("() => document.documentElement.scrollWidth")) <= 390, "手机画界面横向溢出"
    await mpg.click("#skPreviewBtn"); await mpg.wait_for_timeout(500)
    assert await mpg.locator(".sk-player").is_visible()
    assert not merrs, merrs
    await mctx.close()
    print("ERRS", errs)
    assert not errs, errs
    print("E2E PASS: 演示选中再挑改法（14 元素/选中不改图/适用改法/点改法才变/取消选中/计数/撤销/重置/复制/持久化）/真截图圈选识别互斥方案贴图移动缩放持久化复制/画界面（加零件/改标题/连跳转/预览切页/复制/持久化）/手机端（390px 无横向溢出）全部通过")
    await ctx.close(); await b.close()
asyncio.run(main())
