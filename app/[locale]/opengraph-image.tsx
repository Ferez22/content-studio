import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const alt = "Qartmina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = async (name: string) =>
  `data:image/png;base64,${(await readFile(path.join(process.cwd(), "assets/og", name))).toString("base64")}`;

// Social preview: the hero title on the left, the robot in its white disc on the right.
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const [robot, logo] = await Promise.all([asset("robot.png"), asset("logo-white.png")]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "#0a0a0a",
          color: "#fafafa",
          backgroundImage:
            "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            maxWidth: 640,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={213} height={50} alt="" />
          <div style={{ fontSize: 66, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
            {t("title")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#a3a3a3" }}>
            <span>qartmina.com</span>
            <span style={{ color: "#525252" }}>·</span>
            <span>OpenAI Select Partner</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "#ffffff",
            boxShadow: "0 0 0 18px rgba(30, 64, 255, 0.16), 0 0 120px 30px rgba(30, 64, 255, 0.35)",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* The renderer ignores overflow clipping, so the image is rounded itself. */}
          <img src={robot} width={420} height={420} alt="" style={{ borderRadius: 9999 }} />
        </div>
      </div>
    ),
    size
  );
}
