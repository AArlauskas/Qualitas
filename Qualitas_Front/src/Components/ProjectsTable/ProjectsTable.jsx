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
import DashboardIcon from '@material-ui/icons/Dashboard';
import { Chip } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

class ProjectsTable extends Component {
    state = {}

    componentDidMount() {
        let columns = [
            {
                title: "Project name",
                field: "name",
                customFilterAndSearch: (term, rowData) => rowData.name.toLowerCase().startsWith(term.toLowerCase()),
                validate: rowData => {
                    if (rowData.name === "" || rowData.name === undefined) {
                        return {
                            isValid: false,
                            helperText: "Name must not be empty"
                        };
                    }
                    // else if (this.props.projects.some(project => project.name === rowData.name)) {
                    //     return {
                    //         isValid: false,
                    //         helperText: "Names must be unique"
                    //     };
                    // }
                    else return true;
                }
            },
            {
                editable: "never",
                title: "Templates",
                field: "templates",
                render: rowData => <div>{rowData.templates.map(template => <Chip style={{ marginRight: 2, marginTop: 2, backgroundColor: "rgba(218, 161, 160, 0.5)" }} key={template.id}
                    label={template.name}
                    onClick={() => window.location.href = "/EditTemplate/" + template.id} />)}</div>,
                customFilterAndSearch: (term, rowData) => rowData.templates.some(template => template.name.toLowerCase().startsWith(term.toLowerCase()))
            },
            // {
            //     editable: "never",
            //     title: "Teams",
            //     field: "teams",
            //     render: rowData => <div>{rowData.teams.map(team => <Chip style={{ marginRight: 2, marginTop: 2 }} key={team.id}
            //         label={team.name}
            //         onClick={() => window.location.href = "/TeamDetails/" + team.id} />)}</div>,
            //     customFilterAndSearch: (term, rowData) => rowData.teams.some(team => team.name.toLowerCase().startsWith(term.toLowerCase()))
            // },
            {
                editable: "never", title: "Score", field: "score", render: rowData => isNaN(Math.round((rowData.score / rowData.points) * 10000) / 100) ? "0%" : Math.round((rowData.score / rowData.points) * 10000) / 100 + "%",
                customFilterAndSearch: (term, rowData) => Math.round((rowData.score / rowData.points) * 10000) / 100 === parseInt(term)
            },
            {
                title: "Evaluated cases", field: "caseCount", customFilterAndSearch: (term, rowData) => rowData.caseCount === parseInt(term), editable: "never"
            }
        ];
        this.setState({ columns: columns, open: false })
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
                {console.log(this.props.projects)}
                <MaterialTable
                    options={{
                        addRowPosition: "first",
                        filtering: true,
                        actionsColumnIndex: -1,
                        pageSize: 10
                    }}
                    icons={tableIcons}
                    title="Projects"
                    columns={this.state.columns}
                    data={this.props.projects}
                    actions={[
                        {
                            icon: () => <DashboardIcon />,
                            tooltip: "Manage templates",
                            onClick: (event, rowData) => {
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve();
                                        window.location.href = "/ProjectTemplates/" + rowData.id
                                    }, 600);
                                })
                            }
                        },
                        // {
                        //     icon: () => <GroupWorkIcon />,
                        //     tooltip: "Manage teams",
                        //     onClick: (event, rowData) => {
                        //         new Promise((resolve) => {
                        //             setTimeout(() => {
                        //                 resolve();
                        //                 window.location.href = "/ProjectTeams/" + rowData.id
                        //             }, 600);
                        //         })
                        //     }
                        // },

                        {
                            icon: () => <GroupAddIcon />,
                            tooltip: "Manage users",
                            onClick: (event, rowData) => {
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve();
                                        window.location.href = "/ProjectDetails/" + rowData.id
                                    }, 600);
                                })
                            }
                        }
                    ]}
                    editable={{
                        onRowAdd: (newData) =>
                            new Promise((resolve) => {
                                console.log("helloui")
                                setTimeout(() => {
                                    resolve();
                                    this.props.addProject(newData);
                                }, 600);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    if (oldData) {
                                        this.props.updateProject(newData);
                                    }
                                }, 600);
                            }),
                        onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    this.props.deleteProject(oldData);
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
                    onRowClick={(event, rowData, togglePanel) => event.target.tagName === "SPAN" ? null : window.location.href = "/projectReview/" + rowData.id}
                />
            </div>
        );
    }
}

export default ProjectsTable;