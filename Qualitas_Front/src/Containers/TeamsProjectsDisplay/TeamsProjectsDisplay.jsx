import React, { Component } from 'react';
import TeamsProjects from '../../Components/TeamsProjects/TeamsProjects';
import { AddToTeamProjects, RemoveFromTeamProjects, FetchProjectsSimple, FetchTeamsProjects } from '../../API/API';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

class TeamsProjectsDisplay extends Component {
    state = {
        team: null,
        projects: null
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/teamprojects/")[1];
        FetchProjectsSimple().then(response => this.setState({ projects: response }));
        FetchTeamsProjects(id).then(response => this.setState({ team: response }));
    }
    render() {
        return (
            <div>
                {this.state.projects === null || this.state.team === null ?
                    <LoadingScreen /> : <TeamsProjects
                        team={this.state.team}
                        projects={this.state.projects}
                        addProjects={addTeamProjects}
                        removeProjects={removeTeamProjects} />}
            </div>
        );
    }
}

const addTeamProjects = async (id, data) => {
    await AddToTeamProjects(id, data);
}

const removeTeamProjects = async (id, data) => {
    await RemoveFromTeamProjects(id, data);
}


export default TeamsProjectsDisplay;