import React, { Component } from 'react';
import { connect } from "react-redux";
import TemplateCreator from '../../Components/TemplateCreator/TemplateCreator';
import { CreateTemplate } from '../../API/API';

class TemplateCreatorDisplay extends Component {
    state = {}
    render() {
        return (
            <div>
                <TemplateCreator
                    createTemplate={createTemplate} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

const createTemplate = async (data) => {
    await CreateTemplate(data);
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateCreatorDisplay);