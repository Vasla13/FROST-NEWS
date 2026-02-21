(function bootstrapApp(global) {
  const FrostNews = global.FrostNews || {};
  const constants = FrostNews.constants;
  const layouts = FrostNews.layouts;
  const layoutLabels = FrostNews.layoutLabels || {};
  const dom = FrostNews.dom;
  const mediaUtils = FrostNews.mediaUtils;
  const storage = FrostNews.storage;
  const utils = FrostNews.utils;

  if (!constants || !layouts || !dom || !mediaUtils || !storage || !utils) {
    throw new Error("Initialisation impossible: dependances FrostNews manquantes.");
  }

  const refs = dom.getDomRefs();
  const {
    addImageBtn,
    addTextChunkBtn,
    addTextBlockBtn,
    archiveEditionBtn,
    autosaveInfo,
    clearHistoryBtn,
    deleteTextChunkBtn,
    deleteBlockBtn,
    duplicateBlockBtn,
    deleteHistoryBtn,
    editionDateLabel,
    editionLabelInput,
    exportJpegBtn,
    exportPdfBtn,
    exportPngBtn,
    historyList,
    imageUploadInput,
    layoutButtons,
    loadHistoryBtn,
    page,
    previewSurface,
    resetBtn,
    statusText,
    toggleEditBtn
  } = refs;
  let modules = refs.modules;
  let modulesByBlock = refs.modulesByBlock;

  const {
    AUTO_FIT_EMPTY_MIN_HEIGHT,
    AUTO_FIT_EMPTY_PADDING_PX,
    AUTOSAVE_DELAY_MS,
    AUTOSAVE_KEY,
    EXPORT_MAX_HEIGHT,
    EXPORT_MAX_WIDTH,
    HISTORY_KEY,
    HISTORY_LIMIT,
    IMAGE_MAX_DIMENSION,
    JOURNAL_YEAR,
    MAX_EXPORT_BYTES,
    MIN_HEIGHT,
    MIN_WIDTH,
    TEXT_BLOCK_MIN_HEIGHT_PX,
    TEXT_BLOCK_MIN_WIDTH_PX
  } = constants;

  const {
    buildImageAlt,
    buildLegend,
    canvasToBlob,
    cloneCanvas,
    createFigure,
    downscaleDataUrl,
    fileToDataUrl,
    quantizeCanvasInPlace,
    waitForImages
  } = mediaUtils;

  const { readStorage, writeStorage } = storage;
  const {
    bytesToMo,
    clamp,
    formatDate,
    formatUpperFrenchDate2035,
    shortText
  } = utils;

  const state = {
    editEnabled: true,
    currentLayout: "classic",
    activeModule: null,
    activeTextBlock: null,
    dragState: null,
    autosaveTimer: null,
    suppressPersistence: false,
    pendingImageAction: null,
    historyEntries: [],
    defaultTemplateState: null,
    previewSyncHandle: 0
  };

  const frameResizeDirections = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

  function refreshModulesCache() {
    modules = Array.from(page.querySelectorAll(".module"));
    modulesByBlock = new Map(modules.map((moduleElement) => [moduleElement.dataset.block, moduleElement]));
    for (const moduleElement of modules) {
      ensureResizeHandles(moduleElement);
    }
    refreshTextResizeHandles(page);
  }

  function ensureResizeHandles(moduleElement) {
    const toolbarHandle = moduleElement.querySelector(".module-tools .resize-handle");
    if (toolbarHandle) {
      toolbarHandle.dataset.resizeDir = "se";
      toolbarHandle.classList.add("toolbar-resize-handle");
      if (!toolbarHandle.title) {
        toolbarHandle.title = "Redimensionner";
      }
    }

    let layer = moduleElement.querySelector(".module-resize-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "module-resize-layer";
      moduleElement.appendChild(layer);
    }

    for (const dir of frameResizeDirections) {
      if (layer.querySelector(`[data-resize-dir="${dir}"]`)) {
        continue;
      }
      const handle = document.createElement("span");
      handle.className = `resize-handle frame-resize-handle resize-${dir}`;
      handle.dataset.resizeDir = dir;
      handle.title = "Redimensionner";
      layer.appendChild(handle);
    }
  }

  function ensureTextResizeHandle(textBlock) {
    if (!textBlock || !textBlock.classList) {
      return;
    }
    textBlock.classList.add("text-resizable");

    let layer = null;
    for (const child of Array.from(textBlock.children || [])) {
      if (child.classList && child.classList.contains("text-resize-layer")) {
        layer = child;
        break;
      }
    }
    if (!layer) {
      layer = document.createElement("span");
      layer.className = "text-resize-layer";
      layer.setAttribute("aria-hidden", "true");
      textBlock.appendChild(layer);
    }
    layer.setAttribute("contenteditable", "false");
    layer.setAttribute("draggable", "false");

    if (!layer.querySelector(".text-move-handle")) {
      const moveHandle = document.createElement("span");
      moveHandle.className = "text-move-handle";
      moveHandle.title = "Deplacer le bloc texte";
      moveHandle.setAttribute("aria-hidden", "true");
      moveHandle.setAttribute("contenteditable", "false");
      moveHandle.setAttribute("draggable", "false");
      layer.appendChild(moveHandle);
    }

    for (const dir of frameResizeDirections) {
      if (layer.querySelector(`[data-text-resize-dir="${dir}"]`)) {
        continue;
      }
      const handle = document.createElement("span");
      handle.className = `text-resize-handle text-resize-${dir}`;
      handle.dataset.textResizeDir = dir;
      handle.title = "Redimensionner le bloc texte";
      handle.setAttribute("aria-hidden", "true");
      handle.setAttribute("contenteditable", "false");
      handle.setAttribute("draggable", "false");
      layer.appendChild(handle);
    }
  }

  function readTextShift(textBlock) {
    return {
      x: parseFloat(textBlock.dataset.textShiftX || "0"),
      y: parseFloat(textBlock.dataset.textShiftY || "0")
    };
  }

  function applyTextShift(textBlock, shift) {
    const safeX = Number.isFinite(Number(shift.x)) ? Number(shift.x) : 0;
    const safeY = Number.isFinite(Number(shift.y)) ? Number(shift.y) : 0;
    textBlock.dataset.textShiftX = String(safeX);
    textBlock.dataset.textShiftY = String(safeY);
    if (Math.abs(safeX) < 0.01 && Math.abs(safeY) < 0.01) {
      textBlock.style.removeProperty("transform");
      return;
    }
    textBlock.style.transform = `translate(${safeX.toFixed(1)}px, ${safeY.toFixed(1)}px)`;
  }

  function refreshTextResizeHandles(rootNode) {
    const root = rootNode || page;
    for (const textBlock of root.querySelectorAll(getTextBlockSelector())) {
      ensureTextResizeHandle(textBlock);
      const shift = readTextShift(textBlock);
      applyTextShift(textBlock, shift);
    }
  }

  function setCurrentDateLabels() {
    const now = new Date();
    editionDateLabel.textContent = formatUpperFrenchDate2035(now, JOURNAL_YEAR);
    schedulePreviewSync();
  }

  function updateStatus(message, isError) {
    statusText.textContent = message;
    statusText.style.color = isError ? "var(--danger)" : "#cfe6ff";
  }

  function setActiveModule(moduleElement) {
    for (const moduleItem of modules) {
      moduleItem.classList.remove("active");
    }
    state.activeModule = moduleElement || null;
    if (state.activeModule) {
      state.activeModule.classList.add("active");
    }
    if (!state.activeModule) {
      setActiveTextBlock(null);
    }
  }

  function setActiveTextBlock(textNode) {
    if (state.activeTextBlock) {
      state.activeTextBlock.classList.remove("text-block-active");
    }
    state.activeTextBlock = textNode || null;
    if (state.activeTextBlock) {
      state.activeTextBlock.classList.add("text-block-active");
    }
  }

  function getTextBlockSelector() {
    return ".module-content h2, .module-content h3, .module-content h4, .module-content p, .module-content li, .module-content blockquote, .module-content figcaption";
  }

  function getTargetModuleForTextOps() {
    return state.activeModule || null;
  }

  function addTextChunk() {
    const targetModule = getTargetModuleForTextOps();
    if (!targetModule) {
      updateStatus("Selectionnez une case pour ajouter du texte.", true);
      return;
    }
    const content = targetModule.querySelector(".module-content");
    if (!content) {
      updateStatus("Contenu introuvable dans cette case.", true);
      return;
    }
    const paragraph = document.createElement("p");
    paragraph.textContent = "Nouveau bloc texte a personnaliser.";
    content.appendChild(paragraph);
    setContentEditable(state.editEnabled);
    setActiveModule(targetModule);
    setActiveTextBlock(paragraph);
    schedulePreviewSync();
    scheduleAutosave("bloc texte ajoute");
    updateStatus("Bloc texte ajoute dans la case active.", false);
  }

  function deleteTextChunk() {
    const targetModule = getTargetModuleForTextOps();
    if (!targetModule) {
      updateStatus("Selectionnez une case pour supprimer un bloc texte.", true);
      return;
    }
    const content = targetModule.querySelector(".module-content");
    if (!content) {
      updateStatus("Contenu introuvable dans cette case.", true);
      return;
    }
    const candidates = Array.from(content.querySelectorAll(getTextBlockSelector()));
    if (!candidates.length) {
      updateStatus("Aucun bloc texte a supprimer dans cette case.", true);
      return;
    }

    const fallbackTarget = candidates[candidates.length - 1];
    const activeTarget = state.activeTextBlock && content.contains(state.activeTextBlock)
      ? state.activeTextBlock
      : fallbackTarget;

    if (candidates.length === 1) {
      activeTarget.textContent = "";
      setActiveModule(targetModule);
      setActiveTextBlock(activeTarget);
      autoFitModuleIfEmpty(targetModule);
      schedulePreviewSync();
      scheduleAutosave("bloc texte vide");
      updateStatus("Dernier bloc texte vide (case conservee).", false);
      return;
    }

    const nextCandidate = candidates.find((node) => node !== activeTarget) || null;
    activeTarget.remove();
    setContentEditable(state.editEnabled);
    setActiveModule(targetModule);
    setActiveTextBlock(nextCandidate);
    autoFitModuleIfEmpty(targetModule);
    schedulePreviewSync();
    scheduleAutosave("bloc texte supprime");
    updateStatus("Bloc texte supprime dans la case active.", false);
  }

  function nextCustomBlockId() {
    return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function computeNewCustomRect() {
    const customCount = modules.filter((moduleElement) => moduleElement.dataset.custom === "1").length;
    const offset = customCount % 6;
    return {
      x: clamp(6 + offset * 4, 0, 72),
      y: clamp(10 + offset * 5, 0, 80),
      w: 30,
      h: 16
    };
  }

  function createModuleElement(blockName, labelText, html, rect, contentClass, isCustom) {
    const section = document.createElement("section");
    section.className = "module";
    section.dataset.block = blockName;
    if (isCustom) {
      section.dataset.custom = "1";
    }

    const tools = document.createElement("div");
    tools.className = "module-tools";
    tools.innerHTML = `
      <span class="module-label">${labelText}</span>
      <span class="resize-handle toolbar-resize-handle" data-resize-dir="se" title="Redimensionner"></span>
    `;

    const content = document.createElement("div");
    content.className = contentClass || "module-content article-content compact";
    content.innerHTML = html || "<h3>Nouvelle case texte</h3><p>Ecrivez votre contenu ici.</p>";

    section.appendChild(tools);
    section.appendChild(content);

    if (rect) {
      applyRect(section, rect);
    }
    return section;
  }

  function addTextBlock() {
    const blockId = nextCustomBlockId();
    const rect = computeNewCustomRect();
    const moduleElement = createModuleElement(
      blockId,
      "Case texte",
      "<h3>Nouvelle case texte</h3><p>Ajoutez ici votre texte libre, sous-titre, note ou complement d'article.</p>",
      rect,
      "module-content article-content compact",
      true
    );

    page.appendChild(moduleElement);
    refreshModulesCache();
    setContentEditable(state.editEnabled);
    setActiveModule(moduleElement);
    schedulePreviewSync();
    scheduleAutosave("case texte ajoutee");
    updateStatus("Nouvelle case texte ajoutee.", false);
  }

  function duplicateActiveBlock() {
    const target = state.activeModule;
    if (!target) {
      updateStatus("Selectionnez une case a dupliquer.", true);
      return;
    }

    const blockId = nextCustomBlockId();
    const sourceRect = readRect(target);
    const rect = {
      x: clamp(sourceRect.x + 2.5, 0, 100 - sourceRect.w),
      y: clamp(sourceRect.y + 2.5, 0, 100 - sourceRect.h),
      w: sourceRect.w,
      h: sourceRect.h
    };
    const label = target.querySelector(".module-label")?.textContent || "Case texte";
    const contentNode = target.querySelector(".module-content");
    const html = contentNode ? contentNode.innerHTML : "<p>Contenu duplique.</p>";
    const contentClass = contentNode ? contentNode.className : "module-content article-content compact";

    const moduleElement = createModuleElement(blockId, label, html, rect, contentClass, true);
    page.appendChild(moduleElement);

    refreshModulesCache();
    setContentEditable(state.editEnabled);
    setActiveModule(moduleElement);
    schedulePreviewSync();
    scheduleAutosave("case dupliquee");
    updateStatus("Case dupliquee.", false);
  }

  function deleteActiveBlock() {
    const target = state.activeModule;
    if (!target) {
      updateStatus("Selectionnez une case a supprimer.", true);
      return;
    }
    target.remove();
    refreshModulesCache();
    setActiveModule(null);
    schedulePreviewSync();
    scheduleAutosave("case supprimee");
    updateStatus("Case supprimee.", false);
  }

  function syncPreviewNow() {
    if (!previewSurface) {
      return;
    }
    const clone = page.cloneNode(true);
    clone.id = "preview-page";
    clone.removeAttribute("aria-label");
    clone.classList.remove("export-capture", "export-capture-safe", "export-capture-flat");

    for (const node of clone.querySelectorAll("[id]")) {
      node.removeAttribute("id");
    }
    for (const node of clone.querySelectorAll("[contenteditable]")) {
      node.removeAttribute("contenteditable");
    }
    for (const node of clone.querySelectorAll(".editable-text")) {
      node.classList.remove("editable-text");
    }
    for (const node of clone.querySelectorAll(".text-block-active")) {
      node.classList.remove("text-block-active");
    }
    for (const node of clone.querySelectorAll(".text-resize-handle")) {
      node.remove();
    }
    for (const node of clone.querySelectorAll(".text-resize-layer")) {
      node.remove();
    }
    for (const node of clone.querySelectorAll(".text-resizable")) {
      node.classList.remove("text-resizable");
    }
    for (const node of clone.querySelectorAll(".module")) {
      node.classList.remove("active");
    }

    previewSurface.innerHTML = "";
    previewSurface.appendChild(clone);
  }

  function schedulePreviewSync() {
    if (!previewSurface || state.previewSyncHandle) {
      return;
    }
    state.previewSyncHandle = window.requestAnimationFrame(() => {
      state.previewSyncHandle = 0;
      syncPreviewNow();
    });
  }

  function computeExportMetrics() {
    const rect = page.getBoundingClientRect();
    const safeWidth = Math.max(1, Math.round(rect.width));
    const safeHeight = Math.max(1, Math.round(rect.height));
    const scale = Math.min(EXPORT_MAX_WIDTH / safeWidth, EXPORT_MAX_HEIGHT / safeHeight);

    return {
      sourceWidth: safeWidth,
      sourceHeight: safeHeight,
      scale: Math.max(0.1, scale),
      exportWidth: Math.max(1, Math.round(safeWidth * scale)),
      exportHeight: Math.max(1, Math.round(safeHeight * scale))
    };
  }

  function updateAutosaveInfo(dateIso) {
    autosaveInfo.textContent = `Auto-save: ${formatDate(dateIso)}.`;
  }

  function readRect(moduleElement) {
    return {
      x: parseFloat(moduleElement.dataset.x || "0"),
      y: parseFloat(moduleElement.dataset.y || "0"),
      w: parseFloat(moduleElement.dataset.w || "20"),
      h: parseFloat(moduleElement.dataset.h || "20")
    };
  }

  function normalizeEditableText(value) {
    return String(value || "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function moduleHasUsefulText(moduleElement) {
    const content = moduleElement.querySelector(".module-content");
    if (!content) {
      return false;
    }
    const textBlocks = content.querySelectorAll(getTextBlockSelector());
    for (const block of textBlocks) {
      if (normalizeEditableText(block.textContent).length > 0) {
        return true;
      }
    }
    return false;
  }

  function moduleHasVisualMedia(moduleElement) {
    const content = moduleElement.querySelector(".module-content");
    if (!content) {
      return false;
    }
    return Boolean(content.querySelector("img, picture, video, canvas, svg"));
  }

  function autoFitModuleIfEmpty(moduleElement) {
    if (!moduleElement || !moduleElement.classList.contains("module")) {
      return false;
    }
    if (moduleHasUsefulText(moduleElement) || moduleHasVisualMedia(moduleElement)) {
      return false;
    }

    const content = moduleElement.querySelector(".module-content");
    const tools = moduleElement.querySelector(".module-tools");
    if (!content || !tools) {
      return false;
    }

    const pageRect = page.getBoundingClientRect();
    if (!pageRect.height) {
      return false;
    }

    const rect = readRect(moduleElement);
    const toolsHeightPx = Math.max(18, tools.getBoundingClientRect().height || 0);
    const contentHeightPx = Math.max(10, content.scrollHeight || 0);
    const targetHeightPx = toolsHeightPx + contentHeightPx + AUTO_FIT_EMPTY_PADDING_PX;
    const targetHeightPercent = (targetHeightPx / pageRect.height) * 100;
    const collapsedHeight = clamp(targetHeightPercent, AUTO_FIT_EMPTY_MIN_HEIGHT, 100 - rect.y);

    if (collapsedHeight >= rect.h - 0.05) {
      return false;
    }

    applyRect(moduleElement, {
      x: rect.x,
      y: rect.y,
      w: rect.w,
      h: collapsedHeight
    }, {
      minHeight: AUTO_FIT_EMPTY_MIN_HEIGHT
    });
    return true;
  }

  function autoFitModulesIfEmpty(moduleList) {
    const candidates = Array.isArray(moduleList) ? moduleList : [moduleList];
    let changed = false;
    for (const moduleElement of candidates) {
      if (autoFitModuleIfEmpty(moduleElement)) {
        changed = true;
      }
    }
    return changed;
  }

  function applyRect(moduleElement, rect, options) {
    const opts = options || {};
    const requestedMinWidth = Number(opts.minWidth);
    const requestedMinHeight = Number(opts.minHeight);
    const minWidth = Number.isFinite(requestedMinWidth) ? clamp(requestedMinWidth, 0.5, 100) : MIN_WIDTH;
    const minHeight = Number.isFinite(requestedMinHeight) ? clamp(requestedMinHeight, 0.5, 100) : MIN_HEIGHT;

    const safeRect = {
      x: clamp(Number(rect.x), 0, 100),
      y: clamp(Number(rect.y), 0, 100),
      w: clamp(Number(rect.w), minWidth, 100),
      h: clamp(Number(rect.h), minHeight, 100)
    };
    safeRect.w = clamp(safeRect.w, minWidth, 100 - safeRect.x);
    safeRect.h = clamp(safeRect.h, minHeight, 100 - safeRect.y);

    moduleElement.dataset.x = String(safeRect.x);
    moduleElement.dataset.y = String(safeRect.y);
    moduleElement.dataset.w = String(safeRect.w);
    moduleElement.dataset.h = String(safeRect.h);
    moduleElement.style.left = `${safeRect.x}%`;
    moduleElement.style.top = `${safeRect.y}%`;
    moduleElement.style.width = `${safeRect.w}%`;
    moduleElement.style.height = `${safeRect.h}%`;
  }

  function buildSanitizedModuleHtml(moduleElement) {
    const contentNode = moduleElement.querySelector(".module-content");
    if (!contentNode) {
      return "";
    }
    const clonedContent = contentNode.cloneNode(true);
    for (const node of clonedContent.querySelectorAll(".text-resize-handle")) {
      node.remove();
    }
    for (const node of clonedContent.querySelectorAll(".text-resize-layer")) {
      node.remove();
    }
    for (const node of clonedContent.querySelectorAll(".text-resizable")) {
      node.classList.remove("text-resizable");
    }
    return clonedContent.innerHTML;
  }

  function setActiveLayoutButton(layoutName) {
    for (const button of layoutButtons) {
      button.classList.toggle("is-active", button.dataset.layout === layoutName);
    }
  }

  function setContentEditable(enabled) {
    const editableSelector = [
      ".module-label",
      getTextBlockSelector()
    ].join(",");

    for (const node of page.querySelectorAll(editableSelector)) {
      if (enabled) {
        node.setAttribute("contenteditable", "true");
        node.classList.add("editable-text");
      } else {
        node.removeAttribute("contenteditable");
        node.classList.remove("editable-text");
      }
    }
    refreshTextResizeHandles(page);
  }

  function applyLayout(layoutName, options) {
    const layout = layouts[layoutName];
    const opts = options || {};
    if (!layout) {
      return;
    }

    state.currentLayout = layoutName;
    for (const moduleElement of modules) {
      const blockName = moduleElement.dataset.block;
      if (layout[blockName]) {
        applyRect(moduleElement, layout[blockName]);
      }
    }
    setActiveLayoutButton(layoutName);
    if (!opts.silent) {
      const label = layoutLabels[layoutName] || layoutName;
      updateStatus(`Variante appliquee: ${label}.`, false);
    }
    if (opts.autosaveReason) {
      scheduleAutosave(opts.autosaveReason);
    }
    schedulePreviewSync();
  }

  function cloneState(targetState) {
    return JSON.parse(JSON.stringify(targetState));
  }

  function buildTemplateStateForLayout(layoutName) {
    if (!state.defaultTemplateState) {
      return null;
    }

    const targetLayout = layouts[layoutName] ? layoutName : "classic";
    const targetRects = layouts[targetLayout];
    const nextState = cloneState(state.defaultTemplateState);
    nextState.layout = targetLayout;
    nextState.updatedAt = new Date().toISOString();

    for (const moduleState of nextState.modules) {
      if (targetRects[moduleState.block]) {
        moduleState.rect = { ...targetRects[moduleState.block] };
      }
    }
    return nextState;
  }

  function captureState() {
    return {
      version: 4,
      updatedAt: new Date().toISOString(),
      layout: state.currentLayout,
      modules: modules.map((moduleElement) => ({
        block: moduleElement.dataset.block,
        isCustom: moduleElement.dataset.custom === "1",
        label: moduleElement.querySelector(".module-label")?.textContent || "Bloc",
        rect: readRect(moduleElement),
        html: buildSanitizedModuleHtml(moduleElement),
        contentClass: moduleElement.querySelector(".module-content").className
      }))
    };
  }

  function applyState(nextState) {
    if (!nextState || !Array.isArray(nextState.modules)) {
      return false;
    }

    state.suppressPersistence = true;
    try {
      if (nextState.layout && layouts[nextState.layout]) {
        state.currentLayout = nextState.layout;
      }
      setActiveLayoutButton(state.currentLayout);

      const incomingBlocks = new Set(nextState.modules.map((moduleState) => moduleState.block));
      for (const existingModule of modules) {
        if (!incomingBlocks.has(existingModule.dataset.block)) {
          existingModule.remove();
        }
      }
      refreshModulesCache();

      for (const moduleState of nextState.modules) {
        let targetModule = modulesByBlock.get(moduleState.block);
        if (!targetModule) {
          targetModule = createModuleElement(
            moduleState.block || nextCustomBlockId(),
            moduleState.label || "Case texte",
            moduleState.html || "<p>Contenu vide.</p>",
            moduleState.rect || computeNewCustomRect(),
            moduleState.contentClass || "module-content article-content compact",
            moduleState.isCustom === true || String(moduleState.block || "").startsWith("custom-")
          );
          page.appendChild(targetModule);
          refreshModulesCache();
        }
        if (moduleState.rect) {
          applyRect(targetModule, moduleState.rect);
        }
        if (typeof moduleState.html === "string") {
          targetModule.querySelector(".module-content").innerHTML = moduleState.html;
        }
        if (moduleState.contentClass && targetModule.querySelector(".module-content")) {
          targetModule.querySelector(".module-content").className = moduleState.contentClass;
        }
        if (moduleState.label) {
          const labelNode = targetModule.querySelector(".module-label");
          if (labelNode) {
            labelNode.textContent = moduleState.label;
          }
        }
        if (moduleState.isCustom === true || String(moduleState.block || "").startsWith("custom-")) {
          targetModule.dataset.custom = "1";
        } else {
          delete targetModule.dataset.custom;
        }

        for (const node of targetModule.querySelectorAll(".text-resize-handle")) {
          node.remove();
        }
        for (const node of targetModule.querySelectorAll(".text-resize-layer")) {
          node.remove();
        }
        for (const node of targetModule.querySelectorAll(".text-resizable")) {
          node.classList.remove("text-resizable");
        }
      }

      refreshModulesCache();
      setActiveModule(null);
      setContentEditable(state.editEnabled);
      setCurrentDateLabels();
      autoFitModulesIfEmpty(modules);
      schedulePreviewSync();
      return true;
    } finally {
      state.suppressPersistence = false;
    }
  }

  function loadHistoryEntries() {
    const parsed = readStorage(HISTORY_KEY, []);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item) => item && Array.isArray(item.modules));
  }

  function persistHistoryEntries() {
    const entries = [...state.historyEntries];
    for (let size = entries.length; size >= 0; size -= 1) {
      const candidate = entries.slice(0, size);
      if (writeStorage(HISTORY_KEY, candidate)) {
        state.historyEntries = candidate;
        return true;
      }
    }
    return false;
  }

  function deriveEditionLabel() {
    const titleFromLead = page.querySelector('[data-block="lead"] h2');
    const fallback = page.querySelector('[data-block="masthead"] h2');
    const text = (titleFromLead && titleFromLead.textContent)
      || (fallback && fallback.textContent)
      || "Edition sans titre";
    return shortText(text.trim(), 72);
  }

  function renderHistoryList() {
    historyList.innerHTML = "";
    if (!state.historyEntries.length) {
      const emptyOption = document.createElement("option");
      emptyOption.textContent = "Aucune edition archivee";
      emptyOption.disabled = true;
      emptyOption.selected = true;
      historyList.appendChild(emptyOption);
      return;
    }

    for (const entry of state.historyEntries) {
      const option = document.createElement("option");
      option.value = entry.id;
      option.textContent = `${formatDate(entry.archivedAt || entry.updatedAt)} - ${shortText(entry.label || "Edition", 72)}`;
      historyList.appendChild(option);
    }
  }

  function archiveCurrentEdition() {
    const label = editionLabelInput.value.trim() || deriveEditionLabel();
    const snapshot = captureState();
    const entry = {
      ...snapshot,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      archivedAt: new Date().toISOString(),
      label
    };

    state.historyEntries.unshift(entry);
    if (state.historyEntries.length > HISTORY_LIMIT) {
      state.historyEntries = state.historyEntries.slice(0, HISTORY_LIMIT);
    }

    if (!persistHistoryEntries()) {
      updateStatus("Historique non enregistre: stockage local plein.", true);
      return;
    }

    renderHistoryList();
    historyList.value = entry.id;
    updateStatus("Edition archivee dans l'historique.", false);
  }

  function getSelectedHistoryEntry() {
    const selectedId = historyList.value;
    if (!selectedId) {
      return null;
    }
    return state.historyEntries.find((entry) => entry.id === selectedId) || null;
  }

  function loadSelectedHistory() {
    const entry = getSelectedHistoryEntry();
    if (!entry) {
      updateStatus("Selectionnez une edition a charger.", true);
      return;
    }
    if (!applyState(entry)) {
      updateStatus("Edition invalide dans l'historique.", true);
      return;
    }
    saveAutosave("chargement historique");
    updateStatus(`Edition chargee: ${entry.label}.`, false);
  }

  function deleteSelectedHistory() {
    const entry = getSelectedHistoryEntry();
    if (!entry) {
      updateStatus("Selectionnez une edition a supprimer.", true);
      return;
    }

    state.historyEntries = state.historyEntries.filter((item) => item.id !== entry.id);
    if (!persistHistoryEntries()) {
      updateStatus("Suppression impossible.", true);
      return;
    }
    renderHistoryList();
    updateStatus("Edition supprimee de l'historique.", false);
  }

  function clearHistory() {
    if (!state.historyEntries.length) {
      updateStatus("Historique deja vide.", false);
      return;
    }
    if (!window.confirm("Vider tout l'historique des editions ?")) {
      return;
    }

    state.historyEntries = [];
    if (!persistHistoryEntries()) {
      updateStatus("Effacement impossible.", true);
      return;
    }
    renderHistoryList();
    updateStatus("Historique efface.", false);
  }

  function saveAutosave(reason) {
    if (state.suppressPersistence) {
      return;
    }
    const snapshot = captureState();
    if (!writeStorage(AUTOSAVE_KEY, snapshot)) {
      updateStatus("Auto-save impossible: stockage local plein.", true);
      return;
    }
    updateAutosaveInfo(snapshot.updatedAt);
    if (reason) {
      updateStatus(`Auto-save: ${reason}.`, false);
    }
  }

  function scheduleAutosave(reason) {
    if (state.suppressPersistence) {
      return;
    }
    window.clearTimeout(state.autosaveTimer);
    state.autosaveTimer = window.setTimeout(() => saveAutosave(reason), AUTOSAVE_DELAY_MS);
  }

  function restoreAutosaveIfAvailable() {
    const autosave = readStorage(AUTOSAVE_KEY, null);
    if (autosave && applyState(autosave)) {
      updateAutosaveInfo(autosave.updatedAt);
      updateStatus("Derniere sauvegarde auto restauree.", false);
      return;
    }
    updateAutosaveInfo(null);
  }

  function resetEdition() {
    const templateState = buildTemplateStateForLayout(state.currentLayout);
    if (!templateState || !applyState(templateState)) {
      updateStatus("Reinitialisation impossible.", true);
      return;
    }

    state.pendingImageAction = null;
    imageUploadInput.value = "";
    window.clearTimeout(state.autosaveTimer);
    state.autosaveTimer = null;
    saveAutosave("edition reinitialisee");
    updateStatus("Edition reinitialisee: contenu, images et mise en page.", false);
  }

  function toggleEditMode() {
    state.editEnabled = !state.editEnabled;
    document.body.classList.toggle("editing-enabled", state.editEnabled);
    toggleEditBtn.textContent = `Texte: ${state.editEnabled ? "ON" : "OFF"}`;
    setContentEditable(state.editEnabled);
    schedulePreviewSync();
    scheduleAutosave("mode texte modifie");
    updateStatus(state.editEnabled ? "Edition texte active." : "Edition texte verrouillee (mise en page toujours modifiable).", false);
  }

  function onPointerDown(event) {
    const moduleElement = event.target.closest(".module");
    if (!moduleElement) {
      return;
    }

    const textMoveHandle = event.target.closest(".text-move-handle");
    if (textMoveHandle) {
      const textBlock = textMoveHandle.closest(getTextBlockSelector());
      if (!textBlock || !textBlock.matches(getTextBlockSelector())) {
        return;
      }
      event.preventDefault();
      setActiveModule(moduleElement);
      setActiveTextBlock(textBlock);

      const content = textBlock.closest(".module-content");
      if (!content) {
        return;
      }
      const contentRect = content.getBoundingClientRect();
      const textRect = textBlock.getBoundingClientRect();
      const shift = readTextShift(textBlock);

      state.dragState = {
        module: moduleElement,
        type: "text-block-move",
        textBlock,
        startX: event.clientX,
        startY: event.clientY,
        startShiftX: shift.x,
        startShiftY: shift.y,
        startLeftPx: textRect.left - contentRect.left,
        startTopPx: textRect.top - contentRect.top,
        textWidthPx: Math.max(1, textRect.width),
        textHeightPx: Math.max(1, textRect.height),
        containerWidthPx: Math.max(1, content.clientWidth),
        containerHeightPx: Math.max(1, content.clientHeight),
        dirty: false
      };
      return;
    }

    const textResizeHandle = event.target.closest(".text-resize-handle");
    if (textResizeHandle) {
      const textBlock = textResizeHandle.closest(getTextBlockSelector());
      if (!textBlock || !textBlock.matches(getTextBlockSelector())) {
        return;
      }
      event.preventDefault();
      setActiveModule(moduleElement);
      setActiveTextBlock(textBlock);

      const content = textBlock.closest(".module-content");
      const textRect = textBlock.getBoundingClientRect();
      const computed = window.getComputedStyle(textBlock);
      const minHeightPx = parseFloat(computed.minHeight);

      state.dragState = {
        module: moduleElement,
        type: "text-block-resize",
        textBlock,
        textResizeDir: textResizeHandle.dataset.textResizeDir || "se",
        startX: event.clientX,
        startY: event.clientY,
        startWidthPx: Math.max(TEXT_BLOCK_MIN_WIDTH_PX, textRect.width || TEXT_BLOCK_MIN_WIDTH_PX),
        startHeightPx: Math.max(
          TEXT_BLOCK_MIN_HEIGHT_PX,
          Number.isFinite(minHeightPx) ? minHeightPx : 0,
          textRect.height || TEXT_BLOCK_MIN_HEIGHT_PX
        ),
        containerWidthPx: Math.max(1, content ? content.clientWidth : moduleElement.clientWidth || 1),
        dirty: false
      };
      return;
    }

    const resizeHandle = event.target.closest(".resize-handle");
    const isResizeHandle = Boolean(resizeHandle);
    const isDragHandle = Boolean(event.target.closest(".module-tools"));
    if (!isResizeHandle && !isDragHandle) {
      return;
    }

    event.preventDefault();
    setActiveModule(moduleElement);

    const pageRect = page.getBoundingClientRect();
    state.dragState = {
      module: moduleElement,
      type: isResizeHandle ? "resize" : "drag",
      startX: event.clientX,
      startY: event.clientY,
      pageWidth: pageRect.width,
      pageHeight: pageRect.height,
      rect: readRect(moduleElement),
      resizeDir: isResizeHandle ? (resizeHandle.dataset.resizeDir || "se") : "se",
      dirty: false
    };
  }

  function onPointerMove(event) {
    if (!state.dragState) {
      return;
    }

    if (state.dragState.type === "text-block-move") {
      const deltaX = event.clientX - state.dragState.startX;
      const deltaY = event.clientY - state.dragState.startY;

      const tentativeLeft = state.dragState.startLeftPx + deltaX;
      const tentativeTop = state.dragState.startTopPx + deltaY;

      const maxLeft = Math.max(0, state.dragState.containerWidthPx - state.dragState.textWidthPx);
      const maxTop = Math.max(0, state.dragState.containerHeightPx - state.dragState.textHeightPx);

      const clampedLeft = clamp(tentativeLeft, 0, maxLeft);
      const clampedTop = clamp(tentativeTop, 0, maxTop);

      const effectiveDeltaX = clampedLeft - state.dragState.startLeftPx;
      const effectiveDeltaY = clampedTop - state.dragState.startTopPx;

      applyTextShift(state.dragState.textBlock, {
        x: state.dragState.startShiftX + effectiveDeltaX,
        y: state.dragState.startShiftY + effectiveDeltaY
      });

      state.dragState.dirty = true;
      schedulePreviewSync();
      return;
    }

    if (state.dragState.type === "text-block-resize") {
      const deltaX = event.clientX - state.dragState.startX;
      const deltaY = event.clientY - state.dragState.startY;
      const dir = state.dragState.textResizeDir || "se";

      let nextWidth = state.dragState.startWidthPx;
      let nextHeight = state.dragState.startHeightPx;

      if (dir.includes("e")) {
        nextWidth = state.dragState.startWidthPx + deltaX;
      } else if (dir.includes("w")) {
        nextWidth = state.dragState.startWidthPx - deltaX;
      }
      if (dir.includes("s")) {
        nextHeight = state.dragState.startHeightPx + deltaY;
      } else if (dir.includes("n")) {
        nextHeight = state.dragState.startHeightPx - deltaY;
      }

      const clampedWidth = clamp(nextWidth, TEXT_BLOCK_MIN_WIDTH_PX, state.dragState.containerWidthPx);
      const clampedHeight = clamp(nextHeight, TEXT_BLOCK_MIN_HEIGHT_PX, 2200);

      state.dragState.textBlock.style.maxWidth = "100%";
      state.dragState.textBlock.style.width = `${clampedWidth.toFixed(1)}px`;
      state.dragState.textBlock.style.minHeight = `${clampedHeight.toFixed(1)}px`;

      state.dragState.dirty = true;
      schedulePreviewSync();
      return;
    }

    const deltaXPercent = ((event.clientX - state.dragState.startX) / state.dragState.pageWidth) * 100;
    const deltaYPercent = ((event.clientY - state.dragState.startY) / state.dragState.pageHeight) * 100;
    const rect = state.dragState.rect;

    if (state.dragState.type === "drag") {
      const nextX = clamp(rect.x + deltaXPercent, 0, 100 - rect.w);
      const nextY = clamp(rect.y + deltaYPercent, 0, 100 - rect.h);
      applyRect(state.dragState.module, { x: nextX, y: nextY, w: rect.w, h: rect.h });
      state.dragState.dirty = true;
      schedulePreviewSync();
      return;
    }

    const dir = state.dragState.resizeDir || "se";
    const right = rect.x + rect.w;
    const bottom = rect.y + rect.h;
    let nextX = rect.x;
    let nextY = rect.y;
    let nextW = rect.w;
    let nextH = rect.h;

    if (dir.includes("w")) {
      nextX = clamp(rect.x + deltaXPercent, 0, right - MIN_WIDTH);
      nextW = right - nextX;
    } else if (dir.includes("e")) {
      nextW = clamp(rect.w + deltaXPercent, MIN_WIDTH, 100 - rect.x);
    }

    if (dir.includes("n")) {
      nextY = clamp(rect.y + deltaYPercent, 0, bottom - MIN_HEIGHT);
      nextH = bottom - nextY;
    } else if (dir.includes("s")) {
      nextH = clamp(rect.h + deltaYPercent, MIN_HEIGHT, 100 - rect.y);
    }

    applyRect(state.dragState.module, { x: nextX, y: nextY, w: nextW, h: nextH });
    state.dragState.dirty = true;
    schedulePreviewSync();
  }

  function onPointerUp() {
    if (!state.dragState) {
      return;
    }
    const actionType = state.dragState.type;
    const shouldAutosave = state.dragState.dirty;
    state.dragState = null;
    if (shouldAutosave) {
      const reason = actionType === "text-block-resize"
        ? "taille bloc texte modifiee"
        : (actionType === "text-block-move" ? "position bloc texte modifiee" : "mise en page modifiee");
      scheduleAutosave(reason);
    }
  }

  function onContentInput(event) {
    if (!state.editEnabled) {
      return;
    }
    if (!event.target.closest(".module-content")) {
      return;
    }
    const moduleElement = event.target.closest(".module");
    if (moduleElement) {
      autoFitModuleIfEmpty(moduleElement);
    }
    schedulePreviewSync();
    scheduleAutosave("contenu modifie");
  }

  function openImagePicker(mode, targetImage) {
    state.pendingImageAction = { mode, targetImage: targetImage || null };
    imageUploadInput.multiple = mode === "add";
    imageUploadInput.click();
  }

  function getActiveAdImage() {
    if (!state.activeModule || state.activeModule.dataset.block !== "ad") {
      return null;
    }
    return state.activeModule.querySelector(".ad-media img");
  }

  function handleAddImageAction() {
    const adImage = getActiveAdImage();
    if (adImage) {
      openImagePicker("replace", adImage);
      return;
    }
    openImagePicker("add");
  }

  async function handleImageInputChange() {
    const files = Array.from(imageUploadInput.files || []).filter((file) => file.type.startsWith("image/"));
    if (!files.length) {
      state.pendingImageAction = null;
      return;
    }

    const isReplaceMode = Boolean(
      state.pendingImageAction
      && state.pendingImageAction.mode === "replace"
      && state.pendingImageAction.targetImage
    );
    const galleryGrid = page.querySelector(".gallery-grid");
    if (!isReplaceMode && !galleryGrid) {
      updateStatus("Galerie introuvable.", true);
      state.pendingImageAction = null;
      imageUploadInput.value = "";
      return;
    }

    try {
      if (isReplaceMode) {
        const firstFile = files[0];
        const rawDataUrl = await fileToDataUrl(firstFile);
        const optimizedDataUrl = await downscaleDataUrl(rawDataUrl, IMAGE_MAX_DIMENSION);
        state.pendingImageAction.targetImage.src = optimizedDataUrl;
        state.pendingImageAction.targetImage.alt = buildImageAlt(firstFile.name);
        const caption = state.pendingImageAction.targetImage.closest("figure")?.querySelector("figcaption");
        if (caption && caption.textContent.trim().toLowerCase().startsWith("legende")) {
          caption.textContent = buildLegend(firstFile.name);
        }
        updateStatus("Image remplacee.", false);
      } else {
        for (const file of files) {
          const rawDataUrl = await fileToDataUrl(file);
          const optimizedDataUrl = await downscaleDataUrl(rawDataUrl, IMAGE_MAX_DIMENSION);
          galleryGrid.appendChild(createFigure(optimizedDataUrl, file.name));
        }
        updateStatus(`${files.length} image(s) ajoutee(s) a la galerie.`, false);
      }

      setContentEditable(state.editEnabled);
      schedulePreviewSync();
      scheduleAutosave("images modifiees");
    } catch (_error) {
      updateStatus("Erreur lors de l'import d'image.", true);
    } finally {
      state.pendingImageAction = null;
      imageUploadInput.value = "";
    }
  }

  async function captureWithMode(mode) {
    const metrics = computeExportMetrics();
    const useSafeClass = mode !== "normal";
    const useFlatClone = mode === "flat";
    const superSampling = useFlatClone ? 1.2 : 1.4;
    const renderScale = Math.max(0.1, metrics.scale * superSampling);

    page.classList.add("export-capture");
    if (useSafeClass) {
      page.classList.add("export-capture-safe");
    }
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await waitForImages(page);
      const options = {
        backgroundColor: "#030b1f",
        scale: renderScale,
        useCORS: true,
        logging: false,
        width: metrics.sourceWidth,
        height: metrics.sourceHeight
      };

      if (useFlatClone) {
        options.onclone = (doc) => {
          const clonedPage = doc.getElementById("print-page");
          if (!clonedPage) {
            return;
          }
          clonedPage.classList.add("export-capture-safe", "export-capture-flat");
          const fallbackStyle = doc.createElement("style");
          fallbackStyle.textContent = `
            body, body * { background-image: none !important; }
            body::before, body::after, body *::before, body *::after {
              background-image: none !important;
              box-shadow: none !important;
            }
            #print-page { background: #07142e !important; }
            #print-page .module { background: rgba(9, 22, 49, 0.96) !important; }
            #print-page .masthead-content { background: #0b2657 !important; }
            #print-page .ad-content { background: #0b2657 !important; }
          `;
          doc.head.appendChild(fallbackStyle);
        };
      }

      const rawCanvas = await window.html2canvas(page, options);
      const canvas = document.createElement("canvas");
      canvas.width = metrics.exportWidth;
      canvas.height = metrics.exportHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(rawCanvas, 0, 0, canvas.width, canvas.height);
      }
      return {
        canvas,
        width: metrics.exportWidth,
        height: metrics.exportHeight,
        mode
      };
    } finally {
      if (useSafeClass) {
        page.classList.remove("export-capture-safe");
      }
      page.classList.remove("export-capture");
    }
  }

  async function captureExportCanvas() {
    if (!window.html2canvas) {
      throw new Error("html2canvas indisponible.");
    }
    try {
      return await captureWithMode("normal");
    } catch (error) {
      const message = String(error && error.message ? error.message : error || "");
      if (!/createPattern/i.test(message)) {
        throw error;
      }
      try {
        return await captureWithMode("safe");
      } catch (safeError) {
        const safeMessage = String(safeError && safeError.message ? safeError.message : safeError || "");
        if (!/createPattern/i.test(safeMessage)) {
          throw safeError;
        }
        return captureWithMode("flat");
      }
    }
  }

  async function buildPngBlobUnderLimit(canvas) {
    const baseBlob = await canvasToBlob(canvas, "image/png", 1);
    if (baseBlob.size <= MAX_EXPORT_BYTES) {
      return baseBlob;
    }

    const levelsList = [224, 208, 192, 176, 160, 144, 128, 112];
    for (const levels of levelsList) {
      const quantizedCanvas = cloneCanvas(canvas);
      quantizeCanvasInPlace(quantizedCanvas, levels);
      const blob = await canvasToBlob(quantizedCanvas, "image/png", 1);
      if (blob.size <= MAX_EXPORT_BYTES) {
        return blob;
      }
    }
    return null;
  }

  async function buildJpegBlobUnderLimit(canvas) {
    const qualitySteps = [0.99, 0.97, 0.95, 0.93, 0.91, 0.89, 0.87, 0.85, 0.83, 0.81, 0.79, 0.77];
    for (const quality of qualitySteps) {
      const blob = await canvasToBlob(canvas, "image/jpeg", quality);
      if (blob.size <= MAX_EXPORT_BYTES) {
        return blob;
      }
    }
    return null;
  }

  async function buildPdfBlobUnderLimit(canvas) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error("jsPDF indisponible.");
    }

    const qualitySteps = [0.99, 0.97, 0.95, 0.93, 0.91, 0.89, 0.87, 0.85, 0.83, 0.81, 0.79, 0.77];
    for (const quality of qualitySteps) {
      const jpegData = canvas.toDataURL("image/jpeg", quality);
      const pdf = new window.jspdf.jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
        compress: true
      });
      pdf.addImage(jpegData, "JPEG", 0, 0, canvas.width, canvas.height, undefined, "MEDIUM");
      const blob = pdf.output("blob");
      if (blob.size <= MAX_EXPORT_BYTES) {
        return blob;
      }
    }
    return null;
  }

  function downloadBlob(blob, filename) {
    if (!blob) {
      throw new Error("Generation de fichier impossible.");
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function setExportButtonsDisabled(disabled) {
    exportPngBtn.disabled = disabled;
    exportJpegBtn.disabled = disabled;
    exportPdfBtn.disabled = disabled;
  }

  async function exportAsPng() {
    setExportButtonsDisabled(true);
    updateStatus("Export PNG HQ en cours (< 2 Mo)...", false);
    try {
      const captureResult = await captureExportCanvas();
      const blob = await buildPngBlobUnderLimit(captureResult.canvas);
      if (!blob) {
        updateStatus("PNG > 2 Mo meme apres optimisation. Simplifiez la page ou utilisez JPEG/PDF.", true);
        return;
      }
      downloadBlob(blob, "frost-news-layout-hq.png");
      const suffix = captureResult.mode !== "normal" ? " (mode secours)" : "";
      updateStatus(`PNG exporte (${captureResult.width}x${captureResult.height}): ${bytesToMo(blob.size)} Mo${suffix}.`, false);
    } catch (error) {
      updateStatus(`Erreur PNG: ${error.message}`, true);
    } finally {
      setExportButtonsDisabled(false);
    }
  }

  async function exportAsJpeg() {
    setExportButtonsDisabled(true);
    updateStatus("Export JPEG HQ en cours (< 2 Mo)...", false);
    try {
      const captureResult = await captureExportCanvas();
      const blob = await buildJpegBlobUnderLimit(captureResult.canvas);
      if (!blob) {
        updateStatus("JPEG > 2 Mo meme a compression forte. Simplifiez la page.", true);
        return;
      }
      downloadBlob(blob, "frost-news-layout-hq.jpg");
      const suffix = captureResult.mode !== "normal" ? " (mode secours)" : "";
      updateStatus(`JPEG exporte (${captureResult.width}x${captureResult.height}): ${bytesToMo(blob.size)} Mo${suffix}.`, false);
    } catch (error) {
      updateStatus(`Erreur JPEG: ${error.message}`, true);
    } finally {
      setExportButtonsDisabled(false);
    }
  }

  async function exportAsPdf() {
    setExportButtonsDisabled(true);
    updateStatus("Export PDF HQ en cours (< 2 Mo)...", false);
    try {
      const captureResult = await captureExportCanvas();
      const blob = await buildPdfBlobUnderLimit(captureResult.canvas);
      if (!blob) {
        updateStatus("PDF > 2 Mo meme apres compression. Simplifiez la page.", true);
        return;
      }
      downloadBlob(blob, "frost-news-layout-hq.pdf");
      const suffix = captureResult.mode !== "normal" ? " (mode secours)" : "";
      updateStatus(`PDF exporte (${captureResult.width}x${captureResult.height}): ${bytesToMo(blob.size)} Mo${suffix}.`, false);
    } catch (error) {
      updateStatus(`Erreur PDF: ${error.message}`, true);
    } finally {
      setExportButtonsDisabled(false);
    }
  }

  function bindEvents() {
    for (const button of layoutButtons) {
      button.addEventListener("click", () => applyLayout(button.dataset.layout || "classic", {
        autosaveReason: "variante changee"
      }));
    }

    toggleEditBtn.addEventListener("click", toggleEditMode);
    resetBtn.addEventListener("click", resetEdition);
    addImageBtn.addEventListener("click", handleAddImageAction);
    addTextChunkBtn.addEventListener("click", addTextChunk);
    deleteTextChunkBtn.addEventListener("click", deleteTextChunk);
    addTextBlockBtn.addEventListener("click", addTextBlock);
    duplicateBlockBtn.addEventListener("click", duplicateActiveBlock);
    deleteBlockBtn.addEventListener("click", deleteActiveBlock);
    imageUploadInput.addEventListener("change", handleImageInputChange);

    archiveEditionBtn.addEventListener("click", archiveCurrentEdition);
    loadHistoryBtn.addEventListener("click", loadSelectedHistory);
    deleteHistoryBtn.addEventListener("click", deleteSelectedHistory);
    clearHistoryBtn.addEventListener("click", clearHistory);

    exportPngBtn.addEventListener("click", exportAsPng);
    exportJpegBtn.addEventListener("click", exportAsJpeg);
    exportPdfBtn.addEventListener("click", exportAsPdf);

    page.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    page.addEventListener("input", onContentInput);
    page.addEventListener("click", (event) => {
      const moduleElement = event.target.closest(".module");
      if (moduleElement) {
        setActiveModule(moduleElement);
      }

      const textHandle = event.target.closest(".text-resize-handle");
      const textBlock = textHandle
        ? textHandle.closest(getTextBlockSelector())
        : event.target.closest(getTextBlockSelector());
      if (textBlock && moduleElement && moduleElement.contains(textBlock)) {
        setActiveTextBlock(textBlock);
      } else if (!textBlock) {
        setActiveTextBlock(null);
      }

      if (!state.editEnabled) {
        return;
      }
      const image = event.target.closest(".gallery-grid img, .ad-media img");
      if (!image) {
        return;
      }
      openImagePicker("replace", image);
    });
  }

  function init() {
    refreshModulesCache();
    state.historyEntries = loadHistoryEntries();
    toggleEditBtn.textContent = `Texte: ${state.editEnabled ? "ON" : "OFF"}`;

    applyLayout(state.currentLayout, { silent: true });
    setCurrentDateLabels();
    state.defaultTemplateState = captureState();

    bindEvents();
    restoreAutosaveIfAvailable();
    setCurrentDateLabels();
    setContentEditable(state.editEnabled);
    renderHistoryList();
    syncPreviewNow();
  }

  init();
})(window);
