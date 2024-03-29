import React, { Component } from 'react';
import ProjectsTemplates from '../../Components/ProjectsTemplates/ProjectsTemplates';
import { FetchProjectTemplates, FetchTemplatesList, AddToProjectTemplate, RemoveFromProjectTemplate } from '../../API/API';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

class ProjectsTemplatesDisplay extends Component {
    state = {
        project: null,
        templates: null
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/projecttemplates/")[1];
        FetchProjectTemplates(id).then(response => this.setState({ project: response }));
        FetchTemplatesList().then(response => this.setState({ templates: response }));
    }
    render() {

        return (
            <div>
                {this.state.project === null || this.state.templates === null ? <LoadingScreen /> :
                    <ProjectsTemplates
                        project={this.state.project}
                        templates={this.state.templates}
                        addTemplate={addTemplate}
                        removeTemplate={removeTemplate} />}
            </div>
        );
    }
}

const addTemplate = async (id, data) => {
    await AddToProjectTemplate(id, data);
}

const removeTemplate = async (id, data) => {
    await RemoveFromProjectTemplate(id, data);
}

export default ProjectsTemplatesDisplay;