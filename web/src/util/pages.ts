import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";
import HomeIcon from "@mui/icons-material/Home";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import InboxIcon from "@mui/icons-material/Inbox";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import InsertChart from "@mui/icons-material/InsertChart";
import Logout from "pages/Logout/Logout";
import AdminPage from "pages/Admin/AdminPage";
import ClientList from "pages/ClientList/ClientList";
import ClientDetails from "pages/ClientDetails/ClientDetails";
import UserView from "pages/User/UserView";
import AlertForm from "pages/NewAlert/AlertForm";
import AlertInbox from "pages/AlertInbox/AlertInbox";
import ClientForm from "pages/NewClient/ClientForm";
import NotFound from "pages/NotFound/NotFound";
import AdminNew from "pages/Admin/AdminNew";
import AdminView from "pages/Admin/AdminView";
import AdminEdit from "pages/Admin/AdminEdit";
import AdminPasswordEdit from "pages/Admin/AdminPasswordEdit";
import ZoneNew from "pages/Zone/ZoneNew";
import ZoneEdit from "pages/Zone/ZoneEdit";
import ClientRiskHistory from "pages/ClientDetails/RiskHistory/ClientRiskHistory";
import Dashboard from "pages/Dashboard/Dashboard";
import NewVisit from "pages/NewVisit/NewVisit";
import NewReferral from "pages/NewReferral/NewReferral";
import Stats from "pages/Stats/Stats";
import { IUser, UserRole } from "@cbr/common/util/users";
import { APILoadError, TAPILoadError } from "@cbr/common/util/endpoints";
import UserChangePassword from "pages/User/UserPasswordEdit";
import NewSurvey from "pages/BaseSurvey/BaseSurvey";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import Referrals from "pages/Referrals/Referrals";

export enum PageName {
    DASHBOARD = "general.dashboard",
    NEW_CLIENT = "clientAttr.newClient",
    CLIENTS = "screenNames.clientList",
    CLIENT_DETAILS = "clientAttr.clientDetails",
    CLIENT_RISK_HISTORY = "screenNames.clientRiskHistory",
    // TODO: change this after new translations are added
    // Should be: screenNames.referrals
    REFERRALS = "screenNames.clientList",
    NEW_VISIT = "screenNames.newVisit",
    NEW_SURVEY = "screenNames.newBaselineSurvey",
    NEW_REFERRAL = "screenNames.newReferral",
    PROFILE = "screenNames.profile",
    CHANGE_PASSWORD = "login.changePassword",
    STATS = "statistics.statistics",
    ADMIN = "users.admin",
    NEW_USER = "screenNames.newUser",
    EDIT_USER = "screenNames.viewUser",
    VIEW_USER = "screenNames.editUser",
    EDIT_USER_PASS = "screenNames.editUserPass",
    NEW_ZONE = "screenNames.newZone",
    EDIT_ZONE = "screenNames.editZone",
    LOGOUT = "login.logout",
    NEW_ALERT = "screenNames.newAlert",
    INBOX = "screenNames.inbox",
    NOT_FOUND = "screenNames.notFound",
}

export interface IPage {
    path: string;
    exact?: boolean;
    name: PageName;
    roles?: UserRole[];
    Component: React.ComponentType<any>;
    showInNav: boolean;
    Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

const pages: IPage[] = [
    {
        path: "/dashboard",
        name: PageName.DASHBOARD,
        Component: Dashboard,
        showInNav: true,
        Icon: HomeIcon,
    },
    {
        path: "/clients/new",
        name: PageName.NEW_CLIENT,
        showInNav: true,
        Component: ClientForm,
        Icon: AddCircleIcon,
    },
    {
        path: "/clients",
        name: PageName.CLIENTS,
        Component: ClientList,
        showInNav: true,
        Icon: FormatListBulletedIcon,
    },
    {
        path: "/client/:clientId",
        name: PageName.CLIENT_DETAILS,
        Component: ClientDetails,
        showInNav: false,
    },
    {
        path: "/client/:clientId/risks",
        name: PageName.CLIENT_RISK_HISTORY,
        Component: ClientRiskHistory,
        showInNav: false,
    },
    {
        path: "/client/:clientId/visits/new",
        name: PageName.NEW_VISIT,
        Component: NewVisit,
        showInNav: false,
    },
    {
        path: "/client/:clientId/surveys/new",
        name: PageName.NEW_SURVEY,
        Component: NewSurvey,
        showInNav: false,
    },
    {
        path: "/client/:clientId/referrals/new",
        name: PageName.NEW_REFERRAL,
        Component: NewReferral,
        showInNav: false,
    },
    {
        path: "/referrals",
        name: PageName.REFERRALS,
        Component: Referrals,
        showInNav: true,
        Icon: WorkHistoryIcon,
    },
    {
        path: "/user",
        name: PageName.PROFILE,
        Component: UserView,
        showInNav: true,
        Icon: PersonIcon,
    },
    {
        path: "/user/password",
        name: PageName.CHANGE_PASSWORD,
        Component: UserChangePassword,
        showInNav: false,
    },
    {
        path: "/stats",
        name: PageName.STATS,
        roles: [UserRole.ADMIN],
        Component: Stats,
        showInNav: true,
        Icon: InsertChart,
    },
    {
        path: "/admin",
        name: PageName.ADMIN,
        roles: [UserRole.ADMIN],
        Component: AdminPage,
        showInNav: true,
        Icon: SettingsIcon,
    },
    {
        path: "/admin/new",
        name: PageName.NEW_USER,
        roles: [UserRole.ADMIN],
        Component: AdminNew,
        showInNav: false,
    },
    {
        path: "/admin/view/:userId",
        name: PageName.VIEW_USER,
        roles: [UserRole.ADMIN],
        Component: AdminView,
        showInNav: false,
    },
    {
        path: "/admin/edit/:userId",
        name: PageName.EDIT_USER,
        roles: [UserRole.ADMIN],
        Component: AdminEdit,
        showInNav: false,
    },
    {
        path: "/admin/password/:userId",
        name: PageName.EDIT_USER_PASS,
        Component: AdminPasswordEdit,
        showInNav: false,
    },
    {
        path: "/zone/new",
        name: PageName.NEW_ZONE,
        roles: [UserRole.ADMIN],
        Component: ZoneNew,
        showInNav: false,
    },
    {
        path: "/zone/edit/:zone_name",
        name: PageName.EDIT_ZONE,
        roles: [UserRole.ADMIN],
        Component: ZoneEdit,
        showInNav: false,
    },
    {
        path: "/logout",
        name: PageName.LOGOUT,
        Component: Logout,
        showInNav: false,
    },
    {
        path: "/alerts/new",
        name: PageName.NEW_ALERT,
        roles: [UserRole.ADMIN],
        showInNav: true,
        Component: AlertForm,
        Icon: AddAlertIcon,
    },
    {
        path: "/alerts/inbox",
        name: PageName.INBOX,
        showInNav: true,
        Component: AlertInbox,
        Icon: InboxIcon,
    },
    // must be at the bottom
    {
        path: "/",
        exact: false,
        name: PageName.NOT_FOUND,
        Component: NotFound,
        showInNav: false,
    },
];

export const pagesForUser = (user: IUser | TAPILoadError | undefined) => {
    return pages.filter((page) => {
        if (!page.roles) {
            return true;
        }
        if (!user || user === APILoadError) {
            return false;
        }

        return page.roles.includes(user.role);
    });
};

export const defaultPagePath = pages[0].path;
