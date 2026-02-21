(function registerDom(global) {
  function requiredById(id) {
    const node = document.getElementById(id);
    if (!node) {
      throw new Error(`Element introuvable: #${id}`);
    }
    return node;
  }

  function getDomRefs() {
    const page = requiredById("print-page");
    const modules = Array.from(page.querySelectorAll(".module"));

    return {
      page,
      statusText: requiredById("status-text"),
      autosaveInfo: requiredById("autosave-info"),
      editionDateLabel: requiredById("edition-date"),
      toggleEditBtn: requiredById("toggle-edit"),
      resetBtn: requiredById("reset-layout"),
      addImageBtn: requiredById("add-image"),
      addTextChunkBtn: requiredById("add-text-chunk"),
      deleteTextChunkBtn: requiredById("delete-text-chunk"),
      addTextBlockBtn: requiredById("add-text-block"),
      duplicateBlockBtn: requiredById("duplicate-block"),
      deleteBlockBtn: requiredById("delete-block"),
      imageUploadInput: requiredById("image-upload-input"),
      exportPngBtn: requiredById("export-png"),
      exportJpegBtn: requiredById("export-jpeg"),
      exportPdfBtn: requiredById("export-pdf"),
      archiveEditionBtn: requiredById("archive-edition"),
      loadHistoryBtn: requiredById("load-history"),
      deleteHistoryBtn: requiredById("delete-history"),
      clearHistoryBtn: requiredById("clear-history"),
      editionLabelInput: requiredById("edition-label"),
      historyList: requiredById("history-list"),
      previewSurface: requiredById("preview-surface"),
      layoutButtons: Array.from(document.querySelectorAll(".layout-btn")),
      modules,
      modulesByBlock: new Map(modules.map((moduleElement) => [moduleElement.dataset.block, moduleElement]))
    };
  }

  global.FrostNews = global.FrostNews || {};
  global.FrostNews.dom = {
    getDomRefs
  };
})(window);
