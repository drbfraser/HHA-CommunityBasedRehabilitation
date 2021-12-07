import imageCompression from "browser-image-compression";

export const helperImgCompress = async (imgFile: File) => {
    const MAX_FILE_SIZE = 100000;
    if (imgFile.size >= MAX_FILE_SIZE) {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 500,
            initialQuality: 0.5,
            useWebWorker: true,
        };
        return await imageCompression(imgFile, options);
    } else {
        return imgFile;
    }
};
