import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormLabel } from "@mui/material";
import { helperImgCompress } from "./imgCompressHelper";

interface Iprops {
    onPictureChange: (newPictureURL: string) => void;
}

export const PhotoView = (props: Iprops) => {
    const [thumb, setThumb] = useState<string | undefined>(undefined);
    const [upload, setUpload] = useState<boolean>(false);
    const { t } = useTranslation();

    return (
        <>
            <br />
            {thumb !== undefined ? (
                <>
                    <img alt="" src={thumb} width="200 px" />
                    <br />
                </>
            ) : (
                <p />
            )}

            {upload === false ? (
                <FormLabel>{t("referral.attachWheelchairPhoto")} </FormLabel>
            ) : (
                <p />
            )}

            <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                    const files = event.target.files;
                    if (!files) {
                        return;
                    }

                    const target_file = await helperImgCompress(files[0]);
                    const reader = new FileReader();
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
