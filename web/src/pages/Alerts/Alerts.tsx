import { useStyles } from "./styles";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import {
    DataGrid,
    DensityTypes,
    RowsProp,
    GridOverlay,
    ValueFormatterParams,
} from "@material-ui/data-grid";
import {
    LinearProgress,
    IconButton,
    Typography,
    Select,
    MenuItem,
    Popover,
    Switch,
} from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { useDataGridStyles } from "styles/DataGrid.styles";
import { Cancel } from "@material-ui/icons";
import { useHideColumnsStyles } from "styles/HideColumns.styles";
import { useHistory } from "react-router-dom";

const RenderText = (params: ValueFormatterParams) => {
    return <Typography variant={"body2"}>{params.value}</Typography>;
};

const RenderLoadingOverlay = () => {
    return (
        <GridOverlay>
            <div style={{ position: "absolute", top: 0, width: "100%" }}>
                <LinearProgress />
            </div>
        </GridOverlay>
    );
};

const RenderNoRowsOverlay = () => {
    const styles = useDataGridStyles();

    return (
        <GridOverlay className={styles.noRows}>
            <Cancel color="primary" className={styles.noRowsIcon} />
            <Typography color="primary">No Users Found</Typography>
        </GridOverlay>
    );
};

const AdminList = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [isTitleHidden, setTitleHidden] = useState<boolean>(false);
    const [isMessageHidden, setMessageHidden] = useState<boolean>(false);

    const [filteredRows, setFilteredRows] = useState<RowsProp>([]);
    const [optionsAnchorEl, setOptionsAnchorEl] = useState<Element | null>(null);
    const isOptionsOpen = Boolean(optionsAnchorEl);

    const styles = useStyles();
    const dataGridStyle = useDataGridStyles();
    const hideColumnsStyle = useHideColumnsStyles();
    const history = useHistory();

    const onAddClick = () => history.push("/alert/new");

    const onOptionsClose = () => setOptionsAnchorEl(null);

    const columns = [
        {
            field: "title",
            headerName: "Title",
            flex: 0.55,
            renderCell: RenderText,
            hide: isTitleHidden,
            hideFunction: setTitleHidden,
        },
        {
            field: "message",
            headerName: "Message",
            flex: 1,
            renderCell: RenderText,
            hide: isMessageHidden,
            hideFunction: setMessageHidden,
        },
    ];

    const initialDataLoaded = useRef(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            // await data here
            setLoading(false);
            initialDataLoaded.current = true;
        };
        loadInitialData();
    }, []);

    return (
        <div className={styles.container}>
            <div>
                <IconButton onClick={onAddClick}>
                    <PersonAddIcon />
                </IconButton>
                <Popover
                    open={isOptionsOpen}
                    anchorEl={optionsAnchorEl}
                    onClose={onOptionsClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                >
                    <div className={hideColumnsStyle.optionsContainer}>
                        {columns.map((column): JSX.Element => {
                            return (
                                <div key={column.field} className={hideColumnsStyle.optionsRow}>
                                    <Typography component={"span"} variant={"body2"}>
                                        {column.headerName}
                                    </Typography>
                                    <Switch
                                        checked={!column.hide}
                                        onClick={() => column.hideFunction(!column.hide)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </Popover>
            </div>
            <div>
                <DataGrid
                    className={dataGridStyle.datagrid}
                    loading={loading}
                    components={{
                        LoadingOverlay: RenderLoadingOverlay,
                        NoRowsOverlay: RenderNoRowsOverlay,
                    }}
                    rows={filteredRows}
                    columns={columns}
                    density={DensityTypes.Comfortable}
                    // onRowClick={onRowClick}
                    pagination
                />
            </div>
        </div>
    );
};

export default AdminList;
