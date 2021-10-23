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