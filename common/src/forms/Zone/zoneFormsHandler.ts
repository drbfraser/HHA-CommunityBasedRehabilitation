import { FormikHelpers } from "formik";
import { apiFetch, Endpoint } from "../../util/endpoints";
import { IZone } from "../../util/zones";
import { TNewZoneValues } from "./zoneFields";

const addZone = async (zoneInfo: string) => {
    const init: RequestInit = {
        method: "POST",
        body: zoneInfo,
    };

    return await apiFetch(Endpoint.ZONES, "", init)
        .then((res) => res.json())
        .then((res) => res as IZone);
};

const updateZone = async (zoneInfo: string, zoneName: string) => {
    const init: RequestInit = {
        method: "PUT",
        body: zoneInfo,
    };

    return await apiFetch(Endpoint.ZONES, `${zoneName}`, init)
        .then((res) => res.json())
        .then((res) => res as IZone);
};

/**
 * @return The new user's JSON from the server, which has extra properties filled in such as
 * ID.
 */
export const handleNewZoneSubmit = async (
    values: TNewZoneValues,
    helpers: FormikHelpers<TNewZoneValues>
) => {
    const newZone = JSON.stringify({
        zone_name: values.zone_name,
    });

    try {
        return await addZone(newZone);
    } finally {
        helpers.setSubmitting(false);
    }
};

/**
 * @return The updated user's JSON from the server.
 */
export const handleUserEditSubmit = async (values: IZone, helpers: FormikHelpers<IZone>) => {
    const editZone = JSON.stringify({
        zone: values.zone_name,
    });

    try {
        return await updateZone(editZone, values.zone_name);
    } finally {
        helpers.setSubmitting(false);
    }
};
