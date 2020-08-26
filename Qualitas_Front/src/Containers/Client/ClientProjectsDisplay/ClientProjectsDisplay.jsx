import React, { Component } from 'react';
import { connect } from "react-redux";
import ClientProjectsList from '../../../Components/Client/ClientProjectsList/ClientProjectsList';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';
import { fetchClientProjects } from '../../../Actions/ProjectsTableActions';

let date = new Date();
class ClientProjectsDisplay extends Component {
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
                {this.props.projects === null ? <LoadingScreen /> :
                    <ClientProjectsList
                        projects={this.props.projects.Projects}
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
    fetchProjects: (id, start, end) => dispatch(fetchClientProjects(id, start, end)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientProjectsDisplay);