export const appendPicture = async (
    formData: FormData,
    pictureUrl: string,
    clientId: number | undefined | null
) => {
    const clientProfilePictureFetch = await fetch(pictureUrl);
    const contentType = clientProfilePictureFetch.headers.get("Content-Type");

    if (contentType?.includes("image/")) {
        const splitHeader = contentType.split(";");
        const imageType = splitHeader.find((value) => value.includes("image/"));
        const imageExtension = imageType?.trim()?.split("/")[1] ?? "";

        formData.append(
            "picture",
            await clientProfilePictureFetch.blob(),
            clientId ? `client-${clientId}.${imageExtension}` : `client-new.${imageExtension}`
        );
    }
};
