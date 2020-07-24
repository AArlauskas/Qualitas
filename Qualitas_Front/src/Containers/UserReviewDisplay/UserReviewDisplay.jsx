import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { connect } from "react-redux";
import { fetchUsersEvaluations, deleteEvaluation } from '../../Actions/UserEvaluationListActions';
import UsersEvaluationsList from '../../Components/UsersEvaluationsList/UsersEvaluationsList';
import { FetchUserToEdit } from '../../API/API';

const OverallScore = (evaluations) => {
    let sumOfPoints = 0;
    let sumOfScore = 0;
    evaluations.forEach(evaluation => evaluation.Topics.forEach(topic => topic.Criteria.forEach(criteria => {
        sumOfPoints = sumOfPoints + criteria.points;
        sumOfScore = sumOfScore + criteria.score;
    })));

    return Math.trunc(sumOfScore / sumOfPoints * 100);
}

class UserReviewDisplay extends Component {
    state = {
        User: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/userdetails/")[1];
        FetchUserToEdit(id).then(response => this.setState({ User: response }));
        this.props.fetchUsersEvaluations(id);
    }
    render() {
        return (
            <div>
                {this.state.User.length === 0 ? null :
                    <div>
                        <div style={{ textAlign: "center" }}>
                            {console.log(this.state.User)}
                            <h2>User: {this.state.User.firstname + " " + this.state.User.lastname}</h2>
                            <h2>Assigned projects: {this.state.User.Projects.length}</h2>
                            <h2>Overall Score: {OverallScore(this.state.User.Evaluations) + "%"}</h2>
                        </div>
                        <div style={{ marginTop: 20, marginBottom: 100 }}>
                            <Button color="primary" variant="outlined" href={"/newCase/" + window.location.href.toLowerCase().split("/userdetails/")[1]} style={{ marginBottom: 10 }}>Evaluate case</Button>
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