import React, { Component, forwardRef } from 'react';
import MaterialTable from 'material-table';
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
        let names = this.props.teams;
        let lookup = names.reduce(function (acc, cur, i) {
            acc[cur.id] = cur.name;
            return acc;
        }, {});
        let columns = [
            {
                title: "Role", field: "role", lookup: {
                    "admin": "Admin",
                    "user": "User",
                    "client": "Client"
                }
            },
            { title: 'Name', field: 'firstname' },
            {
                title: 'Surname', field: 'lastname',
            },
            {
                title: "Team", field: "teamId",
                render: rowData => <p>{this.props.teams.find(team => rowData.teamId === team.id) === undefined ?
                    null : this.props.teams.find(team => rowData.teamId === team.id).name}</p>,
                lookup: lookup,
                filtering: false
            },
            // { title: "Projects", field: "projects", editable: "never", render: rowData => rowData.projects === [] ? "" : rowData.projects }
        ];

        this.setState({
            columns
        })
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
                    actions={[{
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
                                    let newUser = {
                                        id: this.props.userData.length,
                                        role: newData.role,
                                        firstname: newData.firstname,
                                        lastname: newData.lastname,
                                        isArchived: false,
                                        user: newData.firstname,
                                        pass: newData.lastname,
                                        teamId: newData.teamId
                                    }
                                    this.props.addUser(newUser)
                                }, 600);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    if (oldData) {
                                        this.props.updateUser(newData);
                                    }
                                }, 600);
                            }),
                    }}
                />
            </div>
        );
    }
}

export default UserListTable;