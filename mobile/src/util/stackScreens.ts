import HomeScreen from "../screens/HomeScreen/HomeScreen";
import BaseSurvey from "../screens/BaseSurvey/BaseSurvey";
import ClientDetails from "../screens/ClientDetails/ClientDetails";

//Stack screens coming up from here on

export enum StackScreenName {
    HOME = "Home",
    CLIENT = "ClientDetails",
    BASELINE = "BaselineSurvey",
}

export const stackScreenProps = {
    [StackScreenName.HOME]: HomeScreen,
    [StackScreenName.CLIENT]: ClientDetails,
    [StackScreenName.BASELINE]: BaseSurvey,
};

export type stackParamList = {
    [StackScreenName.HOME]: undefined;
    [StackScreenName.CLIENT]: {
        clientID: number;
    };
};
