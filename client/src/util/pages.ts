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
import ClientRiskHistory from "pages/ClientRiskHistory/ClientRiskHistory";
import NewVisit from "pages/NewVisit/NewVisit";
import Dashboard from "pages/Dashboard/Dashboard";

export interface IPage {
    path: string;
    exact?: boolean;
    name: string;
    Component: React.ComponentType<any>;
    showInNav: boolean;
    Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export const pages: IPage[] = [
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
        path: "/user",
        name: "Profile",
        Component: UserView,
        showInNav: true,
        Icon: PersonIcon,
    },
    {
        path: "/admin",
        name: "Admin",
        Component: AdminList,
        showInNav: true,
        Icon: SettingsIcon,
    },
    {
        path: "/admin/new",
        name: "New User",
        Component: AdminNew,
        showInNav: false,
    },
    {
        path: "/admin/view/:userId",
        name: "View User",
        Component: AdminView,
        showInNav: false,
    },
    {
        path: "/admin/edit/:userId",
        name: "Edit User",
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

// TODO: change back to pages[0] once dashboard is finished
export const defaultPage = pages[2];
