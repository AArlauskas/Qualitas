import React, { Component } from 'react';
import TemplateViewer from '../../../Components/Client/TemplateViewer/TemplateViewer';
import { FetchTemplateToEdit } from '../../../API/API';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';

class TemplateViewerDisplay extends Component {
    state = {
        template: []
    }
    componentDidMount() {
        let id = this.props.match.params.id;
        FetchTemplateToEdit(id).then(response => this.setState({ template: response }));
    }
    render() {
        return (
            <div>
                {this.state.template.length === 0 ? <LoadingScreen /> :
                    <TemplateViewer
                        template={this.state.template} />}
            </div>
        );
    }
}

export default TemplateViewerDisplay;