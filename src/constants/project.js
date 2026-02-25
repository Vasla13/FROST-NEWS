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
    tickerHeight: 7.4,
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
    subject: "Les drones civils passent en mode veille tactique",
    kicker: "ENQUETE",
    issue: "#001",
    date: "FEVRIER 2035",
    section: "SECURITE URBAINE",
    subhead: "Le protocole de nuit est entre en phase active apres trois semaines de tests en zone dense.",
    body: "A 03h12, les premiers drones de patrouille ont recu la mise a jour tactique sur le secteur Mission Row. Les couloirs a forte densite de trafic ont ete cartographies en direct et relies au centre de supervision.\n\nLe changement principal concerne la priorite de survol. Les appareils evitent desormais les carrefours avec signalement humain et renforcent la couverture sur les zones logistiques. Selon la mairie, l'objectif est de reduire le temps de reaction sans augmenter le nombre de vols.\n\nSur le terrain, les operateurs indiquent une baisse des alertes inutiles mais confirment une charge de controle plus elevee pendant les deux premieres heures. Le syndicat technique demande une grille claire pour les interventions mixtes humain + drone.\n\nLe comite de regulation a annonce une evaluation publique d'ici dix jours. En attendant, le dispositif reste en mode progressif avec journalisation complete des evenements critiques.",
    quote: '"On a gagne en vitesse, pas encore en lisibilite operationnelle."',
    quoteAuthor: "Commandant R. Vega",
    author: "Redaction Frost News",
    imageUrl: "",
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
    articleTextWidth: 42,
    articleHeroHeight: 46,
    articleTitleSize: 5.8,
    articleBodyColumns: 1,
    articleShowImageCard: true,
    articleShowQuoteCard: true,
    showDevice: true,
    showTopMeta: true,
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
    journalTopInset: 0,
    journalBottomInset: 0,
    journalRightInset: 0,
    logoStripScale: 0.5,
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
  { label: "Personnalise", value: "CUSTOM" },
];

export const INSPECTOR_TABS = [
  { key: "page", label: "Page" },
  { key: "assets", label: "Assets" },
  { key: "style", label: "Style" },
  { key: "project", label: "Projet" },
];
