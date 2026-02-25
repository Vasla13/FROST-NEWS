function downloadDataUrl(dataUrl, filename) {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function waitForAnimationFrames(count = 1) {
  return new Promise((resolve) => {
    const step = (remaining) => {
      if (remaining <= 0) {
        resolve();
        return;
      }

      requestAnimationFrame(() => step(remaining - 1));
    };

    step(Math.max(1, count));
  });
}

function waitForImageReady(image) {
  if (image.complete && image.naturalWidth > 0) {
    if (typeof image.decode === "function") {
      return image.decode().catch(() => {});
    }

    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const onDone = () => {
      image.removeEventListener("load", onDone);
      image.removeEventListener("error", onDone);
      resolve();
    };

    image.addEventListener("load", onDone, { once: true });
    image.addEventListener("error", onDone, { once: true });
  });
}

async function waitForExportFonts() {
  if (!document.fonts?.load) {
    return;
  }

  const fontLoads = [
    document.fonts.load('700 52px "VT323"', "FROST NEWS"),
    document.fonts.load('700 34px "Share Tech Mono"', "FROST NEWS"),
    document.fonts.load('700 34px "Rajdhani"', "FROST NEWS"),
    document.fonts.load('700 40px "Bebas Neue"', "FROST NEWS"),
    document.fonts.load('700 40px "Anton"', "FROST NEWS"),
  ];

  await Promise.all(fontLoads.map((promise) => promise.catch(() => {})));
}

async function waitForNodeAssets(node) {
  if (!node) {
    return;
  }

  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(images.map((image) => waitForImageReady(image)));

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  await waitForExportFonts();
}

function resolveGifScale(node, preferredScale = 1.5) {
  const rect = node?.getBoundingClientRect?.();
  if (!rect?.width || !rect?.height) {
    return Math.max(0.8, Math.min(2, preferredScale));
  }

  const maxPixels = 4_200_000;
  const area = rect.width * rect.height;
  const safeScale = Math.sqrt(maxPixels / area);
  const autoScale = Math.min(2, safeScale);
  return Math.max(0.8, Math.min(preferredScale, autoScale));
}

function flattenCanvas(sourceCanvas, backgroundColor, targetCanvas = null) {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const canvas = targetCanvas || document.createElement("canvas");

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("missing-flatten-context");
  }

  context.clearRect(0, 0, width, height);
  if (backgroundColor) {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(sourceCanvas, 0, 0);

  return canvas;
}

function canvasHasVisiblePixels(canvas, alphaThreshold = 16) {
  if (!canvas || canvas.width < 1 || canvas.height < 1) {
    return false;
  }

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return false;
  }

  const { width, height } = canvas;
  const step = Math.max(1, Math.floor(Math.min(width, height) / 80));
  const pixels = context.getImageData(0, 0, width, height).data;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = pixels[((y * width) + x) * 4 + 3];
      if (alpha > alphaThreshold) {
        return true;
      }
    }
  }

  return false;
}

function canvasHasRenderableContent(canvas) {
  if (!canvas || canvas.width < 2 || canvas.height < 2) {
    return false;
  }

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return false;
  }

  const width = canvas.width;
  const height = canvas.height;
  const sampleStep = Math.max(2, Math.floor(Math.min(width, height) / 72));
  const pixels = context.getImageData(0, 0, width, height).data;

  let sampleCount = 0;
  let visibleCount = 0;
  const colorKeys = new Set();

  for (let y = 0; y < height; y += sampleStep) {
    for (let x = 0; x < width; x += sampleStep) {
      const index = (y * width + x) * 4;
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      const alpha = pixels[index + 3];

      sampleCount += 1;
      if (alpha > 12) {
        visibleCount += 1;
        const colorKey = ((red >> 4) << 8) | ((green >> 4) << 4) | (blue >> 4);
        colorKeys.add(colorKey);
      }
    }
  }

  if (sampleCount === 0) {
    return false;
  }

  const visibleRatio = visibleCount / sampleCount;

  if (visibleRatio < 0.03) {
    return false;
  }

  // Dark themes are expected, so do not reject low-luminance canvases.
  // Instead, reject captures that are almost monochrome (likely failed render).
  if (colorKeys.size <= 1) {
    return false;
  }

  return true;
}

