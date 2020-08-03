import React, { Component, forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import ArchiveIcon from '@material-ui/icons/Archive';
import WorkIcon from '@material-ui/icons/Work';
import { TextField } from '@material-ui/core';
import MaterialTable, { MTableToolbar } from 'material-table';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    Archive: forwardRef((props, ref) => <ArchiveIcon {...props} ref={ref} />)
};

class UserListTable extends Component {
    state = {}

    componentDidMount() {
        let columns = [
            {
                title: "Role", field: "role", lookup: {
                    "admin": "Admin",
                    "user": "User",
                    "client": "Client"
                }
            },
            { title: "Username", field: "username" },
            {
                title: "Password", field: "password", filtering: false, render: rowData => {
                    let password = "";
                    for (var i = 0; i < rowData.password.length; i++) {
                        password = password.concat("•");
                    }
                    return password;
                },
                editComponent: props => (
                    <TextField type="password" value={props.value} onChange={e => props.onChange(e.target.value)} />
                )
            },
            { title: 'Name', field: 'firstname' },
            {
                title: 'Surname', field: 'lastname',
            },
            {
                title: "Team", field: "team",
                render: rowData => rowData.teamName === null ? "" : <a href={"/teamDetails/" + rowData.teamId}>{rowData.teamName} </a>,
                customFilterAndSearch: (term, rowData) => rowData.teamName === null ? false : rowData.teamName.toLowerCase().startsWith(term.toLowerCase())
            },
            {
                editable: "never", title: "Score", field: "score", render: rowData => rowData.role === "user" ? isNaN(Math.trunc((rowData.score / rowData.points) * 100)) ? "0%" : Math.trunc((rowData.score / rowData.points) * 100) + "%" : null,
                customFilterAndSearch: (term, rowData) => Math.trunc((rowData.score / rowData.points) * 100) === parseInt(term)
            },
            {
                title: "Evaluated cases", field: "caseCount", customFilterAndSearch: (term, rowData) => rowData.caseCount === parseInt(term), editable: "never",
                render: rowData => rowData.role === "user" ? rowData.caseCount : null
            }
        ];

        this.setState({
            columns
        })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.minDate !== this.props.minDate || prevProps.maxDate !== this.props.maxDate) {
            this.forceUpdate();
        }
    }

    render() {
        return (
            <div style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10 }}>
                {console.log(this.props.userData)}
                <MaterialTable
                    options={{
                        filtering: true,
                        actionsColumnIndex: -1,
                        pageSize: 10
                    }}
                    icons={tableIcons}
                    title="Accounts"
                    columns={this.state.columns}
                    data={this.props.userData.filter(user => user.isArchived === false)}
                    actions={[
                        {
                            icon: () => <WorkIcon />,
                            tooltip: "Projects",
                            onClick: (event, rowData) => {
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve();
                                        window.location.href = "/UsersProjects/" + rowData.id
                                    }, 600);
                                })
                            },
                        },
                        {
                            icon: () => <ArchiveIcon />,
                            tooltip: "Archive",
                            onClick: (event, rowData) => {
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve();
                                        this.props.archiveUser(rowData);
                                    }, 600);
                                })
                            }
                        }]}
                    editable={{
                        isEditable: rowData => rowData.role === "user",
                        onRowAdd: (newData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    if (newData.firstname === "" || newData.lastname === "" ||
                                        newData.role === "" || newData.username === "" ||
                                        newData.password === "") {
                                        return;
                                    }
                                    let newUser = {
                                        id: this.props.userData.length,
                                        role: newData.role,
                                        firstname: newData.firstname,
                                        lastname: newData.lastname,
                                        username: newData.username,
                                        password: newData.password,
                                        isArchived: false,
                                        user: newData.firstname,
                                        pass: newData.lastname,
                                        teamId: parseInt(newData.teamId)
                                    }
                                    this.props.addUser(newUser)
                                }, 600);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    if (newData.firstname === "" || newData.lastname === "" ||
                                        newData.role === "" || newData.username === "" ||
                                        newData.password === "") {
                                        return;
                                    }
                                    if (oldData) {
                                        newData.teamId = parseInt(newData.teamId);
                                        this.props.updateUser(newData);
                                    }
                                }, 600);
                            }),
                    }}
                    components={{
                        Toolbar: props => (
                            <div>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <MTableToolbar {...props} />
                                    <div style={{ marginLeft: 10 }}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="yyyy-MM-dd"
                                            margin="normal"
                                            label="Start date"
                                            value={this.props.minDate}
                                            maxDate={this.state.maxDate}
                                            onChange={e => this.props.setMinDate(e)}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                        <KeyboardDatePicker
                                            style={{ marginLeft: 10 }}
                                            disableToolbar
                                            variant="inline"
                                            format="yyyy-MM-dd"
                                            margin="normal"
                                            label="End date"
                                            value={this.props.maxDate}
                                            minDate={this.props.minDate}
                                            maxDate={new Date()}
                                            onChange={e => this.props.setMaxDate(e)}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </div>
                                </MuiPickersUtilsProvider>
                            </div>

                        ),
                    }}
                    onRowClick={(event, rowData, togglePanel) => rowData.role === "user" ? window.location.href = "/userDetails/" + rowData.id : null}
                />
            </div>
        );
    }
}

export default UserListTable;