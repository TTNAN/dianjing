import json, asyncio
from playwright.async_api import async_playwright
REC = {"type_zh":"底部导航栏","type_en":"Bottom tab bar","description":"白色通栏底栏，灰色方块图标，选中项蓝色，顶部细灰线","issues":["图标是占位方块，缺乏识别度","视觉偏廉价，缺少层次"],"suggested_terms":["floating-tabbar","premium"]}
VAR = {"variants":[
 {"title":"悬浮胶囊","summary":"底栏浮起成胶囊，选中项实心高亮","changes":["左右下各留 16px","圆角 28px","阴影 0 8px 24px rgba(0,0,0,.12)"],"html":"<div style='margin:16px;background:#fff;border-radius:28px;box-shadow:0 8px 24px rgba(0,0,0,.12);display:flex;justify-content:space-around;padding:10px'><span style='background:#3b5bdb;color:#fff;border-radius:20px;padding:8px 16px'>首页</span><span style='padding:8px'>分类</span><span style='padding:8px'>购物车</span><span style='padding:8px'>我的</span></div>"},
 {"title":"毛玻璃通栏","summary":"保留通栏，半透明模糊","changes":["背景 rgba(255,255,255,.7)","backdrop-filter: blur(20px)"],"html":"<div style='background:rgba(255,255,255,.7);display:flex;justify-content:space-around;padding:16px;border-top:1px solid #eee'><b style='color:#3b5bdb'>首页</b><span>分类</span><span>购物车</span><span>我的</span></div>"},
 {"title":"极简指示条","summary":"去掉图标底色，选中项下方小圆点","changes":["图标线性化","选中项 4px 圆点指示"],"html":"<div style='background:#fff;display:flex;justify-content:space-around;padding:16px'><b>首页•</b><span style='color:#999'>分类</span><span style='color:#999'>购物车</span><span style='color:#999'>我的</span></div>"}]}
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch()
    ctx = await b.new_context(viewport={"width":1400,"height":900}, record_video_dir="./tmp-video", record_video_size={"width":1400,"height":900})
    pg = await ctx.new_page()
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type=="error" and errs.append(m.text))
    calls=[0]
    async def handle(route):
      body = json.loads(route.request.post_data)
      txt = body["messages"][0]["content"][0]["text"]
      out = REC if "识别圈出的元素" in txt else VAR
      await asyncio.sleep(1.5); await route.fulfill(json={"choices":[{"message":{"content":"```json\n"+json.dumps(out,ensure_ascii=False)+"\n```"}}]})
    await pg.route("https://fake.api/v1/chat/completions", handle)
    await pg.goto("http://localhost:8766/")
    await pg.wait_for_timeout(3500); await pg.screenshot(path="./tmp-e0.png")
    await pg.evaluate("localStorage.setItem('dianjing.settings', JSON.stringify({baseUrl:'https://fake.api/v1',model:'x',apiKey:'k'}))")
    await pg.reload(); await pg.wait_for_timeout(300)
    await pg.click("#demo"); await pg.wait_for_timeout(1300)
    box = await pg.locator("#overlay").bounding_box()
    sx=box["width"]/390; sy=box["height"]/844
    await pg.mouse.move(box["x"]+4*sx, box["y"]+778*sy); await pg.mouse.down()
    await pg.mouse.move(box["x"]+386*sx, box["y"]+842*sy, steps=30)
    await pg.screenshot(path="./tmp-e1.png")
    await pg.mouse.up(); await pg.wait_for_timeout(500)
    await pg.screenshot(path="./tmp-e2.png")
    await pg.wait_for_timeout(1600)
    await pg.fill("#note","看起来很廉价，想要像苹果那样")
    await pg.click("#varBtn"); await pg.wait_for_timeout(600)
    await pg.locator(".panel").evaluate("e=>e.scrollTo({top:900,behavior:'smooth'})"); await pg.screenshot(path="./tmp-e3.png")
    await pg.wait_for_timeout(2200)
    await pg.locator(".variant").first.locator("button").click(); await pg.wait_for_timeout(700)
    await pg.locator(".chip.quick").first.click(); await pg.wait_for_timeout(900)
    await pg.locator(".panel").evaluate("e=>e.scrollTo({top:0,behavior:'smooth'})"); await pg.wait_for_timeout(300)
    await pg.screenshot(path="./tmp-e4.png")
    await pg.locator(".panel").evaluate("e=>e.scrollTo({top:900,behavior:'smooth'})"); await pg.wait_for_timeout(300)
    await pg.screenshot(path="./tmp-e5.png")
    await pg.click("#copy"); await pg.locator(".panel").evaluate("e=>e.scrollTo({top:99999,behavior:'smooth'})"); await pg.wait_for_timeout(1500)
    await pg.screenshot(path="./tmp-e6.png")
    print("ERRS", errs)
    await ctx.close(); await b.close()
asyncio.run(main())
