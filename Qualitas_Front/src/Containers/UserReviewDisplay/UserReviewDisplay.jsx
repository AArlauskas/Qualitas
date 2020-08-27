import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { connect } from "react-redux";
import { fetchUsersEvaluations, deleteEvaluation } from '../../Actions/UserEvaluationListActions';
import UsersEvaluationsList from '../../Components/UsersEvaluationsList/UsersEvaluationsList';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

let date = new Date();
class UserReviewDisplay extends Component {
    state = {
        User: [],
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
    }

    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/userdetails/")[1];
        this.props.fetchUsersEvaluations(id, this.state.minDate, this.state.maxDate);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.minDate !== this.state.minDate || prevState.maxDate !== this.state.maxDate) {
            let id = window.location.href.toLowerCase().split("/userdetails/")[1];
            this.props.fetchUsersEvaluations(id, this.state.minDate, this.state.maxDate);
        }
    }

    calculateOverallScore = () => {
        let score = 0;
        let points = 0;
        this.props.evaluations.Evaluations.forEach(evaluation => {
            score += evaluation.score;
            points += evaluation.points;
        });

        let average = Math.round((score / points) * 10000) / 100;
        if (isNaN(average)) {
            average = 0;
        }
        return average;
    }

    render() {
        return (
            <div>
                {this.props.evaluations === null ? <LoadingScreen /> :
                    <div>
                        <div style={{ textAlign: "center" }}>
                            <h3 style={{ color: "#F2F5F9" }}>User: {this.props.evaluations.firstname + " " + this.props.evaluations.lastname}</h3>
                            <h3 style={{ color: "#F2F5F9" }}>Assigned projects: {this.props.evaluations.projectCount}</h3>
                            <h3 style={{ color: "#F2F5F9" }}>Overall score: {this.calculateOverallScore()}%</h3>
                            {this.props.evaluations.teamName === null ? null :
                                <div style={{ display: "inline" }}>
                                    <h3 style={{ display: "inline", marginRight: 10, color: "#F2F5F9" }}>Team: {this.props.evaluations.teamName}</h3>
                                    <h3 style={{ display: "inline", marginRight: 10, color: "#F2F5F9" }}>Members: {this.props.evaluations.teamUsersCount}</h3>
                                    <h3 style={{ display: "inline", marginRight: 10, color: "#F2F5F9" }}>Rating: {this.props.evaluations.rating + " / " + this.props.evaluations.teamUsersCount}</h3>
                                </div>}
                        </div>
                        <div style={{ marginTop: 20, marginBottom: 100 }}>
                            <Button disabled={this.props.evaluations.projectCount === 0} variant="outlined" href={"/newCase/" + window.location.href.toLowerCase().split("/userdetails/")[1]} style={{ marginBottom: 10, backgroundColor: "#DAA1A0", color: "#F2F5F9" }}>Evaluate case</Button>
                            <UsersEvaluationsList
                                evaluations={this.props.evaluations.Evaluations}
                                deleteEvaluation={this.props.deleteEvaluation}
                                minDate={this.state.minDate}
                                maxDate={this.state.maxDate}
                                setMinDate={(date) => this.setState({ minDate: date })}
                                setMaxDate={(date) => this.setState({ maxDate: date })} />
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
    fetchUsersEvaluations: (id, start, end) => dispatch(fetchUsersEvaluations(id, start, end)),
    deleteEvaluation: (id) => dispatch(deleteEvaluation(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserReviewDisplay);