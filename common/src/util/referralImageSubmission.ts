export const appendPic = async (formData: FormData, pictureUrl: string) => {
    const referralPictureFetch = await fetch(pictureUrl);
    const contentType = referralPictureFetch.headers.get("Content-Type");

    // Modified from ClientImageSubmission without Id props
    const imageExtension = contentType?.includes("image/")
        ? contentType
              .split(";")
              .find((value) => value.includes("image/"))
              ?.trim()
              ?.split("/")[1]
        : "png";

    formData.append("picture", await referralPictureFetch.blob(), `referral-new.${imageExtension}`);
};
