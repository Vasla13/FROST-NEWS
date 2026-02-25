export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
        checked
          ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
          : "border-slate-600/40 bg-slate-800/60 text-slate-300"
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${checked ? "bg-cyan-300" : "bg-slate-500"}`} />
      {label}
    </button>
  );
}
