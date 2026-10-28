"""Render a motion composition, assets/motion/<name>/index.html, to public/motion/<name>.mp4
plus a poster frame (<name>.jpg).

A composition is a 1920 x 1080 page that draws every frame from window.seek(t) and sets
window.DURATION (seconds) and window.POSTER (time of the poster frame); window.prepare() runs
once after fonts load. Each 60 fps frame is captured three times (t - 1/240 s, t, t + 1/240 s)
and blended with ffmpeg tmix for real motion blur. Needs Python Playwright, Chrome and ffmpeg.

    python3 assets/motion/render.py stop-the-scroll          # full render
    python3 assets/motion/render.py stop-the-scroll --probe  # 20 stills to check first
"""

import asyncio
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from playwright.async_api import async_playwright

NAME = next(arg for arg in sys.argv[1:] if not arg.startswith("--"))
HERE = Path(__file__).resolve().parent / NAME
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "motion"
FPS = 60
SUBFRAMES = (-1 / 240, 0.0, 1 / 240)


async def open_page(playwright):
    browser = await playwright.chromium.launch(channel="chrome")
    page = await browser.new_page(viewport={"width": 1920, "height": 1080})
    await page.goto((HERE / "index.html").as_uri(), wait_until="load")
    await page.evaluate("document.fonts.ready")
    await page.evaluate("window.prepare()")
    timing = await page.evaluate("({ duration: window.DURATION, poster: window.POSTER })")
    return browser, page, timing


async def capture(page, t, path, duration):
    await page.evaluate(f"window.seek({max(0.0, min(duration, t))})")
    await page.locator("#stage").screenshot(path=str(path), type="png")


async def probe():
    target = HERE / "probe"
    target.mkdir(exist_ok=True)
    async with async_playwright() as playwright:
        browser, page, timing = await open_page(playwright)
        duration = timing["duration"]
        for index in range(20):
            t = duration * (index + 0.5) / 20
            await capture(page, t, target / f"t{t:05.2f}.png", duration)
        await browser.close()
    print(f"Probe frames in {target}")


async def render():
    OUT.mkdir(parents=True, exist_ok=True)
    frames = Path(tempfile.mkdtemp(prefix=f"{NAME}-"))
    try:
        async with async_playwright() as playwright:
            browser, page, timing = await open_page(playwright)
            duration = timing["duration"]
            index = 0
            for frame in range(int(duration * FPS)):
                for offset in SUBFRAMES:
                    await capture(page, frame / FPS + offset, frames / f"{index:05d}.png", duration)
                    index += 1
            await capture(page, timing["poster"], OUT / f"{NAME}.png", duration)
            await browser.close()
        # Blend each group of three subframes, keep one frame per group.
        subprocess.run(
            [
                "ffmpeg", "-y", "-v", "error",
                "-framerate", str(FPS * len(SUBFRAMES)), "-i", str(frames / "%05d.png"),
                "-vf", "tmix=frames=3,select='eq(mod(n\\,3)\\,2)',setpts=N/(60*TB),format=yuv420p",
                "-r", str(FPS), "-c:v", "libx264", "-preset", "slow", "-crf", "20",
                "-movflags", "+faststart", "-an",
                str(OUT / f"{NAME}.mp4"),
            ],
            check=True,
        )
        subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-i", str(OUT / f"{NAME}.png"),
             "-q:v", "3", str(OUT / f"{NAME}.jpg")],
            check=True,
        )
        (OUT / f"{NAME}.png").unlink()
    finally:
        shutil.rmtree(frames, ignore_errors=True)
    print(f"Rendered {OUT / f'{NAME}.mp4'}")


if __name__ == "__main__":
    asyncio.run(probe() if "--probe" in sys.argv else render())
