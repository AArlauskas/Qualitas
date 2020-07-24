import React, { Component } from 'react';
import ProjectsReview from '../../Components/ProjectsReview/ProjectsReview';
import { FetchProjectToEdit } from '../../API/API';

class ProjectsReviewDisplay extends Component {
    state = {
        Project: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/projectreview/")[1];
        FetchProjectToEdit(id).then(response => this.setState({ Project: response }))
    }
    render() {
        return (
            <div>
                {this.state.Project.length === 0 ? null : <div>
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