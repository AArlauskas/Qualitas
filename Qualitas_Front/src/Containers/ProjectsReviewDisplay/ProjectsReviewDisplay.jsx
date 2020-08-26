import React, { Component } from 'react';
import ProjectsReview from '../../Components/ProjectsReview/ProjectsReview';
import { FetchProjectToReview } from '../../API/API';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

let date = new Date();
class ProjectsReviewDisplay extends Component {
    state = {
        Project: null,
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/projectreview/")[1];
        FetchProjectToReview(id, this.state.minDate, this.state.maxDate).then(response => this.setState({ Project: response }))
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.minDate !== this.state.minDate || prevState.maxDate !== this.state.maxDate) {
            let id = window.location.href.toLowerCase().split("/projectreview/")[1];
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

        let average = Math.round((score / points) * 10000) / 100;
        if (isNaN(average)) {
            average = 0;
        }
        return average;
    }

    render() {
        return (
            <div>
                {this.state.Project === null ? <LoadingScreen /> : <div>
                    <div style={{ textAlign: "center" }}>
                        <h2>Project's name: {this.state.Project.name}</h2>
                        <h2>Overall score: {this.calculateOverallScore()}%</h2>
                    </div>
                    <div>
                        <ProjectsReview
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

export default ProjectsReviewDisplay;