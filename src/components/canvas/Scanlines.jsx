export default function Scanlines({ opacity = 0.08 }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-30"
      style={{
        opacity,
        backgroundImage:
          "repeating-linear-gradient(to bottom, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 1px, rgba(255,255,255,0.0) 2px, rgba(255,255,255,0.0) 4px)",
        mixBlendMode: "soft-light",
      }}
    />
  );
}
