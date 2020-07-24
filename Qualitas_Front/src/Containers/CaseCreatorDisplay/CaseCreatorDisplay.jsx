import React, { Component } from 'react';
import CaseCreator from '../../Components/CaseCreator/CaseCreator';
import { FetchUserToEdit, CreateCase } from '../../API/API';
import { Select } from '@material-ui/core';

class CaseCreatorDisplay extends Component {
    state = {
        user: [],
        userId: window.location.href.toLowerCase().split("/newcase/")[1],
        projectId: null,
        templateId: null
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/newcase/")[1];
        FetchUserToEdit(id).then(response => this.setState({ user: response })).then(() => {
            this.setState({ projectId: this.state.user.Projects[0].id });
            this.setState({ templateId: this.state.user.Projects[0].EvaluationTemplates[0].id });
        });

    }
    render() {
        return (
            <div>
                {this.state.user.length === 0 ? null :
                    <div>
                        <div style={{ marginTop: 15, marginLeft: 10, textAlign: "center", marginBottom: 30 }}>
                            <Select
                                style={{ width: 300 }}
                                native
                                label="Select Project"
                                defaultValue={this.state.user.Projects[0].id}
                                onChange={e => this.setState({ projectId: parseInt(e.target.value) })}>
                                {this.state.user.Projects.map(project => {
                                    return <option key={project.id} value={project.id}>{project.name}</option>
                                })}
                            </Select>
                            {this.state.projectId === null || this.state.projectId === undefined ? null :
                                <Select
                                    style={{ width: 300, marginLeft: 20 }}
                                    native
                                    label="Select Template"
                                    defaultValue={this.state.user.Projects.find(temp => temp.id === this.state.projectId).id}
                                    onClick={e => this.setState({ templateId: parseInt(e.target.value) })}>
                                    {this.state.user.Projects.find(temp => temp.id === this.state.projectId).EvaluationTemplates.map(template => {
                                        return <option key={template.id} value={template.id}>{template.name}</option>
                                    })}
                                </Select>}
                        </div>
                        {this.state.projectId === null || this.state.templateId === null ? null :
                            <CaseCreator
                                projectId={this.state.projectId}
                                userId={this.state.userId}
                                createCase={createCase}
                                template={this.state.user.Projects.find(temp => temp.id === this.state.projectId).EvaluationTemplates.find(temp => temp.id === this.state.templateId)} />
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