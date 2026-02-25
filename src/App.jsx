import { useEffect, useMemo, useRef, useState } from "react";

import PageCanvas from "./components/editor/PageCanvas";
import InspectorPanel from "./components/editor/InspectorPanel";
import PageSidebar from "./components/editor/PageSidebar";
import PreviewPanel from "./components/editor/PreviewPanel";
import { STORAGE_KEY } from "./constants/project";
import useObjectUrlUpload from "./hooks/useObjectUrlUpload";
import { exportNodeAsImage, exportNodesAsPdf } from "./lib/export-utils";
import {
  createPageFromPreset,
  defaultProject,
  deepCopy,
  hydrateProject,
  parseFormat,
  uid,
} from "./lib/project-utils";

const MAX_AUTOSAVE_BYTES = 4_500_000;
const AUTOSAVE_DEBOUNCE_MS = 350;

function toSafeFileName(value) {
  const normalized = String(value || "frost-news")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  return normalized || "frost-news";
}

function waitForPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

export default function App() {
  const [project, setProject] = useState(defaultProject);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [tab, setTab] = useState("page");
  const [busyExport, setBusyExport] = useState(false);
  const [renderExportDeck, setRenderExportDeck] = useState(false);
  const previewPageRefs = useRef({});
  const exportPageRefs = useRef({});
  const hasShownStorageWarning = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const hydrated = hydrateProject(JSON.parse(raw));
        if (hydrated?.pages?.length) {
          setProject(hydrated);
          setSelectedPageId(hydrated.pages[0].id);
          return;
        }
      }
    } catch {
      // Ignore invalid cache
    }

    const initialProject = defaultProject();
    setProject(initialProject);
    setSelectedPageId(initialProject.pages[0].id);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        if (!project?.pages?.length) {
          return;
        }

        const serialized = JSON.stringify(project);
        const sizeBytes = new Blob([serialized]).size;
        if (sizeBytes > MAX_AUTOSAVE_BYTES) {
          if (!hasShownStorageWarning.current) {
            alert("Autosave desactive: projet trop volumineux pour localStorage. Exporte ton JSON pour sauvegarder.");
            hasShownStorageWarning.current = true;
          }
          return;
        }

        localStorage.setItem(STORAGE_KEY, serialized);
        hasShownStorageWarning.current = false;
      } catch {
        if (!hasShownStorageWarning.current) {
          alert("Autosave indisponible (quota localStorage atteint). Exporte ton JSON pour eviter toute perte.");
          hasShownStorageWarning.current = true;
        }
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [project]);

  const selectedPage = useMemo(
    () => project.pages.find((page) => page.id === selectedPageId) || project.pages[0],
    [project.pages, selectedPageId]
  );

  const setPage = (patch) => {
    if (!selectedPage) {
      return;
    }

    setProject((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => (page.id === selectedPage.id ? { ...page, ...patch } : page)),
    }));
  };

  const setProjectMeta = (patch) => {
    setProject((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        ...patch,
      },
    }));
  };

  const setProjectStyle = (patch) => {
    setProject((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        ...patch,
      },
    }));
  };

  const setProjectAssets = (patch) => {
    setProject((prev) => ({
      ...prev,
      assets: {
        ...prev.assets,
        ...patch,
      },
    }));
  };

  const addPage = (kind = "article") => {
    const newPage = createPageFromPreset(kind);
    setProject((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));
    setSelectedPageId(newPage.id);
  };

  const duplicatePage = () => {
    if (!selectedPage) {
      return;
    }

    const clone = {
      ...deepCopy(selectedPage),
      id: uid(),
      name: `${selectedPage.name} (copie)`,
    };

    const index = project.pages.findIndex((page) => page.id === selectedPage.id);
    const nextPages = [...project.pages];
    nextPages.splice(index + 1, 0, clone);

    setProject((prev) => ({
      ...prev,
      pages: nextPages,
    }));
    setSelectedPageId(clone.id);
  };

  const removePage = () => {
    if (!selectedPage || project.pages.length <= 1) {
      return;
    }

    const index = project.pages.findIndex((page) => page.id === selectedPage.id);
    const nextPages = project.pages.filter((page) => page.id !== selectedPage.id);

    setProject((prev) => ({
      ...prev,
      pages: nextPages,
    }));
    setSelectedPageId(nextPages[Math.max(0, index - 1)]?.id || nextPages[0].id);
  };

  const movePage = (direction) => {
    if (!selectedPage) {
      return;
    }

    const index = project.pages.findIndex((page) => page.id === selectedPage.id);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= project.pages.length) {
      return;
    }

    const nextPages = [...project.pages];
    [nextPages[index], nextPages[nextIndex]] = [nextPages[nextIndex], nextPages[index]];

    setProject((prev) => ({
      ...prev,
      pages: nextPages,
    }));
  };

  const resetProject = () => {
    const freshProject = defaultProject();
    setProject(freshProject);
    setSelectedPageId(freshProject.pages[0].id);
  };

  const onImportProject = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const hydrated = hydrateProject(parsed);

      if (hydrated?.pages?.length) {
        setProject(hydrated);
        setSelectedPageId(hydrated.pages[0].id);
      } else {
        throw new Error("invalid-project");
      }
    } catch {
      alert("JSON invalide");
    }

    event.target.value = "";
  };

  const exportProjectJson = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "frost-news-project.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportCurrent = async (type) => {
    if (!selectedPage) {
      return;
    }

    const node = previewPageRefs.current[selectedPage.id] || exportPageRefs.current[selectedPage.id];
    if (!node) {
      return;
    }

    setBusyExport(true);
    try {
      if (type === "pdf") {
        await exportNodesAsPdf([node], selectedPage.name || "page");
      } else {
        await exportNodeAsImage(node, selectedPage.name || "page", type);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur export. Attends le chargement complet des images et recommence.");
    } finally {
      setBusyExport(false);
    }
  };

  const exportAllPdf = async () => {
    setBusyExport(true);
    setRenderExportDeck(true);
    try {
      await waitForPaint();
      const nodes = project.pages.map((page) => exportPageRefs.current[page.id]).filter(Boolean);
      if (nodes.length !== project.pages.length) {
        throw new Error("missing-export-pages");
      }

      await exportNodesAsPdf(nodes, toSafeFileName(project.meta.title));
    } catch (error) {
      console.error(error);
      alert("Erreur export PDF multi-pages");
    } finally {
      exportPageRefs.current = {};
      setRenderExportDeck(false);
      setBusyExport(false);
    }
  };

  const uploadPageImage = useObjectUrlUpload((data) => setPage({ imageUrl: data }), {
    onError: (message) => alert(message),
  });

  const dimensions = parseFormat(project.meta.format);

  return (
    <div className="h-screen w-full bg-[var(--frost-bg)] text-white">
      <div className="grid h-full grid-cols-12 gap-0">
        <PageSidebar
          project={project}
          selectedPage={selectedPage}
          onSelectPage={setSelectedPageId}
          onAddPage={addPage}
          onDuplicatePage={duplicatePage}
          onRemovePage={removePage}
          onMovePage={movePage}
        />

        <PreviewPanel
          project={project}
          selectedPage={selectedPage}
          dimensions={dimensions}
          busyExport={busyExport}
          onChangeFormat={(value) => setProjectMeta({ format: value })}
          onExportCurrent={exportCurrent}
          onExportAllPdf={exportAllPdf}
          pageRefSetter={(element) => {
            if (!selectedPage?.id) {
              return;
            }

            if (element) {
              previewPageRefs.current[selectedPage.id] = element;
            } else {
              delete previewPageRefs.current[selectedPage.id];
            }
          }}
        />

        <InspectorPanel
          tab={tab}
          onChangeTab={setTab}
          selectedPage={selectedPage}
          project={project}
          setPage={setPage}
          setProjectMeta={setProjectMeta}
          setProjectStyle={setProjectStyle}
          setProjectAssets={setProjectAssets}
          uploadPageImage={uploadPageImage}
          onImportProject={onImportProject}
          exportProjectJson={exportProjectJson}
          resetProject={resetProject}
        />
      </div>

      {renderExportDeck && (
        <div aria-hidden="true" className="pointer-events-none fixed left-[-20000px] top-0 z-[-1]">
          <div className="space-y-6 bg-black p-0">
            {project.pages.map((page) => (
              <div key={`export-${page.id}`} className="w-[900px]">
                <PageCanvas
                  page={page}
                  project={project}
                  pageRef={(element) => {
                    if (element) {
                      exportPageRefs.current[page.id] = element;
                    } else {
                      delete exportPageRefs.current[page.id];
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
