import React, { Component } from 'react';
import { TextField, List, ListSubheader, ListItem, ListItemText, ListItemSecondaryAction, RadioGroup, Radio, Checkbox } from '@material-ui/core';

class CaseCreator extends Component {
    state = {
        caseName: "",
        topics: [],
        breached: false
    }
    componentDidMount() {
        let topics = [];
        this.props.template.TopicTemplates.forEach(topic => {
            let tempTopic = {
                id: topic.id,
                name: topic.name,
                isCritical: topic.isCritical,
                failed: false,
                criteria: []
            };
            let criterias = [];
            topic.CriteriaTemplates.forEach(criteria => {
                criterias.push({
                    id: criteria.id,
                    name: criteria.name,
                    points: criteria.points,
                    score: 0,
                    comment: ""
                });

            });
            tempTopic.criteria = criterias;
            topics.push(tempTopic);
        });
        this.setState({
            topics: topics
        })
    }
    render() {
        return (
            <div>
                {console.log(this.props)}
                {console.log(this.state)}
                <div>
                    <TextField style={{ marginLeft: 20 }} label="Case name" onChange={e => this.setState({ caseName: e.target.value })} />
                    <div>
                        <div>
                            <List style={{ color: "red" }}>
                                <div>
                                    <ListSubheader component="div" style={{ color: "red" }} >
                                        <h3 style={{ color: "red" }}>Criticals</h3>
                                    </ListSubheader>
                                </div>
                                {this.state.topics.filter(topic => topic.isCritical).map(topic => {
                                    return (
                                        <ListItem onClick={() => {
                                            let id = topic.id;
                                            let tempTopics = [...this.state.topics];
                                            var isChecked = tempTopics.find(critical => critical.id === id).failed;
                                            tempTopics.find(critical => critical.id === id).failed = !isChecked;
                                            this.setState({
                                                topics: [...tempTopics],
                                                breached: !isChecked
                                            })
                                        }} button key={topic.id}>
                                            <ListItemText>{topic.name}</ListItemText>
                                            <ListItemSecondaryAction>
                                                <Checkbox
                                                    checked={this.state.topics.find(critical => critical.id === topic.id).failed}
                                                    onChange={(e) => {
                                                        let id = topic.id;
                                                        let tempTopics = [...this.state.topics];
                                                        tempTopics.find(critical => critical.id === id).failed = e.target.checked;
                                                        console.log(e.target.checked);
                                                        this.setState({
                                                            topics: [...tempTopics],
                                                            breached: e.target.checked
                                                        })
                                                    }} />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </div>
                        <List style={{ color: "blue" }}>
                            <ListSubheader component="div" style={{ color: "red" }} >
                                <h3 style={{ color: "blue" }}>Topics and Criterias</h3>
                            </ListSubheader>
                            {this.state.topics.filter(topic => !topic.isCritical).map(topic => {
                                return (
                                    <ListItem button key={topic.id}>
                                        <ListItemText>{topic.name}</ListItemText>
                                        <ListItemSecondaryAction>
                                            <p>{TopicScore(topic)} / {TopicPoints(topic)}</p>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>
                </div>
            </div >
        );
    }
}

const TopicPoints = (topic) => {
    let sum = 0;
    topic.criteria.forEach(criteria => sum = sum + criteria.points);
    return sum;
}

const TopicScore = (topic) => {
    let sum = 0;
    topic.criteria.forEach(criteria => sum = sum + criteria.score);
    return sum;
}

export default CaseCreator;