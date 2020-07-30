import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { connect } from "react-redux";
import { fetchUsersEvaluations, deleteEvaluation } from '../../Actions/UserEvaluationListActions';
import UsersEvaluationsList from '../../Components/UsersEvaluationsList/UsersEvaluationsList';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

// const OverallScore = (evaluations) => {
//     let length = evaluations.length;
//     let sum = 0;
//     evaluations.forEach(evaluation => sum = sum + evaluation.average);
//     let average = Math.trunc((sum / length) * 100);
//     return average;
// }

class UserReviewDisplay extends Component {
    state = {
        User: []
    }

    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/userdetails/")[1];
        this.props.fetchUsersEvaluations(id);
    }

    OverallScore = () => {
        let evaluations = this.props.evaluations.Evaluations;
        let sum = 0;
        evaluations.forEach(evaluation => evaluation.average === null ? null : sum += evaluation.average);
        let average = Math.trunc(sum / evaluations.length);
        if (isNaN(average)) {
            average = 0;
        }
        return average;
    }
    render() {
        return (
            <div>
                {this.props.evaluations.length === 0 ? <LoadingScreen /> :
                    <div>
                        <div style={{ textAlign: "center" }}>
                            <h3>User: {this.props.evaluations.firstname + " " + this.props.evaluations.lastname}</h3>
                            <h3>Assigned projects: {this.props.evaluations.projectCount}</h3>
                            <h3>Overall score: {this.OverallScore()}%</h3>
                            {this.props.evaluations.teamName === null ? null : <h3>Team: {this.props.evaluations.teamName}</h3>}
                        </div>
                        <div style={{ marginTop: 20, marginBottom: 100 }}>
                            <Button disabled={!this.props.evaluations.valid} color="primary" variant="outlined" href={"/newCase/" + window.location.href.toLowerCase().split("/userdetails/")[1]} style={{ marginBottom: 10 }}>Evaluate case</Button>
                            <UsersEvaluationsList
                                evaluations={this.props.evaluations}
                                deleteEvaluation={this.props.deleteEvaluation} />
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