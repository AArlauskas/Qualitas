import React, { Component } from 'react';
import { connect } from "react-redux";
import TemplateCreator from '../../Components/TemplateCreator/TemplateCreator';
import { createTemplate } from '../../Actions/TemplateCreatorActions';

class TemplateCreatorDisplay extends Component {
    state = {}
    render() {
        return (
            <div>
                <TemplateCreator
                    createTemplate={this.props.createTemplate} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    createTemplate: (data) => dispatch(createTemplate(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplateCreatorDisplay);