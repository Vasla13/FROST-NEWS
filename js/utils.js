(function registerUtils(global) {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function formatDate(dateIso) {
    if (!dateIso) {
      return "jamais";
    }
    const dateObj = new Date(dateIso);
    if (Number.isNaN(dateObj.getTime())) {
      return "inconnue";
    }
    return dateObj.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function shortText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, maxLength - 1)}...`;
  }

  function formatUpperFrenchDate2035(dateObj, year) {
    const raw = dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long"
    });
    return `${raw.toUpperCase()} ${year}`;
  }

  function bytesToMo(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2);
  }

  global.FrostNews = global.FrostNews || {};
  global.FrostNews.utils = {
    bytesToMo,
    clamp,
    formatDate,
    formatUpperFrenchDate2035,
    shortText
  };
})(window);
