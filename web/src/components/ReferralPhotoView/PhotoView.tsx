import { FormLabel } from "@material-ui/core";
import imageCompression from "browser-image-compression";
import { MAX_FILE_SIZE } from "components/PhotoViewUpload/PhotoViewUpload";
import React from "react";
import { useState } from "react";

interface Iprops {
    onPictureChange: (newPictureURL: string) => void;
}

export const PhotoView = (props: Iprops) => {
    const [thumb, setThumb] = useState<string | undefined>(undefined);
    const [upload, setUpload] = useState<boolean>(false);
    return (
        <>
            <br />
            {thumb !== undefined ? (
                <>
                    <img alt="" src={thumb} width="200 px" /> <br />
                </>
            ) : (
                <p></p>
            )}
            {upload === false ? (
                <FormLabel>Attach a photo of the wheelchair if possible </FormLabel>
            ) : (
                <p></p>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                    const files = event.target.files;
                    if (!files) {
                        return;
                    }
                    let target_file;
                    if (files[0].size >= MAX_FILE_SIZE) {
                        const options = {
                            maxSizeMB: 1,
                            maxWidthOrHeight: 500,
                            initialQuality: 0.5,
                            useWebWorker: true,
                        };
                        target_file = await imageCompression(files[0], options);
                    } else {
                        target_file = files[0];
                    }
                    let reader = new FileReader();
                    reader.onload = () => {
                        const image = (reader.result as ArrayBuffer) ?? undefined;
                        const url = URL.createObjectURL(new Blob([image]));
                        setThumb(url);
                        props.onPictureChange(url);
                        setUpload(true);
                    };

                    reader.readAsArrayBuffer(target_file);
                }}
            ></input>
        </>
    );
};
