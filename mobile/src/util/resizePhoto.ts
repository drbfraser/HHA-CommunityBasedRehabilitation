import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { ImagePickerAsset } from "expo-image-picker";

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

// Keep in sync with web/src/util/resizePhoto.ts.
export const RECORD_PHOTO_SIZE: PhotoSize = { maxSide: 400, quality: 0.75 }; // client, visit, referral
// Success stories: phones store all of a story's photos (as base64) in one database row, which
// Android can only read if the row fits in 2 MB. 4 photos (MAX_STORY_PHOTOS) of at most 320 KB
// (~427 KB as base64) leave ~0.4 MB for the story text and a safety margin.
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

// Decoded size of a base64 string.
const base64Bytes = (base64: string) =>
    Math.floor((base64.length * 3) / 4) -
    (base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0);

// Resizes the photo (see resizePhotoToDataUrl) and returns the final JPEG's file URI and base64.
const resizePhoto = async (
    asset: ImagePickerAsset,
    { maxSide, quality, maxBytes }: PhotoSize
): Promise<{ uri: string; base64: string }> => {
    let { width, height } = asset;
    let uri = asset.uri;

    if (!width || !height) {
        // Dimensions unknown: decode once (without re-compressing) to find them.
        const decoded = await manipulateAsync(uri, [], { format: SaveFormat.PNG });
        ({ width, height, uri } = decoded);
    }

    const encode = async (side: number, jpegQuality: number) => {
        const actions =
            Math.max(width, height) > side
                ? [{ resize: width >= height ? { width: side } : { height: side } }]
                : [];
        const result = await manipulateAsync(uri, actions, {
            compress: jpegQuality,
            format: SaveFormat.JPEG,
            base64: true,
        });
        return { uri: result.uri, base64: result.base64 ?? "" };
    };

    let jpeg = await encode(maxSide, quality);
    if (maxBytes) {
        for (const [sideFraction, stepQuality] of STEP_DOWN) {
            if (base64Bytes(jpeg.base64) <= maxBytes) {
                break;
            }
            jpeg = await encode(Math.round(maxSide * sideFraction), stepQuality);
        }
    }
    return jpeg;
};

/*
    Resizes a picked photo so its longest side is at most maxSide (and, with maxBytes, so the JPEG
    fits that budget) and returns it as a JPEG data URL, ready to store and sync. It reads the
    picked file rather than a base64 copy, so a full-resolution photo is never held in JavaScript
    memory.

    Callers pick with allowsEditing, which writes a new image with its rotation applied, so the
    asset's width and height match the photo as displayed.
*/
export const resizePhotoToDataUrl = async (
    asset: ImagePickerAsset,
    size: PhotoSize
): Promise<string> => `data:image/jpeg;base64,${(await resizePhoto(asset, size)).base64}`;

// Like resizePhotoToDataUrl, but returns the URI of the resized JPEG file, for uploading.
export const resizePhotoToFile = async (
    asset: ImagePickerAsset,
    size: PhotoSize
): Promise<string> => (await resizePhoto(asset, size)).uri;
