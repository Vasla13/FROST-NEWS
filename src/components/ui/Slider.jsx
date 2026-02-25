export default function Slider({ value, min, max, step = 1, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-cyan-300"
      />
      <div className="w-12 rounded-md border border-cyan-400/20 bg-slate-950/50 px-1 py-0.5 text-center text-xs text-cyan-100">
        {typeof value === "number" ? value : String(value)}
      </div>
    </div>
  );
}
