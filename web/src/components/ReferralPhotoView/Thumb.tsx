import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import React, { useEffect, useState } from "react";
import { ImageViewerDialog } from "components/ImageViewer/ImageViewerDialog";

interface Iprops {
    Id: string | number;
    Url: string;
    endpoint: Endpoint; // NEW: accept which endpoint to use
}

const DOWNLOAD_NAME_PREFIX: Partial<Record<Endpoint, string>> = {
    [Endpoint.CLIENT_PICTURE]: "client",
    [Endpoint.VISIT_PICTURE]: "visit",
    [Endpoint.REFERRAL_PICTURE]: "referral",
};

export const Thumb = (props: Iprops) => {
    const [thumb, setThumb] = useState<string>("");
    const [viewerOpen, setViewerOpen] = useState(false);

    useEffect(() => {
        if (props.Url) {
            apiFetch(props.endpoint, `${props.Id}`) // Use the passed endpoint
                .then((resp) => resp.blob())
                .then((blob) => {
                    setThumb(URL.createObjectURL(blob));
                });
        }
    }, [props.Id, props.Url, props.endpoint]);

    if (!thumb) {
        return null;
    }

    const prefix = DOWNLOAD_NAME_PREFIX[props.endpoint] ?? "image";
    return (
        <>
            <img
                alt=""
                src={thumb}
                width="200px"
                title="Click to enlarge"
                style={{ cursor: "zoom-in" }}
                onClick={() => setViewerOpen(true)}
            />
            <ImageViewerDialog
                open={viewerOpen}
                onClose={() => setViewerOpen(false)}
                images={[{ src: thumb, fileBaseName: `${prefix}-${props.Id}` }]}
            />
        </>
    );
};
