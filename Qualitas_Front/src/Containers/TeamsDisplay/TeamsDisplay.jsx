import React, { Component } from 'react';
import { connect } from "react-redux";
import TeamListTable from "../../Components/TeamsListTable/TeamsListTable";
import { fetchTeamsList, createTeam, updateTeam, deleteTeam } from '../../Actions/TeamsListActions';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

let date = new Date();
class TeamsDisplay extends Component {
    state = {
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
    }
    componentDidMount() {
        this.props.fetchTeamsList(this.state.minDate, this.state.maxDate);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.minDate !== this.state.minDate || prevState.maxDate !== this.state.maxDate) {
            this.props.fetchTeamsList(this.state.minDate, this.state.maxDate);
        }
    }
    render() {
        return (
            <div>
                {this.props.teamsList.length === 0 ? <LoadingScreen /> :
                    <TeamListTable
                        teamsList={this.props.teamsList}
                        createTeam={this.props.createTeam}
                        updateTeam={this.props.updateTeam}
                        deleteTeam={this.props.deleteTeam}
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        setMinDate={(date) => this.setState({ minDate: date })}
                        setMaxDate={(date) => this.setState({ maxDate: date })}
                    />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    teamsList: state.Teams
});

const mapDispatchToProps = (dispatch) => ({
    fetchTeamsList: (start, end) => dispatch(fetchTeamsList(start, end)),
    createTeam: (data) => dispatch(createTeam(data)),
    updateTeam: (data) => dispatch(updateTeam(data)),
    deleteTeam: (id) => dispatch(deleteTeam(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamsDisplay);