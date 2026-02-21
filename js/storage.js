(function registerStorage(global) {
  function readStorage(key, fallbackValue) {
    try {
      const rawValue = localStorage.getItem(key);
      if (!rawValue) {
        return fallbackValue;
      }
      return JSON.parse(rawValue);
    } catch (_error) {
      return fallbackValue;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_error) {
      return false;
    }
  }

  global.FrostNews = global.FrostNews || {};
  global.FrostNews.storage = {
    readStorage,
    writeStorage
  };
})(window);
