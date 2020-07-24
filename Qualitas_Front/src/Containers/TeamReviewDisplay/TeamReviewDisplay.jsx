import React, { Component } from 'react';
import TeamReviewList from '../../Components/TeamReviewList/TeamReviewList';
import { FetchTeam } from '../../API/API';

class TeamReviewDisplay extends Component {
    state = {
        Team: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/teamdetails/")[1];
        FetchTeam(id).then(response => this.setState({ Team: response }));
    }
    render() {
        return (
            <div>
                {console.log(this.state.Team)}
                {this.state.Team.length === 0 ? null :
                    <div>
                        <div style={{ textAlign: "center" }}>
                            <h2>Team: {this.state.Team.name}</h2>
                            <h2>Users: {this.state.Team.Users.length}</h2>
                            <h2>Projects: {this.state.Team.Projects.length}</h2>
                        </div>
                        <div>
                            <TeamReviewList
                                users={this.state.Team.Users} />
                        </div>
                    </div>}
            </div>
        );
    }
}

export default TeamReviewDisplay;