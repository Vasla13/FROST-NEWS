import { Image as ImageIcon } from "lucide-react";
import SideDevice from "../canvas/SideDevice";

export default function AdTemplate({ page, project }) {
  const radius = project.meta.borderRadius;
  const sideDeviceWidth = Math.max(page.sideDeviceWidth ?? 11.8, 9.2);
  const adPageWithDevice = { ...page, showDevice: true, sideDeviceWidth };
  const visualLeft = `${sideDeviceWidth}%`;

  return (
    <div
      data-frost-template="ad"
      className="relative h-full w-full overflow-hidden"
      style={{ borderRadius: radius, background: "#04080F" }}
    >
      {page.imageUrl ? (
        <div className="absolute inset-y-0 right-0 overflow-hidden" style={{ left: visualLeft }}>
          <img
            src={page.imageUrl}
            alt="visuel publicitaire"
            className="h-full w-full object-cover"
            style={{
              objectFit: page.imageFit || "cover",
              objectPosition: `${page.imageX ?? 50}% ${page.imageY ?? 50}%`,
              transform: `scale(${page.imageScale || 1})`,
              transformOrigin: "center center",
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-y-0 right-0 grid place-items-center text-cyan-100/45" style={{ left: visualLeft }}>
          <div className="text-center">
            <ImageIcon className="mx-auto h-10 w-10" />
            <div className="mt-2 text-sm">Upload une image pour la page pub</div>
          </div>
        </div>
      )}
      <SideDevice page={adPageWithDevice} assets={project.assets} styleObj={project.style} />
    </div>
  );
}
