export interface IAlert {
    id: number;
    Subject: String;
    Priority: PriorityLevel;
    Body: String;
}

export enum PriorityLevel {
    LOW = "LO",
    MEDIUM = "ME",
    HIGH = "HI",
}

/*
  This class will be used later, when improving the namings
*/
