/**
 * Success Story types & local storage helpers.
 *
 * Once a backend endpoint exists, replace the localStorage helpers with
 * apiFetch calls – the interface stays the same.
 */

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
    /** UUID generated client-side until the backend assigns real IDs */
    id: string;
    client_id: string;
    /** user id of the worker who wrote this story */
    created_by_user_id: string;
    created_at: number; // epoch ms
    updated_at: number;

    /* ---- case study header fields ---- */
    written_by_name: string;
    beneficiary_age: number | "";
    beneficiary_gender: string;
    hcr_status: string; // "Host Community" | "Refugee"
    refugee_origin: string; // where they are from (if refugee)
    refugee_duration: string; // how long in Uganda (if refugee)
    diagnosis: string;
    treatment_service: string;

    /* ---- narrative sections ---- */
    part1_background: string;
    part2_challenge: string;
    part3_introduction: string;
    part4_action: string;
    part5_impact: string;

    /* ---- photo (base-64 data-url stored for now) ---- */
    photo: string;

    /* ---- meta ---- */
    publish_permission: PublishPermission;
    status: StoryStatus;
    date: string; // ISO date string
}

/* ---------- local-storage helpers ---------- */

const STORAGE_KEY = "cbr_success_stories";

const readAll = (): ISuccessStory[] => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
        return [];
    }
};

const writeAll = (stories: ISuccessStory[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
};

export const getAllStories = (): ISuccessStory[] => readAll();

export const getStoriesForClient = (clientId: string): ISuccessStory[] =>
    readAll().filter((s) => s.client_id === clientId);

export const getStoryById = (id: string): ISuccessStory | undefined =>
    readAll().find((s) => s.id === id);

export const saveStory = (story: ISuccessStory): void => {
    const all = readAll();
    const idx = all.findIndex((s) => s.id === story.id);
    if (idx >= 0) {
        all[idx] = story;
    } else {
        all.push(story);
    }
    writeAll(all);
};

export const deleteStory = (id: string): void => {
    writeAll(readAll().filter((s) => s.id !== id));
};

export const generateStoryId = (): string =>
    `story-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/* ---------- mock data for development ---------- */

const MOCK_SEEDED_KEY = "cbr_success_stories_mock_seeded";

export const seedMockStories = (clientId: string): void => {
    const seededKey = `${MOCK_SEEDED_KEY}_${clientId}`;
    if (localStorage.getItem(seededKey)) return; // already seeded for this client

    const now = Date.now();
    const day = 86_400_000;

    const mockStories: ISuccessStory[] = [
        {
            id: `mock-story-1-${clientId}`,
            client_id: clientId,
            created_by_user_id: "mock-user-1",
            created_at: now - 30 * day,
            updated_at: now - 28 * day,
            written_by_name: "Sarah Nakamya",
            beneficiary_age: 34,
            beneficiary_gender: "F",
            hcr_status: "Refugee",
            refugee_origin: "Democratic Republic of Congo",
            refugee_duration: "3 years",
            diagnosis: "Lower limb disability following polio",
            treatment_service: "Wheelchair provision and physiotherapy",
            part1_background:
                "Amina is a 34-year-old mother of four who fled the DRC three years ago due to armed conflict in her village. She now lives in Bidi Bidi settlement with her children and elderly mother. Before the conflict, she was a market trader.",
            part2_challenge:
                "After contracting polio as a child, Amina has had limited mobility in both legs. In the refugee settlement, she struggled to access water points and the health centre. Her children often missed school to help her with daily tasks. She felt isolated and depressed, unable to contribute to her family's wellbeing.",
            part3_introduction:
                "A community health worker referred Amina to our team after noticing she had difficulty moving around the settlement. Our CBR worker visited her at home to assess her needs.",
            part4_action:
                "Our team provided Amina with a wheelchair suited to the rough terrain of the settlement. We also arranged weekly physiotherapy sessions to strengthen her upper body. Beyond the clinical support, we connected her with a women's savings group and helped her set up a small tailoring business from home.",
            part5_impact:
                "Amina can now move independently around the settlement. Her children are back in school full-time. Through her tailoring business, she earns enough to cover her family's basic needs. She says she feels like herself again — a provider, a mother, and a valued member of her community.",
            photo: "",
            publish_permission: PublishPermission.YES,
            status: StoryStatus.READY,
            date: new Date(now - 30 * day).toISOString().slice(0, 10),
        },
        {
            id: `mock-story-2-${clientId}`,
            client_id: clientId,
            created_by_user_id: "mock-user-2",
            created_at: now - 10 * day,
            updated_at: now - 10 * day,
            written_by_name: "James Okello",
            beneficiary_age: 12,
            beneficiary_gender: "M",
            hcr_status: "Host Community",
            refugee_origin: "",
            refugee_duration: "",
            diagnosis: "Cerebral palsy",
            treatment_service: "Physiotherapy and educational support",
            part1_background:
                "David is a 12-year-old boy living with his grandmother in a small village outside Juba. His parents passed away when he was young, and his grandmother has been his sole caregiver.",
            part2_challenge:
                "David was unable to attend school due to his condition. Other children in the village often excluded him from activities. His grandmother worried constantly about his future and felt helpless watching him sit alone at home every day.",
            part3_introduction:
                "A neighbor told David's grandmother about our community rehabilitation services. She brought David to our outreach clinic during a village visit.",
            part4_action:
                "We started David on a regular physiotherapy programme and provided assistive devices to help him sit and move more comfortably. We worked with the local school to make their classroom more accessible and trained the teachers on inclusive education practices.",
            part5_impact:
                "David now attends school three days a week and is making friends for the first time. His grandmother says he smiles more and is eager to learn. The school has become a model for inclusion in the district.",
            photo: "",
            publish_permission: PublishPermission.ANONYMOUS,
            status: StoryStatus.WORK_IN_PROGRESS,
            date: new Date(now - 10 * day).toISOString().slice(0, 10),
        },
    ];

    const existing = readAll();
    writeAll([...existing, ...mockStories]);
    localStorage.setItem(seededKey, "true");
};
