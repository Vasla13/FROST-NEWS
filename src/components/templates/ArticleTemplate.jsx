import { CalendarDays, Clock3, FileText, Image as ImageIcon, Quote, UserRound } from "lucide-react";

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

function estimateReadTime(paragraphs) {
  const words = paragraphs
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
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

  const textWidth = clamp(page.articleTextWidth ?? 42, 30, 72);
  const titleSize = clamp(page.articleTitleSize ?? 5.8, 3.5, 7.2);
  const sideVisualHeight = clamp(page.articleHeroHeight ?? 46, 28, 72);
  const bodyColumns = clamp(Math.round(page.articleBodyColumns ?? 1), 1, 2);
  const rawParagraphs = splitParagraphs(page.body);
  const paragraphs = rawParagraphs.length ? rawParagraphs : ["Bloc de texte principal. Colle ton article ici."];
  const readingMinutes = estimateReadTime(paragraphs);

  const showImageCard = page.articleShowImageCard !== false;
  const showQuoteCard = page.articleShowQuoteCard !== false;
  const showSideColumn = showImageCard || showQuoteCard;
  const hasSplitSide = showImageCard && showQuoteCard;
  const splitQuoteHeight = hasSplitSide ? clamp(100 - sideVisualHeight - 2, 24, 36) : null;
  const splitImageHeight = hasSplitSide ? 100 - splitQuoteHeight - 2 : null;

  const subject = String(page.subject || "").trim() || "Titre du sujet";
  const subhead = String(page.subhead || "").trim() || "Resume court de la news avec un angle editorial clair.";
  const quoteAuthor = String(page.quoteAuthor || page.author || "Source").trim();
  const contentBottomInset = bottomInset + 1.35;

  return (
    <div data-frost-template="article" className="relative h-full w-full overflow-hidden" style={{ borderRadius: radius }}>
      <BackgroundPhoto page={page} styleObj={styleObj} disableOverlays />
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
          right: `${panelRightInset}%`,
          top: `${topInset}%`,
          bottom: `${bottomInset}%`,
          overflow: "hidden",
          borderTopRightRadius: radius,
          borderBottomRightRadius: radius,
          backdropFilter: "saturate(122%) brightness(1.02) contrast(1.01)",
          backgroundImage:
            "linear-gradient(180deg, rgba(8,18,36,0.22) 0%, rgba(7,15,32,0.18) 40%, rgba(4,10,24,0.3) 100%), repeating-linear-gradient(to bottom, rgba(160,246,255,0.1) 0px, rgba(160,246,255,0.1) 1px, rgba(9,22,38,0) 2px, rgba(9,22,38,0) 4px), radial-gradient(circle at 22% 18%, rgba(120,244,255,0.1) 0%, rgba(120,244,255,0) 40%), radial-gradient(circle at 86% 86%, rgba(121,101,255,0.08) 0%, rgba(121,101,255,0) 42%)",
          backgroundSize: "100% 100%, 100% 8px, 100% 100%, 100% 100%",
          backgroundPosition: "0 0, 0 0, 0 0, 0 0",
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
        className="absolute z-[14] rounded-[12px]"
        style={{
          left: `${leftOffset + 0.55}%`,
          right: `${panelRightInset + 0.55}%`,
          top: `${topInset + 0.65}%`,
          bottom: `${bottomInset + 0.65}%`,
          border: `1px solid ${styleObj.cyan}4a`,
          boxShadow: page.glow
            ? `0 0 18px ${styleObj.blueGlow}3a, inset 0 0 14px ${styleObj.blueGlow}22, inset 0 0 0 1px rgba(255,255,255,0.03)`
            : `inset 0 0 0 1px ${styleObj.cyan}1f`,
        }}
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
            className="relative overflow-hidden rounded-[11px] border"
            style={{
              borderColor: `${styleObj.cyan}4f`,
              background: "linear-gradient(92deg, rgba(4,13,24,0.84) 0%, rgba(8,22,40,0.68) 54%, rgba(18,10,35,0.55) 100%)",
              boxShadow: page.glow ? `0 0 12px ${styleObj.blueGlow}30` : `inset 0 0 0 1px ${styleObj.cyan}16`,
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${styleObj.cyan} 34%, transparent 78%)`,
              }}
            />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-[1.8%]">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="font-frost-tech inline-flex items-center gap-1.5 rounded border px-2.5 py-[2px] text-[clamp(10px,1.04cqw,14px)] font-bold uppercase tracking-[0.1em]"
                  style={{
                    borderColor: `${styleObj.cyan}70`,
                    color: styleObj.cyanSoft,
                    background: "rgba(2,9,16,0.58)",
                    fontFamily: styleObj.fontTech || "var(--font-tech)",
                  }}
                >
                  <FileText className="h-3.5 w-3.5" /> {page.kicker}
                </div>
                <div
                  className="font-frost-tech rounded border px-2.5 py-[2px] text-[clamp(10px,0.98cqw,14px)] uppercase tracking-[0.08em]"
                  style={{
                    borderColor: `${styleObj.cyan}56`,
                    color: styleObj.cyan,
                    background: "rgba(1,8,14,0.52)",
                    fontFamily: styleObj.fontTech || "var(--font-tech)",
                  }}
                >
                  {page.section}
                </div>
              </div>
              {page.showTopMeta && (
                <div
                  className="font-frost-tech flex flex-wrap items-center gap-x-3 gap-y-1 text-[clamp(10px,0.98cqw,14px)] uppercase"
                  style={{ color: `${styleObj.cyanSoft}e5`, fontFamily: styleObj.fontTech || "var(--font-tech)" }}
                >
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" /> {page.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <UserRound className="h-3.5 w-3.5" /> {page.author}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" /> {readingMinutes} min
                  </span>
                </div>
              )}
            </div>
          </div>

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
              <div className="font-frost-tech mb-1 inline-flex items-center gap-2 uppercase tracking-[0.09em]" style={{ color: styleObj.cyanSoft, fontFamily: styleObj.fontTech || "var(--font-tech)", fontSize: `clamp(11px, ${cq(1.18)}, 16px)` }}>
                <span
                  className="rounded border px-2 py-[1px]"
                  style={{
                    borderColor: `${styleObj.cyan}62`,
                    background: "rgba(2,9,16,0.58)",
                    color: styleObj.cyan,
                  }}
                >
                  {page.issue}
                </span>
                dossier editorial
              </div>
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

          <div
            className="grid min-h-0 flex-1 gap-[1.8%]"
            style={{
              gridTemplateColumns: showSideColumn ? `minmax(0, ${textWidth}%) minmax(0, 1fr)` : "1fr",
            }}
          >
            <div
              className="flex min-h-0 flex-col overflow-hidden rounded-[14px] border"
              style={{
                borderColor: `${styleObj.cyan}42`,
                background: "rgba(4,12,22,0.76)",
                boxShadow: `inset 0 0 0 1px ${styleObj.cyan}20`,
              }}
            >
              <div
                className="font-frost-tech flex items-center justify-between border-b px-3 py-2 uppercase"
                style={{
                  borderColor: `${styleObj.cyan}30`,
                  color: styleObj.cyanSoft,
                  fontFamily: styleObj.fontTech || "var(--font-tech)",
                  fontSize: `clamp(13px, ${cq(1.44)}, 21px)`,
                }}
              >
                <span className="tracking-[0.11em]">Flux principal</span>
                <span className="opacity-90">
                  {page.issue} / {page.date} / {bodyColumns} col
                </span>
              </div>
              <div className="min-h-0 flex-1 overflow-auto px-4 pb-4 pt-3.5">
                <div
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
            </div>

            {showSideColumn && (
              <div className="flex min-h-0 flex-col gap-[2%]">
                {showQuoteCard && (
                  <div
                    className={`${hasSplitSide ? "shrink-0" : "flex-1"} relative overflow-hidden rounded-[14px] border px-3 py-3`}
                    style={{
                      height: hasSplitSide ? `${splitQuoteHeight}%` : undefined,
                      borderColor: `${styleObj.cyan}5f`,
                      background: "linear-gradient(160deg, rgba(7,20,36,0.9) 0%, rgba(3,10,18,0.86) 55%, rgba(11,34,59,0.8) 100%)",
                      boxShadow: page.glow ? `0 0 14px ${styleObj.blueGlow}2f inset` : `inset 0 0 0 1px ${styleObj.cyan}25`,
                    }}
                    >
                      <div
                        className="pointer-events-none absolute right-2 top-[-8px] text-[clamp(40px,4.8cqw,72px)] font-black leading-none"
                        style={{ color: `${styleObj.cyan}33`, fontFamily: styleObj.fontDisplay || "var(--font-display)" }}
                      >
                      "
                    </div>
                    <div
                      className="font-frost-tech mb-2 inline-flex items-center gap-1 text-[clamp(11px,1.1cqw,15px)] uppercase tracking-[0.1em]"
                      style={{ color: styleObj.cyanSoft, fontFamily: styleObj.fontTech || "var(--font-tech)" }}
                    >
                      <Quote className="h-3.5 w-3.5" /> Citation
                    </div>
                    <div
                      className="font-frost-tech text-[clamp(17px,1.95cqw,30px)] leading-[1.28]"
                      style={{
                        color: styleObj.cyanSoft,
                        fontFamily: styleObj.fontTech || "var(--font-tech)",
                        textShadow: page.glow ? `0 0 10px ${styleObj.blueGlow}40` : "none",
                      }}
                    >
                      {page.quote}
                    </div>
                    <div
                      className="font-frost-tech mt-3 inline-flex rounded border px-2 py-1 text-[clamp(11px,1.02cqw,14px)] uppercase"
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
                )}

                {showImageCard && (
                  <div
                    className={`relative overflow-hidden rounded-[14px] border ${hasSplitSide ? "shrink-0" : "flex-1"}`}
                    style={{
                      height: hasSplitSide ? `${splitImageHeight}%` : undefined,
                      borderColor: `${styleObj.cyan}42`,
                      background: "rgba(3,10,19,0.85)",
                    }}
                    >
                    {page.imageUrl ? (
                      <>
                        <img
                          src={page.imageUrl}
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
                    <div
                      className="font-frost-tech absolute bottom-2 right-2 rounded border px-2 py-[2px] text-[clamp(10px,0.94cqw,13px)] uppercase"
                      style={{
                        borderColor: `${styleObj.cyan}45`,
                        color: `${styleObj.cyanSoft}d9`,
                        background: "rgba(2,8,15,0.55)",
                        fontFamily: styleObj.fontTech || "var(--font-tech)",
                      }}
                    >
                      live frame
                    </div>
                  </div>
                )}
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
