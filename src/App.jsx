import { useEffect, useMemo, useRef, useState } from "react";

import InspectorPanel from "./components/editor/InspectorPanel";
import PageSidebar from "./components/editor/PageSidebar";
import PreviewPanel from "./components/editor/PreviewPanel";
import { STORAGE_KEY } from "./constants/project";
import useObjectUrlUpload from "./hooks/useObjectUrlUpload";
import { exportNodeAsPngUnderSize } from "./lib/export-utils";
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

function clampFormatDimension(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.max(320, Math.min(5000, Math.round(parsed)));
}

export default function App() {
  const [project, setProject] = useState(defaultProject);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [tab, setTab] = useState("page");
  const [busyExport, setBusyExport] = useState(false);
  const previewPageRefs = useRef({});
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

  const exportCurrent = async () => {
    if (!selectedPage) {
      return;
    }

    const node = previewPageRefs.current[selectedPage.id];
    if (!node) {
      return;
    }

    setBusyExport(true);
    try {
      await exportNodeAsPngUnderSize(node, selectedPage.name || "page", {
        maxBytes: 2 * 1024 * 1024,
      });
    } catch (error) {
      console.error(error);
      alert("Export PNG impossible sous 2 Mo. Reduis la taille du format, puis recommence.");
    } finally {
      setBusyExport(false);
    }
  };

  const uploadPageImage = useObjectUrlUpload((data) => {
    if (selectedPage?.template === "article") {
      setPage({ articleImageUrl: data });
      return;
    }

    setPage({ imageUrl: data });
  }, {
    onError: (message) => alert(message),
  });

  const dimensions = parseFormat(project.meta.format, project.meta.customWidth, project.meta.customHeight);

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
          onChangeFormat={(value) => {
            if (value === "CUSTOM") {
              setProjectMeta({
                format: "CUSTOM",
                customWidth: project.meta.customWidth ?? dimensions.w,
                customHeight: project.meta.customHeight ?? dimensions.h,
              });
              return;
            }

            setProjectMeta({ format: value });
          }}
          onChangeCustomWidth={(value) => {
            const width = clampFormatDimension(value);
            if (width === null) {
              return;
            }

            setProjectMeta({
              format: "CUSTOM",
              customWidth: width,
              customHeight: project.meta.customHeight ?? dimensions.h,
            });
          }}
          onChangeCustomHeight={(value) => {
            const height = clampFormatDimension(value);
            if (height === null) {
              return;
            }

            setProjectMeta({
              format: "CUSTOM",
              customWidth: project.meta.customWidth ?? dimensions.w,
              customHeight: height,
            });
          }}
          onExportCurrent={exportCurrent}
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
    </div>
  );
}
