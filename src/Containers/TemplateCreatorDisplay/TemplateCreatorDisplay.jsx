import React, { Component } from 'react';
import { connect } from "react-redux";
import TemplateCreator from '../../Components/TemplateCreator/TemplateCreator';
import { fetchTemplateToEdit, createTemplate, editTemplate } from '../../Actions/TemplateCreatorActions';

class TemplateCreatorDisplay extends Component {
    state = {
        editId: window.location.pathname.split("/EditTemplate/")[1]
    }
    componentDidMount() {
        if (this.state.editId !== undefined) {
            fetchTemplateToEdit(this.state.editId);
        }
    }
    render() {
        return (
            <div>
                <TemplateCreator
                    editId={this.state.editId}
                    templateToEdit={this.props.templateToEdit}
                    createTemplate={this.props.createTemplate}
                    editTemplate={this.props.editTemplate} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    templateToEdit: state.TemplateToEdit
});

const mapDispatchToProps = (dispatch) => ({
    fetchTemplateToEdit: (id) => dispatch(fetchTemplateToEdit(id)),
    createTemplate: () => dispatch(createTemplate()),
    editTemplate: () => dispatch(editTemplate())
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplateCreatorDisplay);