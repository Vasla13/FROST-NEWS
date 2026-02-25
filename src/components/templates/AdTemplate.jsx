import { Image as ImageIcon, LayoutTemplate } from "lucide-react";

import BackgroundPhoto from "../canvas/BackgroundPhoto";
import DecorativeCorners from "../canvas/DecorativeCorners";
import FrostVerticalBand from "../canvas/FrostVerticalBand";
import Grain from "../canvas/Grain";
import MetaStrip from "../canvas/MetaStrip";
import NeonBorder from "../canvas/NeonBorder";
import Scanlines from "../canvas/Scanlines";
import SideDevice from "../canvas/SideDevice";

export default function AdTemplate({ page, project }) {
  const styleObj = project.style;
  const sideWidth = page.showDevice ? page.sideDeviceWidth : 0;
  const bandWidth = page.showVerticalBand === false ? 0 : page.leftBandWidth;
  const leftOffset = sideWidth + bandWidth;
  const radius = project.meta.borderRadius;
  const topInset = page.showDevice ? page.journalTopInset ?? 0 : 0;
  const bottomInset = page.showDevice ? page.journalBottomInset ?? 0 : 0;
  const panelRightInset = page.showDevice ? page.journalRightInset ?? 0 : 0;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: radius }}>
      <BackgroundPhoto page={page} styleObj={styleObj} />
      {page.glow && <NeonBorder styleObj={styleObj} radius={radius} />}
      <SideDevice page={page} assets={project.assets} styleObj={styleObj} />
      {page.showVerticalBand !== false && bandWidth > 0 && (
        <FrostVerticalBand
          page={page}
          styleObj={styleObj}
          assets={project.assets}
          title="FROST ADS"
          topInset={topInset}
          bottomInset={bottomInset}
        />
      )}
      {page.showTopMeta && <MetaStrip page={page} assets={project.assets} styleObj={styleObj} topInset={topInset} />}
      <DecorativeCorners
        assets={project.assets}
        style={styleObj}
        page={page}
        panelLeft={leftOffset}
        bottomOffset={3.2}
        topInset={topInset}
        bottomInset={bottomInset}
      />

      <div
        className="absolute z-10 p-[3%]"
        style={{ left: `${leftOffset + 1.2}%`, right: `${panelRightInset}%`, top: `${topInset}%`, bottom: `${bottomInset}%` }}
      >
        <div className="absolute inset-0 bg-black/38" />
        <div
          className="relative flex h-full flex-col rounded-2xl border p-5"
          style={{
            borderColor: `${styleObj.cyan}55`,
            background: "rgba(0,0,0,0.45)",
            boxShadow: `inset 0 0 0 1px ${styleObj.cyan}22`,
          }}
        >
          <div
            className="font-frost-tech inline-flex w-max items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold"
            style={{
              borderColor: `${styleObj.cyan}66`,
              color: styleObj.cyan,
              fontFamily: styleObj.fontTech || "var(--font-tech)",
            }}
          >
            <LayoutTemplate className="h-3.5 w-3.5" /> {page.kicker}
          </div>
          <h2
            className="font-frost-display mt-3 font-black uppercase leading-none"
            style={{
              color: "#fff",
              fontFamily: styleObj.fontDisplay || "var(--font-display)",
              fontSize: "clamp(26px, 4.2cqw, 54px)",
            }}
          >
            {page.subject}
          </h2>
          <p
            className="font-frost-ui mt-2 max-w-[70%] text-sm"
            style={{ color: styleObj.cyanSoft, fontFamily: styleObj.fontUi || "var(--font-ui)" }}
          >
            {page.body}
          </p>

          <div className="mt-4 grid flex-1 place-items-center rounded-2xl border border-dashed" style={{ borderColor: `${styleObj.cyan}44`, background: "rgba(0,0,0,0.3)" }}>
            {page.imageUrl ? (
              <img
                src={page.imageUrl}
                alt="pub"
                className="h-full w-full object-contain p-2"
                style={{ objectPosition: `${page.imageX}% ${page.imageY}%`, transform: `scale(${page.imageScale})` }}
              />
            ) : (
              <div className="text-center text-cyan-100/50">
                <ImageIcon className="mx-auto h-10 w-10" />
                <div className="mt-2 text-sm">Zone visuel sponsor / produit</div>
              </div>
            )}
          </div>

          <div
            className="font-frost-tech mt-4 rounded-xl border px-4 py-3 text-center font-semibold"
            style={{
              borderColor: `${styleObj.cyan}66`,
              color: styleObj.cyan,
              background: "rgba(0,0,0,0.52)",
              boxShadow: page.glow ? `0 0 12px ${styleObj.blueGlow}44 inset` : "none",
              fontFamily: styleObj.fontTech || "var(--font-tech)",
            }}
          >
            {page.cta}
          </div>
        </div>
      </div>

      {page.showScanlines && <Scanlines opacity={0.07} />}
      {page.grain && <Grain opacity={0.05} />}
    </div>
  );
}
