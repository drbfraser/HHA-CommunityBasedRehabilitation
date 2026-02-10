import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormLabel, styled } from "@mui/material";
import { helperImgCompress } from "./imgCompressHelper";

const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
});

interface Iprops {
    onPictureChange: (newPictureURL: string) => void;
}

export const PhotoView = (props: Iprops) => {
    const [thumb, setThumb] = useState<string | undefined>(undefined);
    const { t } = useTranslation();

    return (
        <Container>
            {thumb === undefined ? (
                <FormLabel sx={{ display: "block" }}>
                    {t("referral.addImageDescription")}
                </FormLabel>
            ) : (
                <img alt="" src={thumb} width="200 px" />
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
                    };

                    reader.readAsArrayBuffer(target_file);
                }}
            />
        </Container>
    );
};
