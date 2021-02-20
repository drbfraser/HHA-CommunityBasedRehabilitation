import { useStyles } from "./AdminList.styles";
import SearchBar from "components/SearchBar/SearchBar";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { DataGrid, ColDef, DensityTypes } from "@material-ui/data-grid";
// import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import { useDataGridStyles } from "styles/DataGrid.styles";
import React from "react";

const columns: ColDef[] = [
    { field: "id", headerName: "ID", flex: 0.55 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
];

const rows = [
    { id: 10000001, name: "Liam", type: "Admin", status: "Active" },
    { id: 10000002, name: "Olivia", type: "Admin", status: "Active" },
    { id: 10000003, name: "Noah", type: "Worker", status: "Active" },
    { id: 10000004, name: "Emma", type: "Admin", status: "Active" },
    { id: 10000005, name: "Oliver", type: "Worker", status: "Active" },
    { id: 10000006, name: "Ava", type: "Admin", status: "Active" },
    { id: 10000007, name: "William", type: "Admin", status: "Active" },
    { id: 10000008, name: "James", type: "Admin", status: "Active" },
    { id: 10000009, name: "Charlotte", type: "Admin", status: "Active" },
    { id: 10000010, name: "Mia", type: "Admin", status: "Active" },
    { id: 10000011, name: "Benjamin", type: "Admin", status: "Active" },
];

const AdminList = () => {
    const styles = useStyles();
    const dataGridStyle = useDataGridStyles();
    // const history = useHistory();

    // TODO: update path to go to user clicked profile page
    const onRowClick = () => alert("Functionality not yet implemented");
    // TODO: update path to create user page
    const onAddClick = () => alert("Functionality not yet implemented");

    return (
        <>
            <div className={styles.container}>
                <div className={styles.topContainer}>
                    <IconButton onClick={onAddClick} className={styles.icon}>
                        <PersonAddIcon />
                    </IconButton>
                    <SearchBar />
                </div>
                <div className={styles.dataGridWrapper}>
                    <DataGrid
                        className={dataGridStyle.datagrid}
                        rows={rows}
                        columns={columns}
                        density={DensityTypes.Comfortable}
                        onRowClick={onRowClick}
                        pagination
                    />
                </div>
            </div>
        </>
    );
};

export default AdminList;
