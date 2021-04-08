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
    [Grade.P1]: {
        name: "Primary 1",
        number: 1,
    },
    [Grade.P2]: {
        name: "Primary 2",
        number: 2,
    },
    [Grade.P3]: {
        name: "Primary 3",
        number: 3,
    },
    [Grade.P4]: {
        name: "Primary 4",
        number: 4,
    },
    [Grade.P5]: {
        name: "Primary 5",
        number: 5,
    },
    [Grade.P6]: {
        name: "Primary 6",
        number: 6,
    },
    [Grade.P7]: {
        name: "Primary 7",
        number: 7,
    },
    [Grade.S1]: {
        name: "Secondary 1",
        number: 8,
    },
    [Grade.S2]: {
        name: "Secondary 2",
        number: 9,
    },
    [Grade.S3]: {
        name: "Secondary 3",
        number: 10,
    },
    [Grade.S4]: {
        name: "Secondary 4",
        number: 11,
    },
    [Grade.S5]: {
        name: "Secondary 5",
        number: 12,
    },
    [Grade.S6]: {
        name: "Secondary 6",
        number: 13,
    },
};
