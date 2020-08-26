import React, { Component } from 'react';
import { ListSubheader, List, ListItemText, ListItem, ListItemSecondaryAction, ListItemIcon, IconButton } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp, GetAppRounded } from '@material-ui/icons';
import TemplateReport from "./TemplateReport";

class UserReport extends Component {
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
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ paddingTop: 10 }}>User score: {CalculateUserScore(this.props.report)}%</h2>
                    <IconButton style={{ marginLeft: 5, paddingTop: 10 }} onClick={() => this.props.download()}>
                        <GetAppRounded fontSize="large" />
                    </IconButton>
                </div>
                <div style={{ paddingTop: 50, paddingBottom: 50 }}>
                    {console.log(this.state.categories)}
                    <div style={{ marginLeft: "15%", marginRight: "15%", background: "rgba(255, 204, 204, 0.2)" }}>
                        {console.log(this.props.report)}
                        <List>
                            <ListSubheader disableSticky>Projects</ListSubheader>
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
                                        {this.state.openId === report.id ? <TemplateReport report={report.templates} categories={this.state.categories} /> : null}
                                        <hr />
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserReport;