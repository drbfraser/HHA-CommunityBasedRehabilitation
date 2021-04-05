import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon";
import HomeIcon from "@material-ui/icons/Home";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Logout from "pages/Logout/Logout";
import AdminList from "pages/AdminList/AdminList";
import ClientList from "pages/ClientList/ClientList";
import ClientDetails from "pages/ClientDetails/ClientDetails";
import UserView from "pages/User/UserView";
import ClientForm from "pages/NewClient/ClientForm";
import NotFound from "pages/NotFound/NotFound";
import AdminNew from "pages/Admin/AdminNew";
import AdminView from "pages/Admin/AdminView";
import AdminEdit from "pages/Admin/AdminEdit";
import ClientRiskHistory from "pages/ClientDetails/RiskHistory/ClientRiskHistory";
import Dashboard from "pages/Dashboard/Dashboard";
import NewVisit from "pages/NewVisit/NewVisit";
import { IUser, UserRole } from "./users";
import { APILoadError, TAPILoadError } from "./endpoints";
import NewSurvey from "pages/ClientDetails/BaseSurvey/ClientBaseSurvey";

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
        path: "/user",
        name: "Profile",
        Component: UserView,
        showInNav: true,
        Icon: PersonIcon,
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
        path: "/logout",
        name: "Logout",
        Component: Logout,
        showInNav: true,
        Icon: ExitToAppIcon,
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

// TODO: change back to pages[0] once dashboard is finished
export const defaultPagePath = pages[2].path;
