export enum RateLevel {
    VERY_POOR = "VP",
    POOR = "P",
    FINE = "F",
    GOOD = "G",
}

export enum DeviceType {
    WHEELCHAIR = "WC",
    PROSTHETIC = "PR",
    ORTHOTIC = "OR",
    CRUTCH = "CR",
    WALKING_STICK = "WS",
    HEARING_AID = "HA",
    GLASSES = "GL",
    STANDING_FRAME = "SF",
    CORNER_SEAT = "CS",
}

export enum ReasonNotSchool {
    LACK_OF_FUNDING = "LF",
    MY_DISABILITY_STOPS_ME = "D",
    OTHER = "O",
}

export enum Grade {
    P1 = 1,
    P2 = 2,
    P3 = 3,
    P4 = 4,
    P5 = 5,
    P6 = 6,
    P7 = 7,
    S1 = 8,
    S2 = 9,
    S3 = 10,
    S4 = 11,
    S5 = 12,
    S6 = 13,
}

export enum ChildNourish {
    MALNOURISHED = "M",
    UNDERNOURISHED = "U",
    WELL_NOURISHED = "W",
}

export enum IsSelfEmployed {
    EMPLOYED = "EMPL",
    SELFEMPLOYED = "SEMPL",
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
    [ChildNourish.WELL_NOURISHED]: "Well-nourished",
};

export const isSelfEmployed = {
    [IsSelfEmployed.EMPLOYED]: "Employed",
    [IsSelfEmployed.SELFEMPLOYED]: "Self-employed",
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
