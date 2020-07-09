import React, { Component } from 'react';
import UserListTable from '../../Components/UserListTable/UserListTable';
import { connect } from "react-redux";
import { fetchUserData, addUser, updateUser, archiveUser } from '../../Actions/UserListActions';


class UserListDisplay extends Component {
    componentDidMount() {
        this.props.fetchUserData();
    }
    state = {
        type: "user"
    }
    render() {
        return (
            <UserListTable
                userData={this.props.userData}
                addUser={this.props.addUser}
                updateUser={this.props.updateUser}
                archiveUser={this.props.archiveUser} />
        );
    }
}


const mapStateToProps = (state) => ({
    userData: state.Users
});

const mapDispatchToProps = (dispatch) => ({
    fetchUserData: () => dispatch(fetchUserData()),
    addUser: (data) => dispatch(addUser(data)),
    updateUser: (data) => dispatch(updateUser(data)),
    archiveUser: (oldData) => dispatch(archiveUser(oldData))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserListDisplay);