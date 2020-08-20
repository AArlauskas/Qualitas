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
            return isNaN(Math.trunc(score / points * 100)) ? "0" : Math.trunc(score / points * 100)
        }
        return (
            <div>
                <div>
                    <h2 style={{ textAlign: "center", paddingTop: 10 }}>Team score: {CalculateUserScore(this.props.report)}%</h2>
                    <div style={{ paddingTop: 50, paddingBottom: 50 }}>
                        {console.log(this.state.categories)}
                        <div style={{ marginLeft: "15%", marginRight: "15%", background: "rgba(255, 204, 204, 0.2)" }}>
                            {console.log(this.props.report)}
                            <List>
                                <ListSubheader>Projects</ListSubheader>
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
                                                    <ListItemText>Score: {isNaN(Math.trunc(report.score / report.points * 100)) ? "0" : Math.trunc(report.score / report.points * 100) + "%"} {"   "}
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