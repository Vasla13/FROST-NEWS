import { useState } from "react";
import { Upload } from "lucide-react";

import {
  BUNDLED_PAGE_IMAGES,
  PAGE_PRESETS,
} from "../../../constants/project";
import Field from "../../ui/Field";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Slider from "../../ui/Slider";
import TextArea from "../../ui/TextArea";
import Toggle from "../../ui/Toggle";

export default function PageSettingsTab({ selectedPage, setPage, uploadPageImage }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const applyTemplate = (kind) => {
    const base = PAGE_PRESETS[kind];
    setPage({ ...base, id: selectedPage.id, name: selectedPage.name || base.name });
  };

  const applyFrostCoverPreset = () => {
    setPage({
      template: "cover",
      imageUrl: BUNDLED_PAGE_IMAGES.coverNoGlow,
      imageFit: "cover",
      imageScale: 1,
      imageX: 50,
      imageY: 50,
      opacityPhoto: 0.96,
      leftBandWidth: 13.2,
      sideDeviceWidth: 11.8,
      journalTopInset: 0,
      journalBottomInset: 0,
      journalRightInset: 0.8,
      logoStripScale: 0.76,
      headlineBarY: 74.8,
      headlineBarH: 9,
      headlineFont: 4.9,
      tickerHeight: 7.4,
      showDevice: true,
      showTopMeta: true,
      showCorners: false,
      showVerticalBand: true,
      showHeadline: true,
      showTicker: true,
      showScanlines: true,
      glow: true,
      grain: true,
      bgMode: "solid",
      bgColor: "#050A0F",
      issue: selectedPage.issue || "#001",
      date: selectedPage.date || "FEVRIER 2035",
    });
  };

  const applyArticlePreset = () => {
    setPage({
      ...PAGE_PRESETS.article,
      name: selectedPage.name || PAGE_PRESETS.article.name,
      kicker: selectedPage.kicker || PAGE_PRESETS.article.kicker,
      issue: selectedPage.issue || PAGE_PRESETS.article.issue,
      date: selectedPage.date || PAGE_PRESETS.article.date,
      subject: selectedPage.subject || PAGE_PRESETS.article.subject,
      body: selectedPage.body || PAGE_PRESETS.article.body,
      subhead: selectedPage.subhead || PAGE_PRESETS.article.subhead,
      author: selectedPage.author || PAGE_PRESETS.article.author,
      section: selectedPage.section || PAGE_PRESETS.article.section,
      quote: selectedPage.quote || PAGE_PRESETS.article.quote,
      quoteAuthor: selectedPage.quoteAuthor || PAGE_PRESETS.article.quoteAuthor,
      imageUrl: selectedPage.imageUrl || PAGE_PRESETS.article.imageUrl,
      imageFit: selectedPage.imageFit || PAGE_PRESETS.article.imageFit,
      imageScale: selectedPage.imageScale ?? PAGE_PRESETS.article.imageScale,
      imageX: selectedPage.imageX ?? PAGE_PRESETS.article.imageX,
      imageY: selectedPage.imageY ?? PAGE_PRESETS.article.imageY,
      opacityPhoto: selectedPage.opacityPhoto ?? PAGE_PRESETS.article.opacityPhoto,
    });
  };

  return (
    <div className="space-y-4">
      <Field label="Nom de page">
        <Input value={selectedPage.name || ""} onChange={(event) => setPage({ name: event.target.value })} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Template">
          <Select value={selectedPage.template} onChange={(event) => applyTemplate(event.target.value)}>
            <option value="cover">Cover</option>
            <option value="article">Article</option>
            <option value="ad">Pub</option>
          </Select>
        </Field>
        <Field label="Kicker / Rubrique">
          <Input value={selectedPage.kicker || ""} onChange={(event) => setPage({ kicker: event.target.value })} />
        </Field>
      </div>

      <Field label="Titre principal">
        <TextArea rows={2} value={selectedPage.subject || ""} onChange={(event) => setPage({ subject: event.target.value })} />
      </Field>

      {selectedPage.template === "cover" && (
        <div className="space-y-3 rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-3">
          <div className="text-xs font-bold tracking-wide text-cyan-100/90">Reglages cover</div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Numero">
              <Input value={selectedPage.issue || ""} onChange={(event) => setPage({ issue: event.target.value })} />
            </Field>
            <Field label="Date">
              <Input value={selectedPage.date || ""} onChange={(event) => setPage({ date: event.target.value })} />
            </Field>
          </div>
          <Field label="Ticker">
            <Input value={selectedPage.ticker1 || ""} onChange={(event) => setPage({ ticker1: event.target.value })} />
          </Field>
          <button
            onClick={applyFrostCoverPreset}
            className="w-full rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100 hover:border-cyan-300/50"
          >
            Appliquer preset cyberpunk cover
          </button>
        </div>
      )}

      {selectedPage.template === "article" && (
        <>
          <div className="space-y-3 rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-3">
            <div className="text-xs font-bold tracking-wide text-cyan-100/90">Reglages article</div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Numero">
                <Input value={selectedPage.issue || ""} onChange={(event) => setPage({ issue: event.target.value })} />
              </Field>
              <Field label="Date">
                <Input value={selectedPage.date || ""} onChange={(event) => setPage({ date: event.target.value })} />
              </Field>
            </div>
            <button
              onClick={applyArticlePreset}
              className="w-full rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100 hover:border-cyan-300/50"
            >
              Appliquer preset editorial article
            </button>
          </div>

          <Field label="Sous-titre / Chapo">
            <TextArea rows={3} value={selectedPage.subhead || ""} onChange={(event) => setPage({ subhead: event.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Section">
              <Input value={selectedPage.section || ""} onChange={(event) => setPage({ section: event.target.value })} />
            </Field>
            <Field label="Auteur">
              <Input value={selectedPage.author || ""} onChange={(event) => setPage({ author: event.target.value })} />
            </Field>
          </div>
          <Field label="Citation">
            <Input value={selectedPage.quote || ""} onChange={(event) => setPage({ quote: event.target.value })} />
          </Field>
          <Field label="Nom personne citation">
            <Input value={selectedPage.quoteAuthor || ""} onChange={(event) => setPage({ quoteAuthor: event.target.value })} />
          </Field>
          <Field label="Corps de texte">
            <TextArea rows={6} value={selectedPage.body || ""} onChange={(event) => setPage({ body: event.target.value })} />
          </Field>
        </>
      )}

      {selectedPage.template === "ad" && (
        <>
          <Field label="CTA">
            <Input value={selectedPage.cta || ""} onChange={(event) => setPage({ cta: event.target.value })} />
          </Field>
          <Field label="Texte pub">
            <TextArea rows={5} value={selectedPage.body || ""} onChange={(event) => setPage({ body: event.target.value })} />
          </Field>
        </>
      )}

      <div className="space-y-3 rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-3">
        <div className="text-xs font-bold tracking-wide text-cyan-100/90">Visuel de page</div>
        <div className="flex items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-400/20 bg-slate-900/70 px-3 py-2 text-xs text-cyan-100 hover:border-cyan-300/40">
            <Upload className="h-3.5 w-3.5" /> Upload image
            <input type="file" accept="image/*" onChange={uploadPageImage} className="hidden" />
          </label>
          <button onClick={() => setPage({ imageUrl: "" })} className="rounded-xl border border-slate-700/60 px-2 py-1 text-[11px] text-slate-300">
            Effacer
          </button>
        </div>

        <div className="space-y-2 rounded-xl border border-cyan-400/10 bg-slate-950/40 p-2">
          <div className="text-[10px] uppercase tracking-widest text-cyan-200/60">Assets locaux (dossier assets)</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPage({ imageUrl: BUNDLED_PAGE_IMAGES.baseCover, imageFit: "cover", imageScale: 1, imageX: 50, imageY: 50 })}
              className="rounded-lg border border-cyan-400/20 px-2 py-1 text-[11px] text-cyan-100 hover:border-cyan-300/40"
            >
              fond0
            </button>
            <button
              onClick={() => setPage({ imageUrl: BUNDLED_PAGE_IMAGES.eyeLogo, imageFit: "contain", imageScale: 0.9, imageX: 50, imageY: 50 })}
              className="rounded-lg border border-cyan-400/20 px-2 py-1 text-[11px] text-cyan-100 hover:border-cyan-300/40"
            >
              oeil frost (center)
            </button>
            <button
              onClick={() => setPage({ imageUrl: BUNDLED_PAGE_IMAGES.eyeLogo, imageFit: "cover", imageScale: 1, imageX: 50, imageY: 44 })}
              className="rounded-lg border border-cyan-400/20 px-2 py-1 text-[11px] text-cyan-100 hover:border-cyan-300/40"
            >
              oeil frost (cover)
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-3">
        <button
          onClick={() => setShowAdvanced((value) => !value)}
          className="w-full rounded-xl border border-slate-700/60 px-3 py-2 text-xs text-slate-200 hover:border-cyan-300/40"
        >
          {showAdvanced ? "Masquer options avancees" : "Afficher options avancees"}
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-3">
            <Field label="Fit">
              <Select value={selectedPage.imageFit || "cover"} onChange={(event) => setPage({ imageFit: event.target.value })}>
                <option value="cover">cover</option>
                <option value="contain">contain</option>
                <option value="fill">fill</option>
              </Select>
            </Field>
            <Field label="Scale" hint="zoom">
              <Slider min={0.4} max={2.2} step={0.01} value={selectedPage.imageScale || 1} onChange={(value) => setPage({ imageScale: value })} />
            </Field>
            <Field label="Position X">
              <Slider min={0} max={100} value={selectedPage.imageX ?? 50} onChange={(value) => setPage({ imageX: value })} />
            </Field>
            <Field label="Position Y">
              <Slider min={0} max={100} value={selectedPage.imageY ?? 50} onChange={(value) => setPage({ imageY: value })} />
            </Field>

            <Field label="Opacite photo">
              <Slider
                min={0.2}
                max={1}
                step={0.01}
                value={selectedPage.opacityPhoto ?? 1}
                onChange={(value) => setPage({ opacityPhoto: value })}
              />
            </Field>

            <Field label="Largeur bande gauche (%)">
              <Slider min={0} max={28} value={selectedPage.leftBandWidth || 0} onChange={(value) => setPage({ leftBandWidth: value })} />
            </Field>
            <Field label="Largeur device (%)">
              <Slider min={0} max={18} value={selectedPage.sideDeviceWidth || 0} onChange={(value) => setPage({ sideDeviceWidth: value })} />
            </Field>

            {(selectedPage.template === "cover" || selectedPage.template === "article") && (
              <>
                <Field label="Decalage haut journal (%)">
                  <Slider min={0} max={12} step={0.1} value={selectedPage.journalTopInset ?? 0} onChange={(value) => setPage({ journalTopInset: value })} />
                </Field>
                <Field label="Decalage bas journal (%)">
                  <Slider min={0} max={12} step={0.1} value={selectedPage.journalBottomInset ?? 0} onChange={(value) => setPage({ journalBottomInset: value })} />
                </Field>
                <Field label="Marge droite journal (%)">
                  <Slider min={0} max={10} step={0.1} value={selectedPage.journalRightInset ?? 0} onChange={(value) => setPage({ journalRightInset: value })} />
                </Field>
                <Field label="Scale logo bande">
                  <Slider min={0.3} max={0.9} step={0.01} value={selectedPage.logoStripScale ?? 0.5} onChange={(value) => setPage({ logoStripScale: value })} />
                </Field>
              </>
            )}

            {selectedPage.template === "article" && (
              <>
                <Field label="Largeur texte article (%)">
                  <Slider min={30} max={70} step={1} value={selectedPage.articleTextWidth ?? 42} onChange={(value) => setPage({ articleTextWidth: value })} />
                </Field>
                <Field label="Hauteur visuel colonne (%)">
                  <Slider min={26} max={70} step={1} value={selectedPage.articleHeroHeight ?? 46} onChange={(value) => setPage({ articleHeroHeight: value })} />
                </Field>
                <Field label="Taille titre article">
                  <Slider min={2.8} max={7.2} step={0.1} value={selectedPage.articleTitleSize ?? 5.8} onChange={(value) => setPage({ articleTitleSize: value })} />
                </Field>
                <Field label="Colonnes corps texte">
                  <Select value={String(selectedPage.articleBodyColumns ?? 1)} onChange={(event) => setPage({ articleBodyColumns: Number(event.target.value) })}>
                    <option value="1">1 colonne</option>
                    <option value="2">2 colonnes</option>
                  </Select>
                </Field>
              </>
            )}

            {selectedPage.template === "cover" && (
              <>
                <Field label="Y barre titre">
                  <Slider min={45} max={82} value={selectedPage.headlineBarY || 67} onChange={(value) => setPage({ headlineBarY: value })} />
                </Field>
                <Field label="Hauteur barre titre">
                  <Slider min={6} max={18} value={selectedPage.headlineBarH || 10} onChange={(value) => setPage({ headlineBarH: value })} />
                </Field>
                <Field label="Taille titre">
                  <Slider min={2.5} max={7} step={0.1} value={selectedPage.headlineFont || 5.1} onChange={(value) => setPage({ headlineFont: value })} />
                </Field>
              </>
            )}

            <div className="flex flex-wrap gap-2">
              <Toggle checked={!!selectedPage.showDevice} onChange={(value) => setPage({ showDevice: value })} label="Device" />
              <Toggle checked={!!selectedPage.showVerticalBand} onChange={(value) => setPage({ showVerticalBand: value })} label="Bande" />
              <Toggle checked={!!selectedPage.showTopMeta} onChange={(value) => setPage({ showTopMeta: value })} label="Meta" />
              <Toggle checked={!!selectedPage.showCorners} onChange={(value) => setPage({ showCorners: value })} label="Corners" />
              <Toggle checked={!!selectedPage.glow} onChange={(value) => setPage({ glow: value })} label="Glow" />
              <Toggle checked={!!selectedPage.grain} onChange={(value) => setPage({ grain: value })} label="Grain" />
              <Toggle checked={!!selectedPage.showScanlines} onChange={(value) => setPage({ showScanlines: value })} label="Scanlines" />
              {selectedPage.template === "cover" && (
                <>
                  <Toggle checked={!!selectedPage.showHeadline} onChange={(value) => setPage({ showHeadline: value })} label="Titre barre" />
                  <Toggle checked={!!selectedPage.showTicker} onChange={(value) => setPage({ showTicker: value })} label="Ticker" />
                </>
              )}
              {selectedPage.template === "article" && (
                <>
                  <Toggle checked={selectedPage.articleShowImageCard !== false} onChange={(value) => setPage({ articleShowImageCard: value })} label="Visuel side" />
                  <Toggle checked={selectedPage.articleShowQuoteCard !== false} onChange={(value) => setPage({ articleShowQuoteCard: value })} label="Citation side" />
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Fond page">
                <Select value={selectedPage.bgMode || "solid"} onChange={(event) => setPage({ bgMode: event.target.value })}>
                  <option value="solid">solid</option>
                  <option value="gradient">gradient</option>
                </Select>
              </Field>
              <Field label="Couleur fond">
                <input
                  type="color"
                  value={selectedPage.bgColor || "#0B121A"}
                  onChange={(event) => setPage({ bgColor: event.target.value })}
                  className="h-10 w-full rounded-xl border border-cyan-400/20 bg-transparent p-1"
                />
              </Field>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