function getRelativeCanvasRect(sourceNode, element, scaleX, scaleY) {
  const rootRect = sourceNode.getBoundingClientRect();
  const rect = element.getBoundingClientRect();

  return {
    left: (rect.left - rootRect.left) * scaleX,
    top: (rect.top - rootRect.top) * scaleY,
    width: rect.width * scaleX,
    height: rect.height * scaleY,
  };
}

function parsePercentageToken(token, axis = "x") {
  const value = String(token || "").trim().toLowerCase();
  if (!value) {
    return 50;
  }

  if (value.endsWith("%")) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 50;
  }

  if (value === "left" || value === "top") {
    return 0;
  }
  if (value === "center") {
    return 50;
  }
  if (value === "right" || value === "bottom") {
    return 100;
  }

  const parsed = Number.parseFloat(value);
  if (Number.isFinite(parsed)) {
    return parsed;
  }

  return axis === "x" ? 50 : 50;
}

function parseObjectPosition(value) {
  const tokens = String(value || "50% 50%")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 1) {
    const single = parsePercentageToken(tokens[0], "x");
    return { x: single, y: 50 };
  }

  return {
    x: parsePercentageToken(tokens[0], "x"),
    y: parsePercentageToken(tokens[1], "y"),
  };
}

function parseUniformScale(transformValue) {
  const value = String(transformValue || "").trim();
  if (!value || value === "none") {
    return 1;
  }

  const scaleMatch = value.match(/scale\(([^)]+)\)/i);
  if (scaleMatch?.[1]) {
    const parts = scaleMatch[1].split(",").map((part) => Number.parseFloat(part.trim()));
    if (parts.length === 1 && Number.isFinite(parts[0])) {
      return Math.max(0.01, parts[0]);
    }
    if (parts.length >= 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
      return Math.max(0.01, (parts[0] + parts[1]) / 2);
    }
  }

  const matrixMatch = value.match(/matrix\(([^)]+)\)/i);
  if (matrixMatch?.[1]) {
    const parts = matrixMatch[1].split(",").map((part) => Number.parseFloat(part.trim()));
    if (parts.length >= 4) {
      const scaleX = Math.hypot(parts[0], parts[1]);
      const scaleY = Math.hypot(parts[2], parts[3]);
      if (Number.isFinite(scaleX) && Number.isFinite(scaleY)) {
        return Math.max(0.01, (scaleX + scaleY) / 2);
      }
    }
  }

  return 1;
}

function drawCoverBackgroundImage(sourceNode, targetCanvas) {
  if (!sourceNode?.querySelector?.('[data-frost-template="cover"]')) {
    return;
  }

  const imageElement = sourceNode.querySelector("[data-frost-export-bg-photo]");
  if (!imageElement || !imageElement.naturalWidth || !imageElement.naturalHeight) {
    return;
  }

  const context = targetCanvas.getContext("2d");
  if (!context) {
    return;
  }

  const sourceRect = sourceNode.getBoundingClientRect();
  if (!sourceRect.width || !sourceRect.height) {
    return;
  }

  const scaleX = targetCanvas.width / sourceRect.width;
  const scaleY = targetCanvas.height / sourceRect.height;
  const rect = getRelativeCanvasRect(sourceNode, imageElement, scaleX, scaleY);
  const style = getComputedStyle(imageElement);
  const objectFit = (style.objectFit || "fill").trim().toLowerCase();
  const { x: posXPercent, y: posYPercent } = parseObjectPosition(style.objectPosition);
  const transformScale = parseUniformScale(style.transform);
  const opacity = Number.parseFloat(style.opacity);
  const alpha = Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 1;
  const filterValue = style.filter && style.filter !== "none" ? style.filter : "none";
  const exportColorLift = "brightness(1.08) saturate(1.04)";

  const naturalWidth = imageElement.naturalWidth;
  const naturalHeight = imageElement.naturalHeight;
  let drawWidth = rect.width;
  let drawHeight = rect.height;

  if (objectFit === "cover" || objectFit === "contain") {
    const ratio = objectFit === "cover"
      ? Math.max(rect.width / naturalWidth, rect.height / naturalHeight)
      : Math.min(rect.width / naturalWidth, rect.height / naturalHeight);
    drawWidth = naturalWidth * ratio;
    drawHeight = naturalHeight * ratio;
  } else if (objectFit === "none") {
    drawWidth = naturalWidth;
    drawHeight = naturalHeight;
  }

  drawWidth *= transformScale;
  drawHeight *= transformScale;

  const offsetX = (rect.width - drawWidth) * (posXPercent / 100);
  const offsetY = (rect.height - drawHeight) * (posYPercent / 100);
  const drawX = rect.left + offsetX;
  const drawY = rect.top + offsetY;

  context.save();
  context.beginPath();
  context.rect(rect.left, rect.top, rect.width, rect.height);
  context.clip();
  context.globalAlpha = alpha;
  context.filter = filterValue === "none" ? exportColorLift : `${filterValue} ${exportColorLift}`;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(imageElement, drawX, drawY, drawWidth, drawHeight);
  context.restore();
}

