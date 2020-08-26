import React, { Component } from 'react';
import UserProjectsList from '../../../Components/User/UserProjectsList/UserProjectsList';
import { connect } from "react-redux";
import { fetchProjectsReview, changeProjectName, deleteProject, addProject } from '../../../Actions/ProjectsTableActions';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';

let date = new Date();
class UserProjectsListDisplay extends Component {
    state = {
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
    }
    componentDidMount() {
        let id = window.localStorage.getItem("id");
        this.props.fetchProjects(id, this.state.minDate, this.state.maxDate);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.minDate !== this.state.minDate || prevState.maxDate !== this.state.maxDate) {
            let id = window.localStorage.getItem("id");
            this.props.fetchProjects(id, this.state.minDate, this.state.maxDate);
        }
    }
    render() {
        return (
            <div>
                {console.log(this.props.projects)}
                {this.props.projects === null ? <LoadingScreen /> :
                    <UserProjectsList
                        projects={this.props.projects}
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        setMinDate={(date) => this.setState({ minDate: date })}
                        setMaxDate={(date) => this.setState({ maxDate: date })} />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    projects: state.Projects,
});

const mapDispatchToProps = (dispatch) => ({
    fetchProjects: (id, start, end) => dispatch(fetchProjectsReview(id, start, end)),
    addProject: (data) => dispatch(addProject(data)),
    updateProject: (data) => dispatch(changeProjectName(data)),
    deleteProject: (data) => dispatch(deleteProject(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProjectsListDisplay);