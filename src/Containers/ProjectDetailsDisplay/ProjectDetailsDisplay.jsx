import React, { Component } from 'react';
import ProjectDetails from '../../Components/ProjectDetails/ProjectDetails';
import { connect } from "react-redux";
import projects from '../../Constants/Projects';
import dependencies from "../../Constants/Dependencies";
import users from "../../Constants/Users";

class ProjectDetailsDisplay extends Component {
    state = {}
    render() {
        let project = fetchProject();
        let ProjectUsers = fetchProjectUsers();
        let OtherUsers = fetchOtherUsers();
        return (
            <div>
                {ProjectUsers === undefined || OtherUsers === undefined ? null :
                    <ProjectDetails
                        project={project}
                        projectUsers={ProjectUsers}
                        otherUsers={OtherUsers} />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

const fetchProject = () => {
    let id = parseInt(window.location.href.split("/ProjectDetails/")[1]);
    let project = projects.find(temp => temp.id === id);
    return project;
}

const fetchProjectUsers = () => {
    let id = parseInt(window.location.href.split("/ProjectDetails/")[1]);
    let userDependency = dependencies.filter(temp => temp.projectId === id);
    let ProjectUsers = [];
    userDependency.forEach(dep => {
        let user = users.find(temp => temp.id === dep.userId);
        ProjectUsers.push({
            id: user.id,
            name: user.firstname,
            surname: user.lastname
        });

    });
    return ProjectUsers;
}

const fetchOtherUsers = () => {
    let id = parseInt(window.location.href.split("/ProjectDetails/")[1]);
    let userDependency = dependencies.filter(temp => temp.projectId !== id);
    let OtherUsers = [];
    userDependency.forEach(dep => {
        let user = users.filter(temp => temp.role === "user").find(temp => temp.id === dep.userId);
        OtherUsers.push({
            id: user.id,
            name: user.firstname,
            surname: user.lastname
        });
    });
    return OtherUsers;
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetailsDisplay);