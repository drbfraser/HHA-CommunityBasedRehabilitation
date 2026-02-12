import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import React, { useEffect, useState } from "react";

interface Iprops {
    Id: string | number;
    Url: string;
    endpoint: Endpoint;  // NEW: accept which endpoint to use
}

export const Thumb = (props: Iprops) => {
    const [thumb, setThumb] = useState<string>("");

    useEffect(() => {
        if (props.Url) {
            apiFetch(props.endpoint, `${props.Id}`)  // Use the passed endpoint
                .then((resp) => resp.blob())
                .then((blob) => {
                    setThumb(URL.createObjectURL(blob));
                });
        }
    }, [props.Id, props.Url, props.endpoint]);

    return thumb ? <img alt="" src={thumb} width="200px" /> : null;
};