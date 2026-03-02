import { ArrowRight, Image as ImageIcon, LayoutTemplate } from "lucide-react";

import BackgroundPhoto from "../canvas/BackgroundPhoto";
import FrostVerticalBand from "../canvas/FrostVerticalBand";
import Grain from "../canvas/Grain";
import NeonBorder from "../canvas/NeonBorder";
import Scanlines from "../canvas/Scanlines";
import SideDevice from "../canvas/SideDevice";

function getShortBody(text) {
  const cleaned = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) {
    return "Mets une phrase courte pour presenter ton offre.";
  }

  const parts = cleaned
    .split(/[.!?]\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) {
    return cleaned;
  }

  return `${parts.slice(0, 2).join(". ")}.`;
}

export default function AdTemplate({ page, project }) {
  const styleObj = project.style;
  const cq = (value) => `calc(var(--frost-cq, 1px) * ${value})`;
  const sideWidth = page.showDevice ? Math.max(page.sideDeviceWidth ?? 11.8, 9.2) : 0;
  const bandWidth = page.showVerticalBand === false ? 0 : Math.max(page.leftBandWidth ?? 13.2, 9.5);
  const leftOffset = sideWidth + bandWidth;
  const radius = project.meta.borderRadius;
  const topInset = page.showDevice ? page.journalTopInset ?? 0 : 0;
  const bottomInset = page.showDevice ? page.journalBottomInset ?? 0 : 0;
  const panelRightInset = page.showDevice ? page.journalRightInset ?? 0.8 : 0;

  const mode = page.adLayoutMode === "text-image" ? "text-image" : "image-dominant";
  const headline = String(page.subject || "").trim() || "Votre campagne ici";
  const bodyText = String(page.body || "").trim() || "Formats premium pour une visibilite maximale sur Frost News.";
  const shortBody = getShortBody(bodyText);
  const ctaText = String(page.cta || "").trim() || "Contacte l'equipe Frost Ads";
  const badgeText = String(page.kicker || "").trim() || "PUBLICITE";

  const visualPanel = (
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-[14px]" style={{ background: "rgba(3,10,19,0.86)" }}>
      {page.imageUrl ? (
        <>
          <img
            src={page.imageUrl}
            alt="pub"
            className="h-full w-full object-cover"
            style={{
              objectFit: page.imageFit || "cover",
              objectPosition: `${page.imageX ?? 50}% ${page.imageY ?? 50}%`,
              transform: `scale(${page.imageScale || 1})`,
              filter: "contrast(1.08) saturate(1.14) brightness(0.86) hue-rotate(6deg)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, rgba(140,228,243,0.42) 0%, rgba(20,66,104,0.12) 40%, rgba(255,95,191,0.26) 100%)",
              opacity: 0.28,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(192deg, rgba(2,8,16,0.82) 8%, rgba(4,13,24,0.4) 45%, rgba(2,8,15,0.78) 100%)",
              opacity: 0.24,
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center text-cyan-100/45">
          <div className="text-center">
            <ImageIcon className="mx-auto h-10 w-10" />
            <div className="mt-2 text-sm">Ajoute un visuel sponsor</div>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/58" />
    </div>
  );

  return (
    <div data-frost-template="ad" className="relative h-full w-full overflow-hidden" style={{ borderRadius: radius }}>
      <BackgroundPhoto page={{ ...page, imageUrl: "" }} styleObj={styleObj} disableOverlays showPlaceholder={false} />
      {page.glow && <NeonBorder styleObj={styleObj} radius={radius} />}
      <SideDevice page={page} assets={project.assets} styleObj={styleObj} />
      {page.showVerticalBand !== false && bandWidth > 0 && (
        <FrostVerticalBand
          page={page}
          styleObj={styleObj}
          assets={project.assets}
          title="FROST ADS"
          topInset={topInset}
          bottomInset={bottomInset}
        />
      )}
      <div
        className="pointer-events-none absolute z-[10]"
        style={{
          left: `${leftOffset}%`,
          right: 0,
          top: `${topInset}%`,
          bottom: `${bottomInset}%`,
          overflow: "hidden",
          borderTopRightRadius: radius,
          borderBottomRightRadius: radius,
          backdropFilter: "saturate(130%) brightness(1.02) contrast(1.03)",
          backgroundImage:
            "linear-gradient(180deg, rgba(7,16,31,0.24) 0%, rgba(5,12,24,0.3) 58%, rgba(4,10,22,0.38) 100%), repeating-linear-gradient(to bottom, rgba(160,246,255,0.11) 0px, rgba(160,246,255,0.11) 1px, rgba(9,22,38,0) 2px, rgba(9,22,38,0) 4px), radial-gradient(circle at 18% 14%, rgba(120,244,255,0.1) 0%, rgba(120,244,255,0) 42%), radial-gradient(circle at 84% 88%, rgba(106,226,255,0.08) 0%, rgba(106,226,255,0) 45%)",
          backgroundSize: "100% 100%, 100% 8px, 100% 100%, 100% 100%",
          boxShadow: page.glow
            ? `inset 0 0 18px ${styleObj.blueGlow}24, 0 0 18px rgba(91,236,255,0.09)`
            : "inset 0 0 18px rgba(5,14,28,0.24)",
        }}
      />
      <div
        className="absolute z-20"
        style={{
          left: `${leftOffset + 1.2}%`,
          right: `${panelRightInset + 1.2}%`,
          top: `${topInset + 1.2}%`,
          bottom: `${bottomInset + 1.3}%`,
        }}
      >
        <div
          className="relative h-full overflow-hidden rounded-[16px] border p-[2.2%]"
          style={{
            borderColor: `${styleObj.cyan}5f`,
            background: "linear-gradient(162deg, rgba(5,14,25,0.9) 0%, rgba(4,12,22,0.86) 55%, rgba(10,28,48,0.8) 100%)",
            boxShadow: page.glow
              ? `0 0 18px ${styleObj.blueGlow}30, inset 0 0 14px ${styleObj.blueGlow}20, inset 0 0 0 1px ${styleObj.cyan}24`
              : `inset 0 0 0 1px ${styleObj.cyan}1a`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-16"
            style={{
              background:
                "radial-gradient(circle at 12% 20%, rgba(140,228,243,0.32) 0%, rgba(140,228,243,0) 28%), radial-gradient(circle at 88% 84%, rgba(255,94,194,0.2) 0%, rgba(255,94,194,0) 30%)",
            }}
          />
          <div className="relative z-10 flex h-full min-h-0 flex-col gap-[2.1%]">
            <div
              className="font-frost-tech inline-flex w-fit items-center gap-2 rounded px-2.5 py-1 text-[clamp(10px,1.02cqw,14px)] font-bold uppercase tracking-[0.11em]"
              style={{
                color: styleObj.cyanSoft,
                background: "rgba(2,9,16,0.58)",
                fontFamily: styleObj.fontTech || "var(--font-tech)",
              }}
            >
              <LayoutTemplate className="h-3.5 w-3.5" /> {badgeText}
            </div>

            <div className="relative">
              <h1
                className="font-frost-display uppercase leading-[0.9]"
                style={{
                  color: "#F4FDFF",
                  fontFamily: styleObj.fontDisplay || "var(--font-display)",
                  fontSize: `clamp(30px, ${cq(5.1)}, 78px)`,
                  letterSpacing: "0.012em",
                  textShadow: page.glow ? `0 5px 16px rgba(0,0,0,0.45), 0 0 12px ${styleObj.blueGlow}36` : "0 4px 14px rgba(0,0,0,0.45)",
                }}
              >
                {headline}
              </h1>
              <p
                className="font-frost-ui mt-2 max-w-[94%] leading-[1.35]"
                style={{
                  color: "#D8F3FC",
                  fontFamily: styleObj.fontUi || "var(--font-ui)",
                  fontSize: `clamp(13px, ${cq(1.3)}, 19px)`,
                }}
              >
                {shortBody}
              </p>
              <div
                className="pointer-events-none mt-[1.4%] h-[1px] w-full"
                style={{ background: `linear-gradient(90deg, ${styleObj.cyan}aa 0%, ${styleObj.cyan}26 78%, rgba(0,0,0,0) 100%)` }}
              />
            </div>

            {mode === "image-dominant" ? (
              <>
                {visualPanel}
                <div
                  className="font-frost-tech inline-flex items-center justify-center gap-2 rounded px-3.5 py-2.5 text-center font-semibold"
                  style={{
                    color: styleObj.cyanSoft,
                    background: "rgba(2,8,16,0.56)",
                    fontFamily: styleObj.fontTech || "var(--font-tech)",
                    fontSize: `clamp(12px, ${cq(1.2)}, 17px)`,
                    textShadow: page.glow ? `0 0 10px ${styleObj.blueGlow}40` : "none",
                  }}
                >
                  {ctaText} <ArrowRight className="h-4 w-4" />
                </div>
              </>
            ) : (
              <div className="grid min-h-0 flex-1 gap-[2.2%]" style={{ gridTemplateColumns: "minmax(0, 0.42fr) minmax(0, 0.58fr)" }}>
                <div
                  className="frost-export-hide-scroll flex min-h-0 flex-col overflow-auto rounded-[12px] px-[1.2%] py-[0.6%]"
                  style={{ background: "rgba(2,8,16,0.24)" }}
                >
                  <p
                    className="font-frost-ui mt-[0.6%] leading-[1.45]"
                    style={{
                      color: "#D6F2FB",
                      fontFamily: styleObj.fontUi || "var(--font-ui)",
                      fontSize: `clamp(13px, ${cq(1.42)}, 21px)`,
                    }}
                  >
                    {bodyText}
                  </p>
                  <div
                    className="font-frost-tech mt-auto inline-flex items-center justify-center gap-2 rounded px-3.5 py-2.5 text-center font-semibold"
                    style={{
                      color: styleObj.cyanSoft,
                      background: "rgba(2,8,16,0.56)",
                      fontFamily: styleObj.fontTech || "var(--font-tech)",
                      fontSize: `clamp(12px, ${cq(1.22)}, 17px)`,
                      textShadow: page.glow ? `0 0 10px ${styleObj.blueGlow}40` : "none",
                    }}
                  >
                    {ctaText} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {visualPanel}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[15]" style={{ boxShadow: "inset 0 0 88px rgba(0,0,0,0.45)" }} />
      {page.showScanlines && <Scanlines opacity={0.07} />}
      {page.grain && <Grain opacity={0.05} />}
    </div>
  );
}