function drawTextCentered(context, text, rect, style, sizeScale) {
  if (!text) {
    return;
  }

  const fontSize = Math.max(1, (parseFloat(style.fontSize) || 16) * sizeScale);
  const fontWeight = style.fontWeight || "700";
  const fontFamily = style.fontFamily || "sans-serif";
  const color = style.color || "#DFFBFF";

  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = color;
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  context.fillText(text, rect.left + (rect.width / 2), rect.top + (rect.height / 2));
  context.restore();
}

async function captureDateOverlay(sourceNode, html2canvas, scale) {
  const dateElement = sourceNode?.querySelector?.("[data-frost-export-date-native]");
  if (!dateElement) {
    return null;
  }

  const rect = dateElement.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }

  const captureOptions = {
    backgroundColor: null,
    scale,
    useCORS: true,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: document.documentElement.clientWidth,
    windowHeight: document.documentElement.clientHeight,
  };

  let bitmap = null;
  try {
    bitmap = await html2canvas(dateElement, { ...captureOptions, foreignObjectRendering: true });
  } catch {
    bitmap = await html2canvas(dateElement, captureOptions);
  }

  if (!bitmap || !canvasHasVisiblePixels(bitmap)) {
    return null;
  }

  // Protect against malformed captures that unexpectedly contain a full-page snapshot.
  const expectedWidth = Math.max(1, rect.width * scale);
  const expectedHeight = Math.max(1, rect.height * scale);
  if (bitmap.width > expectedWidth * 3 || bitmap.height > expectedHeight * 3) {
    return null;
  }

  const rootRect = sourceNode.getBoundingClientRect();
  return {
    rect: {
      left: rect.left - rootRect.left,
      top: rect.top - rootRect.top,
      width: rect.width,
      height: rect.height,
    },
    bitmap,
  };
}

function drawCoverTextOverlays(sourceNode, targetCanvas, dateOverlay = null) {
  if (!sourceNode?.querySelector('[data-frost-template="cover"]')) {
    return;
  }

  const context = targetCanvas.getContext("2d");
  if (!context) {
    return;
  }

  const sourceRect = sourceNode.getBoundingClientRect();
  if (!sourceRect.width || !sourceRect.height) {
    return;
  }

  const scaleX = targetCanvas.width / sourceRect.width;
  const scaleY = targetCanvas.height / sourceRect.height;

  const titleElement = sourceNode.querySelector("[data-frost-export-title]");
  if (titleElement) {
    const rect = getRelativeCanvasRect(sourceNode, titleElement, scaleX, scaleY);
    drawTextCentered(context, titleElement.textContent?.trim(), rect, getComputedStyle(titleElement), scaleY);
  }

  const tickerElement = sourceNode.querySelector("[data-frost-export-ticker]");
  if (tickerElement) {
    const rect = getRelativeCanvasRect(sourceNode, tickerElement, scaleX, scaleY);
    drawTextCentered(context, tickerElement.textContent?.trim(), rect, getComputedStyle(tickerElement), scaleY);
  }

  if (dateOverlay?.bitmap) {
    const x = dateOverlay.rect.left * scaleX;
    const y = dateOverlay.rect.top * scaleY;
    const w = dateOverlay.rect.width * scaleX;
    const h = dateOverlay.rect.height * scaleY;
    context.drawImage(dateOverlay.bitmap, x, y, w, h);
  }
}

