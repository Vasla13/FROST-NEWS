export default function MetaStrip({ page, assets, styleObj, topInset = 0 }) {
  const cq = (value) => `calc(var(--frost-cq, 1px) * ${value})`;
  const techFont = styleObj.fontTech || "var(--font-tech)";
  const stripWidth = `clamp(12px, ${cq(1.6)}, 18px)`;
  const stripHeight = `clamp(100px, ${cq(16)}, 180px)`;

  return (
    <div
      className="absolute z-30 flex items-start gap-2 text-xs"
      style={{
        left: `calc(${page.showDevice ? page.sideDeviceWidth : 0}% + ${page.leftBandWidth}% + 1%)`,
        top: `calc(${topInset}% + 1%)`,
      }}
    >
      <div className="flex flex-col items-center gap-1.5" style={{ color: styleObj.cyanSoft, fontFamily: techFont }}>
        <div
          className="font-frost-tech font-black tracking-tight"
          style={{ fontSize: `clamp(20px, ${cq(2.3)}, 34px)` }}
        >
          {page.issue}
        </div>
        <div
          className="bg-repeat-y opacity-95"
          style={{
            width: `clamp(5px, ${cq(0.55)}, 8px)`,
            height: `clamp(58px, ${cq(9)}, 96px)`,
            backgroundImage: `repeating-linear-gradient(to bottom, ${styleObj.cyanSoft} 0px, ${styleObj.cyanSoft} 2px, transparent 2px, transparent 5px)`,
          }}
        />
        <div className="leading-none opacity-90" style={{ fontSize: `clamp(16px, ${cq(2)}, 28px)` }}>
          x
        </div>
        <div className="leading-none" style={{ fontSize: `clamp(14px, ${cq(1.6)}, 22px)` }}>
          ◎
        </div>
      </div>
      {assets.metaStrip ? (
        <img src={assets.metaStrip} alt="meta strip" className="object-contain opacity-90" style={{ width: stripWidth, height: stripHeight }} />
      ) : null}
      <div
        data-frost-export-date-native
        className="font-frost-tech font-black tracking-tight"
        style={{
          fontFamily: techFont,
          color: styleObj.cyanSoft,
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          fontSize: `clamp(14px, ${cq(2.2)}, 32px)`,
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
