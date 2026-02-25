import { RefreshCw, Save, Upload } from "lucide-react";

import Field from "../../ui/Field";
import Input from "../../ui/Input";
import Slider from "../../ui/Slider";

export default function ProjectTab({
  project,
  setProjectMeta,
  onImportProject,
  exportProjectJson,
  resetProject,
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-3">
        <div className="text-xs font-bold tracking-wide text-cyan-100/90">Projet</div>
        <Field label="Titre du journal / projet">
          <Input value={project.meta.title || ""} onChange={(event) => setProjectMeta({ title: event.target.value })} />
        </Field>
        <Field label="Fond exterieur (preview/export)">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={project.meta.backgroundOutside || "#000000"}
              onChange={(event) => setProjectMeta({ backgroundOutside: event.target.value })}
              className="h-10 w-14 rounded-xl border border-cyan-400/20 bg-transparent p-1"
            />
            <Input
              value={project.meta.backgroundOutside || "#000000"}
              onChange={(event) => setProjectMeta({ backgroundOutside: event.target.value })}
            />
          </div>
        </Field>
        <Field label="Coins arrondis">
          <Slider min={0} max={28} value={project.meta.borderRadius || 0} onChange={(value) => setProjectMeta({ borderRadius: value })} />
        </Field>
        <Field label="Padding exterieur">
          <Slider min={0} max={30} value={project.meta.padding || 0} onChange={(value) => setProjectMeta({ padding: value })} />
        </Field>
      </div>

      <div className="space-y-3 rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-3">
        <div className="text-xs font-bold tracking-wide text-cyan-100/90">Sauvegarde / import</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={exportProjectJson}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100"
          >
            <Save className="h-3.5 w-3.5" /> Export JSON
          </button>
          <label className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-cyan-300/20 px-3 py-2 text-xs">
            <Upload className="h-3.5 w-3.5" /> Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={onImportProject} />
          </label>
        </div>
        <button
          onClick={resetProject}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-100 hover:border-red-400/40"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reinitialiser le projet
        </button>
        <p className="text-[11px] leading-relaxed text-cyan-100/45">
          Le projet est aussi auto-sauvegarde dans le navigateur (localStorage).
        </p>
      </div>
    </div>
  );
}
