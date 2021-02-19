import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon";
import HomeIcon from "@material-ui/icons/Home";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Logout from "pages/Logout/Logout";
import ToDo from "pages/ToDo/ToDo";
import AdminList from "pages/AdminList/AdminList";
import ClientList from "pages/ClientList/ClientList";
import UserView from "pages/User/UserView";
import UserEdit from "pages/User/UserEdit";
import ClientForm from "pages/NewClient/ClientForm";
import NotFound from "pages/NotFound/NotFound";

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
        Component: ToDo,
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
        path: "/client/:client_id",
        name: "Client Details",
        Component: ToDo,
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
        path: "/user/edit",
        name: "Edit Profile",
        Component: UserEdit,
        showInNav: false,
    },
    {
        path: "/admin",
        name: "Admin",
        Component: AdminList,
        showInNav: true,
        Icon: SettingsIcon,
    },
    {
        path: "/logout",
        name: "Log out",
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
