import React, { Component } from 'react';
import { ListSubheader, List, ListItemText, ListItem, ListItemSecondaryAction, ListItemIcon } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import CriticalListItem from '../ProjectReport/CriticalListItem';
import TopicListItem from '../ProjectReport/TopicListItem';
import DefaultMultiSelect from '../Core-Components/DefaultMultiSelect/DefaultMultiSelect';

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
            score: score,
            description: group[key][0].description === null ? "" : group[key][0].description,
            points: points,
            criterias: criterias
        })
    })
    return result;
}


class ProjectReport extends Component {
    state = {
        openId: null,
        categories: [],
    }
    render() {
        return (
            <div>
                <div>
                    {console.log(this.state.categories)}
                    <div style={{ paddingLeft: 50 }}>
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
                                                <ListItemText>Score: {calculateScore(report, this.state.categories) + "%"} {"   "}
                                    Evaluated cases: {calculateCases(report, this.state.categories)}
                                                </ListItemText>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {
                                            this.state.openId === report.id ?
                                                <React.Fragment>
                                                    <List style={{ color: "red", paddingLeft: 50 }}>
                                                        <ListSubheader disableSticky style={{ color: "red" }}>
                                                            Criticals
                                    </ListSubheader>
                                                        {getCriticals(report, this.state.categories).map(critical => <CriticalListItem critical={critical} />)}
                                                    </List>
                                                    <List style={{ color: "blue", paddingLeft: 30 }}>
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
            </div>
        );
    }
}

export default ProjectReport;