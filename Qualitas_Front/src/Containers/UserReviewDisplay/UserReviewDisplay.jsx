import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { connect } from "react-redux";
import { fetchUsersEvaluations, deleteEvaluation } from '../../Actions/UserEvaluationListActions';
import UsersEvaluationsList from '../../Components/UsersEvaluationsList/UsersEvaluationsList';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

class UserReviewDisplay extends Component {
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
                {this.props.evaluations.length === 0 ? <LoadingScreen /> :
                    <div>
                        <div style={{ textAlign: "center" }}>
                            <h3>User: {this.props.evaluations.firstname + " " + this.props.evaluations.lastname}</h3>
                            <h3>Assigned projects: {this.props.evaluations.projectCount}</h3>
                            {this.state.overallScore === null ? null : <h3>Overall score: {this.state.overallScore}%</h3>}
                            {this.props.evaluations.teamName === null ? null : <h3>Team: {this.props.evaluations.teamName}</h3>}
                        </div>
                        <div style={{ marginTop: 20, marginBottom: 100 }}>
                            <Button disabled={!this.props.evaluations.valid} color="primary" variant="outlined" href={"/newCase/" + window.location.href.toLowerCase().split("/userdetails/")[1]} style={{ marginBottom: 10 }}>Evaluate case</Button>
                            <UsersEvaluationsList
                                evaluations={this.props.evaluations}
                                deleteEvaluation={this.props.deleteEvaluation}
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
    fetchUsersEvaluations: (id) => dispatch(fetchUsersEvaluations(id)),
    deleteEvaluation: (id) => dispatch(deleteEvaluation(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserReviewDisplay);