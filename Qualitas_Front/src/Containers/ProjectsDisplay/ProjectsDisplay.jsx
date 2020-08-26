import React, { Component } from 'react';
import { connect } from "react-redux";
import ProjectsTable from "../../Components/ProjectsTable/ProjectsTable";
import { fetchProjects, changeProjectName, deleteProject, addProject } from '../../Actions/ProjectsTableActions';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

let date = new Date();
class ProjectsDisplay extends Component {
    state = {
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
    }
    componentDidMount() {
        this.props.fetchProjects(this.state.minDate, this.state.maxDate);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.minDate !== this.state.minDate || prevState.maxDate !== this.state.maxDate) {
            this.props.fetchProjects(this.state.minDate, this.state.maxDate);
        }
    }
    render() {

        return (
            <div>
                {this.props.projects === null ? <LoadingScreen /> :
                    <ProjectsTable
                        projects={this.props.projects}
                        addProject={this.props.addProject}
                        updateProject={this.props.updateProject}
                        deleteProject={this.props.deleteProject}
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        setMinDate={(date) => this.setState({ minDate: date })}
                        setMaxDate={(date) => this.setState({ maxDate: date })}
                    />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    projects: state.Projects,
    templateNames: state.Templates
});

const mapDispatchToProps = (dispatch) => ({
    fetchProjects: (start, end) => dispatch(fetchProjects(start, end)),
    addProject: (data) => dispatch(addProject(data)),
    updateProject: (data) => dispatch(changeProjectName(data)),
    deleteProject: (data) => dispatch(deleteProject(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsDisplay);