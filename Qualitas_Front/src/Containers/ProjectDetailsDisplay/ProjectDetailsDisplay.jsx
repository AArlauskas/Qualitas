import React, { Component } from 'react';
import ProjectDetails from '../../Components/ProjectDetails/ProjectDetails';
import { connect } from "react-redux";
import { AddToProjectUser, RemoveFromProjectUser, FetchProjectUsers, FetchUserListSimple } from '../../API/API';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

class ProjectDetailsDisplay extends Component {
    state = {
        project: [],
        users: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/projectdetails/")[1];
        FetchProjectUsers(id).then(response => this.setState({ project: response }));
        FetchUserListSimple().then(response => this.setState({ users: response }));
    }
    render() {
        return (
            <div>
                {this.state.project.length === 0 || this.state.users.length === 0 ? <LoadingScreen /> :
                    <ProjectDetails
                        project={this.state.project}
                        users={this.state.users}
                        addProjectMembers={addProjectMembers}
                        removeProjectMembers={removeProjectMembers} />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

const addProjectMembers = async (id, data) => {
    await AddToProjectUser(id, data);
}

const removeProjectMembers = async (id, data) => {
    await RemoveFromProjectUser(id, data);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetailsDisplay);