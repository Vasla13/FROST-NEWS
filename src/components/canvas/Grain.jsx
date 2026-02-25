export default function Grain({ opacity = 0.1 }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
      style={{
        opacity,
        backgroundImage: "radial-gradient(rgba(255,255,255,.28) 0.6px, transparent 0.7px)",
        backgroundSize: "4px 4px",
        mixBlendMode: "overlay",
      }}
    />
  );
}
