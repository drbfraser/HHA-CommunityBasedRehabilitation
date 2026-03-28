import { apiFetch, Endpoint, objectToFormData } from "@cbr/common";

export enum StoryStatus {
    WORK_IN_PROGRESS = "WIP",
    READY = "READY",
}

export enum PublishPermission {
    YES = "YES",
    NO = "NO",
    ANONYMOUS = "ANON",
}

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
    publish_permission: PublishPermission;
    status: StoryStatus;
    date: string;
}

export type ISuccessStoryPayload = Pick<
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
    | "photo"
    | "publish_permission"
    | "status"
    | "date"
>;

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

export const createStory = async (
    story: ISuccessStoryPayload,
    photoUri?: string
): Promise<ISuccessStory> => {
    const formData = objectToFormData(story);

    if (photoUri) {
        await appendPhoto(formData, photoUri, null);
    }

    const resp = await apiFetch(Endpoint.SUCCESS_STORIES, "", {
        method: "POST",
        body: formData,
    });
    return resp.json();
};

export const updateStory = async (
    id: string,
    story: ISuccessStoryPayload,
    photoUri?: string
): Promise<ISuccessStory> => {
    const formData = objectToFormData(story);

    if (photoUri) {
        await appendPhoto(formData, photoUri, id);
    }

    const resp = await apiFetch(Endpoint.SUCCESS_STORY, id, {
        method: "PUT",
        body: formData,
    });
    return resp.json();
};

const appendPhoto = async (formData: FormData, uri: string, storyId: string | null) => {
    const filename = storyId ? `success-story-${storyId}.jpg` : "success-story-new.jpg";

    formData.append("photo", {
        uri,
        name: filename,
        type: "image/jpeg",
    } as any);
};
