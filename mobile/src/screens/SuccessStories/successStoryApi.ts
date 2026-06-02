import { Q } from "@nozbe/watermelondb";
import type { Database } from "@nozbe/watermelondb";
import { HCRType } from "@cbr/common";
import { modelName } from "../../models/constant";
import SuccessStory from "../../models/SuccessStory";
import Client from "../../models/Client";
import User from "../../models/UserCBR";

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
    | "publish_permission"
    | "status"
    | "date"
>;

// --- Derived-field helpers (mirror the server-side SuccessStorySerializer) ---

const computeAge = (birthDate: Date | null | undefined): number | "" => {
    if (!birthDate) return "";
    const parsed = birthDate instanceof Date ? birthDate : new Date(birthDate);
    if (isNaN(parsed.getTime())) return "";

    const today = new Date();
    let age = today.getFullYear() - parsed.getFullYear();
    if (
        today.getMonth() < parsed.getMonth() ||
        (today.getMonth() === parsed.getMonth() && today.getDate() < parsed.getDate())
    ) {
        age -= 1;
    }
    return age >= 0 ? age : "";
};

const hcrStatusLabel = (hcrType: string | null | undefined): string => {
    if (hcrType === HCRType.REFUGEE) return "Refugee";
    if (hcrType === HCRType.HOST_COMMUNITY) return "Host Community";
    return "";
};

const writtenByName = (user: User | null): string => {
    if (!user) return "";
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
    return fullName || user.username || "";
};

const toISuccessStory = async (record: SuccessStory): Promise<ISuccessStory> => {
    const client: Client | null = await record.client.fetch().catch(() => null);
    const user: User | null = await record.createdByUser.fetch().catch(() => null);

    return {
        id: record.id,
        client_id: record.client.id ?? "",
        created_by_user_id: record.createdByUser.id ?? "",
        created_at: record.createdAt ? record.createdAt.getTime() : 0,
        updated_at: record.updatedAt ? record.updatedAt.getTime() : 0,
        written_by_name: writtenByName(user),
        beneficiary_age: computeAge(client?.birth_date),
        beneficiary_gender: client?.gender ?? "",
        hcr_status: hcrStatusLabel(client?.hcr_type),
        client_name: client?.full_name ?? "",
        title: record.title ?? "",
        refugee_origin: record.refugee_origin ?? "",
        refugee_duration: record.refugee_duration ?? "",
        diagnosis: record.diagnosis ?? "",
        treatment_service: record.treatment_service ?? "",
        part1_background: record.part1_background ?? "",
        part2_challenge: record.part2_challenge ?? "",
        part3_introduction: record.part3_introduction ?? "",
        part4_action: record.part4_action ?? "",
        part5_impact: record.part5_impact ?? "",
        photo: record.photo ?? "",
        publish_permission:
            (record.publish_permission as PublishPermission) ?? PublishPermission.NO,
        status: (record.status as StoryStatus) ?? StoryStatus.WORK_IN_PROGRESS,
        date: record.date ?? "",
    };
};

const applyPayload = (record: SuccessStory, payload: ISuccessStoryPayload) => {
    record.title = payload.title;
    record.refugee_origin = payload.refugee_origin;
    record.refugee_duration = payload.refugee_duration;
    record.diagnosis = payload.diagnosis;
    record.treatment_service = payload.treatment_service;
    record.part1_background = payload.part1_background;
    record.part2_challenge = payload.part2_challenge;
    record.part3_introduction = payload.part3_introduction;
    record.part4_action = payload.part4_action;
    record.part5_impact = payload.part5_impact;
    record.publish_permission = payload.publish_permission;
    record.status = payload.status;
    record.date = payload.date;
};

// --- DB-backed CRUD (offline-first; replaces the previous REST calls) ---

export const getStoriesForClient = async (
    database: Database,
    clientId: string
): Promise<ISuccessStory[]> => {
    const records = (await database
        .get<SuccessStory>(modelName.success_stories)
        .query(Q.where("client_id", clientId), Q.sortBy("created_at", Q.desc))
        .fetch()) as SuccessStory[];

    return Promise.all(records.map(toISuccessStory));
};

export const getStoryById = async (database: Database, id: string): Promise<ISuccessStory> => {
    const record = (await database
        .get<SuccessStory>(modelName.success_stories)
        .find(id)) as SuccessStory;
    return toISuccessStory(record);
};

export const createStory = async (
    database: Database,
    clientId: string,
    createdByUserId: string,
    payload: ISuccessStoryPayload,
    photoUri?: string
): Promise<void> => {
    await database.write(async () => {
        const client = await database.get<Client>(modelName.clients).find(clientId);
        const user = await database.get<User>(modelName.users).find(createdByUserId);

        await database.get<SuccessStory>(modelName.success_stories).create((story) => {
            applyPayload(story, payload);
            story.photo = photoUri ?? "";
            story.client.set(client);
            story.createdByUser.set(user);
        });
    });
};

export const updateStory = async (
    database: Database,
    id: string,
    payload: ISuccessStoryPayload,
    photoUri?: string
): Promise<void> => {
    await database.write(async () => {
        const record = await database.get<SuccessStory>(modelName.success_stories).find(id);
        await record.update((story) => {
            applyPayload(story, payload);
            if (photoUri !== undefined) {
                story.photo = photoUri;
            }
        });
    });
};
