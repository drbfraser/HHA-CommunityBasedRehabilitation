import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormLabel, styled } from "@mui/material";
import { PhotoSize, RECORD_PHOTO_SIZE, resizePhoto } from "util/resizePhoto";

const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
});

interface Iprops {
    onPictureChange: (newPictureURL: string) => void;
    /** How the picked photo is resized; defaults to the size for client/visit/referral photos. */
    size?: PhotoSize;
}

export const PhotoView = (props: Iprops) => {
    const [thumb, setThumb] = useState<string | undefined>(undefined);
    const { t } = useTranslation();

    return (
        <Container>
            {thumb === undefined ? (
                <FormLabel sx={{ display: "block" }}>{t("referral.addImageDescription")}</FormLabel>
            ) : (
                <img alt="" src={thumb} width="200 px" />
            )}

            <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                    const files = event.target.files;
                    if (!files || !files[0]) {
                        return;
                    }

                    try {
                        const resized = await resizePhoto(
                            files[0],
                            props.size ?? RECORD_PHOTO_SIZE
                        );
                        const url = URL.createObjectURL(resized);
                        setThumb(url);
                        props.onPictureChange(url);
                    } catch (e) {
                        console.error(e);
                        alert("Could not read this image. Please choose a JPEG or PNG photo.");
                    }
                }}
            />
        </Container>
    );
};
