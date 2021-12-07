import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon";
import HomeIcon from "@material-ui/icons/Home";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import InboxIcon from "@material-ui/icons/Inbox";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import InsertChart from "@material-ui/icons/InsertChart";
import Logout from "pages/Logout/Logout";
import AdminList from "pages/AdminList/AdminList";
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
import ClientRiskHistory from "pages/ClientDetails/RiskHistory/ClientRiskHistory";
import Dashboard from "pages/Dashboard/Dashboard";
import NewVisit from "pages/NewVisit/NewVisit";
import NewReferral from "pages/NewReferral/NewReferral";
import Stats from "pages/Stats/Stats";
import { IUser, UserRole } from "@cbr/common/util/users";
import { APILoadError, TAPILoadError } from "@cbr/common/util/endpoints";
import UserChangePassword from "pages/User/UserPasswordEdit";
import NewSurvey from "pages/BaseSurvey/BaseSurvey";

export interface IPage {
    path: string;
    exact?: boolean;
    name: string;
    roles?: UserRole[];
    Component: React.ComponentType<any>;
    showInNav: boolean;
    Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

const pages: IPage[] = [
    {
        path: "/dashboard",
        name: "Dashboard",
        Component: Dashboard,
        showInNav: true,
        Icon: HomeIcon,
    },
    {
        path: "/clients/new",
        name: "New Client",
        showInNav: true,
        Component: ClientForm,
        Icon: AddCircleIcon,
    },
    {
        path: "/clients",
        name: "Client List",
        Component: ClientList,
        showInNav: true,
        Icon: FormatListBulletedIcon,
    },
    {
        path: "/client/:clientId",
        name: "Client Details",
        Component: ClientDetails,
        showInNav: false,
    },
    {
        path: "/client/:clientId/risks",
        name: "Client Risk History",
        Component: ClientRiskHistory,
        showInNav: false,
    },
    {
        path: "/client/:clientId/visits/new",
        name: "Add a Visit",
        Component: NewVisit,
        showInNav: false,
    },
    {
        path: "/client/:clientId/surveys/new",
        name: "Add a survey",
        Component: NewSurvey,
        showInNav: false,
    },
    {
        path: "/client/:clientId/referrals/new",
        name: "Add a Referral",
        Component: NewReferral,
        showInNav: false,
    },
    {
        path: "/user",
        name: "Profile",
        Component: UserView,
        showInNav: true,
        Icon: PersonIcon,
    },
    {
        path: "/user/password",
        name: "Change Password",
        Component: UserChangePassword,
        showInNav: false,
    },
    {
        path: "/stats",
        name: "Stats",
        roles: [UserRole.ADMIN],
        Component: Stats,
        showInNav: true,
        Icon: InsertChart,
    },
    {
        path: "/admin",
        name: "Admin",
        roles: [UserRole.ADMIN],
        Component: AdminList,
        showInNav: true,
        Icon: SettingsIcon,
    },
    {
        path: "/admin/new",
        name: "New User",
        roles: [UserRole.ADMIN],
        Component: AdminNew,
        showInNav: false,
    },
    {
        path: "/admin/view/:userId",
        name: "View User",
        roles: [UserRole.ADMIN],
        Component: AdminView,
        showInNav: false,
    },
    {
        path: "/admin/edit/:userId",
        name: "Edit User",
        roles: [UserRole.ADMIN],
        Component: AdminEdit,
        showInNav: false,
    },
    {
        path: "/admin/password/:userId",
        name: "Edit User Password",
        Component: AdminPasswordEdit,
        showInNav: false,
    },
    {
        path: "/logout",
        name: "Logout",
        Component: Logout,
        showInNav: false,
    },
    {
        path: "/alerts/new",
        name: "New Alert",
        roles: [UserRole.ADMIN],
        showInNav: true,
        Component: AlertForm,
        Icon: AddAlertIcon,
    },
    {
        path: "/alerts/inbox",
        name: "Inbox",
        showInNav: true,
        Component: AlertInbox,
        Icon: InboxIcon,
    },
    // must be at the bottom
    {
        path: "/",
        exact: false,
        name: "Not Found",
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
