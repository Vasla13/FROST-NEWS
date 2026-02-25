export default function FrostVerticalBand({
  page,
  styleObj,
  assets,
  title = "FROSTNEWS",
  topInset = 0,
  bottomInset = 0,
}) {
  const left = page.showDevice ? page.sideDeviceWidth : 0;
  const hasLogoStrip = Boolean(assets?.logoStamp);
  const stripScale = page.logoStripScale ?? 0.5;

  return (
    <div
      className="absolute z-20"
      style={{
        top: `${topInset}%`,
        bottom: `${bottomInset}%`,
        left: `${left}%`,
        width: `${page.leftBandWidth}%`,
        background: `linear-gradient(180deg, ${styleObj.cyanSoft} 0%, #69d2ea 20%, ${styleObj.cyan} 58%, ${styleObj.cyanSoft} 100%)`,
      }}
    >
      {hasLogoStrip && (
        <img
          src={assets.logoStamp}
          alt="frost strip"
          className="absolute left-0 top-0 h-full w-auto max-w-none object-contain"
          style={{
            objectPosition: "left top",
            opacity: 0.98,
            transform: `scale(${stripScale})`,
            transformOrigin: "left top",
          }}
        />
      )}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,.85) 0%, rgba(255,255,255,.05) 28%, rgba(255,255,255,.4) 62%, rgba(255,255,255,.08) 100%)",
        }}
      />
      {!hasLogoStrip && (
        <div
          className="font-frost-display absolute left-1/2 top-[4%] -translate-x-1/2 font-black uppercase"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontFamily: styleObj.fontDisplay || "var(--font-display)",
            fontSize: "clamp(28px, 4.7cqw, 88px)",
            lineHeight: 0.9,
            letterSpacing: "0.015em",
            color: "#000",
            textShadow: "0 1px 0 rgba(0,0,0,0.22)",
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
}
