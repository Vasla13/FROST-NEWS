const DEFAULT_OPTIONS = {
  compressionThresholdBytes: 350_000,
  maxDimension: 1800,
  maxDataUrlBytes: 1_500_000,
  outputType: "image/webp",
  quality: 0.86,
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("read-failed"));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("decode-failed"));
    image.src = dataUrl;
  });
}

function estimateDataUrlBytes(dataUrl) {
  const payload = dataUrl.split(",")[1] || "";
  return Math.floor((payload.length * 3) / 4);
}

function renderImageToDataUrl(image, { scale, outputType, quality }) {
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("canvas-unavailable");
  }

  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL(outputType, quality);
}

async function compressImageDataUrl(file, options) {
  const baseDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(baseDataUrl);
  const maxSide = Math.max(image.naturalWidth, image.naturalHeight);
  let scale = maxSide > options.maxDimension ? options.maxDimension / maxSide : 1;
  let quality = options.quality;
  let best = renderImageToDataUrl(image, {
    scale,
    outputType: options.outputType,
    quality,
  });

  for (let attempt = 0; attempt < 4; attempt += 1) {
    if (estimateDataUrlBytes(best) <= options.maxDataUrlBytes) {
      return best;
    }

    scale *= 0.82;
    quality = Math.max(0.55, quality - 0.08);
    best = renderImageToDataUrl(image, {
      scale,
      outputType: options.outputType,
      quality,
    });
  }

  return best;
}

function toUploadErrorMessage(error) {
  if (error?.message === "not-image") {
    return "Fichier invalide: selectionne une image.";
  }

  if (error?.message === "too-large") {
    return "Image trop lourde apres compression. Reduis la resolution avant import.";
  }

  return "Impossible d'importer cette image.";
}

export default function useObjectUrlUpload(onData, options = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return async (event) => {
    const input = event.target;
    if (!input) {
      return;
    }

    const file = input.files?.[0];
    if (!file) {
      return;
    }

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("not-image");
      }

      let dataUrl = await readFileAsDataUrl(file);
      if (file.size >= config.compressionThresholdBytes) {
        dataUrl = await compressImageDataUrl(file, config);
      }

      if (estimateDataUrlBytes(dataUrl) > config.maxDataUrlBytes) {
        throw new Error("too-large");
      }

      onData(dataUrl);
    } catch (error) {
      console.error(error);
      if (typeof config.onError === "function") {
        config.onError(toUploadErrorMessage(error));
      }
    } finally {
      input.value = "";
    }
  };
}
