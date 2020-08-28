import React, { Component } from 'react';
import { connect } from "react-redux";
import TemplateCreator from '../../Components/TemplateCreator/TemplateCreator';
import { CreateTemplate, FetchTemplateNames } from '../../API/API';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

class TemplateCreatorDisplay extends Component {
    state = {
        TemplateNames: null
    }
    componentDidMount() {
        FetchTemplateNames().then(response => this.setState({ TemplateNames: response }));
    }
    render() {
        return (
            <div>
                {this.state.TemplateNames === null ? <LoadingScreen /> :
                    <TemplateCreator
                        templateNames={this.state.TemplateNames}
                        createTemplate={createTemplate} />}
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