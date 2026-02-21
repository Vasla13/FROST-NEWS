(function registerConstants(global) {
  const constants = {
    MIN_WIDTH: 12,
    MIN_HEIGHT: 8,
    AUTO_FIT_EMPTY_MIN_HEIGHT: 2.8,
    AUTO_FIT_EMPTY_PADDING_PX: 6,
    HISTORY_LIMIT: 12,
    IMAGE_MAX_DIMENSION: 1700,
    AUTOSAVE_DELAY_MS: 550,
    AUTOSAVE_KEY: "frost-news.autosave.v4",
    HISTORY_KEY: "frost-news.history.v4",
    JOURNAL_YEAR: 2035,
    EXPORT_MAX_WIDTH: 1440,
    EXPORT_MAX_HEIGHT: 2560,
    MAX_EXPORT_BYTES: 2 * 1024 * 1024
  };

  const layouts = {
    classic: {
      masthead: { x: 2, y: 2, w: 96, h: 12.2 },
      lead: { x: 2, y: 14, w: 65, h: 20.5 },
      "article-main": { x: 2, y: 35.4, w: 65, h: 27.5 },
      "article-second": { x: 2, y: 63.8, w: 65, h: 17.5 },
      frontline: { x: 68, y: 14, w: 30, h: 20.5 },
      briefs: { x: 68, y: 35.4, w: 30, h: 23 },
      quote: { x: 68, y: 59.4, w: 30, h: 10.5 },
      gallery: { x: 2, y: 82.3, w: 65, h: 15.7 },
      ad: { x: 68, y: 70.8, w: 30, h: 27.2 }
    },
    magazine: {
      masthead: { x: 2, y: 2, w: 96, h: 11.8 },
      lead: { x: 2, y: 14.2, w: 96, h: 16.8 },
      gallery: { x: 63, y: 31.8, w: 35, h: 21.5 },
      frontline: { x: 2, y: 31.8, w: 29.5, h: 17 },
      briefs: { x: 32.5, y: 31.8, w: 29.5, h: 21.5 },
      quote: { x: 2, y: 49.8, w: 29.5, h: 10.2 },
      "article-main": { x: 2, y: 61, w: 60, h: 25.5 },
      "article-second": { x: 63, y: 54.2, w: 35, h: 32.3 },
      ad: { x: 2, y: 87.3, w: 96, h: 10.7 }
    },
    minimal: {
      masthead: { x: 3, y: 3, w: 94, h: 11.5 },
      lead: { x: 3, y: 14.2, w: 94, h: 14.8 },
      frontline: { x: 3, y: 30, w: 28.5, h: 16.5 },
      "article-main": { x: 32.6, y: 30, w: 64.4, h: 24.6 },
      briefs: { x: 3, y: 47.5, w: 28.5, h: 19.5 },
      quote: { x: 3, y: 68, w: 28.5, h: 10.5 },
      "article-second": { x: 32.6, y: 55.6, w: 31.4, h: 22.2 },
      gallery: { x: 65.1, y: 55.6, w: 31.9, h: 22.2 },
      ad: { x: 32.6, y: 78.8, w: 64.4, h: 18.2 }
    }
  };

  const layoutLabels = {
    classic: "Classique modernise",
    magazine: "Ultra futuriste",
    minimal: "Minimal premium"
  };

  global.FrostNews = global.FrostNews || {};
  global.FrostNews.constants = constants;
  global.FrostNews.layouts = layouts;
  global.FrostNews.layoutLabels = layoutLabels;
})(window);
