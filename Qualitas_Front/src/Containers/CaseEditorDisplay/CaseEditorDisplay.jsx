import React, { Component } from 'react';
import { FetchCaseToEdit, UpdateCase } from '../../API/API';
import CaseEditor from '../../Components/CaseEditor/CaseEditor';

class CaseEditorDisplay extends Component {
    state = {
        Case: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/editcase/")[1];
        FetchCaseToEdit(id).then(response => this.setState({ Case: response }));
    }
    render() {
        return (
            <div>
                {this.state.Case.length === 0 ? null :
                    <CaseEditor
                        case={this.state.Case}
                        updateCase={updateCase} />}

            </div>
        );
    }
}

const updateCase = async (id, data) => {
    await UpdateCase(id, data);
}

export default CaseEditorDisplay;