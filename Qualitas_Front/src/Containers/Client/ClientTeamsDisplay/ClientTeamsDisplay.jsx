import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchClientTeamsList } from '../../../Actions/TeamsListActions';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';
import ClientTeamsList from '../../../Components/Client/ClientTeamsList/ClientTeamsList';

let date = new Date();
class ClientTeamsDisplay extends Component {
    state = {
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
    }
    componentDidMount() {
        let id = window.localStorage.getItem("id");
        this.props.fetchTeamsList(id, this.state.minDate, this.state.maxDate);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.minDate !== this.state.minDate || prevState.maxDate !== this.state.maxDate) {
            let id = window.localStorage.getItem("id");
            this.props.fetchTeamsList(id, this.state.minDate, this.state.maxDate);
        }
    }
    render() {
        return (
            <div>
                {this.props.teamsList.length === 0 ? <LoadingScreen /> :
                    <ClientTeamsList
                        teams={this.props.teamsList} />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    teamsList: state.Teams
});

const mapDispatchToProps = (dispatch) => ({
    fetchTeamsList: (start, end) => dispatch(fetchClientTeamsList(id, start, end)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientTeamsDisplay);