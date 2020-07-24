import React, { Component } from 'react';
import TeamMembers from '../../Components/TeamMembers/TeamMembers';
import { FetchUserList, GetTeam, AddToTeam, RemoveFromTeam } from '../../API/API';

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
        FetchUserList().then(response => this.setState({ users: response }));
        GetTeam(teamId).then(response => this.setState({ team: response }));
    }

    render() {
        return (
            <div>
                {this.state.users.length !== 0 && this.state.team.id !== undefined ?
                    <TeamMembers
                        users={this.state.users}
                        team={this.state.team}
                        addTeamMembers={addTeamMembers}
                        removeTeamMembers={removeTeamMembers} /> : null}
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