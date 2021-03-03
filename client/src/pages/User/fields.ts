// Field for data get and post connected with database
export interface IUser {
    id: number;
    zone: number;
    first_name: string;
    last_name: string;
    username: string;
    phone_number: string;
}
export enum UserField {
    username = "username",
    userID = "id",
    firstName = "firstName",
    lastName = "lastName",
    zone = "zone",
    phoneNumber = "phoneNumber",
}
