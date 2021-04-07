export enum RateLevel {
    POOR = "POOR",
    VERYPOOR = "VERYPOOR",
    FINE = "FINE",
    GOOD = "GOOD",
}

export enum DeviceType {
    WHEELCHAIR = "WHEELCHAIR",
    PROSTHETIC = "PROSTHETIC",
    ORTHOTIC = "ORTHEOTIC",
    CRUTCH = "CRUTCH",
    WALKINGSTICK = "WALKINGSTICK",
    HEARINGAID = "HEARINGAID",
    GLASSES = "GLASSES",
    STANDINGFRAME = "STANDINGFRAME",
    CORNERSEAT = "CORNERSEAT",
}

export enum ReasonNotSchool {
    LACKOFFUNDING = "LACKOFFUNDING",
    MYDISABILITYSTOPSME = "MYDISABILITYSTOPSME",
    OTHER = "OTHER",
}

export enum GRADE {
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
    WELLNOURISHED = "WELLNOURISHED",
}

export enum IsSelfEmployed {
    EMPLOYED = "POOR",
    SELFEMPLOYED = "SELFEMPLOYED",
}
export interface IRateLevel {
    name: string;
    level: number;
}

export const rateLevel = {
    [RateLevel.VERYPOOR]: {
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
export const deviceType = {
    [DeviceType.WHEELCHAIR]: {
        name: "Wheelchair",
    },
    [DeviceType.PROSTHETIC]: {
        name: "Prosthetic",
    },
    [DeviceType.ORTHOTIC]: {
        name: "Orthotic",
    },
    [DeviceType.CRUTCH]: {
        name: "Crutch",
    },
    [DeviceType.WALKINGSTICK]: {
        name: "Walking Stick",
    },
    [DeviceType.HEARINGAID]: {
        name: "Hearing Aid",
    },
    [DeviceType.GLASSES]: {
        name: "Glasses",
    },
    [DeviceType.STANDINGFRAME]: {
        name: "Standing Frame",
    },
    [DeviceType.CORNERSEAT]: {
        name: "Corner Seat",
    },
};
export const reasonNotSchool = {
    [ReasonNotSchool.LACKOFFUNDING]: {
        name: "Lack of funding",
    },
    [ReasonNotSchool.MYDISABILITYSTOPSME]: {
        name: "My disability stops me",
    },
    [ReasonNotSchool.OTHER]: {
        name: "Other",
    },
};

export const childNourish = {
    [ChildNourish.MALNOURISHED]: {
        name: "Malnourished",
    },
    [ChildNourish.UNDERNOURISHED]: {
        name: "Undernourished",
    },
    [ChildNourish.WELLNOURISHED]: {
        name: "Well nourished",
    },
};

export const isSelfEmployed = {
    [IsSelfEmployed.EMPLOYED]: {
        name: "Employed",
    },
    [IsSelfEmployed.SELFEMPLOYED]: {
        name: "Self Employed",
    },
};

export const grade = {
    [GRADE.P1]: {
        name: "Primary 1",
    },
    [GRADE.P2]: {
        name: "Primary 2",
    },
    [GRADE.P3]: {
        name: "Primary 3",
    },
    [GRADE.P4]: {
        name: "Primary 4",
    },
    [GRADE.P5]: {
        name: "Primary 5",
    },
    [GRADE.P6]: {
        name: "Primary 6",
    },
    [GRADE.P7]: {
        name: "Primary 7",
    },

    [GRADE.S1]: {
        name: "Secondary 1",
    },
    [GRADE.S2]: {
        name: "Secondary 2",
    },
    [GRADE.S3]: {
        name: "Secondary 3",
    },
    [GRADE.S4]: {
        name: "Secondary 4",
    },
    [GRADE.S5]: {
        name: "Secondary 5",
    },
    [GRADE.S6]: {
        name: "Secondary 6",
    },
};
