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
    leftBandWidth: 13.2,
    sideDeviceWidth: 11.8,
    journalTopInset: 0,
    journalBottomInset: 0,
    journalRightInset: 0.8,
    logoStripScale: 0.76,
    headlineBarY: 74.8,
    headlineBarH: 9,
    headlineFont: 4.9,
    tickerHeight: 4.2,
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
    subject: "Sous la ville, le reseau passe en veille silencieuse",
    kicker: "",
    issue: "",
    date: "",
    section: "",
    subhead: "Une bascule technique discreete reorganise la circulation des donnees critiques sans interrompre le rythme urbain.",
    body: "A 03h12, le centre de supervision a declenche une transition vers un profil de trafic plus sobre. L objectif n etait pas d accelerer le systeme, mais de rendre chaque priorite plus lisible pour les equipes de pilotage.\n\nLes flux secondaires ont ete deplaces vers des canaux differes et les passerelles les plus sensibles ont recu un filtrage plus strict. Le reseau a gagne en stabilite, avec moins de micro-coupures et une charge mieux repartie sur les noeuds de bord.\n\nSur le terrain, les operateurs de nuit parlent d une console plus claire et de decisions plus rapides quand un evenement critique apparait. La baisse du bruit technique laisse plus de place au signal utile.\n\nLa phase active se poursuit sous surveillance continue. Si les indicateurs restent stables, ce mode deviendra la reference pour les prochaines semaines.",
    quote: '"Quand le bruit baisse, la ville devient enfin lisible."',
    quoteAuthor: "Cellule de supervision",
    author: "",
    imageUrl: "",
    articleImageUrl: "",
    imageFit: "cover",
    imageScale: 1,
    imageX: 54,
    imageY: 38,
    opacityPhoto: 0.62,
    leftBandWidth: 13.2,
    sideDeviceWidth: 11.8,
    journalTopInset: 0,
    journalBottomInset: 0,
    journalRightInset: 0.8,
    logoStripScale: 0.76,
    articleTextWidth: 68,
    articleHeroHeight: 30,
    articleTitleSize: 5.8,
    articleBodyColumns: 1,
    articleShowImageCard: true,
    articleShowQuoteCard: true,
    showDevice: true,
    showTopMeta: false,
    showCorners: false,
    showVerticalBand: true,
    showHeadline: false,
    showTicker: false,
    showScanlines: true,
    glow: true,
    grain: true,
    bgMode: "solid",
    bgColor: "#050A0F",
  },
  ad: {
    name: "Page Pub",
    template: "ad",
    adLayoutMode: "image-dominant",
    subject: "Lance ta campagne au coeur de la ville",
    kicker: "PUBLICITE",
    issue: "#001",
    date: "FEVRIER 2035",
    section: "PLACEMENT PREMIUM",
    cta: "Reserve ton slot: frost-ads@citynet.io",
    body: "Formats disponibles pour campagnes locales et nationales: pleine page, sequence sponsor, takeover de rubrique, activation evenementielle.",
    imageUrl: "",
    imageFit: "cover",
    imageScale: 1,
    imageX: 50,
    imageY: 50,
    leftBandWidth: 13.2,
    sideDeviceWidth: 11.8,
    journalTopInset: 0,
    journalBottomInset: 0,
    journalRightInset: 0.8,
    logoStripScale: 0.76,
    showDevice: true,
    showTopMeta: false,
    showCorners: false,
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
  { label: "Personnalise", value: "CUSTOM" },
];

export const INSPECTOR_TABS = [
  { key: "page", label: "Page" },
  { key: "assets", label: "Assets" },
  { key: "style", label: "Style" },
  { key: "project", label: "Projet" },
];
