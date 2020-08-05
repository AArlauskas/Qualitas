import React, { Component } from 'react';
import ClientUsersList from '../../../Components/Client/ClientUsersList/ClientUsersList';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';
import { FetchProjectToReview } from '../../../API/API';

let date = new Date();
class ClientUsersDisplay extends Component {
    state = {
        Project: [],
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
    }
    componentDidMount() {
        let id = window.localStorage.getItem("projectId");
        FetchProjectToReview(id, this.state.minDate, this.state.maxDate).then(response => this.setState({ Project: response }))
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.minDate !== this.state.minDate || prevState.maxDate !== this.state.maxDate) {
            let id = window.localStorage.getItem("projectId");
            FetchProjectToReview(id, this.state.minDate, this.state.maxDate).then(response => this.setState({ Project: response }))
        }
    }
    calculateOverallScore = () => {
        let score = 0;
        let points = 0;
        this.state.Project.Users.forEach(evaluation => {
            score += evaluation.score;
            points += evaluation.points;
        });

        let average = Math.trunc((score / points) * 100);
        if (isNaN(average)) {
            average = 0;
        }
        return average;
    }
    render() {
        return (
            <div>
                {this.state.Project.length === 0 ? <LoadingScreen /> : <div>
                    <div style={{ textAlign: "center" }}>
                        <h2>Project's name: {this.state.Project.name}</h2>
                        <h2>Overall score: {this.calculateOverallScore()}%</h2>
                    </div>
                    <div>
                        <ClientUsersList
                            users={this.state.Project.Users}
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

export default ClientUsersDisplay;