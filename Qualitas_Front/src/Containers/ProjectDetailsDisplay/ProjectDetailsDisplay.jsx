import React, { Component } from 'react';
import ProjectDetails from '../../Components/ProjectDetails/ProjectDetails';
import { connect } from "react-redux";
import { FetchProjectToEdit, FetchUserList, AddToProjectUser, RemoveFromProjectUser } from '../../API/API';

class ProjectDetailsDisplay extends Component {
    state = {
        project: [],
        users: []
    }
    componentDidMount() {
        let id = window.location.href.toLowerCase().split("/projectdetails/")[1];
        FetchProjectToEdit(id).then(response => this.setState({ project: response }));
        FetchUserList().then(response => this.setState({ users: response }));
    }
    render() {
        return (
            <div>
                {this.state.project.length === 0 || this.state.users.length === 0 ? null :
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