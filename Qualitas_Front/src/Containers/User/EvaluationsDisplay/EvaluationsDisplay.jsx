import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchUsersEvaluations, deleteEvaluation } from '../../../Actions/UserEvaluationListActions';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';
import UserEvaluationsList from '../../../Components/User/UserEvaluationsList/UserEvaluationsList';

class EvaluationsDisplay extends Component {
    state = {
        User: []
    }
    componentDidMount() {
        let id = window.localStorage.getItem("id");
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
                    <div style={{ textAlign: "center" }}>
                        <h3>User: {this.props.evaluations.firstname + " " + this.props.evaluations.lastname}</h3>
                        <h3>Assigned projects: {this.props.evaluations.projectCount}</h3>
                        <h3>Overall score: {this.OverallScore()}%</h3>
                        {this.props.evaluations.teamName === null ? null : <h3>Team: {this.props.evaluations.teamName}</h3>}
                        <div>
                            <UserEvaluationsList
                                evaluations={this.props.evaluations} />
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

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationsDisplay);