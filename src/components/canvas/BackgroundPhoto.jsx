import { Image as ImageIcon } from "lucide-react";

import { clamp } from "../../lib/project-utils";

export default function BackgroundPhoto({ page, styleObj }) {
  const backgroundStyle =
    page.bgMode === "solid"
      ? { background: page.bgColor || styleObj.dark }
      : {
          background: `radial-gradient(circle at 65% 18%, ${styleObj.cyan}22, transparent 45%), linear-gradient(180deg, ${styleObj.panel}, ${styleObj.dark})`,
        };

  return (
    <div className="absolute inset-0 z-0" style={backgroundStyle}>
      {page.imageUrl ? (
        <img
          src={page.imageUrl}
          alt="article visual"
          className="absolute inset-0 h-full w-full"
          style={{
            objectFit: page.imageFit || "cover",
            objectPosition: `${clamp(page.imageX, 0, 100)}% ${clamp(page.imageY, 0, 100)}%`,
            transform: `scale(${page.imageScale || 1})`,
            opacity: page.opacityPhoto ?? 1,
            filter:
              page.template === "cover"
                ? "contrast(1.1) saturate(1.28) brightness(1.02) hue-rotate(8deg)"
                : "contrast(1.02) saturate(0.95) brightness(0.95)",
          }}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-center text-cyan-100/40">
          <div className="space-y-1">
            <ImageIcon className="mx-auto h-10 w-10" />
            <p className="text-xs">Upload une image pour cette page</p>
          </div>
        </div>
      )}
      {page.template === "cover" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.18,
            backgroundImage:
              "radial-gradient(rgba(140,228,243,.35) 0.65px, transparent 0.8px), linear-gradient(180deg, rgba(5,10,15,0.05), rgba(5,10,15,0.4))",
            backgroundSize: "3px 3px, 100% 100%",
            mixBlendMode: "screen",
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/18" />
    </div>
  );
}
