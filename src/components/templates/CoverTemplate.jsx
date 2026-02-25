import BackgroundPhoto from "../canvas/BackgroundPhoto";
import DecorativeCorners from "../canvas/DecorativeCorners";
import FrostVerticalBand from "../canvas/FrostVerticalBand";
import MetaStrip from "../canvas/MetaStrip";
import NeonBorder from "../canvas/NeonBorder";
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
  const tickerHeight = Math.min(page.tickerHeight ?? 4.2, 4.9);
  const tickerBottom = bottomInset;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: radius }}>
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
        className="cover-holo-layer pointer-events-none absolute z-[11]"
        style={{
          left: `${leftOffset}%`,
          right: 0,
          top: 0,
          bottom: 0,
          borderTopRightRadius: radius,
          borderBottomRightRadius: radius,
          backdropFilter: "saturate(126%) brightness(1.03)",
          backgroundImage: `linear-gradient(180deg, rgba(8,20,36,0.24) 0%, rgba(7,18,34,0.2) 48%, rgba(5,14,28,0.3) 100%), repeating-linear-gradient(to bottom, rgba(170,243,255,0.1) 0px, rgba(170,243,255,0.1) 1px, rgba(9,22,38,0.0) 2px, rgba(9,22,38,0.0) 4px), repeating-linear-gradient(90deg, rgba(123,224,240,0.028) 0px, rgba(123,224,240,0.028) 2px, rgba(9,26,44,0.0) 3px, rgba(9,26,44,0.0) 5px), linear-gradient(120deg, rgba(255,255,255,0) 41%, rgba(130,244,255,0.1) 50%, rgba(255,255,255,0) 59%), radial-gradient(circle at 98% 52%, rgba(101,220,242,0.1) 0%, rgba(101,220,242,0.0) 24%)`,
          backgroundSize: "100% 100%, 100% 8px, 9px 100%, 180% 100%, 100% 100%",
          backgroundPosition: "0 0, 0 0, 0 0, -140% 0, 0 0",
          boxShadow: page.glow
            ? `inset 0 0 20px ${styleObj.blueGlow}24, inset 0 0 38px rgba(5,14,28,0.36)`
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
              background: "linear-gradient(180deg, rgba(5,18,34,0.74) 0%, rgba(3,12,24,0.62) 100%)",
              borderTop: `1px solid ${styleObj.cyan}88`,
              borderBottomRightRadius: radius,
              boxShadow: page.glow ? `0 0 12px ${styleObj.blueGlow}3f, inset 0 0 16px ${styleObj.blueGlow}29` : `inset 0 0 8px ${styleObj.cyan}24`,
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
            className="ticker-holo-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/2"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${styleObj.cyan}a8 48%, transparent 100%)`,
              filter: "blur(4px)",
            }}
          />
          <div
            className="relative z-10 flex h-full items-center px-2.5"
          >
            <div
              className="font-frost-tech w-full truncate text-center font-bold"
              style={{
                fontFamily: styleObj.fontTech || "var(--font-tech)",
                color: styleObj.cyanSoft,
                fontSize: "clamp(13px, 1.62cqw, 23px)",
                letterSpacing: "0.02em",
                textShadow: page.glow ? `0 0 8px ${styleObj.blueGlow}78` : `0 0 3px ${styleObj.cyan}45`,
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
