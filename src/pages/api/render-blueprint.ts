import type { NextApiRequest, NextApiResponse } from "next";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import Blueprint from "@/lib/renderer/Blueprint";

// Load fonts. In Vercel, we fetch them from /public/fonts.
// In local builds, the fs fallback also works.
async function getFonts() {
  try {
    const base =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";
    const [regular, bold] = await Promise.all([
      fetch(`${base}/fonts/Inter-Regular.ttf`).then(r => r.arrayBuffer()),
      fetch(`${base}/fonts/Inter-Bold.ttf`).then(r => r.arrayBuffer()),
    ]);
    return [
      { name: "Inter", data: regular, weight: 400, style: "normal" },
      { name: "Inter", data: bold,    weight: 700, style: "normal" },
    ];
  } catch {
    // Local fallback: read from filesystem if dev server isn't serving yet
    const fs = await import("fs/promises");
    const [regular, bold] = await Promise.all([
      fs.readFile("public/fonts/Inter-Regular.ttf"),
      fs.readFile("public/fonts/Inter-Bold.ttf"),
    ]);
    return [
      { name: "Inter", data: regular, weight: 400, style: "normal" },
      { name: "Inter", data: bold,    weight: 700, style: "normal" },
    ];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
