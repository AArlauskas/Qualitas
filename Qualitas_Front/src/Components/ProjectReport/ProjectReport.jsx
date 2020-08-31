import React, { Component } from 'react';
import { ListSubheader, List, ListItemText, ListItem, ListItemSecondaryAction, ListItemIcon, IconButton } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp, GetAppRounded } from '@material-ui/icons';
import CriticalListItem from './CriticalListItem';
import TopicListItem from './TopicListItem';
import DefaultMultiSelect from '../Core-Components/DefaultMultiSelect/DefaultMultiSelect';
import ProjectUserList from './ProjectUserList';
import CriteriaDialog from '../CriteriaDialog/CriteriaDialog';

const calculateScore = (report, categories) => {

    if (categories.length === 0) {
        return isNaN(Math.round(report.score / report.points * 10000) / 100) ? "0" : Math.round(report.score / report.points * 10000) / 100
    }
    else {
        let score = 0;
        let points = 0;
        let filtered = report.categoryReports.filter(temp => categories.includes(temp.name));
        filtered.forEach(temp => {
            score += temp.score;
            points += temp.points;
        });
        return isNaN(Math.round(score / points * 10000) / 100) ? "0" : Math.round(score / points * 10000) / 100
    }
}

const calculateCases = (report, categories) => {
    if (categories.length === 0) {
        return report.caseCount;
    }
    else {
        let count = 0;
        let filtered = report.categoryReports.filter(temp => categories.includes(temp.name));
        filtered.forEach(temp => {
            count += temp.caseCount;
        });
        return count;
    }
}

const getCriticals = (report, categories) => {
    let criticals = [];
    let result = [];
    if (categories.length === 0) {
        report.categoryReports.forEach(category => category.criticals.forEach(critical => criticals.push(critical)));
    }
    else {
        let filtered = report.categoryReports.filter(temp => categories.includes(temp.name));
        filtered.forEach(category => category.criticals.forEach(critical => criticals.push(critical)));
    }

    let group = criticals.reduce((r, a) => {
        r[a.name] = [...r[a.name] || [], a];
        return r;
    }, {});
    Object.keys(group).forEach(key => {
        let breachCount = 0;
        group[key].forEach(member => breachCount += member.breachedCount);
        result.push({
            name: key,
            description: group[key][0].description === null ? "" : group[key][0].description,
            breachedCount: breachCount
        })
    })

    return result;
}

const getTopics = (report, categories) => {
    let topics = [];
    let result = [];
    if (categories.length === 0) {
        report.categoryReports.forEach(category => category.topics.forEach(topic => topics.push(topic)));
    }
    else {
        let filtered = report.categoryReports.filter(temp => categories.includes(temp.name));
        filtered.forEach(category => category.topics.forEach(topic => topics.push(topic)));
    }
    let group = topics.reduce((r, a) => {
        r[a.name] = [...r[a.name] || [], a];
        return r;
    }, {});
    Object.keys(group).forEach(key => {
        let score = 0;
        let points = 0;
        let criterias = [];
        group[key].forEach(member => {
            score += member.score;
            points += member.points;
            member.criterias.forEach(criteria => criterias.push(criteria))
        });
        result.push({
            name: key,
            description: group[key][0].description === null ? "" : group[key][0].description,
            score: score,
            points: points,
            criterias: criterias
        })
    })
    return result;
}

const getUsers = (report, categories) => {
    let users = [];
    let result = [];
    if (categories.length === 0) {
        report.categoryReports.forEach(category => category.users.forEach(user => users.push(user)));
    }
    else {
        let filtered = report.categoryReports.filter(temp => categories.includes(temp.name));
        filtered.forEach(category => category.users.forEach(user => users.push(user)));
    }
    let group = users.reduce((r, a) => {
        r[a.id] = [...r[a.id] || [], a];
        return r;
    }, {});
    Object.keys(group).forEach(key => {
        let caseCount = 0;
        let score = 0;
        let points = 0;
        group[key].forEach(member => {
            caseCount += member.caseCount;
            score += member.score;
            points += member.points;
        });
        result.push({
            id: key,
            name: group[key][0].firstname + " " + group[key][0].lastname,
            caseCount: caseCount,
            score: score,
            points: points
        })
    });
    return result;
}

const OverallScore = (reports) => {
    let score = 0;
    let points = 0;
    reports.forEach(report => {
        score += report.score;
        points += report.points;
    });
    return isNaN(Math.round(score / points * 10000) / 100) ? "0" : Math.round(score / points * 10000) / 100

}

class ProjectReport extends Component {
    state = {
        openId: null,
        categories: [],
        dialogOpen: false,
        dialogData: []
    }
    render() {
        return (
            <div>
                <CriteriaDialog open={this.state.dialogOpen} data={this.state.dialogData} closeDialog={(data) => this.setState({ dialogOpen: false, dialogData: [] })} />
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ paddingTop: 10, color: "#F2F5F9" }}>Project score: {OverallScore(this.props.report)}%</h2>
                    <IconButton style={{ marginLeft: 5, paddingTop: 10 }} onClick={() => this.props.download()}>
                        <GetAppRounded fontSize="large" />
                    </IconButton>
                </div>
                <div style={{ paddingTop: 50, paddingBottom: 50 }}>
                    <div style={{ marginLeft: "15%", marginRight: "15%", borderRadius: 10, background: "rgba(242, 245, 249, 0.6)" }}>
                        {console.log(this.props.report)}
                        <List>
                            <ListSubheader style={{ color: "#F2F5F9" }} disableSticky>Templates</ListSubheader>
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
                                            {this.state.openId === report.id ? <ListItemText style={{ marginRight: 15 }}><DefaultMultiSelect options={report.categories}
                                                onChange={(value, type) => {
                                                    if (type === "clear") {
                                                        this.setState({ categories: [] })
                                                    }
                                                    else {
                                                        this.setState({ categories: value })
                                                    }
                                                }} /></ListItemText> : null}
                                            <ListItemSecondaryAction>
                                                <ListItemText>Score: {calculateScore(report, this.state.categories) + "%"} {"   "}
                                    Evaluated cases: {calculateCases(report, this.state.categories)}
                                                </ListItemText>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {
                                            this.state.openId === report.id ?
                                                <React.Fragment>
                                                    <List style={{ color: "red" }}>
                                                        <ListSubheader disableSticky style={{ color: "red" }}>
                                                            Criticals
                                    </ListSubheader>
                                                        {getCriticals(report, this.state.categories).map(critical => <CriticalListItem critical={critical} />)}
                                                    </List>
                                                    <List style={{ color: "blue" }}>
                                                        <ListSubheader disableSticky style={{ color: "blue" }}>
                                                            Topics
                                    </ListSubheader>
                                                        {getTopics(report, this.state.categories).map(topic => <TopicListItem topic={topic}
                                                            openDialog={(data) => this.setState({ dialogOpen: true, dialogData: data })}
                                                            closeDialog={(data) => this.setState({ dialogOpen: false, dialogData: [] })}
                                                        />)}
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
                {this.state.openId === null ? null :
                    <div>
                        <ProjectUserList changeToUserReport={this.props.changeToUserReport} users={getUsers(this.props.report.find(e => e.id === this.state.openId), this.state.categories)} />
                    </div>}
            </div>
        );
    }
}

export default ProjectReport;