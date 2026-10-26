import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { ImagePickerAsset } from "expo-image-picker";

export interface PhotoSize {
    /** Longest side in pixels; smaller photos are not enlarged. */
    maxSide: number;
    /** JPEG quality, 0-1. */
    quality: number;
}

// Keep in sync with web/src/util/resizePhoto.ts.
export const RECORD_PHOTO_SIZE: PhotoSize = { maxSide: 400, quality: 0.75 }; // client, visit, referral
export const STORY_PHOTO_SIZE: PhotoSize = { maxSide: 1500, quality: 0.8 }; // success stories

/*
    Resizes a picked photo so its longest side is at most maxSide and returns it as a JPEG data URL,
    ready to store and sync. It reads the picked file rather than a base64 copy, so a
    full-resolution photo is never held in JavaScript memory.

    Callers pick with allowsEditing, which writes a new image with its rotation applied, so the
    asset's width and height match the photo as displayed.
*/
export const resizePhotoToDataUrl = async (
    asset: ImagePickerAsset,
    { maxSide, quality }: PhotoSize
): Promise<string> => {
    let { width, height } = asset;
    let uri = asset.uri;

    if (!width || !height) {
        // Dimensions unknown: decode once (without re-compressing) to find them.
        const decoded = await manipulateAsync(uri, [], { format: SaveFormat.PNG });
        ({ width, height, uri } = decoded);
    }

    const actions =
        Math.max(width, height) > maxSide
            ? [{ resize: width >= height ? { width: maxSide } : { height: maxSide } }]
            : [];
    const result = await manipulateAsync(uri, actions, {
        compress: quality,
        format: SaveFormat.JPEG,
        base64: true,
    });
    return `data:image/jpeg;base64,${result.base64}`;
};
