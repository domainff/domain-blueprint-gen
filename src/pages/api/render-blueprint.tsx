import type { NextApiRequest, NextApiResponse } from "next";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import Blueprint from "@/lib/renderer/Blueprint";

// Load fonts. In Vercel, fetch from /public/fonts.
// In local builds, use fs fallback if needed.
async function getFonts() {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const [normal, italic] = await Promise.all([
      fetch(`${base}/fonts/Inter-VariableFont_opsz,wght.ttf`).then(r =>
        r.arrayBuffer()
      ),
      fetch(`${base}/fonts/Inter-Italic-VariableFont_opsz,wght.ttf`).then(r =>
        r.arrayBuffer()
      ),
    ]);

    return [
      { name: "Inter", data: normal, weight: 400, style: "normal" },
      { name: "Inter", data: normal, weight: 700, style: "normal" },
      { name: "Inter", data: italic, weight: 400, style: "italic" },
      { name: "Inter", data: italic, weight: 700, style: "italic" },
    ];
  } catch {
    // Local fallback: read from filesystem if fetch fails
    const fs = await import("fs/promises");
    const [normal, italic] = await Promise.all([
      fs.readFile("public/fonts/Inter-VariableFont_opsz,wght.ttf"),
      fs.readFile("public/fonts/Inter-Italic-VariableFont_opsz,wght.ttf"),
    ]);
    return [
      { name: "Inter", data: normal, weight: 400, style: "normal" },
      { name: "Inter", data: normal, weight: 700, style: "normal" },
      { name: "Inter", data: italic, weight: 400, style: "italic" },
      { name: "Inter", data: italic, weight: 700, style: "italic" },
    ];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cfg = req.body; // AlgorithmConfig JSON
    const svg = await satori(<Blueprint cfg={cfg} />, {
      width: 1920,
      height: 1080,
      embedFont: true,
      fonts: await getFonts(),
    });

    const png = new Resvg(svg, { fitTo: { mode: "width", value: 1920 } })
      .render()
      .asPng();

    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(png));
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "render_failed" });
  }
}

