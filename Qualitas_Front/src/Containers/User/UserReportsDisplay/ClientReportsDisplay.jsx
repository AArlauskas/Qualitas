import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { FetchUserReport } from "../../../API/API";
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen';
import UserReport from '../../../Components/UserReport/UserReport';
import { DownloadUserReport } from '../../../API/DownloadAPI';

let date = new Date();
class UserReportsDisplay extends Component {
    state = {
        minDate: new Date(date.getFullYear(), date.getMonth(), 1),
        maxDate: new Date(),
        Report: [],
        loading: false
    }
    render() {
        return (
            <div>
                <div style={{ marginLeft: 10, marginTop: 15, display: "block" }}>
                    <div style={{ float: "left", paddingTop: 30, marginRight: 15 }}>
                    </div>
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
                        <Button style={{ marginTop: 30, marginLeft: 15 }} variant="outlined" color="secondary"
                            onClick={() => {
                                if (this.state.Report.length !== 0) {
                                    this.setState({ Report: [] });
                                }
                                this.setState({ loading: true });
                                FetchUserReport(window.localStorage.getItem("id"), this.state.minDate, this.state.maxDate).then(response => this.setState({ Report: response, loading: false }))
                            }}
                        >Generate report</Button>
                    </div>
                </div>
                <div style={{ clear: "both" }}>
                    {this.state.Report.length === 0 ? this.state.loading ? <LoadingScreen /> : null :
                        <UserReport report={this.state.Report} download={() => DownloadUserReport(window.localStorage.getItem("id"), this.state.minDate, this.state.maxDate)} />}
                </div>
            </div>
        );
    }
}

export default UserReportsDisplay;