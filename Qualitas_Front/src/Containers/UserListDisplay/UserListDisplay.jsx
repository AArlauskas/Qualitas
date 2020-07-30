import React, { Component } from 'react';
import UserListTable from '../../Components/UserListTable/UserListTable';
import { connect } from "react-redux";
import { fetchUserData, addUser, updateUser, archiveUser } from '../../Actions/UserListActions';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';


class UserListDisplay extends Component {
    componentDidMount() {
        this.props.fetchUserData();
    }
    state = {
        type: "user"
    }
    render() {
        return (
            this.props.userData.length !== 0 ?
                <UserListTable
                    userData={this.props.userData}
                    teams={this.props.teams}
                    addUser={this.props.addUser}
                    updateUser={this.props.updateUser}
                    archiveUser={this.props.archiveUser} />
                :
                <LoadingScreen />
        );
    }
}


const mapStateToProps = (state) => ({
    userData: state.Users,
    teams: state.Teams
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