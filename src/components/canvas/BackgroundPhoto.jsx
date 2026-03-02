import { Image as ImageIcon } from "lucide-react";

import { clamp } from "../../lib/project-utils";

export default function BackgroundPhoto({ page, styleObj, disableOverlays = false, showPlaceholder = true }) {
  const backgroundStyle =
    page.bgMode === "solid"
      ? { background: page.bgColor || styleObj.dark }
      : {
          background: `radial-gradient(circle at 65% 18%, ${styleObj.cyan}22, transparent 45%), linear-gradient(180deg, ${styleObj.panel}, ${styleObj.dark})`,
        };
  const imageFilter =
    page.template === "cover"
      ? "contrast(1.04) saturate(1.2) brightness(1.02) hue-rotate(8deg)"
      : "contrast(1.04) saturate(1.14) brightness(0.9) hue-rotate(6deg)";

  return (
    <div data-frost-export-bg-root className="absolute inset-0 z-0" style={backgroundStyle}>
      {page.imageUrl ? (
        <>
          <img
            data-frost-export-bg-photo
            src={page.imageUrl}
            alt="article visual"
            className="absolute inset-0 h-full w-full"
            style={{
              objectFit: page.imageFit || "cover",
              objectPosition: `${clamp(page.imageX, 0, 100)}% ${clamp(page.imageY, 0, 100)}%`,
              transform: `scale(${page.imageScale || 1})`,
              transformOrigin: "50% 50%",
              opacity: page.opacityPhoto ?? 1,
              filter: imageFilter,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(158deg, rgba(140,228,243,0.46) 2%, rgba(23,88,128,0.14) 43%, rgba(255,94,194,0.28) 100%)",
              opacity: page.template === "cover" ? 0.34 : 0.28,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(192deg, rgba(2,9,17,0.82) 8%, rgba(4,14,24,0.46) 44%, rgba(2,8,15,0.78) 100%)",
              opacity: page.template === "cover" ? 0.3 : 0.24,
            }}
          />
        </>
      ) : showPlaceholder ? (
        <div className="absolute inset-0 grid place-items-center text-center text-cyan-100/40">
          <div className="space-y-1">
            <ImageIcon className="mx-auto h-10 w-10" />
            <p className="text-xs">Upload une image pour cette page</p>
          </div>
        </div>
      ) : null}
      {page.template === "cover" && !disableOverlays && (
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
      {!disableOverlays && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/18" />}
    </div>
  );
}
