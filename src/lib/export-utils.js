function downloadDataUrl(dataUrl, filename) {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
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

async function waitForNodeAssets(node) {
  if (!node) {
    return;
  }

  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(images.map((image) => waitForImageReady(image)));

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
}

export async function exportNodeAsImage(node, fileName, type = "png") {
  const html2canvas = (await import("html2canvas")).default;
  await waitForNodeAssets(node);
  const canvas = await html2canvas(node, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const mime = type === "jpeg" ? "image/jpeg" : "image/png";
  const quality = type === "jpeg" ? 0.92 : 1;
  const dataUrl = canvas.toDataURL(mime, quality);

  downloadDataUrl(dataUrl, `${fileName}.${type === "jpeg" ? "jpg" : "png"}`);
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

    await waitForNodeAssets(node);
    const canvas = await html2canvas(node, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false,
    });

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
