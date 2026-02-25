export default function Field({ label, children, hint }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold tracking-wide text-cyan-100/90">{label}</label>
        {hint ? <span className="text-[10px] text-cyan-200/50">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}
