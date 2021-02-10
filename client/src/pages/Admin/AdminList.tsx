import { useStyles } from "./AdminList.styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { DataGrid, ColDef, DensityTypes } from '@material-ui/data-grid';
import { useHistory } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';

const columns: ColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 300,
    },
    { 
        field: 'name', 
        headerName: 'Name', 
        width: 300
    },
    { 
        field: 'type', 
        headerName: 'Type', 
        width: 300 
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 300,
    },
  ];
  
  const rows = [
    {id: 10000001, name: "Liam", type: "Admin", status: "Active"},
    {id: 10000002, name: "Olivia", type: "Admin", status: "Active"},
    {id: 10000003, name: "Noah", type: "Worker", status: "Active"},
    {id: 10000004, name: "Emma", type: "Admin", status: "Active"},
    {id: 10000005, name: "Oliver", type: "Worker", status: "Active"},
    {id: 10000006, name: "Ava", type: "Admin", status: "Active"},
    {id: 10000007, name: "William", type: "Admin", status: "Active"},
    {id: 10000008, name: "James", type: "Admin", status: "Active"},
    {id: 10000009, name: "Charlotte", type: "Admin", status: "Active"},
    {id: 10000010, name: "Mia", type: "Admin", status: "Active"},
    {id: 10000011, name: "Benjamin", type: "Admin", status: "Active"},
  ];

const AdminList = (props: any) => {
    const styles = useStyles();
    const history = useHistory();
    const onRowClick = () => history.push("/clients/new");
    const onIconClick = () => history.push("/clients/new");
    
    return (
        <>
            <div className = {styles.container}>
                <div className = {styles.wrapper}>
                    <IconButton onClick={onIconClick}>                      
                        <PersonAddIcon/>
                    </IconButton>
                    <form noValidate autoComplete="off">
                        <TextField 
                            id="outlined-basic" 
                            label="Search" 
                            variant="outlined" 
                            InputProps={
                                {
                                    endAdornment: 
                                    <InputAdornment position="end">
                                        <SearchIcon>
                                        </SearchIcon>
                                    </InputAdornment>,
                                }
                            }
                        />
                    </form>
                </div>
                <br />
                <br />
                <br />
                    <DataGrid 
                        className = {styles.datagrid}
                        rows={rows} 
                        columns={columns} 
                        density={DensityTypes.Comfortable}
                        onRowClick={onRowClick}
                        hideFooter
                    />
            </div>
        </>
    )
}

export default AdminList;
 