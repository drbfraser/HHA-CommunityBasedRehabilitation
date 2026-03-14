import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";

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

export type ISuccessStoryWritePayload = Pick<
    ISuccessStory,
    | "client_id"
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

export const createStory = async (story: ISuccessStoryWritePayload): Promise<ISuccessStory> => {
    const resp = await apiFetch(Endpoint.SUCCESS_STORIES, "", {
        method: "POST",
        body: JSON.stringify(story),
    });
    return resp.json();
};

export const updateStory = async (
    id: string,
    story: ISuccessStoryWritePayload
): Promise<ISuccessStory> => {
    const resp = await apiFetch(Endpoint.SUCCESS_STORY, id, {
        method: "PUT",
        body: JSON.stringify(story),
    });
    return resp.json();
};
