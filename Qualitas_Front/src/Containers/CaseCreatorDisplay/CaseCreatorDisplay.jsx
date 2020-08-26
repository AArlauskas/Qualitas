import React, { Component } from 'react';
import CaseCreator from '../../Components/CaseCreator/CaseCreator';
import { CreateCase, FetchUserProjectsTemplates, FetchTemplateForCase } from '../../API/API';
import { Select } from '@material-ui/core';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

class CaseCreatorDisplay extends Component {
    state = {
        user: [],
        userId: window.location.href.toLowerCase().split("/newcase/")[1],
        projectId: undefined,
        templateId: undefined,
        template: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/newcase/")[1];
        FetchUserProjectsTemplates(id).then(response => this.setState({ user: response })).then(() => {
            this.setState({ projectId: this.state.user.Projects[0].id });
            this.setState({ templateId: this.state.user.Projects[0].EvaluationTemplates[0].id });
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.templateId !== this.state.templateId || prevState.projectId !== this.state.projectId) {
            if (this.state.templateId !== undefined) {
                FetchTemplateForCase(this.state.templateId).then(response => this.setState({ template: response }));
            }
        }
    }
    render() {
        return (
            <div>
                {console.log(this.state)}
                {this.state.user.length === 0 ? <LoadingScreen /> :
                    <div>
                        <div style={{ marginTop: 15, marginLeft: 10, textAlign: "center", marginBottom: 30 }}>
                            <Select
                                style={{ width: 300 }}
                                native
                                label="Select Project"
                                value={this.state.projectId}
                                defaultValue={this.state.user.Projects[0].id}
                                onChange={e => this.setState({ projectId: parseInt(e.target.value), templateId: this.state.user.Projects.find(temp => temp.id === parseInt(e.target.value)).EvaluationTemplates[0].id })}>
                                {this.state.user.Projects.map(project => {
                                    return <option key={project.id} value={project.id}>{project.name}</option>
                                })}
                            </Select>
                            {this.state.projectId === null || this.state.projectId === undefined ? null :
                                <Select
                                    style={{ width: 300, marginLeft: 20 }}
                                    native
                                    label="Select Template"
                                    value={this.state.templateId}
                                    defaultValue={this.state.user.Projects.find(temp => temp.id === this.state.projectId).id}
                                    onChange={e => this.setState({ templateId: parseInt(e.target.value) })}>
                                    {this.state.user.Projects.find(temp => temp.id === this.state.projectId).EvaluationTemplates.map(template => {
                                        return <option key={template.id} value={template.id}>{template.name}</option>
                                    })}
                                </Select>}
                        </div>
                        {this.state.projectId === undefined || this.state.template.length === 0 ? <LoadingScreen /> :
                            <CaseCreator
                                projectId={this.state.projectId}
                                userId={this.state.userId}
                                createCase={createCase}
                                template={this.state.template} />
                        }
                    </div>}
            </div>
        );
    }
}

const createCase = async (data) => {
    await CreateCase(data);
}

export default CaseCreatorDisplay;