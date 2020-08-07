import React, { Component } from 'react';
import ClientProjectReview from '../../../Components/Client/ClientProjectReview/ClientProjectReview';
import { FetchProjectToReview } from '../../../API/API';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';

let date = new Date();
class ClientProjectReviewDisplay extends Component {
    state = {
        Project: [],
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
    }
    componentDidMount() {
        let id = this.props.match.params.id
        FetchProjectToReview(id, this.state.minDate, this.state.maxDate).then(response => this.setState({ Project: response }))
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.minDate !== this.state.minDate || prevState.maxDate !== this.state.maxDate) {
            let id = this.props.match.params.id
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
                {console.log(this.props)}
                {this.state.Project.length === 0 ? <LoadingScreen /> : <div>
                    <div style={{ textAlign: "center" }}>
                        <h2>Project's name: {this.state.Project.name}</h2>
                        <h2>Overall score: {this.calculateOverallScore()}%</h2>
                    </div>
                    <div>
                        <ClientProjectReview
                            projectId={this.state.Project.id}
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

export default ClientProjectReviewDisplay;