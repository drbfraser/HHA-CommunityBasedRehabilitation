export interface IAlert {
    id: number;
    Subject: String;
    Priority: PriorityLevel;
    Body: String;
}

export enum PriorityLevel {
    LOW = "L",
    MEDIUM = "M",
    HIGH = "H",
}

export interface IAlertModel {
  id: string;
  subject: string;
  priority: PriorityLevel;
  alert_message: string;
  unread_by_users: string;
  created_by_user: string;
  created_date: string;
}

/*
  This class will be used later, when improving the namings
*/