async function captureNodeCanvas(
  node,
  html2canvas,
  {
    scale = 2,
    foreignObjectRendering = false,
    fallbackOnInvalidForeignObject = true,
    animationTimeMs = 0,
    hideDateText = false,
    hideBackgroundImage = false,
  } = {}
) {
  await waitForNodeAssets(node);
  const rect = node.getBoundingClientRect();
  const measuredWidth = Math.max(1, rect.width || 0);
  const measuredHeight = Math.max(1, rect.height || 0);
  const captureWidth = Math.max(1, Math.round(measuredWidth));
  const captureHeight = Math.max(1, Math.round(measuredHeight));
  const animationOffsetMs = -Math.max(0, Math.round(animationTimeMs));

  const baseOptions = {
    backgroundColor: null,
    scale,
    width: captureWidth,
    height: captureHeight,
    scrollX: 0,
    scrollY: 0,
    windowWidth: document.documentElement.clientWidth,
    windowHeight: document.documentElement.clientHeight,
    useCORS: true,
    logging: false,
    onclone: (clonedDocument) => {
      const clonedCanvasNode = clonedDocument.querySelector('[data-frost-canvas="true"]');
      if (!clonedCanvasNode) {
        return;
      }

      clonedCanvasNode.setAttribute("data-frost-export-mode", "1");
      clonedCanvasNode.style.setProperty("--frost-cq", `${measuredWidth / 100}px`);
      clonedCanvasNode.style.setProperty("--frost-export-anim-delay", `${animationOffsetMs}ms`);
      clonedCanvasNode.style.setProperty("--frost-export-anim-state", "paused");

      clonedCanvasNode
        .querySelectorAll(
          hideDateText
            ? "[data-frost-export-title], [data-frost-export-ticker], [data-frost-export-date-native]"
            : "[data-frost-export-title], [data-frost-export-ticker]"
        )
        .forEach((element) => {
          element.style.visibility = "hidden";
        });

      if (hideBackgroundImage) {
        clonedCanvasNode.style.background = "transparent";
        clonedCanvasNode
          .querySelectorAll("[data-frost-export-bg-photo]")
          .forEach((element) => {
            element.style.visibility = "hidden";
          });
        clonedCanvasNode
          .querySelectorAll("[data-frost-export-bg-root]")
          .forEach((element) => {
            element.style.background = "transparent";
          });
      }
    },
  };

  if (!foreignObjectRendering) {
    return html2canvas(node, baseOptions);
  }

  try {
    const canvas = await html2canvas(node, { ...baseOptions, foreignObjectRendering: true });
    if (!fallbackOnInvalidForeignObject || canvasHasRenderableContent(canvas)) {
      return canvas;
    }
    if (!fallbackOnInvalidForeignObject) {
      throw new Error("foreign-object-render-invalid");
    }
  } catch {
    if (!fallbackOnInvalidForeignObject) {
      throw new Error("foreign-object-capture-failed");
    }
    // Fallback below.
  }

  return html2canvas(node, baseOptions);
}

export async function exportNodeAsImage(node, fileName, type = "png") {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await captureNodeCanvas(node, html2canvas, { scale: 2 });

  const mime = type === "jpeg" ? "image/jpeg" : "image/png";
  const quality = type === "jpeg" ? 0.92 : 1;
  const dataUrl = canvas.toDataURL(mime, quality);

  downloadDataUrl(dataUrl, `${fileName}.${type === "jpeg" ? "jpg" : "png"}`);
}

