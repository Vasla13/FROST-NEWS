import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Quote } from "lucide-react";

import BackgroundPhoto from "../canvas/BackgroundPhoto";
import DecorativeCorners from "../canvas/DecorativeCorners";
import FrostVerticalBand from "../canvas/FrostVerticalBand";
import Grain from "../canvas/Grain";
import NeonBorder from "../canvas/NeonBorder";
import Scanlines from "../canvas/Scanlines";
import SideDevice from "../canvas/SideDevice";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function splitParagraphs(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function ArticleTemplate({ page, project }) {
  const styleObj = project.style;
  const cq = (value) => `calc(var(--frost-cq, 1px) * ${value})`;
  const sideWidth = page.showDevice ? Math.max(page.sideDeviceWidth ?? 11.8, 11.8) : 0;
  const bandWidth = page.showVerticalBand === false ? 0 : Math.max(page.leftBandWidth ?? 13.2, 13.2);
  const leftOffset = sideWidth + bandWidth;
  const radius = project.meta.borderRadius;
  const topInset = page.showDevice ? page.journalTopInset ?? 0 : 0;
  const bottomInset = page.showDevice ? page.journalBottomInset ?? 0 : 0;
  const panelRightInset = page.showDevice ? page.journalRightInset ?? 0.8 : 0;

  const bodyWeight = clamp(page.articleTextWidth ?? page.articleBodyHeight ?? 68, 45, 90);
  const titleSize = clamp(page.articleTitleSize ?? 5.8, 3.5, 7.2);
  const visualWeight = clamp(page.articleHeroHeight ?? page.articleVisualHeight ?? 30, 18, 60);
  const bodyColumns = clamp(Math.round(page.articleBodyColumns ?? 1), 1, 2);
  const rawParagraphs = splitParagraphs(page.body);
  const paragraphs = rawParagraphs.length ? rawParagraphs : ["Bloc de texte principal. Colle ton article ici."];

  const showImageCard = page.articleShowImageCard !== false;
  const showQuoteCard = page.articleShowQuoteCard !== false;
  const hasSecondaryCards = showImageCard || showQuoteCard;
  const flowStackRef = useRef(null);
  const textContentRef = useRef(null);
  const [measuredTextShare, setMeasuredTextShare] = useState(null);

  const wordCount = paragraphs
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  const targetWords = bodyColumns === 2 ? 280 : 220;
  const contentDensityBase = clamp((wordCount - targetWords) / 260, -1, 1);
  const contentDensity = bodyColumns === 2 ? contentDensityBase * 0.82 : contentDensityBase;
  const quoteWordCount = String(page.quote || "")
    .split(/\s+/)
    .filter(Boolean).length;
  const fallbackTextShare = hasSecondaryCards
    ? clamp((bodyWeight / 100) + contentDensity * 0.18, 0.2, showImageCard && showQuoteCard ? 0.78 : 0.88)
    : 1;
  const textShare = hasSecondaryCards
    ? clamp(measuredTextShare ?? fallbackTextShare, 0.16, showImageCard && showQuoteCard ? 0.78 : 0.9)
    : 1;

  let textShareNorm = textShare;
  let quoteShareNorm = 0;
  let imageShareNorm = 0;

  if (showImageCard && showQuoteCard) {
    const remaining = Math.max(0.14, 1 - textShareNorm);
    const quoteTarget = clamp(0.12 + quoteWordCount / 320, 0.11, 0.24);
    const imageTarget = clamp(visualWeight / 100, 0.14, 0.72);
    const targetTotal = quoteTarget + imageTarget;
    quoteShareNorm = remaining * (quoteTarget / targetTotal);
    imageShareNorm = remaining * (imageTarget / targetTotal);
  } else if (showImageCard) {
    imageShareNorm = Math.max(0.12, 1 - textShareNorm);
  } else if (showQuoteCard) {
    quoteShareNorm = Math.max(0.12, 1 - textShareNorm);
  }

  const totalShare = textShareNorm + quoteShareNorm + imageShareNorm;
  if (totalShare > 0) {
    textShareNorm /= totalShare;
    quoteShareNorm /= totalShare;
    imageShareNorm /= totalShare;
  }

  const quoteFlex = showQuoteCard ? Math.max(10, quoteShareNorm * 100) : 0;
  const imageFlex = showImageCard ? Math.max(12, imageShareNorm * 100) : 0;

  const subject = String(page.subject || "").trim() || "Titre du sujet";
  const subhead = String(page.subhead || "").trim() || "Resume court de la news avec un angle editorial clair.";
  const quoteText = String(page.quote || "").trim() || "Ajoute une citation cle pour renforcer l'angle de l'article.";
  const quoteAuthor = String(page.quoteAuthor || page.author || "Source").trim();
  const visualImageUrl = String(page.articleImageUrl || page.imageUrl || "").trim();
  const contentBottomInset = bottomInset + 1.35;

  useEffect(() => {
    if (!hasSecondaryCards) {
      setMeasuredTextShare(null);
      return;
    }

    const stackElement = flowStackRef.current;
    const textContentElement = textContentRef.current;
    if (!stackElement || !textContentElement) {
      return;
    }

    const updateMeasuredShare = () => {
      const availableHeight = stackElement.clientHeight;
      if (availableHeight <= 0) {
        return;
      }

      const contentHeight = textContentElement.scrollHeight + 34;
      const minShare = showImageCard && showQuoteCard ? 0.2 : 0.16;
      const maxShare = showImageCard && showQuoteCard ? 0.78 : showImageCard ? 0.9 : 0.94;
      const nextShare = clamp(contentHeight / availableHeight, minShare, maxShare);
      setMeasuredTextShare((prev) => {
        if (prev === null || Math.abs(prev - nextShare) > 0.012) {
          return nextShare;
        }

        return prev;
      });
    };

    const rafId = requestAnimationFrame(updateMeasuredShare);
    let observer = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateMeasuredShare);
      observer.observe(stackElement);
      observer.observe(textContentElement);
    } else {
      window.addEventListener("resize", updateMeasuredShare);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (observer) {
        observer.disconnect();
      } else {
        window.removeEventListener("resize", updateMeasuredShare);
      }
    };
  }, [hasSecondaryCards, showImageCard, showQuoteCard, bodyColumns, page.body]);

  return (
    <div data-frost-template="article" className="relative h-full w-full overflow-hidden" style={{ borderRadius: radius }}>
      <BackgroundPhoto page={{ ...page, imageUrl: "" }} styleObj={styleObj} disableOverlays showPlaceholder={false} />
      {page.glow && <NeonBorder styleObj={styleObj} radius={radius} />}
      <SideDevice page={page} assets={project.assets} styleObj={styleObj} />
      {page.showVerticalBand !== false && bandWidth > 0 && (
        <FrostVerticalBand
          page={page}
          styleObj={styleObj}
          assets={project.assets}
          title="FROST REPORT"
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
          backdropFilter: "saturate(118%) brightness(1.01) contrast(1.02)",
          backgroundImage:
            "linear-gradient(180deg, rgba(7,16,31,0.2) 0%, rgba(5,12,24,0.28) 56%, rgba(4,10,22,0.34) 100%), radial-gradient(circle at 18% 14%, rgba(120,244,255,0.1) 0%, rgba(120,244,255,0) 44%), radial-gradient(circle at 82% 82%, rgba(106,226,255,0.07) 0%, rgba(106,226,255,0) 46%)",
          backgroundSize: "100% 100%, 100% 100%, 100% 100%",
          backgroundPosition: "0 0, 0 0, 0 0",
          boxShadow: page.glow
            ? `inset 0 0 18px ${styleObj.blueGlow}24, 0 0 18px rgba(91,236,255,0.09)`
            : "inset 0 0 18px rgba(5,14,28,0.24)",
        }}
      />
      <DecorativeCorners
        assets={project.assets}
        style={styleObj}
        page={page}
        panelLeft={leftOffset}
        bottomOffset={2.6}
        topInset={topInset + 2.6}
        bottomInset={bottomInset}
      />

      <div
        className="absolute z-20"
        style={{
          left: `${leftOffset + 1.2}%`,
          right: `${panelRightInset + 1.2}%`,
          top: `${topInset + 1.2}%`,
          bottom: `${contentBottomInset}%`,
        }}
      >
        <div className="flex h-full min-h-0 flex-col gap-[1.7%]">
          <div
            className="relative overflow-hidden rounded-[14px] border px-[2.25%] pb-[2.2%] pt-[2%]"
            style={{
              borderColor: `${styleObj.cyan}5a`,
              background:
                "linear-gradient(168deg, rgba(5,14,25,0.9) 0%, rgba(4,12,22,0.86) 52%, rgba(12,26,42,0.78) 100%)",
              boxShadow: page.glow
                ? `inset 0 0 16px ${styleObj.blueGlow}1d, inset 0 0 0 1px ${styleObj.cyan}2c`
                : `inset 0 0 0 1px ${styleObj.cyan}1f`,
            }}
          >
            <div
              className="pointer-events-none absolute inset-y-[14%] left-0 w-[3px]"
              style={{ background: `linear-gradient(180deg, ${styleObj.cyanSoft} 0%, ${styleObj.cyan} 100%)` }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-14"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, rgba(170,243,255,0.42) 0px, rgba(170,243,255,0.42) 1px, rgba(9,24,41,0.0) 2px, rgba(9,24,41,0.0) 4px)",
              }}
            />
            <div className="relative z-10">
              <h1
                className="font-frost-display font-black uppercase leading-[0.9]"
                style={{
                  color: "#F4FDFF",
                  fontFamily: styleObj.fontDisplay || "var(--font-display)",
                  fontSize: `clamp(30px, ${titleSize}cqw, 86px)`,
                  letterSpacing: "0.012em",
                  textShadow: page.glow ? `0 6px 20px rgba(0,0,0,0.45), 0 0 14px ${styleObj.blueGlow}2b` : "0 4px 16px rgba(0,0,0,0.45)",
                }}
              >
                {subject}
              </h1>
              <p
                className="font-frost-ui mt-2.5 max-w-[94%] leading-[1.4]"
                style={{
                  color: "#D4F0FA",
                  fontFamily: styleObj.fontUi || "var(--font-ui)",
                  fontSize: `clamp(14px, ${cq(1.66)}, 24px)`,
                }}
              >
                {subhead}
              </p>
            </div>
          </div>

          <div ref={flowStackRef} className="flex min-h-0 flex-1 flex-col gap-[1.8%]">
            <div
              className="frost-export-hide-scroll min-h-0 overflow-auto rounded-[14px] border px-4 pb-4 pt-4"
              style={{
                flexGrow: hasSecondaryCards ? 0 : 1,
                flexShrink: hasSecondaryCards ? 1 : 0,
                flexBasis: hasSecondaryCards ? "auto" : 0,
                maxHeight: hasSecondaryCards ? `${Math.max(20, textShareNorm * 100)}%` : undefined,
                borderColor: `${styleObj.cyan}42`,
                background: "rgba(4,12,22,0.76)",
                boxShadow: `inset 0 0 0 1px ${styleObj.cyan}20`,
              }}
            >
              <div
                ref={textContentRef}
                className="font-frost-ui leading-[1.72]"
                style={{
                  color: "#EAF8FF",
                  fontFamily: styleObj.fontUi || "var(--font-ui)",
                  fontSize: `clamp(15px, ${cq(1.7)}, 26px)`,
                  columnCount: bodyColumns,
                  columnGap: bodyColumns > 1 ? "1.65em" : undefined,
                }}
              >
                {paragraphs.map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 16)}-${index}`} className="mb-[0.9em] break-inside-avoid">
                    {index === 0 ? (
                      <>
                        <span
                          className="font-frost-display mr-1 inline-block align-top leading-[0.78]"
                          style={{
                            color: styleObj.cyanSoft,
                            fontFamily: styleObj.fontDisplay || "var(--font-display)",
                            fontSize: `clamp(30px, ${cq(3.2)}, 52px)`,
                          }}
                        >
                          {paragraph.slice(0, 1)}
                        </span>
                        {paragraph.slice(1)}
                      </>
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}
              </div>
            </div>

            {showQuoteCard && (
              <div
                className="relative overflow-hidden rounded-[14px] border px-[2.2%] py-[1.7%]"
                style={{
                  flexGrow: quoteFlex,
                  flexBasis: showImageCard ? 0 : undefined,
                  borderColor: `${styleObj.cyan}5f`,
                  background: "linear-gradient(160deg, rgba(7,20,36,0.9) 0%, rgba(3,10,18,0.86) 55%, rgba(11,34,59,0.8) 100%)",
                  boxShadow: page.glow ? `0 0 14px ${styleObj.blueGlow}2f inset` : `inset 0 0 0 1px ${styleObj.cyan}25`,
                }}
              >
                <div
                  className="pointer-events-none absolute right-2 top-[-8px] text-[clamp(34px,4.4cqw,64px)] font-black leading-none"
                  style={{ color: `${styleObj.cyan}2e`, fontFamily: styleObj.fontDisplay || "var(--font-display)" }}
                >
                  "
                </div>
                <div className="frost-export-hide-scroll relative z-10 min-h-0 max-h-full overflow-auto pr-1">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="mt-[2px] inline-flex shrink-0 items-center rounded border px-2 py-1"
                      style={{
                        borderColor: `${styleObj.cyan}5d`,
                        color: styleObj.cyanSoft,
                        background: "rgba(1,8,16,0.45)",
                      }}
                    >
                      <Quote className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className="font-frost-tech mb-1 text-[clamp(10px,1.04cqw,14px)] tracking-[0.1em]"
                        style={{ color: styleObj.cyanSoft, fontFamily: styleObj.fontTech || "var(--font-tech)" }}
                      >
                        Citation
                      </div>
                      <div
                        className="font-frost-ui text-[clamp(14px,1.45cqw,22px)] leading-[1.35]"
                        style={{
                          color: "#DDF4FF",
                          fontFamily: styleObj.fontUi || "var(--font-ui)",
                          textShadow: page.glow ? `0 0 10px ${styleObj.blueGlow}30` : "none",
                        }}
                      >
                        {quoteText}
                      </div>
                      <div
                        className="font-frost-tech mt-2 inline-flex rounded border px-2 py-1 text-[clamp(10px,0.95cqw,13px)] uppercase"
                        style={{
                          color: `${styleObj.cyanSoft}e8`,
                          borderColor: `${styleObj.cyan}55`,
                          background: "rgba(0,0,0,0.35)",
                          fontFamily: styleObj.fontTech || "var(--font-tech)",
                        }}
                      >
                        {quoteAuthor}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showImageCard && (
              <div
                className="relative min-h-0 overflow-hidden rounded-[14px] border"
                style={{
                  flexGrow: imageFlex,
                  flexBasis: 0,
                  borderColor: `${styleObj.cyan}42`,
                  background: "rgba(3,10,19,0.85)",
                }}
              >
                {visualImageUrl ? (
                  <>
                    <img
                      src={visualImageUrl}
                      alt="illustration article"
                      className="h-full w-full object-cover"
                      style={{
                        objectFit: page.imageFit || "cover",
                        objectPosition: `${page.imageX ?? 50}% ${page.imageY ?? 50}%`,
                        transform: `scale(${page.imageScale || 1})`,
                        filter: "contrast(1.05) saturate(1.14) brightness(0.84) hue-rotate(6deg)",
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(160deg, rgba(140,228,243,0.42) 0%, rgba(17,63,102,0.12) 44%, rgba(255,95,191,0.26) 100%)",
                        opacity: 0.28,
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(194deg, rgba(2,8,16,0.82) 6%, rgba(4,13,24,0.42) 46%, rgba(1,6,12,0.8) 100%)",
                        opacity: 0.24,
                      }}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-cyan-100/35">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-7 w-7" />
                      <div className="mt-1 text-[11px]">Ajoute une image</div>
                    </div>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/45" />
                <div
                  className="font-frost-tech absolute bottom-2 left-2 rounded border px-2 py-1 text-[clamp(10px,0.98cqw,14px)] uppercase"
                  style={{
                    borderColor: `${styleObj.cyan}5f`,
                    color: styleObj.cyanSoft,
                    background: "rgba(0,0,0,0.5)",
                    fontFamily: styleObj.fontTech || "var(--font-tech)",
                  }}
                >
                  Zone visuelle
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[15]" style={{ boxShadow: "inset 0 0 88px rgba(0,0,0,0.5)" }} />
      {page.showScanlines && <Scanlines opacity={0.06} />}
      {page.grain && <Grain opacity={0.05} />}
    </div>
  );
}
