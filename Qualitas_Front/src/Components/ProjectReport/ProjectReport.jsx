import React, { Component } from 'react';
import { ListSubheader, List, ListItemText, ListItem, ListItemSecondaryAction, ListItemIcon } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import CriticalListItem from './CriticalListItem';
import TopicListItem from './TopicListItem';
import DefaultMultiSelect from '../Core-Components/DefaultMultiSelect/DefaultMultiSelect';
class ProjectReport extends Component {
    state = {
        openId: null,
        categories: []
    }
    render() {
        return (
            <div style={{ paddingTop: 50, paddingBottom: 50 }}>
                {console.log(this.state.categories)}
                <div style={{ marginLeft: "15%", marginRight: "15%", background: "rgba(200, 200, 200, 0.5)" }}>
                    {console.log(this.props.report)}
                    <List>
                        <ListSubheader>Templates</ListSubheader>
                        {this.props.report.map(report => {
                            return (
                                <React.Fragment>
                                    <ListItem button key={report.id} >
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
                                        {this.state.openId === report.id ? <ListItemText><DefaultMultiSelect options={report.categories}
                                            onChange={(value, type) => {
                                                if (type === "clear") {
                                                    this.setState({ categories: [] })
                                                }
                                                else {
                                                    this.setState({ categories: value })
                                                }
                                            }} /></ListItemText> : null}
                                        <ListItemSecondaryAction>
                                            <ListItemText>Score: {isNaN(Math.trunc(report.score / report.points * 100)) ? "0%" : Math.trunc(report.score / report.points * 100) + "%"} {"   "}
                                    Evaluated cases: {report.caseCount}
                                            </ListItemText>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {
                                        this.state.openId === report.id ?
                                            <React.Fragment>
                                                <List style={{ color: "red", paddingLeft: 50 }}>
                                                    <ListSubheader style={{ color: "red" }}>
                                                        Criticals
                                    </ListSubheader>
                                                    {report.criticals.map(critical => <CriticalListItem critical={critical} categories={this.state.categories} />)}
                                                </List>
                                                <List style={{ color: "blue", paddingLeft: 30 }}>
                                                    <ListSubheader style={{ color: "blue" }}>
                                                        Topics
                                    </ListSubheader>
                                                    {report.topics.map(topic => <TopicListItem topic={topic} />)}
                                                </List>
                                            </React.Fragment> : null
                                    }
                                    <hr />
                                </React.Fragment>
                            );
                        })}
                    </List>
                </div>
                <div>

                </div>
            </div>
        );
    }
}

export default ProjectReport;