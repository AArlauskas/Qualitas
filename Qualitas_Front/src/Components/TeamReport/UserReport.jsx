import React, { Component } from 'react';
import { ListSubheader, List, ListItemText, ListItem, ListItemSecondaryAction, ListItemIcon } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import TemplateReport from "../UserReport/TemplateReport";

class UserReport extends Component {
    state = {}
    render() {
        return (
            <div style={{ paddingLeft: 30 }}>
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
                                        <ListItemText>Score: {isNaN(Math.trunc(report.score / report.points * 100)) ? "0" : Math.trunc(report.score / report.points * 100) + "%"} {"   "}
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
        );
    }
}

export default UserReport;