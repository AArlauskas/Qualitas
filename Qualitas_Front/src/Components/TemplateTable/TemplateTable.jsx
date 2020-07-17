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
import WorkIcon from '@material-ui/icons/Work';
import { Chip } from '@material-ui/core';

class TemplateTable extends Component {
    state = {
        columns: [
            { title: 'Template name', field: 'name' },
            {
                title: "Projects",
                editable: "never",
                field: "projects",
                render: rowData => <div>{rowData.Projects.map(project => <Chip key={project.id}
                    label={project.name}
                    onClick={() => window.location.href = "/ProjectDetails/" + project.id} />)}</div>,

            }
        ]
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
            <div>
                {console.log(this.props.templates)}
                <MaterialTable
                    title="Templates"
                    icons={tableIcons}
                    data={this.props.templates}
                    columns={this.state.columns}
                    options={{
                        actionsColumnIndex: -1,
                        pageSize: 10
                    }}
                    actions={[
                        {
                            icon: () => <WorkIcon />,
                            tooltip: "Template projects",
                            onClick: (event, rowData) => {
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve();
                                        window.location.href = "/TemplateProjects/" + rowData.id
                                    }, 600);
                                })
                            }
                        },
                        {
                            icon: () => <Edit />,
                            tooltip: "Edit template",
                            onClick: (event, rowData) => {
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve();
                                        window.location.href = "/EditTemplate/" + rowData.id
                                    }, 600);
                                })
                            }
                        },
                    ]}
                    editable={{
                        onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    this.props.deleteTemplate(oldData.id);
                                }, 600);
                            })
                    }}
                />
            </div>
        );
    }
}

export default TemplateTable;