import BackgroundPhoto from "../canvas/BackgroundPhoto";
import DecorativeCorners from "../canvas/DecorativeCorners";
import FrostVerticalBand from "../canvas/FrostVerticalBand";
import Grain from "../canvas/Grain";
import MetaStrip from "../canvas/MetaStrip";
import NeonBorder from "../canvas/NeonBorder";
import Scanlines from "../canvas/Scanlines";
import SideDevice from "../canvas/SideDevice";

export default function CoverTemplate({ page, project, dimensions }) {
  const styleObj = project.style;
  const sideWidth = page.showDevice ? page.sideDeviceWidth : 0;
  const bandWidth = page.showVerticalBand === false ? 0 : page.leftBandWidth;
  const leftOffset = sideWidth + bandWidth;
  const radius = project.meta.borderRadius;
  const showHeadline = page.showHeadline !== false;
  const showTicker = page.showTicker !== false;
  const showCoverCorners = page.showCorners;
  const topInset = page.showDevice ? page.journalTopInset ?? 0 : 0;
  const bottomInset = page.showDevice ? page.journalBottomInset ?? 0 : 0;
  const panelRightInset = page.showDevice ? page.journalRightInset ?? 3 : 0;
  const tickerHeight = Math.min(page.tickerHeight ?? 7.4, 8);
  const tickerBottom = bottomInset + 0.1;

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
          topInset={topInset}
          bottomInset={bottomInset}
        />
      )}

      <div
        className="absolute z-[5]"
        style={{ left: `${leftOffset}%`, right: `${panelRightInset}%`, top: `${topInset}%`, bottom: `${bottomInset}%` }}
      >
        <div className="absolute inset-0 bg-black/12" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[24%]"
          style={{ background: `linear-gradient(180deg, ${styleObj.blueGlow}26 0%, transparent 100%)` }}
        />
      </div>
      <div
        className="pointer-events-none absolute z-[16] rounded-[10px]"
        style={{
          left: `${leftOffset + 0.35}%`,
          right: `${panelRightInset + 0.8}%`,
          top: `${topInset + 0.8}%`,
          bottom: `${bottomInset + 0.8}%`,
          border: `1px solid ${styleObj.cyan}66`,
          boxShadow: page.glow
            ? `0 0 18px ${styleObj.blueGlow}66, inset 0 0 20px ${styleObj.blueGlow}22`
            : `inset 0 0 0 1px ${styleObj.cyan}22`,
        }}
      />
      <div
        className="pointer-events-none absolute z-[16]"
        style={{
          left: `${leftOffset + 0.4}%`,
          right: `${panelRightInset + 0.9}%`,
          top: `${topInset + 0.5}%`,
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${styleObj.blueGlow}cc 45%, ${styleObj.blueGlow}cc 55%, transparent 100%)`,
          opacity: 0.85,
        }}
      />

      {page.showTopMeta && <MetaStrip page={page} assets={project.assets} styleObj={styleObj} topInset={topInset} />}
      {showCoverCorners && (
        <DecorativeCorners
          assets={project.assets}
          style={styleObj}
          page={page}
          panelLeft={leftOffset}
          topInset={topInset}
          bottomInset={bottomInset}
        />
      )}

      {showHeadline && (
        <>
          <div
            className="absolute z-30 flex items-center overflow-hidden"
            style={{
              left: `${leftOffset + 1.5}%`,
              right: `${2.5 + panelRightInset}%`,
              top: `${page.headlineBarY}%`,
              height: `${page.headlineBarH}%`,
              background: "rgba(6,14,28,0.92)",
              border: `1px solid ${styleObj.cyan}66`,
              boxShadow: page.glow ? `0 0 14px ${styleObj.blueGlow}50` : "none",
            }}
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{ background: `linear-gradient(90deg, transparent 0%, ${styleObj.cyan} 35%, transparent 70%)` }}
            />
            <div
              className="font-frost-pixel relative z-10 w-full px-4 text-center font-black tracking-wide"
              style={{
                fontFamily: styleObj.fontPixel || "var(--font-pixel)",
                color: styleObj.cyanSoft,
                fontSize: `clamp(18px, ${(page.headlineFont || 4.6)}cqw, 58px)`,
                textShadow: page.glow ? `0 0 10px ${styleObj.blueGlow}66` : "none",
              }}
            >
              {page.subject}
            </div>
          </div>
          <div
            className="absolute z-30"
            style={{
              left: `${leftOffset + 1.1}%`,
              top: `calc(${page.headlineBarY}% - 0.9%)`,
              width: "clamp(20px, 2.7cqw, 42px)",
              height: "clamp(20px, 2.7cqw, 42px)",
              borderLeft: `2px solid ${styleObj.cyanSoft}`,
              borderTop: `2px solid ${styleObj.cyanSoft}`,
              opacity: 0.9,
            }}
          />
          <div
            className="absolute z-30"
            style={{
              right: `${2.1 + panelRightInset}%`,
              top: `${page.headlineBarY + page.headlineBarH - 1}%`,
              width: "clamp(20px, 2.7cqw, 42px)",
              height: "clamp(20px, 2.7cqw, 42px)",
              borderRight: `2px solid ${styleObj.cyanSoft}`,
              borderBottom: `2px solid ${styleObj.cyanSoft}`,
              opacity: 0.9,
            }}
          />
        </>
      )}

      {showTicker && (
        <div
          className="absolute z-30 overflow-hidden"
          style={{ left: `${leftOffset}%`, right: `${panelRightInset}%`, bottom: `${tickerBottom}%`, height: `${tickerHeight}%` }}
        >
          <div
            className="absolute inset-x-0 top-0 flex h-full items-center bg-[#041228]/95 px-3"
            style={{ borderTop: `1px solid ${styleObj.cyan}66`, borderBottom: `1px solid ${styleObj.cyan}44` }}
          >
            <div
              className="font-frost-tech w-full truncate text-center font-bold"
              style={{
                fontFamily: styleObj.fontTech || "var(--font-tech)",
                color: styleObj.cyanSoft,
                fontSize: "clamp(13px, 1.65cqw, 24px)",
                letterSpacing: "0.01em",
              }}
            >
              -// {page.ticker1} //-
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-[15]" style={{ boxShadow: "inset 0 0 90px rgba(0,0,0,0.55)" }} />
      {page.showScanlines && <Scanlines opacity={0.05} />}
      {page.grain && <Grain opacity={0.04} />}
    </div>
  );
}
