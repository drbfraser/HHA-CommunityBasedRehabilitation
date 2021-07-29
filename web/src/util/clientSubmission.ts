export const appendPicture = async (
    formData: FormData,
    pictureUrl: string,
    clientId: number | undefined | null
) => {
    const clientProfilePictureFetch = await fetch(pictureUrl);
    const contentType = clientProfilePictureFetch.headers.get("Content-Type");

    // If needed, fall back to PNG so that the upload can continue; the server will figure out the
    // image type. The cropper library by default makes PNGs anyway.
    const imageExtension = contentType?.includes("image/")
        ? contentType
              .split(";")
              .find((value) => value.includes("image/"))
              ?.trim()
              ?.split("/")[1]
        : "png";

    formData.append(
        "picture",
        await clientProfilePictureFetch.blob(),
        clientId ? `client-${clientId}.${imageExtension}` : `client-new.${imageExtension}`
    );
};
