export interface PhotoSize {
    /** Longest side in pixels; smaller photos are not enlarged. */
    maxSide: number;
    /** JPEG quality, 0-1. */
    quality: number;
    /**
     * Optional size budget for the JPEG, in bytes. A photo over it is re-encoded with the
     * STEP_DOWN settings until it fits.
     */
    maxBytes?: number;
}

// Keep in sync with mobile/src/util/resizePhoto.ts.
export const RECORD_PHOTO_SIZE: PhotoSize = { maxSide: 400, quality: 0.75 }; // client, visit, referral
// Success stories: phones store all of a story's photos (as base64) in one database row, which
// Android can only read if the row fits in 2 MB, and stories uploaded here are synced to phones.
// 4 photos (MAX_STORY_PHOTOS) of at most 320 KB leave room for the story text and a margin.
export const STORY_PHOTO_SIZE: PhotoSize = { maxSide: 1500, quality: 0.8, maxBytes: 320 * 1024 };
// Bug report screenshots and images, sent by email: large enough to read text in a screenshot.
export const BUG_REPORT_IMAGE_SIZE: PhotoSize = {
    maxSide: 2000,
    quality: 0.85,
    maxBytes: 800 * 1024,
};

// Tried in order for a photo over its budget: [fraction of maxSide, JPEG quality].
// For success stories: 1500 px at 0.75/0.7/0.65, then 1200 px, 1000 px and 750 px.
const STEP_DOWN: [number, number][] = [
    [1, 0.75],
    [1, 0.7],
    [1, 0.65],
    [0.8, 0.75],
    [0.8, 0.65],
    [2 / 3, 0.65],
    [0.5, 0.6],
];

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

const drawScaled = (image: DecodedImage, width: number, height: number, side: number) => {
    const scale = Math.min(1, side / Math.max(width, height));
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
    return canvas;
};

/**
 * Resizes an image so its longest side is at most `maxSide` (and, with `maxBytes`, so the JPEG
 * fits that budget) and re-encodes it as JPEG, which also drops metadata such as GPS location.
 * Transparent areas become white.
 *
 * @throws Error if the browser cannot decode the image (e.g. HEIC in most browsers).
 */
export const resizePhoto = async (
    file: Blob,
    { maxSide, quality, maxBytes }: PhotoSize
): Promise<Blob> => {
    const image = await decodeImage(file);
    try {
        const width = image instanceof HTMLImageElement ? image.naturalWidth : image.width;
        const height = image instanceof HTMLImageElement ? image.naturalHeight : image.height;
        const encode = (side: number, jpegQuality: number) =>
            canvasToJpeg(drawScaled(image, width, height, side), jpegQuality);

        let jpeg = await encode(maxSide, quality);
        if (maxBytes) {
            for (const [sideFraction, stepQuality] of STEP_DOWN) {
                if (jpeg.size <= maxBytes) {
                    break;
                }
                jpeg = await encode(Math.round(maxSide * sideFraction), stepQuality);
            }
        }
        return jpeg;
    } finally {
        if (!(image instanceof HTMLImageElement)) {
            image.close();
        }
    }
};
