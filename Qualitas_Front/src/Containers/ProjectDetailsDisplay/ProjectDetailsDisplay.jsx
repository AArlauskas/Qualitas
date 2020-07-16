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
        let AllUsers = fetchAllUsers();
        return (
            <div>
                {ProjectUsers === undefined || AllUsers === undefined ? null :
                    <ProjectDetails
                        project={project}
                        projectUsers={ProjectUsers}
                        allUsers={AllUsers} />}
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
            firstname: user.firstname,
            lastname: user.lastname
        });

    });
    return ProjectUsers;
}

const fetchAllUsers = () => {
    let AllUsers = [];
    users.filter(user => user.role === "user").forEach(user => {
        AllUsers.push({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname
        });
    });
    return AllUsers;
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetailsDisplay);