import React, { Component } from 'react';
import UserListTable from '../../Components/UserListTable/UserListTable';
import { connect } from "react-redux";
import { fetchUserData, addUser, updateUser, deleteUser } from '../../Actions/UserListActions';


class UserListDisplay extends Component {
    componentDidMount() {
        this.props.fetchUserData();
    }
    state = {
        type: "user"
    }
    render() {
        return (
            <div>
                {this.props.userData === [] ? null :
                    <UserListTable
                        userData={this.props.userData}
                        addUser={this.props.addUser}
                        updateUser={this.props.updateUser}
                        deleteUser={this.props.deleteUser} />}
            </div>
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
    deleteUser: (oldData) => dispatch(deleteUser(oldData))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserListDisplay);