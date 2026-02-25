export default function MetaStrip({ page, assets, styleObj, topInset = 0 }) {
  const techFont = styleObj.fontTech || "var(--font-tech)";
  const stripWidth = "clamp(12px, 1.6cqw, 18px)";
  const stripHeight = "clamp(100px, 16cqw, 180px)";

  return (
    <div
      className="absolute z-30 flex items-start gap-2 text-xs"
      style={{
        left: `calc(${page.showDevice ? page.sideDeviceWidth : 0}% + ${page.leftBandWidth}% + 1%)`,
        top: `calc(${topInset}% + 1%)`,
      }}
    >
      <div className="flex flex-col items-center gap-1.5" style={{ color: styleObj.cyanSoft, fontFamily: techFont }}>
        <div className="font-frost-tech text-[clamp(20px,2.3cqw,34px)] font-black tracking-tight">{page.issue}</div>
        <div
          className="w-[clamp(5px,0.55cqw,8px)] bg-repeat-y opacity-95"
          style={{
            height: "clamp(58px, 9cqw, 96px)",
            backgroundImage: `repeating-linear-gradient(to bottom, ${styleObj.cyanSoft} 0px, ${styleObj.cyanSoft} 2px, transparent 2px, transparent 5px)`,
          }}
        />
        <div className="text-[clamp(16px,2cqw,28px)] leading-none opacity-90">x</div>
        <div className="text-[clamp(14px,1.6cqw,22px)] leading-none">◎</div>
      </div>
      {assets.metaStrip ? (
        <img src={assets.metaStrip} alt="meta strip" className="object-contain opacity-90" style={{ width: stripWidth, height: stripHeight }} />
      ) : null}
      <div
        className="font-frost-tech font-black tracking-tight"
        style={{
          fontFamily: techFont,
          color: styleObj.cyanSoft,
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          fontSize: "clamp(14px, 2.2cqw, 32px)",
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
