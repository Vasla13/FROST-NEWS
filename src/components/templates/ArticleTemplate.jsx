import { FileText } from "lucide-react";

import BackgroundPhoto from "../canvas/BackgroundPhoto";
import DecorativeCorners from "../canvas/DecorativeCorners";
import FrostVerticalBand from "../canvas/FrostVerticalBand";
import Grain from "../canvas/Grain";
import MetaStrip from "../canvas/MetaStrip";
import NeonBorder from "../canvas/NeonBorder";
import Scanlines from "../canvas/Scanlines";
import SideDevice from "../canvas/SideDevice";

export default function ArticleTemplate({ page, project }) {
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
        <FrostVerticalBand page={page} styleObj={styleObj} assets={project.assets} topInset={topInset} bottomInset={bottomInset} />
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
        className="absolute z-10"
        style={{ left: `${leftOffset + 1.5}%`, right: `${panelRightInset}%`, top: `${topInset}%`, bottom: `${bottomInset}%` }}
      >
        <div className="absolute inset-0 bg-black/52" />
        <div className="absolute inset-0 p-[3.2%]">
          <div
            className="font-frost-tech mb-3 inline-flex items-center gap-2 rounded border px-2 py-1 text-xs font-bold tracking-wider"
            style={{
              borderColor: `${styleObj.cyan}66`,
              color: styleObj.cyan,
              background: "rgba(0,0,0,0.35)",
              fontFamily: styleObj.fontTech || "var(--font-tech)",
            }}
          >
            <FileText className="h-3.5 w-3.5" /> {page.kicker}
          </div>

          <h1
            className="font-frost-display mb-2 font-black uppercase leading-[0.95]"
            style={{
              color: "#fff",
              fontFamily: styleObj.fontDisplay || "var(--font-display)",
              fontSize: "clamp(24px, 4.4cqw, 56px)",
              textShadow: "0 2px 14px rgba(0,0,0,0.4)",
            }}
          >
            {page.subject}
          </h1>

          <div
            className="font-frost-tech mb-3 text-sm uppercase tracking-[0.14em]"
            style={{ color: styleObj.cyanSoft, fontFamily: styleObj.fontTech || "var(--font-tech)" }}
          >
            {page.section} | {page.date} | {page.author}
          </div>

          <p
            className="font-frost-ui mb-4 max-w-[90%] text-sm leading-relaxed"
            style={{ color: "#d6efff", fontFamily: styleObj.fontUi || "var(--font-ui)" }}
          >
            {page.subhead}
          </p>

          <div className="grid h-[58%] grid-cols-12 gap-3">
            <div className="col-span-8 overflow-auto rounded-xl border p-3" style={{ borderColor: `${styleObj.cyan}33`, background: "rgba(5,10,15,0.72)" }}>
              <div
                className="font-frost-ui whitespace-pre-wrap text-sm leading-6"
                style={{ color: "#EAF9FF", fontFamily: styleObj.fontUi || "var(--font-ui)" }}
              >
                {page.body}
              </div>
            </div>
            <div className="col-span-4 flex flex-col gap-3">
              <div className="rounded-xl border p-3" style={{ borderColor: `${styleObj.cyan}40`, background: "rgba(5,10,15,0.72)" }}>
                <div
                  className="font-frost-tech mb-1 text-xs uppercase tracking-widest"
                  style={{ color: styleObj.cyanSoft, fontFamily: styleObj.fontTech || "var(--font-tech)" }}
                >
                  Citation
                </div>
                <div
                  className="font-frost-tech text-base font-semibold leading-snug"
                  style={{ color: styleObj.cyan, fontFamily: styleObj.fontTech || "var(--font-tech)" }}
                >
                  {page.quote}
                </div>
              </div>
              <div className="flex-1 rounded-xl border p-3" style={{ borderColor: `${styleObj.cyan}22`, background: "rgba(5,10,15,0.52)" }}>
                <div
                  className="font-frost-tech mb-2 text-xs uppercase tracking-widest"
                  style={{ color: styleObj.cyanSoft, fontFamily: styleObj.fontTech || "var(--font-tech)" }}
                >
                  Notes
                </div>
                <div
                  className="font-frost-ui text-xs leading-5"
                  style={{ color: "#d3ecff", fontFamily: styleObj.fontUi || "var(--font-ui)" }}
                >
                  {page.note}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {page.showScanlines && <Scanlines opacity={0.07} />}
      {page.grain && <Grain opacity={0.06} />}
    </div>
  );
}
