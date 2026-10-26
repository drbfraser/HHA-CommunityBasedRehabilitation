export interface PhotoSize {
    /** Longest side in pixels; smaller photos are not enlarged. */
    maxSide: number;
    /** JPEG quality, 0-1. */
    quality: number;
}

// Keep in sync with mobile/src/util/resizePhoto.ts.
export const RECORD_PHOTO_SIZE: PhotoSize = { maxSide: 400, quality: 0.75 }; // client, visit, referral
export const STORY_PHOTO_SIZE: PhotoSize = { maxSide: 1500, quality: 0.8 }; // success stories

type DecodedImage = ImageBitmap | HTMLImageElement;

// Decodes the image with its EXIF rotation applied, so phone photos are not sideways.
const decodeImage = async (file: Blob): Promise<DecodedImage> => {
    if (typeof createImageBitmap === "function") {
        try {
            return await createImageBitmap(file, { imageOrientation: "from-image" });
        } catch {
            // Fall back to <img>, which browsers also draw with EXIF rotation applied.
        }
    }
    const url = URL.createObjectURL(file);
    try {
        const img = new Image();
        img.src = url;
        await img.decode();
        return img;
    } finally {
        URL.revokeObjectURL(url);
    }
};

export const canvasToJpeg = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> =>
    new Promise((resolve, reject) =>
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode the image"))),
            "image/jpeg",
            quality
        )
    );

/**
 * Resizes an image so its longest side is at most `maxSide` and re-encodes it as JPEG (which also
 * drops metadata such as GPS location). Transparent areas become white.
 *
 * @throws Error if the browser cannot decode the image (e.g. HEIC in most browsers).
 */
export const resizePhoto = async (file: Blob, { maxSide, quality }: PhotoSize): Promise<Blob> => {
    const image = await decodeImage(file);
    const width = image instanceof HTMLImageElement ? image.naturalWidth : image.width;
    const height = image instanceof HTMLImageElement ? image.naturalHeight : image.height;
    const scale = Math.min(1, maxSide / Math.max(width, height));

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Could not resize the image");
    }
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    if (!(image instanceof HTMLImageElement)) {
        image.close();
    }

    return canvasToJpeg(canvas, quality);
};
