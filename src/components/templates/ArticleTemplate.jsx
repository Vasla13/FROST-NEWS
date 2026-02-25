import { CalendarDays, FileText, Image as ImageIcon, Quote, UserRound } from "lucide-react";

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
  const sideWidth = page.showDevice ? Math.max(page.sideDeviceWidth ?? 11.8, 11.8) : 0;
  const bandWidth = page.showVerticalBand === false ? 0 : Math.max(page.leftBandWidth ?? 13.2, 13.2);
  const leftOffset = sideWidth + bandWidth;
  const radius = project.meta.borderRadius;
  const topInset = page.showDevice ? page.journalTopInset ?? 0 : 0;
  const bottomInset = page.showDevice ? page.journalBottomInset ?? 0 : 0;
  const panelRightInset = page.showDevice ? page.journalRightInset ?? 0 : 0;

  const textWidth = clamp(page.articleTextWidth ?? 42, 30, 72);
  const titleSize = clamp(page.articleTitleSize ?? 5.8, 3.5, 7.2);
  const sideVisualHeight = clamp(page.articleHeroHeight ?? 46, 28, 72);
  const bodyColumns = clamp(Math.round(page.articleBodyColumns ?? 1), 1, 2);
  const paragraphs = splitParagraphs(page.body);

  const showImageCard = page.articleShowImageCard !== false;
  const showQuoteCard = page.articleShowQuoteCard !== false;
  const showSideColumn = showImageCard || showQuoteCard;
  const hasSplitSide = showImageCard && showQuoteCard;

  const subject = String(page.subject || "").trim() || "Titre du sujet";
  const subhead = String(page.subhead || "").trim() || "Resume court de la news avec un angle editorial clair.";
  const quoteAuthor = String(page.quoteAuthor || page.author || "Source").trim();

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: radius }}>
      <BackgroundPhoto page={page} styleObj={styleObj} />
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
      <DecorativeCorners
        assets={project.assets}
        style={styleObj}
        page={page}
        panelLeft={leftOffset}
        bottomOffset={2.4}
        topInset={topInset + 2.6}
        bottomInset={bottomInset}
      />

      <div
        className="absolute z-[6]"
        style={{ left: `${leftOffset}%`, right: `${panelRightInset}%`, top: `${topInset}%`, bottom: `${bottomInset}%` }}
      >
        <div className="absolute inset-0 bg-black/56" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(101,220,242,0.09) 0%, rgba(3,9,17,0.1) 20%, rgba(0,0,0,0.44) 100%)",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute z-[14] rounded-[10px]"
        style={{
          left: `${leftOffset + 0.6}%`,
          right: `${panelRightInset + 0.7}%`,
          top: `${topInset + 0.8}%`,
          bottom: `${bottomInset + 0.8}%`,
          border: `1px solid ${styleObj.cyan}52`,
          boxShadow: page.glow
            ? `0 0 16px ${styleObj.blueGlow}44, inset 0 0 14px ${styleObj.blueGlow}22`
            : `inset 0 0 0 1px ${styleObj.cyan}1f`,
        }}
      />

      <div
        className="absolute z-20"
        style={{
          left: `${leftOffset + 1.35}%`,
          right: `${panelRightInset + 1.35}%`,
          top: `${topInset + 1.8}%`,
          bottom: `${bottomInset + 1.8}%`,
        }}
      >
        <div className="flex h-full min-h-0 flex-col gap-[2%]">
          {page.showTopMeta && (
            <div
              className="font-frost-tech flex flex-wrap items-center gap-x-4 gap-y-1 rounded-[10px] border px-3 py-2 text-[clamp(11px,1.12cqw,15px)] uppercase"
              style={{
                borderColor: `${styleObj.cyan}42`,
                color: `${styleObj.cyanSoft}de`,
                background: "rgba(3,10,18,0.7)",
                fontFamily: styleObj.fontTech || "var(--font-tech)",
              }}
            >
              <span className="rounded border px-2 py-[1px]" style={{ borderColor: `${styleObj.cyan}4f`, color: styleObj.cyan }}>
                {page.issue}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> {page.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <UserRound className="h-3.5 w-3.5" /> {page.author}
              </span>
            </div>
          )}

          <div
            className="rounded-[14px] border px-[2.2%] py-[2.2%]"
            style={{
              borderColor: `${styleObj.cyan}45`,
              background: "rgba(4,13,24,0.82)",
              boxShadow: `inset 0 0 0 1px ${styleObj.cyan}1f`,
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div
                className="font-frost-tech inline-flex items-center gap-2 rounded border px-3 py-1 text-[clamp(11px,1.15cqw,16px)] font-bold tracking-[0.12em]"
                style={{
                  borderColor: `${styleObj.cyan}70`,
                  color: styleObj.cyanSoft,
                  background: "rgba(1,8,14,0.6)",
                  fontFamily: styleObj.fontTech || "var(--font-tech)",
                }}
              >
                <FileText className="h-3.5 w-3.5" /> {page.kicker}
              </div>
              <div
                className="font-frost-tech rounded border px-2 py-[2px] text-[clamp(11px,1.08cqw,15px)] uppercase"
                style={{
                  borderColor: `${styleObj.cyan}55`,
                  color: styleObj.cyan,
                  background: "rgba(3,10,18,0.65)",
                  fontFamily: styleObj.fontTech || "var(--font-tech)",
                }}
              >
                {page.section}
              </div>
            </div>

            <h1
              className="font-frost-display mt-2.5 font-black uppercase leading-[0.92]"
              style={{
                color: "#F4FDFF",
                fontFamily: styleObj.fontDisplay || "var(--font-display)",
                fontSize: `clamp(26px, ${titleSize}cqw, 82px)`,
                letterSpacing: "0.012em",
                textShadow: "0 5px 20px rgba(0,0,0,0.45)",
              }}
            >
              {subject}
            </h1>

            <p
              className="font-frost-ui mt-2 text-[clamp(14px,1.68cqw,24px)] leading-[1.42]"
              style={{ color: "#CDEBF8", fontFamily: styleObj.fontUi || "var(--font-ui)" }}
            >
              {subhead}
            </p>
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
                className="font-frost-tech flex items-center justify-between border-b px-3 py-2 text-[clamp(12px,1.25cqw,17px)] uppercase"
                style={{
                  borderColor: `${styleObj.cyan}30`,
                  color: styleObj.cyanSoft,
                  fontFamily: styleObj.fontTech || "var(--font-tech)",
                }}
              >
                <span className="tracking-[0.11em]">Flux principal</span>
                <span className="opacity-90">
                  {page.issue} / {page.date}
                </span>
              </div>
              <div className="min-h-0 flex-1 overflow-auto px-4 pb-4 pt-3.5">
                <div
                  className="font-frost-ui text-[clamp(15px,1.7cqw,26px)] leading-[1.72]"
                  style={{
                    color: "#EAF8FF",
                    fontFamily: styleObj.fontUi || "var(--font-ui)",
                    columnCount: bodyColumns,
                    columnGap: bodyColumns > 1 ? "1.65em" : undefined,
                  }}
                >
                  {(paragraphs.length ? paragraphs : ["Bloc de texte principal. Colle ton article ici."]).map((paragraph, index) => (
                    <p key={`${paragraph.slice(0, 16)}-${index}`} className="mb-[0.9em] break-inside-avoid">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {showSideColumn && (
              <div className="flex min-h-0 flex-col gap-[2%]">
                {showQuoteCard && (
                  <div
                    className={`${showImageCard ? "flex-1 min-h-[36%]" : "flex-1"} relative overflow-hidden rounded-[14px] border px-3 py-3`}
                    style={{
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
                    className={`relative overflow-hidden rounded-[14px] border ${hasSplitSide ? "mt-auto shrink-0" : "flex-1"}`}
                    style={{
                      height: hasSplitSide ? `${sideVisualHeight}%` : undefined,
                      borderColor: `${styleObj.cyan}42`,
                      background: "rgba(3,10,19,0.85)",
                    }}
                  >
                    {page.imageUrl ? (
                      <img
                        src={page.imageUrl}
                        alt="illustration article"
                        className="h-full w-full object-cover"
                        style={{
                          objectFit: page.imageFit || "cover",
                          objectPosition: `${page.imageX ?? 50}% ${page.imageY ?? 50}%`,
                          transform: `scale(${page.imageScale || 1})`,
                          filter: "contrast(1.03) saturate(0.95) brightness(0.86)",
                        }}
                      />
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
                      className="font-frost-tech absolute left-2 top-2 rounded border px-2 py-1 text-[clamp(10px,0.98cqw,14px)] uppercase"
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
