import { Image as ImageIcon, Palette, Save, Settings } from "lucide-react";

import AssetsTab from "./tabs/AssetsTab";
import PageSettingsTab from "./tabs/PageSettingsTab";
import ProjectTab from "./tabs/ProjectTab";
import StyleTab from "./tabs/StyleTab";

const TAB_BUTTONS = [
  { key: "page", label: "Page", icon: Settings },
  { key: "assets", label: "Assets", icon: ImageIcon },
  { key: "style", label: "Style", icon: Palette },
  { key: "project", label: "Projet", icon: Save },
];

export default function InspectorPanel({
  tab,
  onChangeTab,
  selectedPage,
  project,
  setPage,
  setProjectMeta,
  setProjectStyle,
  setProjectAssets,
  uploadPageImage,
  onImportProject,
  exportProjectJson,
  resetProject,
}) {
  return (
    <aside className="col-span-12 border-l border-cyan-400/10 bg-slate-950/80 backdrop-blur md:col-span-3 xl:col-span-3">
      <div className="flex h-full flex-col">
        <div className="border-b border-cyan-400/10 p-3">
          <div className="flex gap-2">
            {TAB_BUTTONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onChangeTab(key)}
                className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs ${
                  tab === key
                    ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                    : "border-slate-700/50 text-slate-300 hover:border-cyan-400/20"
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {tab === "page" && selectedPage && (
            <PageSettingsTab selectedPage={selectedPage} setPage={setPage} uploadPageImage={uploadPageImage} />
          )}
          {tab === "assets" && <AssetsTab setProjectAssets={setProjectAssets} />}
          {tab === "style" && <StyleTab project={project} setProjectStyle={setProjectStyle} />}
          {tab === "project" && (
            <ProjectTab
              project={project}
              setProjectMeta={setProjectMeta}
              onImportProject={onImportProject}
              exportProjectJson={exportProjectJson}
              resetProject={resetProject}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
