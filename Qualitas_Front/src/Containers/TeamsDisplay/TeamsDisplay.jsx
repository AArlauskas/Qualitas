import React, { Component } from 'react';
import { connect } from "react-redux";
import TeamListTable from "../../Components/TeamsListTable/TeamsListTable";
import { fetchTeamsList, createTeam, updateTeam, deleteTeam } from '../../Actions/TeamsListActions';

class TeamsDisplay extends Component {
    state = {}
    componentDidMount() {
        this.props.fetchTeamsList();
    }
    render() {
        return (
            <div>
                <TeamListTable
                    teamsList={this.props.teamsList}
                    createTeam={this.props.createTeam}
                    updateTeam={this.props.updateTeam}
                    deleteTeam={this.props.deleteTeam}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    teamsList: state.Teams
});

const mapDispatchToProps = (dispatch) => ({
    fetchTeamsList: () => dispatch(fetchTeamsList()),
    createTeam: (data) => dispatch(createTeam(data)),
    updateTeam: (data) => dispatch(updateTeam(data)),
    deleteTeam: (id) => dispatch(deleteTeam(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamsDisplay);