import React, { Component } from 'react';
import { Select, MenuItem, Button } from '@material-ui/core';
import { FetchProjectsSimple, FetchUserListSimple, FetchTeamsSimple, FetchClientProjectsSimple, FetchClientProjectsUsersSimple, FetchClientUserReport, FetchTeamReport } from '../../API/API';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { FetchProjectReport, FetchUserReport } from "../../API/API";
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';
import ProjectReport from '../../Components/ProjectReport/ProjectReport';
import UserReport from '../../Components/UserReport/UserReport';
import TeamReport from '../../Components/TeamReport/TeamReport';
import { DownloadProjectReport, DownloadUserReport, DownloadClientUserReport } from '../../API/DownloadAPI';

let date = new Date();
class ReportsDisplay extends Component {
    state = {
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
        reportBy: "Project",
        reportObjects: [],
        reportItemId: "",
        Report: [],
        loading: false
    }
    componentDidMount() {
        if (window.localStorage.getItem("role") === "client") {
            FetchClientProjectsSimple(window.localStorage.getItem("id")).then(response => this.setState({ reportObjects: response }));
        }
        else {
            FetchProjectsSimple().then(response => this.setState({ reportObjects: response }));
        }

    }
    reportByChanged(newType) {
        if (newType === "Project") {
            if (window.localStorage.getItem("role") === "client") {
                FetchClientProjectsSimple(window.localStorage.getItem("id")).then(response => this.setState({ reportObjects: response }));
            }
            else {
                FetchProjectsSimple().then(response => this.setState({ reportObjects: response }));
            }
        }
        else if (newType === "User") {
            if (window.localStorage.getItem("role") === "client") {
                FetchClientProjectsUsersSimple(window.localStorage.getItem("id")).then(response => this.setState({ reportObjects: response }));
            }
            else {
                FetchUserListSimple().then(response => this.setState({ reportObjects: response }));
            }

        }
        else {
            FetchTeamsSimple().then(response => this.setState({ reportObjects: response }));
        }
    }

    render() {
        const changeToUserReport = (id) => {
            this.setState({ Report: [], loading: true });
            this.setState({ reportBy: "User" });
            this.reportByChanged("User");
            this.setState({ reportItemId: id });
            if (window.localStorage.getItem("role") === "client") {
                FetchClientUserReport(this.state.reportItemId, window.localStorage.getItem("id"), this.state.minDate, this.state.maxDate).then(response => this.setState({ Report: response, loading: false }))
            }
            else {
                FetchUserReport(id, this.state.minDate, this.state.maxDate).then(response => this.setState({ Report: response, loading: false }))
            }

        }
        return (
            <div>
                <div style={{ marginLeft: 10, marginTop: 15, display: "block" }}>
                    <div style={{ float: "left", paddingTop: 30, marginRight: 15 }}>
                        <Select
                            label="Report by"
                            style={{ width: 200 }}
                            value={this.state.reportBy}
                            onChange={e => {
                                this.setState({ reportBy: e.target.value });
                                this.reportByChanged(e.target.value);
                            }}
                        >
                            <MenuItem value="Project">Project</MenuItem>
                            {window.localStorage.getItem("role") === "client" ? null : <MenuItem value="Team">Team</MenuItem>}
                            <MenuItem value="User">User</MenuItem>
                        </Select>

                        {this.state.reportObjects.length === 0 ? null :
                            <Select
                                value={this.state.reportItemId}
                                onChange={e => this.setState({ reportItemId: e.target.value })}
                                style={{ width: 200, marginLeft: 15 }}>
                                {this.state.reportObjects.map(object => <MenuItem key={object.id} value={object.id}>{this.state.reportBy === "User" ?
                                    object.firstname + " " + object.lastname : object.name}</MenuItem>)}
                            </Select>}
                    </div>
                    {this.state.reportItemId === "" ? null :
                        <div style={{ float: "left" }}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="yyyy-MM-dd"
                                    margin="normal"
                                    label="Start date"
                                    value={this.state.minDate}
                                    maxDate={this.state.maxDate}
                                    onChange={e => this.setState({ minDate: e })}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                                <KeyboardDatePicker
                                    style={{ marginLeft: 10 }}
                                    disableToolbar
                                    variant="inline"
                                    format="yyyy-MM-dd"
                                    margin="normal"
                                    label="End date"
                                    value={this.state.maxDate}
                                    minDate={this.state.minDate}
                                    maxDate={new Date()}
                                    onChange={e => this.setState({ maxDate: e })}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                            <Button style={{ marginTop: 30, marginLeft: 15, backgroundColor: "#DAA1A0", color: "#F2F5F9" }} variant="contained"
                                onClick={() => {
                                    if (this.state.Report.length !== 0) {
                                        this.setState({ Report: [] });
                                    }
                                    if (this.state.reportBy === "Project") {
                                        this.setState({ loading: true });
                                        FetchProjectReport(this.state.reportItemId, this.state.minDate, this.state.maxDate).then(response => this.setState({ Report: response, loading: false }));
                                    }
                                    else if (this.state.reportBy === "User") {
                                        this.setState({ loading: true });
                                        if (window.localStorage.getItem("role") === "client") {
                                            FetchClientUserReport(this.state.reportItemId, window.localStorage.getItem("id"), this.state.minDate, this.state.maxDate).then(response => this.setState({ Report: response, loading: false }))
                                        }
                                        else {
                                            FetchUserReport(this.state.reportItemId, this.state.minDate, this.state.maxDate).then(response => this.setState({ Report: response, loading: false }))
                                        }
                                    }
                                    else if (this.state.reportBy === "Team") {
                                        this.setState({ loading: true });
                                        FetchTeamReport(this.state.reportItemId, this.state.minDate, this.state.maxDate).then(response => this.setState({ Report: response, loading: false }));
                                    }
                                }}
                            >Generate report</Button>
                        </div>}
                </div>
                <div style={{ clear: "both" }}>
                    {this.state.Report.length === 0 ? this.state.loading ? <LoadingScreen /> : null :
                        this.state.reportBy === "Project" ? <ProjectReport report={this.state.Report} changeToUserReport={changeToUserReport} download={() => DownloadProjectReport(this.state.reportItemId, this.state.minDate, this.state.maxDate)} /> :
                            this.state.reportBy === "User" ? <UserReport report={this.state.Report} download={window.localStorage.getItem("role") === "client" ? () => DownloadClientUserReport(this.state.reportItemId, window.localStorage.getItem("id"), this.state.minDate, this.state.maxDate) : () => DownloadUserReport(this.state.reportItemId, this.state.minDate, this.state.maxDate)} /> :
                                this.state.reportBy === "Team" ? <TeamReport report={this.state.Report} /> : null}
                </div>
            </div>
        );
    }
}

export default ReportsDisplay;