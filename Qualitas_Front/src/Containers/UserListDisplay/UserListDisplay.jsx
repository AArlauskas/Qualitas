import React, { Component } from 'react';
import UserListTable from '../../Components/UserListTable/UserListTable';
import { connect } from "react-redux";
import { fetchUserData, addUser, updateUser, archiveUser } from '../../Actions/UserListActions';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

let date = new Date();
class UserListDisplay extends Component {
    state = {
        type: "user",
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
    }
    componentDidMount() {
        this.props.fetchUserData(this.state.minDate, this.state.maxDate);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.minDate !== this.state.minDate || prevState.maxDate !== this.state.maxDate) {
            this.props.fetchUserData(this.state.minDate, this.state.maxDate);
        }
    }
    render() {
        return (
            this.props.userData !== null ?
                <UserListTable
                    userData={this.props.userData}
                    teams={this.props.teams}
                    addUser={this.props.addUser}
                    updateUser={this.props.updateUser}
                    archiveUser={this.props.archiveUser}
                    minDate={this.state.minDate}
                    maxDate={this.state.maxDate}
                    setMinDate={(date) => this.setState({ minDate: date })}
                    setMaxDate={(date) => this.setState({ maxDate: date })} />
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
    fetchUserData: (start, end) => dispatch(fetchUserData(start, end)),
    addUser: (data) => dispatch(addUser(data)),
    updateUser: (data) => dispatch(updateUser(data)),
    archiveUser: (oldData) => dispatch(archiveUser(oldData))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserListDisplay);