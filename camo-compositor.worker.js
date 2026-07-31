let basePixels = null;
let maskPixels = null;
let width = 0;
let height = 0;

self.onmessage = async event => {
  const message = event.data;

  try {
    if (message.type === "init") {
      width = message.width;
      height = message.height;

      const baseCanvas = new OffscreenCanvas(width, height);
      const baseContext = baseCanvas.getContext("2d", { willReadFrequently: true });
      baseContext.drawImage(message.base, 0, 0, width, height);
      basePixels = baseContext.getImageData(0, 0, width, height);

      const maskCanvas = new OffscreenCanvas(width, height);
      const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
      maskContext.drawImage(message.mask, 0, 0, width, height);
      maskPixels = maskContext.getImageData(0, 0, width, height);

      message.base.close?.();
      message.mask.close?.();

      self.postMessage({ type: "ready", generation: message.generation });
      return;
    }

    if (message.type === "compose") {
      if (!basePixels || !maskPixels) {
        throw new Error("Worker texture sources are not initialized.");
      }

      const repeat = Math.max(0.1, Number(message.repeat) || 1);
      const angle = (Number(message.rotation) || 0) * Math.PI / 180;
      const tileWidth = width / repeat;
      const tileHeight = height / repeat;
      const diagonal = Math.ceil(Math.sqrt(width * width + height * height));

      const sheet = new OffscreenCanvas(diagonal, diagonal);
      const sheetContext = sheet.getContext("2d");

      const startX = -(diagonal % tileWidth) - tileWidth;
      const startY = -(diagonal % tileHeight) - tileHeight;

      for (let y = startY; y < diagonal + tileHeight; y += tileHeight) {
        for (let x = startX; x < diagonal + tileWidth; x += tileWidth) {
          sheetContext.drawImage(message.camo, x, y, tileWidth, tileHeight);
        }
      }

      const tiled = new OffscreenCanvas(width, height);
      const tiledContext = tiled.getContext("2d", { willReadFrequently: true });
      tiledContext.save();
      tiledContext.translate(width / 2, height / 2);
      tiledContext.rotate(angle);
      tiledContext.drawImage(sheet, -diagonal / 2, -diagonal / 2);
      tiledContext.restore();

      const camoPixels = tiledContext.getImageData(0, 0, width, height);
      const output = new ImageData(width, height);

      for (let index = 0; index < basePixels.data.length; index += 4) {
        const blend = maskPixels.data[index + 3] / 255;
        output.data[index] = Math.round(basePixels.data[index] * (1 - blend) + camoPixels.data[index] * blend);
        output.data[index + 1] = Math.round(basePixels.data[index + 1] * (1 - blend) + camoPixels.data[index + 1] * blend);
        output.data[index + 2] = Math.round(basePixels.data[index + 2] * (1 - blend) + camoPixels.data[index + 2] * blend);
        output.data[index + 3] = basePixels.data[index + 3];
      }

      message.camo.close?.();

      const resultCanvas = new OffscreenCanvas(width, height);
      resultCanvas.getContext("2d").putImageData(output, 0, 0);
      const bitmap = resultCanvas.transferToImageBitmap();

      self.postMessage(
        {
          type: "result",
          requestId: message.requestId,
          generation: message.generation,
          bitmap
        },
        [bitmap]
      );
    }
  } catch (error) {
    self.postMessage({
      type: "error",
      requestId: message.requestId,
      generation: message.generation,
      message: error?.message || String(error)
    });
  }
};
