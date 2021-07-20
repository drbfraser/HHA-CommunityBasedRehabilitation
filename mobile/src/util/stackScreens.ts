import HomeScreen from "../screens/HomeScreen/HomeScreen";
import BaseSurvey from "../screens/BaseSurvey/BaseSurvey";
import ClientDetails from "../screens/ClientDetails/ClientDetails";
import NewReferral from "../screens/NewReferral/NewReferral";

//Stack screens coming up from here on

export enum StackScreenName {
    HOME = "Home",
    CLIENT = "ClientDetails",
    BASELINE = "BaselineSurvey",
    REFERRAL = "NewReferral",
}

export const stackScreenProps = {
    [StackScreenName.HOME]: HomeScreen,
    [StackScreenName.CLIENT]: ClientDetails,
    [StackScreenName.BASELINE]: BaseSurvey,
    [StackScreenName.REFERRAL]: NewReferral,
};

export type stackParamList = {
    [StackScreenName.HOME]: undefined;
    [StackScreenName.CLIENT]: {
        clientID: number;
    };
    [StackScreenName.BASELINE]: {
        clientID: number;
    };
    [StackScreenName.REFERRAL]: {
        clientID: number;
    };
};
