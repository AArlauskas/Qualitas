import React, { Component } from 'react';
import Credentials from "../../../Components/User/Credentials/Credentials";
import { FetchUserCredentials, UpdateUserCredentials } from "../../../API/API";
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';

class CredentialsDisplay extends Component {
    state = {
        User: null
    }
    componentDidMount() {
        let id = window.localStorage.getItem("id");
        FetchUserCredentials(id).then(response => this.setState({ User: response }));
    }
    render() {
        return (
            <div>
                {this.state.User === null ? <LoadingScreen /> :
                    <Credentials
                        user={this.state.User}
                        updateCredentials={updateUserCredentials} />}
            </div>
        );
    }
}

const updateUserCredentials = async (data) => {
    let id = window.localStorage.getItem("id");
    await UpdateUserCredentials(id, data);
}

export default CredentialsDisplay;