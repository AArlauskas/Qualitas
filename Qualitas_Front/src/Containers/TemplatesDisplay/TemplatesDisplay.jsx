import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import TemplateTable from '../../Components/TemplateTable/TemplateTable';
import { connect } from "react-redux";
import { fetchTemplates, deleteTemplate } from '../../Actions/TemplateDisplayActions';

class TemplatesDisplay extends Component {
    state = {}
    componentDidMount() {
        this.props.fetchTemplates();
    }
    render() {
        return (
            <div>
                <Button color="primary" variant="outlined" href="/newTemplate" style={{ marginBottom: 10 }}>Create new template</Button>
                <TemplateTable
                    templates={this.props.templates}
                    deleteTemplate={this.props.deleteTemplate} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    templates: state.Templates
});

const mapDispatchToProps = (dispatch) => ({
    fetchTemplates: () => dispatch(fetchTemplates()),
    deleteTemplate: (id) => dispatch(deleteTemplate(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesDisplay);