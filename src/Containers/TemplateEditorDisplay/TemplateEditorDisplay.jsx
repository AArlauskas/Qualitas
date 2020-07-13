import React, { Component } from 'react';
import { connect } from "react-redux";
import TemplateEditor from '../../Components/TemplateEditor/TemplateEditor';
import { editTemplate } from "../../Actions/TemplateEditorActions";
import templates from '../../Constants/Templates';

class TemplateCreatorDisplay extends Component {
    state = {}
    render() {
        return (
            <div>
                <TemplateEditor
                    template={fetchTemplateToEdit()}
                    editTemplate={this.props.editTemplate} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    editTemplate: (data) => dispatch(editTemplate(data)),
});

const fetchTemplateToEdit = () => {
    let id = parseInt(window.location.href.split("/EditTemplate/")[1]);
    let template = templates.find(temp => temp.id === id);
    return template;
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateCreatorDisplay);