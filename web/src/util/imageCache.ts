export const IMAGE_CACHE_NAME = "apiImages";

/**
 * @return a Promise that resolves to true if the Cache object is found and deleted, and false
 * otherwise.
 */
export const deleteImageCache = async (): Promise<boolean> => {
    return caches.delete(IMAGE_CACHE_NAME).catch((e) => {
        console.log(`Error occurred when trying to delete caches: ${e}`);
        return false;
    });
};

// Only persist this profile image cache until the user reloads.
deleteImageCache();
