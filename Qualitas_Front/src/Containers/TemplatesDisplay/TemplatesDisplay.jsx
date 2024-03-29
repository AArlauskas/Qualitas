import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import TemplateTable from '../../Components/TemplateTable/TemplateTable';
import { connect } from "react-redux";
import { fetchTemplates, deleteTemplate, copyTemplate } from '../../Actions/TemplateDisplayActions';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

class TemplatesDisplay extends Component {
    state = {}
    componentDidMount() {
        this.props.fetchTemplates();
    }
    render() {
        return (
            <div>
                {this.props.templates === null ? <LoadingScreen /> :
                    <div><Button variant="contained" href="/newTemplate" style={{ marginBottom: 10, marginLeft: 10, backgroundColor: "#DAA1A0", color: "#F2F5F9" }}>Create new template</Button>
                        <TemplateTable
                            templates={this.props.templates}
                            copyTemplate={this.props.copyTemplate}
                            deleteTemplate={this.props.deleteTemplate} /></div>}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    templates: state.Templates
});

const mapDispatchToProps = (dispatch) => ({
    fetchTemplates: () => dispatch(fetchTemplates()),
    copyTemplate: (id, name) => dispatch(copyTemplate(id, name)),
    deleteTemplate: (id) => dispatch(deleteTemplate(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesDisplay);