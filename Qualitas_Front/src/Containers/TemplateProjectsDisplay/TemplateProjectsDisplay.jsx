import React, { Component } from 'react';
import TemplateProjects from '../../Components/TemplateProjects/TemplateProjects';
import { FetchTemplateProjects, AddToTemplateProject, RemoveFromTemplateProject, FetchProjectsSimple } from '../../API/API';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

class TemplateProjectsDisplay extends Component {
    state = {
        projects: [],
        template: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/templateprojects/")[1];
        FetchProjectsSimple().then(response => this.setState({ projects: response }));
        FetchTemplateProjects(id).then(response => this.setState({ template: response }));
    }
    render() {
        return (
            <div>
                {this.state.projects.length === 0 || this.state.template.length === 0 ?
                    <LoadingScreen /> :
                    <TemplateProjects
                        projects={this.state.projects}
                        template={this.state.template}
                        addProjectToTemplate={addProjectToTemplate}
                        removeProjectFromTemplate={removeProjectFromTemplate} />}

            </div>
        );
    }
}


const addProjectToTemplate = async (id, data) => {
    await AddToTemplateProject(id, data);
}

const removeProjectFromTemplate = async (id, data) => {
    await RemoveFromTemplateProject(id, data);
}

export default TemplateProjectsDisplay;