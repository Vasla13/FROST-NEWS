import { useLayoutEffect, useRef, useState } from "react";

import { parseFormat } from "../../lib/project-utils";
import AdTemplate from "../templates/AdTemplate";
import ArticleTemplate from "../templates/ArticleTemplate";
import CoverTemplate from "../templates/CoverTemplate";

export default function PageCanvas({ page, project, pageRef }) {
  const dimensions = parseFormat(project.meta.format, project.meta.customWidth, project.meta.customHeight);
  const radius = project.meta.borderRadius || 0;
  const canvasNodeRef = useRef(null);
  const [cqUnitPx, setCqUnitPx] = useState(null);

  useLayoutEffect(() => {
    const node = canvasNodeRef.current;
    if (!node) {
      return;
    }

    const update = () => {
      const width = node.getBoundingClientRect().width;
      if (!Number.isFinite(width) || width <= 0) {
        return;
      }
      setCqUnitPx(width / 100);
    };

    update();

    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(update);
      observer.observe(node);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [dimensions.w, dimensions.h, project.meta.padding]);

  const setCanvasRef = (element) => {
    canvasNodeRef.current = element;
    if (typeof pageRef === "function") {
      pageRef(element);
      return;
    }

    if (pageRef && typeof pageRef === "object") {
      pageRef.current = element;
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="relative"
        style={{
          width: "min(100%, 860px)",
          aspectRatio: `${dimensions.w} / ${dimensions.h}`,
          padding: project.meta.padding,
          background: project.meta.backgroundOutside || "#000",
          borderRadius: radius + 6,
          boxShadow: "0 24px 70px rgba(0,0,0,.55)",
        }}
      >
        <div
          ref={setCanvasRef}
          data-frost-canvas="true"
          className="relative h-full w-full overflow-hidden"
          style={{
            "--frost-cq": cqUnitPx ? `${cqUnitPx}px` : undefined,
            background: project.style.dark,
            borderRadius: radius,
            containerType: "inline-size",
          }}
        >
          {page.template === "cover" ? (
            <CoverTemplate page={page} project={project} dimensions={dimensions} />
          ) : page.template === "article" ? (
            <ArticleTemplate page={page} project={project} />
          ) : (
            <AdTemplate page={page} project={project} />
          )}
        </div>
      </div>
    </div>
  );
}
