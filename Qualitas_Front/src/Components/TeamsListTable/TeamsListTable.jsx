import React, { Component, forwardRef } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
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
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

class TeamsListTable extends Component {
    state = {
        columns: [
            {
                title: "Name", field: "name"
            },
            // {
            //     title: "Projects", field: "projects", editable: "never",
            //     render: rowData => <div>{rowData.projects.map(project => <Chip style={{ marginRight: 2, marginTop: 2 }} key={project.id}
            //         label={project.name}
            //         onClick={() => window.location.href = "/projectReview/" + project.id} />)}</div>,
            //     customFilterAndSearch: (term, rowData) => rowData.projects.some(project => project.name.toLowerCase().startsWith(term.toLowerCase()))
            // },
            {
                title: "Number of users", field: "userCount", editable: "never"
            },
            {
                editable: "never", title: "Score", field: "score", render: rowData => isNaN(Math.trunc((rowData.score / rowData.points) * 100)) ? "0%" : Math.trunc((rowData.score / rowData.points) * 100) + "%",
                customFilterAndSearch: (term, rowData) => Math.trunc((rowData.score / rowData.points) * 100) === parseInt(term)
            },
        ]
    }

    componentDidUpdate(prevProps) {
        if (prevProps.minDate !== this.props.minDate || prevProps.maxDate !== this.props.maxDate) {
            this.forceUpdate();
        }
    }

    render() {
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
            ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
        };
        return (
            <div style={{ padding: 10 }}>
                <MaterialTable
                    columns={this.state.columns}
                    data={this.props.teamsList}
                    icons={tableIcons}
                    title="Teams"
                    options={{
                        addRowPosition: "first",
                        filtering: true,
                        actionsColumnIndex: -1,
                        pageSize: 10
                    }}
                    actions={[
                        // {
                        //     icon: () => <WorkIcon />,
                        //     tooltip: "Team projects",
                        //     onClick: (event, rowData) => {
                        //         new Promise((resolve) => {
                        //             setTimeout(() => {
                        //                 resolve();
                        //                 window.location.href = "/teamProjects/" + rowData.id
                        //             }, 600);
                        //         })
                        //     }
                        // },
                        {
                            icon: () => <GroupAddIcon />,
                            tooltip: "Team members",
                            onClick: (event, rowData) => {
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve();
                                        window.location.href = "/teamMembers/" + rowData.id
                                    }, 600);
                                })
                            }
                        }
                    ]}
                    editable={{
                        onRowAdd: (newData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    if (newData.firstname === "") {
                                        return;
                                    }
                                    this.props.createTeam(newData);
                                }, 600);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    if (newData.firstname === "") {
                                        return;
                                    }
                                    if (oldData) {
                                        this.props.updateTeam(newData);
                                    }
                                }, 600);
                            }),
                        onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    this.props.deleteTeam(oldData.id);
                                }, 600);
                            })
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
                    onRowClick={(event, rowData, togglePanel) => event.target.tagName === "SPAN" ? null : window.location.href = "/teamDetails/" + rowData.id} />
            </div>
        );
    }
}

export default TeamsListTable;