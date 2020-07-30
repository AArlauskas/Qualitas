import React, { Component } from 'react';
import ProjectsReview from '../../Components/ProjectsReview/ProjectsReview';
import { FetchProjectToReview } from '../../API/API';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

class ProjectsReviewDisplay extends Component {
    state = {
        Project: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/projectreview/")[1];
        FetchProjectToReview(id).then(response => this.setState({ Project: response }))
    }
    render() {
        return (
            <div>
                {this.state.Project.length === 0 ? <LoadingScreen /> : <div>
                    <div style={{ textAlign: "center" }}>
                        {console.log(this.state.Project)}
                        <h2>Project's name: {this.state.Project.name}</h2>
                    </div>
                    <div>
                        <ProjectsReview
                            users={this.state.Project.Users} />
                    </div>
                </div>}
            </div>
        );
    }
}

export default ProjectsReviewDisplay;