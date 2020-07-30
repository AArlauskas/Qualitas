import React, { Component } from 'react';
import TeamMembers from '../../Components/TeamMembers/TeamMembers';
import { AddToTeam, RemoveFromTeam, FetchTeamsUsers, FetchUsersForTeamSimple } from '../../API/API';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

class TeamMembersDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            team: []
        };
    }

    componentDidMount() {
        let teamId = window.location.href.toLowerCase().split("/teammembers/")[1];
        FetchUsersForTeamSimple(teamId).then(response => this.setState({ users: response }));
        FetchTeamsUsers(teamId).then(response => this.setState({ team: response }));
    }

    render() {
        return (
            <div>
                {console.log(this.state)}
                {this.state.users.length !== 0 && this.state.team.id !== undefined ?
                    < TeamMembers
                        users={this.state.users}
                        team={this.state.team}
                        addTeamMembers={addTeamMembers}
                        removeTeamMembers={removeTeamMembers} /> : <LoadingScreen />}
            </div>
        );
    }
}

const addTeamMembers = async (id, data) => {
    await AddToTeam(id, data);
}

const removeTeamMembers = async (id, data) => {
    await RemoveFromTeam(id, data);
}

export default TeamMembersDisplay;