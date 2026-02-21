(function registerMediaUtils(global) {
  function sanitizeFileName(fileName) {
    return fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  }

  async function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Lecture image impossible"));
      reader.readAsDataURL(file);
    });
  }

  async function downscaleDataUrl(dataUrl, maxDimension) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const largestSide = Math.max(img.width, img.height);
        const scale = largestSide > maxDimension ? maxDimension / largestSide : 1;
        const nextWidth = Math.max(1, Math.round(img.width * scale));
        const nextHeight = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = nextWidth;
        canvas.height = nextHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, nextWidth, nextHeight);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  function createFigure(dataUrl, fileName) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const caption = document.createElement("figcaption");
    const cleanName = sanitizeFileName(fileName) || "Image";
    image.src = dataUrl;
    image.alt = `Image importee: ${cleanName}`;
    caption.textContent = `Legende: ${cleanName}`;
    figure.appendChild(image);
    figure.appendChild(caption);
    return figure;
  }

  function buildImageAlt(fileName) {
    return `Image importee: ${sanitizeFileName(fileName) || "image"}`;
  }

  function buildLegend(fileName) {
    return `Legende: ${sanitizeFileName(fileName) || "Image"}`;
  }

  async function waitForImages(rootElement) {
    const images = Array.from(rootElement.querySelectorAll("img"));
    if (!images.length) {
      return;
    }

    await Promise.all(images.map((img) => {
      if (img.complete) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    }));
  }

  function canvasToBlob(canvas, mimeType, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Generation du fichier impossible."));
          return;
        }
        resolve(blob);
      }, mimeType, quality);
    });
  }

  function cloneCanvas(sourceCanvas) {
    const canvas = document.createElement("canvas");
    canvas.width = sourceCanvas.width;
    canvas.height = sourceCanvas.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(sourceCanvas, 0, 0);
    }
    return canvas;
  }

  function quantizeCanvasInPlace(canvas, levels) {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      return;
    }
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const step = 255 / (levels - 1);

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / step) * step;
      data[i + 1] = Math.round(data[i + 1] / step) * step;
      data[i + 2] = Math.round(data[i + 2] / step) * step;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  global.FrostNews = global.FrostNews || {};
  global.FrostNews.mediaUtils = {
    buildImageAlt,
    buildLegend,
    canvasToBlob,
    cloneCanvas,
    createFigure,
    downscaleDataUrl,
    fileToDataUrl,
    quantizeCanvasInPlace,
    waitForImages
  };
})(window);
