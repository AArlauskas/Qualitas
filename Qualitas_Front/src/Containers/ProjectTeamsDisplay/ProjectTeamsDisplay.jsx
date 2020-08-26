import React, { Component } from 'react';
import ProjectTeams from '../../Components/ProjectTeams/ProjectTeams';
import { FetchProjectTeams, FetchTeamsSimple, AddToProjectTeam, RemoveFromProjectTeam } from '../../API/API';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

class ProjectTeamsDisplay extends Component {
    state = {
        project: null,
        teams: null
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/projectteams/")[1];
        FetchProjectTeams(id).then(response => this.setState({ project: response }));
        FetchTeamsSimple().then(response => this.setState({ teams: response }));
    }
    render() {
        return (
            <div>
                {this.state.project === null || this.state.teams === null ? <LoadingScreen /> :
                    <ProjectTeams
                        project={this.state.project}
                        teams={this.state.teams}
                        addTeam={addTeam}
                        removeTeam={removeTeam} />}
            </div>
        );
    }
}

const addTeam = async (id, data) => {
    await AddToProjectTeam(id, data);
}

const removeTeam = async (id, data) => {
    await RemoveFromProjectTeam(id, data);
}

export default ProjectTeamsDisplay;