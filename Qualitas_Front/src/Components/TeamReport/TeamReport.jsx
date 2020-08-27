import React, { Component } from 'react';
import { ListSubheader, List, ListItemText, ListItem, ListItemSecondaryAction, ListItemIcon } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import UserReport from './UserReport';

class TeamReport extends Component {
    state = {
        openId: null,
        categories: [],
    }
    render() {
        const CalculateUserScore = (reports) => {
            let score = 0;
            let points = 0;
            reports.forEach(report => {
                score += report.score;
                points += report.points;
            });
            return isNaN(Math.round(score / points * 10000) / 100) ? "0" : Math.round(score / points * 10000) / 100
        }
        return (
            <div>
                <div>
                    <h2 style={{ textAlign: "center", paddingTop: 10, color: "#F2F5F9" }}>Team score: {CalculateUserScore(this.props.report)}%</h2>
                    <div style={{ paddingTop: 50, paddingBottom: 50 }}>
                        {console.log(this.state.categories)}
                        <div style={{ marginLeft: "15%", marginRight: "15%", borderRadius: 10, background: "rgba(242, 245, 249, 0.6)" }}>
                            {console.log(this.props.report)}
                            <List>
                                <ListSubheader style={{ color: "#F2F5F9" }}>Projects</ListSubheader>
                                {this.props.report.map(report => {
                                    return (
                                        <React.Fragment key={report.id}>
                                            <ListItem button  >
                                                <ListItemIcon onClick={() => {
                                                    if (this.state.openId === report.id) {
                                                        this.setState({ openId: null })
                                                    }
                                                    else {
                                                        this.setState({ openId: report.id })
                                                    }
                                                }}>
                                                    {this.state.openId === report.id ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
                                                </ListItemIcon>
                                                <ListItemText>{report.name}</ListItemText>
                                                <ListItemSecondaryAction>
                                                    <ListItemText>Score: {isNaN(Math.round(report.score / report.points * 10000) / 100) ? "0" : Math.round(report.score / report.points * 10000) / 100 + "%"} {"   "}
                                    Evaluated cases: {report.caseCount}
                                                    </ListItemText>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            {this.state.openId === report.id ? <UserReport report={report.projects} categories={this.state.categories} /> : null}
                                            <hr />
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TeamReport;