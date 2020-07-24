import React, { Component } from 'react';
import { connect } from "react-redux";
import TemplateEditor from '../../Components/TemplateEditor/TemplateEditor';
import { FetchTemplateToEdit, EditTemplate } from '../../API/API';

class TemplateCreatorDisplay extends Component {
    state = {
        template: []
    }

    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/edittemplate/")[1];
        FetchTemplateToEdit(id).then(response => this.setState({ template: response }));
    }

    render() {
        return (
            <div>
                {this.state.template.length === 0 ? null : <TemplateEditor
                    template={this.state.template}
                    editTemplate={editTemplate} />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

const editTemplate = async (id, data) => {
    await EditTemplate(id, data);
}


export default connect(mapStateToProps, mapDispatchToProps)(TemplateCreatorDisplay);