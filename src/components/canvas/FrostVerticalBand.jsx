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
  const harmonizedCyan = "#6FE1FA";
  const bandGradient = `linear-gradient(180deg, #8DEAFF 0%, ${harmonizedCyan} 44%, #60CFE8 100%)`;
  const bandTint = `linear-gradient(180deg, ${harmonizedCyan}2a 0%, ${harmonizedCyan}22 60%, ${harmonizedCyan}35 100%)`;

  return (
    <div
      className="absolute z-20"
      style={{
        top: `${topInset}%`,
        bottom: `${bottomInset}%`,
        left: `${left}%`,
        width: `${page.leftBandWidth}%`,
        background: bandGradient,
      }}
    >
      {hasLogoStrip && (
        <img
          src={assets.logoStamp}
          alt="frost strip"
          className="absolute left-0 top-0 h-full w-auto max-w-none object-contain"
          style={{
            objectPosition: "left top",
            opacity: 0.95,
            transform: `scale(${stripScale})`,
            transformOrigin: "left top",
            filter: "saturate(0.9) contrast(0.96) brightness(0.97)",
          }}
        />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: hasLogoStrip ? 0.65 : 0.35,
          background: bandTint,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.16,
          background:
            "linear-gradient(90deg, rgba(255,255,255,.85) 0%, rgba(255,255,255,.05) 28%, rgba(255,255,255,.4) 62%, rgba(255,255,255,.08) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-px"
        style={{
          background: `${harmonizedCyan}88`,
          boxShadow: `0 0 8px ${harmonizedCyan}66`,
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
