import React, { Component } from 'react';
import TeamReviewList from '../../Components/TeamReviewList/TeamReviewList';
import { FetchTeamToReview } from '../../API/API';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

let date = new Date();
class TeamReviewDisplay extends Component {
    state = {
        Team: null,
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/teamdetails/")[1];
        FetchTeamToReview(id, this.state.minDate, this.state.maxDate).then(response => this.setState({ Team: response }));
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.minDate !== this.state.minDate || prevState.maxDate !== this.state.maxDate) {
            let id = window.location.href.toLowerCase().split("/teamdetails/")[1];
            FetchTeamToReview(id, this.state.minDate, this.state.maxDate).then(response => this.setState({ Team: response }));
        }
    }

    calculateOverallScore = () => {
        let score = 0;
        let points = 0;
        this.state.Team.Users.forEach(evaluation => {
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
                {console.log(this.state.Team)}
                {this.state.Team === null ? <LoadingScreen /> :
                    <div>
                        <div style={{ textAlign: "center" }}>
                            <h2>Team: {this.state.Team.name}</h2>
                            <h2>Users: {this.state.Team.Users.length}</h2>
                            <h2>Overall score: {this.calculateOverallScore()}%</h2>
                        </div>
                        <div>
                            <TeamReviewList
                                users={this.state.Team.Users}
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

export default TeamReviewDisplay;