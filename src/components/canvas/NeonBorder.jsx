export default function NeonBorder({ styleObj, radius }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        borderRadius: radius,
        boxShadow: `inset 0 0 0 1px ${styleObj.cyan}70, inset 0 0 24px ${styleObj.blueGlow}30, 0 0 24px ${styleObj.blueGlow}58, 0 0 40px rgba(255,78,190,0.18)`,
      }}
    />
  );
}
