"""Render index.html to public/motion/stop-the-scroll.mp4 (and a poster frame).

Each 60 fps frame is captured three times (t - 1/240 s, t, t + 1/240 s) and blended with
ffmpeg tmix for real motion blur. Needs Python Playwright, Google Chrome and ffmpeg.

    python3 assets/motion/stop-the-scroll/render.py          # full render
    python3 assets/motion/stop-the-scroll/render.py --probe  # stills at key moments only
"""

import asyncio
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from playwright.async_api import async_playwright

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
OUT = ROOT / "public" / "motion"
DURATION = 7.5
FPS = 60
SUBFRAMES = (-1 / 240, 0.0, 1 / 240)
POSTER_AT = 0.0
PROBE_TIMES = [0.1, 0.18, 0.24, 0.32, 0.45, 0.55, 0.65, 0.8, 1.05, 1.2, 1.45, 1.6, 2.1, 3.1,
               3.7, 4.3, 5.45, 5.6, 6.0, 7.25]


async def open_page(playwright):
    browser = await playwright.chromium.launch(channel="chrome")
    page = await browser.new_page(viewport={"width": 1920, "height": 1080})
    await page.goto((HERE / "index.html").as_uri(), wait_until="load")
    await page.evaluate("document.fonts.ready")
    await page.evaluate("window.prepare()")
    return browser, page


async def capture(page, t, path):
    await page.evaluate(f"window.seek({max(0.0, min(DURATION, t))})")
    await page.locator("#stage").screenshot(path=str(path), type="png")


async def probe():
    target = HERE / "probe"
    target.mkdir(exist_ok=True)
    async with async_playwright() as playwright:
        browser, page = await open_page(playwright)
        for t in PROBE_TIMES:
            await capture(page, t, target / f"t{t:05.2f}.png")
        await browser.close()
    print(f"Probe frames in {target}")


async def render():
    OUT.mkdir(parents=True, exist_ok=True)
    frames = Path(tempfile.mkdtemp(prefix="stop-the-scroll-"))
    try:
        async with async_playwright() as playwright:
            browser, page = await open_page(playwright)
            index = 0
            for frame in range(int(DURATION * FPS)):
                for offset in SUBFRAMES:
                    await capture(page, frame / FPS + offset, frames / f"{index:05d}.png")
                    index += 1
            await capture(page, POSTER_AT, OUT / "stop-the-scroll.png")
            await browser.close()
        # Blend each group of three subframes, keep one frame per group.
        subprocess.run(
            [
                "ffmpeg", "-y", "-v", "error",
                "-framerate", str(FPS * len(SUBFRAMES)), "-i", str(frames / "%05d.png"),
                "-vf", "tmix=frames=3,select='eq(mod(n\\,3)\\,2)',setpts=N/(60*TB),format=yuv420p",
                "-r", str(FPS), "-c:v", "libx264", "-preset", "slow", "-crf", "20",
                "-movflags", "+faststart", "-an",
                str(OUT / "stop-the-scroll.mp4"),
            ],
            check=True,
        )
        subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-i", str(OUT / "stop-the-scroll.png"),
             "-q:v", "3", str(OUT / "stop-the-scroll.jpg")],
            check=True,
        )
        (OUT / "stop-the-scroll.png").unlink()
    finally:
        shutil.rmtree(frames, ignore_errors=True)
    print(f"Rendered {OUT / 'stop-the-scroll.mp4'}")


if __name__ == "__main__":
    asyncio.run(probe() if "--probe" in sys.argv else render())
