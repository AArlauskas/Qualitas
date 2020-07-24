import React, { Component } from 'react';
import TeamsProjects from '../../Components/TeamsProjects/TeamsProjects';
import { FetchProjectsList, GetTeam, AddToTeamProjects, RemoveFromTeamProjects } from '../../API/API';

class TeamsProjectsDisplay extends Component {
    state = {
        team: [],
        projects: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/teamprojects/")[1];
        FetchProjectsList().then(response => this.setState({ projects: response }));
        GetTeam(id).then(response => this.setState({ team: response }));
    }
    render() {
        return (
            <div>
                {this.state.projects.length === 0 || this.state.team.length === 0 ?
                    <p>labas</p> : <TeamsProjects
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