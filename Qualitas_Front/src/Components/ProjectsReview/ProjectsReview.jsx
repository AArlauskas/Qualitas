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

const UsersScore = (user) => {
    let score = 0;
    let points = 0;
    user.Evaluations.forEach(evaluation => evaluation.Topics.forEach(topic => topic.Criteria.forEach(criteria => {
        score += criteria.score;
        points += criteria.points;
    })));

    let average = Math.trunc((score / points) * 100);
    if (isNaN(average)) {
        average = 0;
    }
    return average;
}

class ProjectsReview extends Component {
    state = {
        columns: [
            {
                title: "Name", field: "name", render: rowData => rowData.firstname + " " + rowData.lastname
            },
            {
                title: "Team", field: "team", render: rowData => rowData.Team === null ? "" : <a href={"/teamDetails/" + rowData.Team.id}>{rowData.Team.name}</a>
            },
            {
                title: "Score", field: "score", render: rowData => UsersScore(rowData) + "%"
            },
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
                <div>
                    {console.log(this.props)}
                    <MaterialTable
                        title="Project's users"
                        columns={this.state.columns}
                        icons={tableIcons}
                        data={this.props.users}
                        options={{
                            filtering: true,
                            actionsColumnIndex: -1,
                            pageSize: 10
                        }}
                        onRowClick={(event, rowData, togglePanel) => window.location.href = "/userDetails/" + rowData.id} />
                </div>
            </div>
        );
    }
}

export default ProjectsReview;