import React, { Component } from 'react';
import { connect } from "react-redux";
import ProjectsTable from "../../Components/ProjectsTable/ProjectsTable";
import { fetchProjects, changeProjectName, deleteProject, addProject } from '../../Actions/ProjectsTableActions';


class ProjectsDisplay extends Component {
    state = {}
    componentDidMount() {
        this.props.fetchProjects();
        //this.props.fetchTemplateNames()
    }
    render() {

        return (
            <div>
                <ProjectsTable
                    projects={this.props.projects}
                    addProject={this.props.addProject}
                    updateProject={this.props.updateProject}
                    deleteProject={this.props.deleteProject}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    projects: state.Projects,
    templateNames: state.Templates
});

const mapDispatchToProps = (dispatch) => ({
    fetchProjects: () => dispatch(fetchProjects()),
    addProject: (data) => dispatch(addProject(data)),
    updateProject: (data) => dispatch(changeProjectName(data)),
    deleteProject: (data) => dispatch(deleteProject(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsDisplay);