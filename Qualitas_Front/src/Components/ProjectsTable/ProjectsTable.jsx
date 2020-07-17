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
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { Chip } from '@material-ui/core';

class ProjectsTable extends Component {
    state = {}

    componentDidMount() {
        let columns = [
            { title: "Project name", field: "name", },
            {
                editable: "never",
                title: "Templates",
                field: "templates",
                render: rowData => <div>{rowData.templates.map(template => <Chip key={template.id}
                    label={template.name}
                    onClick={() => window.location.href = "/EditTemplate/" + template.id} />)}</div>,
            },
            {
                editable: "never",
                title: "Teams",
                field: "teams",
                render: rowData => <div>{rowData.teams.map(team => <Chip key={team.id}
                    label={team.name}
                    onClick={() => window.location.href = "/TeamMembers/" + team.id} />)}</div>,
            }
        ];
        this.setState({ columns: columns })
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
            <div style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10 }}>
                <MaterialTable
                    options={{
                        filtering: true,
                        actionsColumnIndex: -1,
                        pageSize: 10
                    }}
                    icons={tableIcons}
                    title="Projects"
                    columns={this.state.columns}
                    data={this.props.projects}
                    actions={[{
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
                    }]}
                    editable={{
                        onRowAdd: (newData) =>
                            new Promise((resolve) => {
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
                />
            </div>
        );
    }
}

export default ProjectsTable;