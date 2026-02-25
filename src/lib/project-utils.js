import {
  DEFAULT_COLORS,
  DEFAULT_PROJECT_ASSETS,
  PAGE_PRESETS,
} from "../constants/project";

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createPageFromPreset(kind = "cover") {
  const preset = PAGE_PRESETS[kind] || PAGE_PRESETS.cover;
  return {
    id: uid(),
    ...deepCopy(preset),
  };
}

export function defaultProject() {
  return {
    meta: {
      title: "Frost News Journal",
      format: "1080x1350",
      backgroundOutside: "#050A0F",
      borderRadius: 8,
      padding: 12,
    },
    style: {
      ...DEFAULT_COLORS,
      fontDisplay: "\"Bebas Neue\", \"Anton\", sans-serif",
      fontUi: "\"Rajdhani\", \"Share Tech Mono\", sans-serif",
      fontTech: "\"Share Tech Mono\", monospace",
      fontPixel: "\"VT323\", monospace",
    },
    assets: {
      ...DEFAULT_PROJECT_ASSETS,
    },
    pages: [createPageFromPreset("cover"), createPageFromPreset("article")],
  };
}

export function hydrateProject(rawProject) {
  const fallback = defaultProject();
  if (!rawProject?.pages?.length) {
    return fallback;
  }

  const incomingAssets = rawProject.assets || {};
  const hasAtLeastOneAsset = Object.values(incomingAssets).some(
    (value) => typeof value === "string" && value.trim() !== ""
  );

  return {
    ...fallback,
    ...rawProject,
    meta: { ...fallback.meta, ...(rawProject.meta || {}) },
    style: { ...fallback.style, ...(rawProject.style || {}) },
    assets: hasAtLeastOneAsset ? { ...fallback.assets, ...incomingAssets } : { ...fallback.assets },
    pages: rawProject.pages.map((page) => {
      const preset = PAGE_PRESETS[page.template] || PAGE_PRESETS.cover;
      const looksLikeOldImageOnlyCover =
        page.template === "cover" &&
        page.showVerticalBand === false &&
        page.showHeadline === false &&
        page.showTicker === false &&
        (page.leftBandWidth === 0 || page.leftBandWidth === undefined) &&
        (page.sideDeviceWidth === 0 || page.sideDeviceWidth === undefined);

      return {
        ...deepCopy(preset),
        ...page,
        id: page.id || uid(),
        imageUrl: page.template === "cover" ? (page.imageUrl || preset.imageUrl || "") : (page.imageUrl || ""),
        leftBandWidth: looksLikeOldImageOnlyCover ? 17 : (page.leftBandWidth ?? preset.leftBandWidth),
        sideDeviceWidth: looksLikeOldImageOnlyCover ? 12 : (page.sideDeviceWidth ?? preset.sideDeviceWidth),
        showDevice: looksLikeOldImageOnlyCover ? true : (page.showDevice ?? preset.showDevice),
        showTopMeta: looksLikeOldImageOnlyCover ? true : (page.showTopMeta ?? preset.showTopMeta),
        showCorners: looksLikeOldImageOnlyCover ? true : (page.showCorners ?? preset.showCorners),
        glow: looksLikeOldImageOnlyCover ? true : (page.glow ?? preset.glow),
        grain: looksLikeOldImageOnlyCover ? true : (page.grain ?? preset.grain),
        showVerticalBand:
          page.showVerticalBand === undefined
            ? page.template === "cover"
              ? fallback.pages[0].showVerticalBand
              : (preset.showVerticalBand ?? true)
            : page.showVerticalBand,
        showHeadline: page.showHeadline === undefined ? (page.template === "cover") : page.showHeadline,
        showTicker: page.showTicker === undefined ? (page.template === "cover") : page.showTicker,
      };
    }),
  };
}

export function parseFormat(format) {
  if (format === "A4") {
    return { w: 1240, h: 1754 };
  }

  if (format === "A4_PRINT") {
    return { w: 1654, h: 2339 };
  }

  const match = String(format).match(/(\d+)x(\d+)/i);
  if (match) {
    return { w: Number(match[1]), h: Number(match[2]) };
  }

  return { w: 1080, h: 1350 };
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
