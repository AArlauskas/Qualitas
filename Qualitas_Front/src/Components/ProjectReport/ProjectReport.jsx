import React, { Component } from 'react';
import { ListSubheader, List, ListItemText, ListItem, ListItemSecondaryAction, ListItemIcon } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import CriticalListItem from './CriticalListItem';
import TopicListItem from './TopicListItem';
import DefaultMultiSelect from '../Core-Components/DefaultMultiSelect/DefaultMultiSelect';
import ProjectUserList from './ProjectUserList';

const calculateScore = (report, categories) => {

    if (categories.length === 0) {
        return isNaN(Math.trunc(report.score / report.points * 100)) ? "0" : Math.trunc(report.score / report.points * 100)
    }
    else {
        let score = 0;
        let points = 0;
        let filtered = report.categoryReports.filter(temp => categories.includes(temp.name));
        filtered.forEach(temp => {
            score += temp.score;
            points += temp.points;
        });
        return isNaN(Math.trunc(score / points * 100)) ? "0" : Math.trunc(score / points * 100)
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
    return isNaN(Math.trunc(score / points * 100)) ? "0" : Math.trunc(score / points * 100)

}

class ProjectReport extends Component {
    state = {
        openId: null,
        categories: [],
    }
    render() {
        return (
            <div>
                <h2 style={{ textAlign: "center", paddingTop: 10 }}>Project score: {OverallScore(this.props.report)}%</h2>
                <div style={{ paddingTop: 50, paddingBottom: 50 }}>
                    {console.log(this.state.categories)}
                    <div style={{ marginLeft: "15%", marginRight: "15%", background: "rgba(255, 204, 204, 0.2)" }}>
                        {console.log(this.props.report)}
                        <List>
                            <ListSubheader disableSticky>Templates</ListSubheader>
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
                                                        {getTopics(report, this.state.categories).map(topic => <TopicListItem topic={topic} />)}
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