import { Upload } from "lucide-react";

import { uid } from "../../lib/project-utils";

export default function AssetUploadButton({ label, onUpload, onClear }) {
  const id = `up-${label.replace(/\s+/g, "-").toLowerCase()}-${uid()}`;

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-400/20 bg-slate-900/70 px-3 py-2 text-xs text-cyan-100 hover:border-cyan-300/40"
      >
        <Upload className="h-3.5 w-3.5" /> {label}
      </label>
      <input id={id} type="file" accept="image/*" onChange={onUpload} className="hidden" />
      <button
        type="button"
        onClick={onClear}
        className="rounded-xl border border-slate-700/60 px-2 py-1 text-[11px] text-slate-300 hover:border-red-400/40 hover:text-red-200"
      >
        Effacer
      </button>
    </div>
  );
}
