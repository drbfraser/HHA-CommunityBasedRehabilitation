export const appendMobilePict = async (formData: FormData, pictureUrl: string) => {
    let localUri = pictureUrl;
    let filename = localUri.split("/").pop();

    //find matching extension for file type
    let match = /\.(\w+)$/.exec(filename as string);
    let type = match ? `image/${match[1]}` : `image`;

    formData.append(
        "picture",
        JSON.parse(JSON.stringify({ uri: pictureUrl, name: filename, type }))
    );
};
