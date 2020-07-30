import React, { Component } from 'react';
import CaseView from '../../../Components/User/CaseView/CaseView';
import { FetchCaseToEdit } from '../../../API/API';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';
class CaseViewDisplay extends Component {
    state = {
        Case: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/viewcase/")[1];
        FetchCaseToEdit(id).then(response => this.setState({ Case: response }));
    }
    render() {
        return (
            <div>
                {this.state.Case.length === 0 ? <LoadingScreen /> :
                    <CaseView
                        case={this.state.Case} />}
            </div>
        );
    }
}

export default CaseViewDisplay;