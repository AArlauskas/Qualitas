import React, { Component } from 'react';
import ClientUsersDetails from '../../../Components/Client/ClientUsersDetails/ClientUsersDetails';
import { Button } from '@material-ui/core';
import { connect } from "react-redux";
import { fetchClientUsersEvaluations } from '../../../Actions/UserEvaluationListActions';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';

class ClientUsersDetailsDisplay extends Component {
    state = {
        User: [],
        overallScore: null
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/userdetails/")[1];
        this.props.fetchUsersEvaluations(id);
    }

    changeOverallScore = (score) => {
        this.setState({ overallScore: score });
        console.log("got here");
    }
    render() {
        return (
            <div>
                {console.log(this.props.evaluations)}
                {this.props.evaluations.length === 0 ? <LoadingScreen /> :
                    <div>
                        <div style={{ textAlign: "center" }}>
                            <h3>User: {this.props.evaluations.firstname + " " + this.props.evaluations.lastname}</h3>
                            {this.state.overallScore === null ? null : <h3>Overall score: {this.state.overallScore}%</h3>}
                            {this.props.evaluations.teamName === null ? null : <h3>Team: {this.props.evaluations.teamName}</h3>}
                        </div>
                        <div style={{ marginTop: 20, marginBottom: 100 }}>
                            <Button disabled={!this.props.evaluations.valid} color="primary" variant="outlined" href={"/newCase/" + window.location.href.toLowerCase().split("/userdetails/")[1]} style={{ marginBottom: 10 }}>Evaluate case</Button>
                            <ClientUsersDetails
                                evaluations={this.props.evaluations}
                                changeScore={(score) => this.changeOverallScore(score)} />
                        </div>
                    </div>}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    evaluations: state.Evaluations
});

const mapDispatchToProps = (dispatch) => ({
    fetchUsersEvaluations: (id) => dispatch(fetchClientUsersEvaluations(id, window.localStorage.getItem("projectId"))),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientUsersDetailsDisplay);