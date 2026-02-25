import { parseFormat } from "../../lib/project-utils";
import AdTemplate from "../templates/AdTemplate";
import ArticleTemplate from "../templates/ArticleTemplate";
import CoverTemplate from "../templates/CoverTemplate";

export default function PageCanvas({ page, project, pageRef }) {
  const dimensions = parseFormat(project.meta.format);
  const radius = project.meta.borderRadius || 0;

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
          ref={pageRef}
          className="relative h-full w-full overflow-hidden"
          style={{
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