export async function exportNodeAsGif(node, fileName, options = {}) {
  if (!node) {
    return;
  }

  const html2canvas = (await import("html2canvas")).default;
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");

  const frameCount = Math.max(24, Math.min(96, Math.round(options.frameCount ?? 60)));
  const fps = Math.max(8, Math.min(18, Math.round(options.fps ?? 12)));
  const frameDelay = Math.round(1000 / fps);
  const preferredScale = options.scale ?? 2;
  const scale = resolveGifScale(node, preferredScale);
  const requestedRenderer = options.renderer === "foreignObject" ? "foreignObject" : "standard";

  const gif = GIFEncoder();
  let width = 0;
  let height = 0;
  let flattenBuffer = null;
  let effectiveRenderer = requestedRenderer;
  let lastSuccessfulCanvas = null;
  const isCoverTemplate = Boolean(node.querySelector('[data-frost-template="cover"]'));
  const hasCoverBackground = Boolean(node.querySelector("[data-frost-export-bg-photo]"));
  let dateOverlay = null;
  let hideDateText = false;
  const hideBackgroundImage = isCoverTemplate && hasCoverBackground;
  const captureValidatedFrame = async (renderer, elapsedMs = 0) => {
    await waitForAnimationFrames(1);

    const frameCanvas = await captureNodeCanvas(node, html2canvas, {
      scale,
      foreignObjectRendering: renderer === "foreignObject",
      fallbackOnInvalidForeignObject: false,
      animationTimeMs: elapsedMs,
      hideDateText,
      hideBackgroundImage,
    });

    if (renderer === "foreignObject" && !canvasHasRenderableContent(frameCanvas)) {
      throw new Error("invalid-foreign-object-frame");
    }

    return frameCanvas;
  };

  try {
    await captureValidatedFrame(effectiveRenderer, 0);
  } catch {
    effectiveRenderer = requestedRenderer === "foreignObject" ? "standard" : "foreignObject";
    try {
      await captureValidatedFrame(effectiveRenderer, 0);
    } catch {
      effectiveRenderer = "standard";
      await captureValidatedFrame(effectiveRenderer, 0);
    }
  }

  if (isCoverTemplate) {
    try {
      dateOverlay = await captureDateOverlay(node, html2canvas, scale);
      hideDateText = Boolean(dateOverlay?.bitmap);
    } catch {
      dateOverlay = null;
      hideDateText = false;
    }
  }

  for (let index = 0; index < frameCount; index += 1) {
    const elapsedMs = index * frameDelay;
    let canvas = null;

    try {
      canvas = await captureValidatedFrame(effectiveRenderer, elapsedMs);
    } catch {
      const fallbackRenderer = effectiveRenderer === "foreignObject" ? "standard" : "foreignObject";
      try {
        canvas = await captureValidatedFrame(fallbackRenderer, elapsedMs);
        effectiveRenderer = fallbackRenderer;
      } catch {
        if (lastSuccessfulCanvas) {
          canvas = lastSuccessfulCanvas;
        } else {
          throw new Error("gif-capture-failed");
        }
      }
    }

    if (canvas) {
      lastSuccessfulCanvas = canvas;
    }

    if (!width || !height) {
      width = canvas.width;
      height = canvas.height;
    }

    flattenBuffer = flattenCanvas(canvas, null, flattenBuffer);
    if (hideBackgroundImage) {
      drawCoverBackgroundImage(node, flattenBuffer);
      const context = flattenBuffer.getContext("2d");
      if (context) {
        context.drawImage(canvas, 0, 0);
      }
    }
    drawCoverTextOverlays(node, flattenBuffer, dateOverlay);
    const context = flattenBuffer.getContext("2d", { willReadFrequently: true });
    if (!context) {
      throw new Error("missing-canvas-context");
    }

    const rgba = context.getImageData(0, 0, width, height).data;
    const palette = quantize(rgba, 256, { format: "rgb565" });
    const pixels = applyPalette(rgba, palette, "rgb565");

    gif.writeFrame(
      pixels,
      width,
      height,
      index === 0
        ? { palette, delay: frameDelay, repeat: 0 }
        : { palette, delay: frameDelay }
    );
  }

  gif.finish();
  const output = gif.bytesView();
  const blob = new Blob([output], { type: "image/gif" });
  downloadBlob(blob, `${fileName}.gif`);
}

export async function exportNodesAsPdf(nodes, fileName = "frost-news-journal") {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");
  let pdf = null;

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (!node) {
      continue;
    }

    const canvas = await captureNodeCanvas(node, html2canvas, { scale: 2 });

    const image = canvas.toDataURL("image/png");
    const width = canvas.width;
    const height = canvas.height;
    const orientation = width > height ? "landscape" : "portrait";

    if (!pdf) {
      pdf = new jsPDF({ orientation, unit: "px", format: [width, height] });
    } else {
      pdf.addPage([width, height], orientation);
    }

    pdf.addImage(image, "PNG", 0, 0, width, height);
  }

  if (pdf) {
    pdf.save(`${fileName}.pdf`);
  }
}
