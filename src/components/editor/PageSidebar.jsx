import { AnimatePresence, motion } from "framer-motion";
import { Copy, Newspaper, Trash2 } from "lucide-react";

export default function PageSidebar({
  project,
  selectedPage,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onRemovePage,
  onMovePage,
}) {
  return (
    <aside className="col-span-12 border-r border-cyan-400/10 bg-slate-950/70 backdrop-blur md:col-span-3 xl:col-span-2">
      <div className="flex h-full flex-col">
        <div className="border-b border-cyan-400/10 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-300/10">
              <Newspaper className="h-5 w-5 text-cyan-200" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide text-cyan-100">Frost News Builder</div>
              <div className="text-xs text-cyan-200/50">Cover + pages multi-sujets</div>
            </div>
          </div>
        </div>

        <div className="space-y-2 p-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddPage("cover")}
              className="rounded-xl border border-cyan-300/20 bg-slate-900/80 px-2 py-2 text-xs text-cyan-100 hover:border-cyan-300/40"
            >
              + Cover
            </button>
            <button
              onClick={() => onAddPage("article")}
              className="rounded-xl border border-cyan-300/20 bg-slate-900/80 px-2 py-2 text-xs text-cyan-100 hover:border-cyan-300/40"
            >
              + Article
            </button>
            <button
              onClick={() => onAddPage("ad")}
              className="col-span-2 rounded-xl border border-cyan-300/20 bg-slate-900/80 px-2 py-2 text-xs text-cyan-100 hover:border-cyan-300/40"
            >
              + Pub / Sponsor
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-auto px-3 pb-3">
          <AnimatePresence initial={false}>
            {project.pages.map((page, index) => {
              const active = page.id === selectedPage?.id;

              return (
                <motion.button
                  key={page.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  onClick={() => onSelectPage(page.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-cyan-300/50 bg-cyan-300/10 shadow-[0_0_0_1px_rgba(103,232,249,.08)]"
                      : "border-slate-700/40 bg-slate-900/60 hover:border-cyan-400/25"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-cyan-100/90">
                      {index + 1}. {page.name}
                    </div>
                    <span className="rounded border border-cyan-300/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-cyan-200/80">
                      {page.template}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-xs text-cyan-200/50">{page.subject}</div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="space-y-2 border-t border-cyan-400/10 p-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onDuplicatePage}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-700/60 px-2 py-2 text-xs hover:border-cyan-300/30"
            >
              <Copy className="h-3.5 w-3.5" /> Dupliquer
            </button>
            <button
              onClick={onRemovePage}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-700/60 px-2 py-2 text-xs hover:border-red-400/40"
            >
              <Trash2 className="h-3.5 w-3.5" /> Suppr.
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onMovePage(-1)} className="rounded-xl border border-slate-700/60 px-2 py-1.5 text-xs">
              ↑ Monter
            </button>
            <button onClick={() => onMovePage(1)} className="rounded-xl border border-slate-700/60 px-2 py-1.5 text-xs">
              ↓ Descendre
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
