export default function Select({ className = "", ...props }) {
  return (
    <select
      {...props}
      className={
        "w-full rounded-xl border border-cyan-400/20 bg-slate-950/70 px-3 py-2 text-sm text-cyan-50 outline-none focus:border-cyan-300/50 " +
        className
      }
    />
  );
}
