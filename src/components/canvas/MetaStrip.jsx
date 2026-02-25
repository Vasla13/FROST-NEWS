export default function MetaStrip({ page, assets, styleObj, topInset = 0 }) {
  const techFont = styleObj.fontTech || "var(--font-tech)";
  const stripWidth = "clamp(14px, 2cqw, 26px)";
  const stripHeight = "clamp(96px, 18cqw, 220px)";

  return (
    <div
      className="absolute z-30 flex items-start gap-2 text-xs"
      style={{
        left: `calc(${page.showDevice ? page.sideDeviceWidth : 0}% + ${page.leftBandWidth}% + 1%)`,
        top: `calc(${topInset}% + 1%)`,
      }}
    >
      {assets.metaStrip ? (
        <img src={assets.metaStrip} alt="meta strip" className="object-contain" style={{ width: stripWidth, height: stripHeight }} />
      ) : (
        <div
          className="flex flex-col items-center gap-1 text-[10px] sm:text-xs"
          style={{ color: styleObj.cyanSoft, fontFamily: techFont }}
        >
          <div className="font-bold tracking-widest">{page.issue}</div>
          <div
            className="h-10 w-4 bg-repeat-y opacity-90"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, ${styleObj.cyanSoft} 0px, ${styleObj.cyanSoft} 2px, transparent 2px, transparent 4px)`,
            }}
          />
          <div className="text-lg leading-none opacity-90">x</div>
          <div className="text-[12px] leading-none">o</div>
        </div>
      )}
      <div
        className="font-frost-tech font-black tracking-tight"
        style={{
          fontFamily: techFont,
          color: styleObj.cyanSoft,
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          fontSize: "clamp(12px, 1.9cqw, 26px)",
          letterSpacing: "0.04em",
          lineHeight: 1,
          textTransform: "uppercase",
          textShadow: page.glow ? `0 0 8px ${styleObj.blueGlow}aa` : "none",
        }}
      >
        {page.date}
      </div>
    </div>
  );
}
