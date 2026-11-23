/**
 * Redimensiona e converte imagens para WebP no navegador antes do upload,
 * reduzindo drasticamente o peso sem perder nitidez visível.
 */
export async function optimizeImageBeforeUpload(
  file: File,
  maxWidth = 1400,
  quality = 0.82,
): Promise<File> {
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Falha ao carregar imagem"));
      image.src = objectUrl;
    });

    const scale = img.width > maxWidth ? maxWidth / img.width : 1;
    const targetWidth = Math.max(1, Math.round(img.width * scale));
    const targetHeight = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const webpBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/webp", quality),
    );

    if (!webpBlob) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "");
    const optimized = new File([webpBlob], `${baseName}.webp`, {
      type: "image/webp",
    });

    return optimized.size < file.size || file.type !== "image/webp"
      ? optimized
      : file;
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
