import React, { Component } from 'react';
import { connect } from "react-redux";
import ClientUserReview from '../../../Components/Client/ClientUserReview/ClientUserReview';
import { fetchProjectUsersEvaluations } from '../../../Actions/UserEvaluationListActions';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';

let date = new Date();
class ClientUserReviewDisplay extends Component {
    state = {
        User: [],
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
    }

    componentDidMount() {
        let userId = this.props.match.params.userId;
        let projectId = this.props.match.params.projectId;
        this.props.fetchProjectUsersEvaluations(userId, projectId, this.state.minDate, this.state.maxDate);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.minDate !== this.state.minDate || prevState.maxDate !== this.state.maxDate) {
            let userId = this.props.match.params.userId;
            let projectId = this.props.match.params.projectId;
            this.props.fetchProjectUsersEvaluations(userId, projectId, this.state.minDate, this.state.maxDate);
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
                            <h3>User: {this.props.evaluations.firstname + " " + this.props.evaluations.lastname}</h3>
                            <h3>Overall score: {this.calculateOverallScore()}%</h3>
                        </div>
                        <div style={{ marginTop: 20, marginBottom: 100 }}>
                            <ClientUserReview
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
    fetchProjectUsersEvaluations: (userId, projectId, start, end) => dispatch(fetchProjectUsersEvaluations(userId, projectId, start, end)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientUserReviewDisplay);