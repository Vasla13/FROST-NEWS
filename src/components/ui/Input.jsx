export default function Input(props) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border border-cyan-400/20 bg-slate-950/70 px-3 py-2 text-sm text-cyan-50 outline-none ring-0 placeholder:text-cyan-200/30 focus:border-cyan-300/50 " +
        (props.className || "")
      }
    />
  );
}
