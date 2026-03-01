import BackgroundPhoto from "../canvas/BackgroundPhoto";
import DecorativeCorners from "../canvas/DecorativeCorners";
import FrostVerticalBand from "../canvas/FrostVerticalBand";
import MetaStrip from "../canvas/MetaStrip";
import NeonBorder from "../canvas/NeonBorder";
import SideDevice from "../canvas/SideDevice";

export default function CoverTemplate({ page, project, dimensions }) {
  const styleObj = project.style;
  const cq = (value) => `calc(var(--frost-cq, 1px) * ${value})`;
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
  const tickerHeight = Math.min(page.tickerHeight ?? 4.2, 4.9);
  const tickerBottom = bottomInset;

  return (
    <div data-frost-template="cover" className="relative h-full w-full overflow-hidden" style={{ borderRadius: radius }}>
      <BackgroundPhoto page={page} styleObj={styleObj} disableOverlays />
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
        className="cover-holo-layer cover-crt-layer pointer-events-none absolute z-[11]"
        style={{
          left: `${leftOffset}%`,
          right: 0,
          top: 0,
          bottom: 0,
          overflow: "hidden",
          borderTopRightRadius: radius,
          borderBottomRightRadius: radius,
          backdropFilter: "saturate(142%) brightness(1.08) contrast(1.06)",
          backgroundImage: `linear-gradient(180deg, rgba(8,18,36,0.24) 0%, rgba(7,15,32,0.2) 46%, rgba(5,10,24,0.32) 100%), repeating-linear-gradient(to bottom, rgba(160,246,255,0.14) 0px, rgba(160,246,255,0.14) 1px, rgba(9,22,38,0.0) 2px, rgba(9,22,38,0.0) 4px), repeating-linear-gradient(90deg, rgba(114,230,255,0.04) 0px, rgba(114,230,255,0.04) 2px, rgba(9,20,40,0.0) 3px, rgba(9,20,40,0.0) 5px), linear-gradient(118deg, rgba(255,255,255,0) 38%, rgba(120,244,255,0.16) 50%, rgba(255,255,255,0) 62%), radial-gradient(circle at 84% 14%, rgba(255,78,190,0.16) 0%, rgba(255,78,190,0.0) 33%), radial-gradient(circle at 18% 82%, rgba(121,101,255,0.13) 0%, rgba(121,101,255,0.0) 38%)`,
          backgroundSize: "100% 100%, 100% 8px, 9px 100%, 190% 100%, 100% 100%, 100% 100%",
          backgroundPosition: "0 0, 0 0, 0 0, -140% 0, 0 0, 0 0",
          boxShadow: page.glow
            ? `inset 0 0 22px ${styleObj.blueGlow}30, inset 0 0 46px rgba(255,78,190,0.12), 0 0 28px rgba(91,236,255,0.12)`
            : "inset 0 0 22px rgba(5,14,28,0.3)",
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
              data-frost-export-title
              className="font-frost-pixel relative z-10 w-full px-4 text-center font-black tracking-wide"
              style={{
                fontFamily: styleObj.fontPixel || "var(--font-pixel)",
                color: styleObj.cyanSoft,
                fontSize: `clamp(18px, ${cq(page.headlineFont || 4.6)}, 58px)`,
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
              width: `clamp(20px, ${cq(2.7)}, 42px)`,
              height: `clamp(20px, ${cq(2.7)}, 42px)`,
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
              width: `clamp(20px, ${cq(2.7)}, 42px)`,
              height: `clamp(20px, ${cq(2.7)}, 42px)`,
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
          style={{
            left: `${leftOffset}%`,
            right: 0,
            bottom: `${tickerBottom}%`,
            height: `${tickerHeight}%`,
            borderBottomRightRadius: radius,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, rgba(4,16,34,0.8) 0%, rgba(6,16,37,0.72) 56%, rgba(25,10,45,0.62) 100%)",
              borderTop: `1px solid ${styleObj.cyan}88`,
              borderBottomRightRadius: radius,
              boxShadow: page.glow
                ? `0 0 12px ${styleObj.blueGlow}42, inset 0 0 16px ${styleObj.blueGlow}2e, inset 0 -2px 0 rgba(255,78,190,0.16)`
                : `inset 0 0 8px ${styleObj.cyan}24`,
              backdropFilter: "blur(1.2px) saturate(130%)",
            }}
          />
          <div
            className="ticker-tv-scan pointer-events-none absolute inset-0"
            style={{
              opacity: 0.24,
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(170,243,255,0.62) 0px, rgba(170,243,255,0.62) 1px, rgba(9,24,41,0.14) 2px, rgba(9,24,41,0.14) 4px)",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="ticker-tv-static pointer-events-none absolute inset-0"
            style={{
              opacity: 0.16,
              backgroundImage:
                "linear-gradient(90deg, rgba(130, 244, 255, 0.08) 0%, rgba(130, 244, 255, 0.22) 48%, rgba(130, 244, 255, 0.08) 100%), repeating-linear-gradient(90deg, rgba(9,26,44,0.0) 0px, rgba(9,26,44,0.0) 2px, rgba(123,224,240,0.08) 3px)",
            }}
          />
          <div
            className="relative z-10 flex h-full items-center px-2.5"
          >
            <div
              data-frost-export-ticker
              className="font-frost-tech w-full truncate text-center font-bold"
              style={{
                fontFamily: styleObj.fontTech || "var(--font-tech)",
                color: styleObj.cyanSoft,
                fontSize: `clamp(13px, ${cq(1.62)}, 23px)`,
                letterSpacing: "0.02em",
                textShadow: page.glow ? `0 0 8px ${styleObj.blueGlow}84, 0 0 14px rgba(255,78,190,0.24)` : `0 0 3px ${styleObj.cyan}45`,
              }}
            >
              -// {page.ticker1} //-
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
