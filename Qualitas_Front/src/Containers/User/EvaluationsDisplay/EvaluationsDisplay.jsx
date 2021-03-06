import React, { Component } from 'react';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';
import UserEvaluationsList from '../../../Components/User/UserEvaluationsList/UserEvaluationsList';
import { FetchUserToReview } from '../../../API/API';

let date = new Date();
class EvaluationsDisplay extends Component {
    state = {
        User: null,
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
    }
    componentDidMount() {
        let id;
        if (this.props.match !== undefined) {
            id = this.props.match.params.id;
        }
        else {
            id = window.localStorage.getItem("id");
        }
        FetchUserToReview(id, this.state.minDate, this.state.maxDate).then(response => this.setState({ User: response }));
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.minDate !== this.state.minDate || prevState.maxDate !== this.state.maxDate) {
            let id;
            if (this.props.match !== undefined) {
                id = this.props.match.params.id;
            }
            else {
                id = window.localStorage.getItem("id");
            }
            FetchUserToReview(id, this.state.minDate, this.state.maxDate).then(response => this.setState({ User: response }));
        }
    }

    calculateOverallScore = () => {
        let score = 0;
        let points = 0;
        this.state.User.Evaluations.forEach(evaluation => {
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
                {console.log(this.state.User)}
                {this.state.User === null ? <LoadingScreen /> :
                    <div>
                        <div style={{ textAlign: "center" }}>
                            <h3 style={{ color: "#F2F5F9" }}>User: {this.state.User.firstname + " " + this.state.User.lastname}</h3>
                            <h3 style={{ color: "#F2F5F9" }}>Assigned projects: {this.state.User.projectCount}</h3>
                            <h3 style={{ color: "#F2F5F9" }}>Overall score: {this.calculateOverallScore()}%</h3>
                            {this.state.User.teamName === null ? null :
                                <div style={{ display: "inline" }}>
                                    <h3 style={{ display: "inline", marginRight: 10, color: "#F2F5F9" }}>Team: {this.state.User.teamName}</h3>
                                    <h3 style={{ display: "inline", marginRight: 10, color: "#F2F5F9" }}>Members: {this.state.User.teamUsersCount}</h3>
                                    <h3 style={{ display: "inline", marginRight: 10, color: "#F2F5F9" }}>Rating: {this.state.User.rating + " / " + this.state.User.teamUsersCount}</h3>
                                </div>}
                        </div>
                        <div>
                            <UserEvaluationsList
                                evaluations={this.state.User.Evaluations}
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

export default EvaluationsDisplay;