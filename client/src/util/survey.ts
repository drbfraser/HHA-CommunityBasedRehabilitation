export enum RateLevel {
    POOR = "POOR",
    VERY_POOR = "VERY_POOR",
    FINE = "FINE",
    GOOD = "GOOD",
}

export enum DeviceType {
    WHEELCHAIR = "WHEELCHAIR",
    PROSTHETIC = "PROSTHETIC",
    ORTHOTIC = "ORTHEOTIC",
    CRUTCH = "CRUTCH",
    WALKING_STICK = "WALKING_STICK",
    HEARING_AID = "HEARING_AID",
    GLASSES = "GLASSES",
    STANDING_FRAME = "STANDING_FRAME",
    CORNER_SEAT = "CORNER_SEAT",
}

export enum ReasonNotSchool {
    LACK_OF_FUNDING = "LACK_OF_FUNDING",
    MY_DISABILITY_STOPS_ME = "MY_DISABILITY_STOPS_ME",
    OTHER = "OTHER",
}

export enum Grade {
    P1 = "P1",
    P2 = "P2",
    P3 = "P3",
    P4 = "P4",
    P5 = "P5",
    P6 = "P6",
    P7 = "P7",
    S1 = "S1",
    S2 = "S2",
    S3 = "S3",
    S4 = "S4",
    S5 = "S5",
    S6 = "S6",
}

export enum ChildNourish {
    MALNOURISHED = "MALNOURISHED",
    UNDERNOURISHED = "UNDERNOURISHED",
    WELL_NOURISHED = "WELL_NOURISHED",
}

export enum IsSelfEmployed {
    EMPLOYED = "EMPLOYED",
    SELFEMPLOYED = "SELFEMPLOYED",
}
export interface IRateLevel {
    name: string;
    level: number;
}

export const rateLevel = {
    [RateLevel.VERY_POOR]: {
        name: "Very poor",
        level: 1,
    },
    [RateLevel.POOR]: {
        name: "Poor",
        level: 2,
    },
    [RateLevel.FINE]: {
        name: "Fine",
        level: 3,
    },
    [RateLevel.GOOD]: {
        name: "Good",
        level: 4,
    },
};
export const deviceTypes = {
    [DeviceType.WHEELCHAIR]: "Wheelchair",
    [DeviceType.PROSTHETIC]: "Prosthetic",
    [DeviceType.ORTHOTIC]: "Orthotic",
    [DeviceType.CRUTCH]: "Crutch",
    [DeviceType.WALKING_STICK]: "Walking Stick",
    [DeviceType.HEARING_AID]: "Hearing Aid",
    [DeviceType.GLASSES]: "Glasses",
    [DeviceType.STANDING_FRAME]: "Standing Frame",
    [DeviceType.CORNER_SEAT]: "Corner Seat",
};
export const reasonNotSchool = {
    [ReasonNotSchool.LACK_OF_FUNDING]: "Lack of funding",
    [ReasonNotSchool.MY_DISABILITY_STOPS_ME]: "My disability stops me",
    [ReasonNotSchool.OTHER]: "Other",
};

export const childNourish = {
    [ChildNourish.MALNOURISHED]: "Malnourished",
    [ChildNourish.UNDERNOURISHED]: "Undernourished",
    [ChildNourish.WELL_NOURISHED]: "Well nourished",
};

export const isSelfEmployed = {
    [IsSelfEmployed.EMPLOYED]: "Employed",
    [IsSelfEmployed.SELFEMPLOYED]: "Self Employed",
};

export const grade = {
    [Grade.P1]: "Primary 1",
    [Grade.P2]: "Primary 2",
    [Grade.P3]: "Primary 3",
    [Grade.P4]: "Primary 4",
    [Grade.P5]: "Primary 5",
    [Grade.P6]: "Primary 6",
    [Grade.P7]: "Primary 7",
    [Grade.S1]: "Secondary 1",
    [Grade.S2]: "Secondary 2",
    [Grade.S3]: "Secondary 3",
    [Grade.S4]: "Secondary 4",
    [Grade.S5]: "Secondary 5",
    [Grade.S6]: "Secondary 6",
};
