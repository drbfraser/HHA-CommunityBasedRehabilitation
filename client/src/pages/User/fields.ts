// Field for data get and post connected with database
export enum UserField {
    username = "username",
    userID = "id",
    firstName = "firstName",
    lastName = "lastName",
    zone = "zone",
    phoneNumber = "phoneNumber",
}

export const initialValues = {
    [UserField.username]: "Username",
    [UserField.userID]: "11111111",
    [UserField.firstName]: "First Name",
    [UserField.lastName]: "Last Name",
    [UserField.zone]: "1",
    [UserField.phoneNumber]: "(XXX) XXX-XXXX",
};
