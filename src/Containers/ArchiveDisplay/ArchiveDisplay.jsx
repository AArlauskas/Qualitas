import React, { Component } from 'react';
import { connect } from "react-redux";
import ArchivedUserListTable from '../../Components/ArchivedUserListTable/ArchivedUserListTable';
import { fetchArchivedUserData, unarchiveUser, deleteUser } from '../../Actions/ArchivedUserListActions';

class ArchiveDisplay extends Component {
    state = {}
    componentDidMount() {
        this.props.fetchArchivedUserData();
    }
    render() {
        return (
            <div>
                <ArchivedUserListTable
                    archivedUserData={this.props.archivedUserData}
                    unarchiveUser={this.props.unarchiveUser}
                    deleteUser={this.props.deleteUser} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    archivedUserData: state.Users
});

const mapDispatchToProps = (dispatch) => ({
    fetchArchivedUserData: () => dispatch(fetchArchivedUserData()),
    unarchiveUser: (oldData) => dispatch(unarchiveUser(oldData)),
    deleteUser: (oldData) => dispatch(deleteUser(oldData))
});

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveDisplay);