import { apiFetch, Endpoint, objectToFormData } from "@cbr/common/util/endpoints";

export enum StoryStatus {
    WORK_IN_PROGRESS = "WIP",
    READY = "READY",
    PUBLISHED = "PUB",
    ARCHIVED = "ARCH",
}

export enum PublishPermission {
    YES = "YES",
    NO = "NO",
    ANONYMOUS = "ANON",
}

export const storyStatusLabel = (status: StoryStatus | string): string => {
    switch (status) {
        case StoryStatus.READY:
            return "Ready";
        case StoryStatus.PUBLISHED:
            return "Published";
        case StoryStatus.ARCHIVED:
            return "Archived";
        case StoryStatus.WORK_IN_PROGRESS:
            return "Work in Progress";
        default:
            return "Work in Progress";
    }
};

export const storyStatusChipColor = (
    status: StoryStatus | string
): "success" | "warning" | "info" | "default" => {
    switch (status) {
        case StoryStatus.READY:
            return "success";
        case StoryStatus.PUBLISHED:
            return "info";
        case StoryStatus.ARCHIVED:
            return "default";
        default:
            return "warning";
    }
};

// Maximum number of photos a story can carry, and the matching server field names.
// Slot 1 stays "photo" for backward compatibility
export const MAX_STORY_PHOTOS = 5;
export const PHOTO_FIELDS = ["photo", "photo_2", "photo_3", "photo_4", "photo_5"] as const;
export type PhotoField = typeof PHOTO_FIELDS[number];

export interface ISuccessStory {
    id: string;
    client_id: string;
    created_by_user_id: string;
    created_at: number;
    updated_at: number;
    written_by_name: string;
    beneficiary_age: number | "";
    beneficiary_gender: string;
    hcr_status: string;
    client_name: string;
    title: string;
    refugee_origin: string;
    refugee_duration: string;
    diagnosis: string;
    treatment_service: string;
    part1_background: string;
    part2_challenge: string;
    part3_introduction: string;
    part4_action: string;
    part5_impact: string;
    photo: string;
    photo_2: string;
    photo_3: string;
    photo_4: string;
    photo_5: string;
    publish_permission: PublishPermission;
    status: StoryStatus;
    date: string;
}

export type ISuccessStoryWritePayload = Pick<
    ISuccessStory,
    | "client_id"
    | "title"
    | "refugee_origin"
    | "refugee_duration"
    | "diagnosis"
    | "treatment_service"
    | "part1_background"
    | "part2_challenge"
    | "part3_introduction"
    | "part4_action"
    | "part5_impact"
    | "publish_permission"
    | "status"
    | "date"
>;

export const getAllStories = async (): Promise<ISuccessStory[]> => {
    const resp = await apiFetch(Endpoint.SUCCESS_STORIES);
    return resp.json();
};

export const getStoriesForClient = async (clientId: string): Promise<ISuccessStory[]> => {
    const resp = await apiFetch(
        Endpoint.SUCCESS_STORIES,
        `?client_id=${encodeURIComponent(clientId)}`
    );
    return resp.json();
};

export const getStoryById = async (id: string): Promise<ISuccessStory> => {
    const resp = await apiFetch(Endpoint.SUCCESS_STORY, id);
    return resp.json();
};

/**
 * Fetches a single photo slot (1-based) for a story and returns an object URL,
 * or "" if there is no image in that slot. Slot 1 hits the legacy unindexed
 * endpoint; slots 2-5 hit the indexed endpoint.
 */
export const fetchStoryPhotoUrl = async (storyId: string, slot: number): Promise<string> => {
    const suffix = slot <= 1 ? `${storyId}` : `${storyId}/${slot}`;
    try {
        const resp = await apiFetch(Endpoint.SUCCESS_STORY_PHOTO, suffix);
        const blob = await resp.blob();
        return URL.createObjectURL(blob);
    } catch {
        return "";
    }
};

const appendPhoto = async (
    formData: FormData,
    fieldName: string,
    photoUrl: string,
    storyId: string | undefined | null
) => {
    const photoFetch = await fetch(photoUrl);
    const contentType = photoFetch.headers.get("Content-Type");

    // If needed, fall back to PNG so that the upload can continue; the server will figure out the
    // image type. The cropper library by default makes PNGs anyway.
    const imageExtension = contentType?.includes("image/")
        ? contentType
              .split(";")
              .find((value) => value.includes("image/"))
              ?.trim()
              ?.split("/")[1]
        : "png";

    formData.append(
        fieldName,
        await photoFetch.blob(),
        storyId
            ? `success-story-${storyId}-${fieldName}.${imageExtension}`
            : `success-story-new-${fieldName}.${imageExtension}`
    );
};

// Writes a compact, ordered list of photos into the slot fields photo, photo_2,
// ... (no gaps). Every photo is a fetchable URL (a freshly-picked blob: URL or an
// object URL for an image already on the server), so editing re-sends the full
// desired state and the server slots always mirror the on-screen order.
const appendPhotos = async (
    formData: FormData,
    photos: string[],
    storyId: string | undefined | null
) => {
    await Promise.all(
        photos.slice(0, MAX_STORY_PHOTOS).map(async (url, index) => {
            if (url) {
                await appendPhoto(formData, PHOTO_FIELDS[index], url, storyId);
            }
        })
    );
};

export const createStory = async (
    story: ISuccessStoryWritePayload,
    photos: string[] = []
): Promise<ISuccessStory> => {
    const formData = objectToFormData(story);
    await appendPhotos(formData, photos, null);

    const resp = await apiFetch(Endpoint.SUCCESS_STORIES, "", {
        method: "POST",
        body: formData,
    });
    return resp.json();
};

export const updateStory = async (
    id: string,
    story: ISuccessStoryWritePayload,
    photos: string[] = []
): Promise<ISuccessStory> => {
    const formData = objectToFormData(story);
    await appendPhotos(formData, photos, id);

    // The photos array is the full desired state, so every slot beyond it is
    // cleared. This keeps the stored photos compact (no gaps) after a removal.
    const clearedPhotos = PHOTO_FIELDS.slice(Math.min(photos.length, MAX_STORY_PHOTOS));
    if (clearedPhotos.length > 0) {
        formData.append("cleared_photos", clearedPhotos.join(","));
    }

    const resp = await apiFetch(Endpoint.SUCCESS_STORY, id, {
        method: "PUT",
        body: formData,
    });
    return resp.json();
};
