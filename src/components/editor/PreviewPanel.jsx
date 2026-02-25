import { Download } from "lucide-react";

import { FORMAT_OPTIONS } from "../../constants/project";
import PageCanvas from "./PageCanvas";
import Input from "../ui/Input";
import Select from "../ui/Select";

export default function PreviewPanel({
  project,
  selectedPage,
  dimensions,
  busyExport,
  onChangeFormat,
  onChangeCustomWidth,
  onChangeCustomHeight,
  onExportCurrent,
  onExportAllPdf,
  pageRefSetter,
}) {
  const customMode = project.meta.format === "CUSTOM";

  return (
    <main className="col-span-12 flex flex-col bg-black md:col-span-6 xl:col-span-7">
      <div className="flex flex-wrap items-center gap-2 border-b border-cyan-400/10 bg-slate-950/50 p-3">
        <div className="mr-1 text-xs text-cyan-200/60">Format</div>
        <Select value={project.meta.format} onChange={(event) => onChangeFormat(event.target.value)} className="w-auto min-w-[130px]">
          {FORMAT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {customMode && (
          <>
            <div className="ml-2 text-xs text-cyan-200/60">W</div>
            <Input
              type="number"
              min={320}
              max={5000}
              value={project.meta.customWidth ?? dimensions.w}
              onChange={(event) => onChangeCustomWidth(event.target.value)}
              className="w-[96px]"
            />
            <div className="text-xs text-cyan-200/60">H</div>
            <Input
              type="number"
              min={320}
              max={5000}
              value={project.meta.customHeight ?? dimensions.h}
              onChange={(event) => onChangeCustomHeight(event.target.value)}
              className="w-[96px]"
            />
          </>
        )}

        <div className="ml-2 text-xs text-cyan-200/60">Dimensions:</div>
        <div className="rounded-lg border border-cyan-300/20 px-2 py-1 text-xs text-cyan-100">
          {dimensions.w} x {dimensions.h}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            onClick={() => onExportCurrent("png")}
            disabled={busyExport}
            className="inline-flex items-center gap-1 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100 hover:border-cyan-300/50 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" /> PNG
          </button>
          <button
            onClick={() => onExportCurrent("jpeg")}
            disabled={busyExport}
            className="inline-flex items-center gap-1 rounded-xl border border-cyan-300/20 px-3 py-2 text-xs hover:border-cyan-300/40 disabled:opacity-50"
          >
            JPG
          </button>
          <button
            onClick={() => onExportCurrent("pdf")}
            disabled={busyExport}
            className="inline-flex items-center gap-1 rounded-xl border border-cyan-300/20 px-3 py-2 text-xs hover:border-cyan-300/40 disabled:opacity-50"
          >
            PDF page
          </button>
          <button
            onClick={onExportAllPdf}
            disabled={busyExport}
            className="inline-flex items-center gap-1 rounded-xl border border-cyan-300/20 px-3 py-2 text-xs hover:border-cyan-300/40 disabled:opacity-50"
          >
            PDF journal
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.08),transparent_35%),linear-gradient(#010306,#010306)] p-4 md:p-6">
        {selectedPage ? (
          <PageCanvas page={selectedPage} project={project} pageRef={pageRefSetter} />
        ) : (
          <div className="grid h-full place-items-center text-cyan-100/40">Aucune page</div>
        )}
      </div>
    </main>
  );
}
