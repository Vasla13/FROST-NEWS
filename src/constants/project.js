import sideDeviceAsset from "../../assets/barrejournal.png";
import cornerBRAsset from "../../assets/fond1.png";
import cornerBLAsset from "../../assets/fond2.png";
import cornerTRAsset from "../../assets/fond3.png";
import cornerTLAsset from "../../assets/fond4.png";
import coverBaseAsset from "../../assets/fond0.png";
import logoStripAsset from "../../assets/logofrost.png";
import eyeLogoAsset from "../../assets/oeil frost.png";
import metaStripAsset from "../../assets/SEPARATION NUMERO JOURNAL ET DATE.png";

export const DEFAULT_COLORS = {
  cyan: "#2B9ECD",
  cyanSoft: "#8CE4F3",
  blueGlow: "#65DCF2",
  dark: "#050A0F",
  panel: "#093055",
  text: "#DFFBFF",
  black: "#000000",
};

export const STORAGE_KEY = "frost_news_builder_v1";

export const DEFAULT_PROJECT_ASSETS = {
  sideDevice: sideDeviceAsset,
  cornerTL: cornerTLAsset,
  cornerTR: cornerTRAsset,
  cornerBL: cornerBLAsset,
  cornerBR: cornerBRAsset,
  metaStrip: metaStripAsset,
  logoStamp: logoStripAsset,
};

export const BUNDLED_PROJECT_ASSETS = {
  ...DEFAULT_PROJECT_ASSETS,
};

export const BUNDLED_PAGE_IMAGES = {
  finalCover: coverBaseAsset,
  coverNoGlow: coverBaseAsset,
  coverGlow: coverBaseAsset,
  baseCover: coverBaseAsset,
  eyeLogo: eyeLogoAsset,
};

export const PAGE_PRESETS = {
  cover: {
    name: "Cover",
    template: "cover",
    subject: "Michel Muck dans le coma",
    kicker: "URGENT",
    issue: "#001",
    date: "FEVRIER 2035",
    ticker1: "Mission Row : Le pilotage nocturne passe du test au deploiement",
    imageUrl: coverBaseAsset,
    imageFit: "cover",
    imageScale: 1,
    imageX: 50,
    imageY: 50,
    leftBandWidth: 8.5,
    sideDeviceWidth: 13.5,
    journalTopInset: 4.2,
    journalBottomInset: 3.4,
    headlineBarY: 69,
    headlineBarH: 8.2,
    headlineFont: 4.2,
    showTopMeta: true,
    showDevice: true,
    showCorners: false,
    showVerticalBand: true,
    showHeadline: true,
    showTicker: true,
    showScanlines: true,
    glow: true,
    grain: true,
    opacityPhoto: 0.96,
    bgMode: "solid",
    bgColor: "#050A0F",
    note: "Cover principale Frost News",
  },
  article: {
    name: "Page Article",
    template: "article",
    subject: "Titre du sujet",
    kicker: "ENQUETE",
    issue: "#001",
    date: "FEVRIER 2035",
    section: "SECURITE / VILLE",
    subhead: "Resume court de la news avec un angle editorial clair.",
    body: "Bloc de texte principal. Colle ton article ici.\n\nSepare en paragraphes pour aerer la lecture.",
    quote: '"Le terrain change plus vite que les regles."',
    author: "Redaction Frost News",
    imageUrl: "",
    imageFit: "cover",
    imageScale: 1,
    imageX: 50,
    imageY: 40,
    leftBandWidth: 16,
    sideDeviceWidth: 8,
    journalTopInset: 4.2,
    journalBottomInset: 3.4,
    showDevice: false,
    showTopMeta: true,
    showCorners: true,
    showVerticalBand: true,
    showHeadline: false,
    showTicker: false,
    showScanlines: true,
    glow: false,
    grain: true,
    bgMode: "solid",
    bgColor: "#050A0F",
    note: "Page article standard",
  },
  ad: {
    name: "Page Pub",
    template: "ad",
    subject: "Votre pub ici",
    kicker: "PUBLICITE",
    issue: "#001",
    date: "FEVRIER 2035",
    section: "FROST ADS",
    cta: "Contactez Frost News pour diffuser votre campagne",
    body: "Formats disponibles : encart, pleine page, bandeau, sponsor de rubrique.",
    imageUrl: "",
    imageFit: "contain",
    imageScale: 0.9,
    imageX: 50,
    imageY: 45,
    leftBandWidth: 14,
    sideDeviceWidth: 8,
    journalTopInset: 4.2,
    journalBottomInset: 3.4,
    showDevice: false,
    showTopMeta: true,
    showCorners: true,
    showVerticalBand: true,
    showHeadline: false,
    showTicker: false,
    showScanlines: true,
    glow: true,
    grain: false,
    bgMode: "solid",
    bgColor: "#050A0F",
    note: "Template sponsor / pub",
  },
};

export const FORMAT_OPTIONS = [
  { label: "1080x1350", value: "1080x1350" },
  { label: "1080x1920", value: "1080x1920" },
  { label: "1200x1600", value: "1200x1600" },
  { label: "A4 (ecran)", value: "A4" },
  { label: "A4 print (hi-res)", value: "A4_PRINT" },
];

export const INSPECTOR_TABS = [
  { key: "page", label: "Page" },
  { key: "assets", label: "Assets" },
  { key: "style", label: "Style" },
  { key: "project", label: "Projet" },
];
