import React, { Component } from 'react';
import UsersProjects from '../../Components/UsersProjects/UsersProjects';
import { FetchUserForProjects, AddProjectToUser, RemoveProjectFromUser, FetchProjectsSimple, AddToProjectClient, RemoveFromProjectClient } from '../../API/API';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

class UsersProjectsDisplay extends Component {
    state = {
        user: [],
        projects: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/usersprojects/")[1];
        FetchProjectsSimple().then(response => this.setState({ projects: response }));
        FetchUserForProjects(id).then(response => this.setState({ user: response }));
    }
    render() {
        return (
            <div>
                {this.state.user.length === 0 || this.state.projects.length === 0 ? <LoadingScreen /> :
                    <UsersProjects
                        isClient={this.state.user.role === "client"}
                        projects={this.state.projects}
                        user={this.state.user}
                        addProjectToUser={addProjectToUser}
                        removeProjectFromUser={removeProjectFromUser} />}
            </div>
        );
    }
}

const addProjectToUser = async (id, data, isClient) => {
    if (isClient) {
        await AddToProjectClient(id, data);
    }
    else {
        await AddProjectToUser(id, data);
    }

}

const removeProjectFromUser = async (id, data, isClient) => {
    if (isClient) {
        await RemoveFromProjectClient(id, data);
    }
    else {
        await RemoveProjectFromUser(id, data);
    }

}

export default UsersProjectsDisplay;