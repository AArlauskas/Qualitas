import React, { Component } from 'react';
import ProjectsTemplates from '../../Components/ProjectsTemplates/ProjectsTemplates';
import { FetchProjectToEdit, FetchTemplatesList, AddToProjectTemplate, RemoveFromProjectTemplate } from '../../API/API';

class ProjectsTemplatesDisplay extends Component {
    state = {
        project: [],
        templates: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/projecttemplates/")[1];
        FetchProjectToEdit(id).then(response => this.setState({ project: response }));
        FetchTemplatesList().then(response => this.setState({ templates: response }));
    }
    render() {

        return (
            <div>
                {this.state.project.length === 0 || this.state.templates.length === 0 ? null :
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