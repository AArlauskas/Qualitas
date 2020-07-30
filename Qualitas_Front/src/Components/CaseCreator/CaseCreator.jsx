import React, { Component } from 'react';
import { TextField, List, ListSubheader, ListItem, ListItemText, ListItemSecondaryAction, Checkbox, IconButton, Button } from '@material-ui/core';
import AddCommentIcon from '@material-ui/icons/AddComment';
import UnifiedModal from "../../Components/Core-Components/UnifiedModal";
import DefaultTextArea from '../Core-Components/DefaultTextArea/DefaultTextArea';
import ButtonBlock from "../Core-Components/UnifiedModal/ButtonBlock/ButtonBlock";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

class CaseCreator extends Component {
    state = {
        caseName: "",
        topics: [],
        breached: false,
        modalOpen: false,
        commentTopicId: null,
        commentCriteriaId: null
    }

    componentDidUpdate(previousProps) {
        if (this.props.template.id !== previousProps.template.id) {
            this.MountingProps();
        }
    }

    componentDidMount() {
        this.MountingProps();
    }

    MountingProps() {
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
        });
    }

    render() {
        return (
            <div>
                <div style={{ marginLeft: "25%", marginRight: "25%", background: "rgba(200, 200, 200, 0.5)" }}>
                    {console.log(this.props)}
                    <UnifiedModal open={this.state.modalOpen} title="Comment">
                        <DefaultTextArea defaultValue={this.state.modalOpen ? this.state.topics.find(topic => topic.id === this.state.commentTopicId)
                            .criteria.find(criteria => criteria.id === this.state.commentCriteriaId).comment : ""} label="Add comment..." maxLength={250} onChange={e => {
                                let TempTopics = [...this.state.topics];
                                TempTopics.find(topic => topic.id === this.state.commentTopicId)
                                    .criteria.find(criteria => criteria.id === this.state.commentCriteriaId).comment = e.target.value;
                                this.setState({
                                    topics: [...TempTopics]
                                })
                            }} />
                        <ButtonBlock onSave={() => this.setState({ modalOpen: false, commentCriteriaId: null, commentTopicId: null })} />
                    </UnifiedModal>
                    <div style={{ textAlign: "center" }}>
                        <TextField style={{ marginLeft: 20, width: 400 }} label="Case name" onChange={e => this.setState({ caseName: e.target.value })} />
                        <div>
                            <h3>Points: {TotalScore(this.state.topics)} / {TotalPoints(this.state.topics)}</h3>
                            <h3>Percent: {Math.trunc(TotalScore(this.state.topics) / TotalPoints(this.state.topics) * 100)}%</h3>
                        </div>
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
                                                if (isChecked) {
                                                    tempTopics.forEach(tempTopic => tempTopic.criteria.forEach(tempCriteria => {
                                                        tempCriteria.score = 0;
                                                    }));
                                                }
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
                                                            if (e.target.checked) {
                                                                tempTopics.forEach(tempTopic => tempTopic.criteria.forEach(tempCriteria => {
                                                                    tempCriteria.score = 0;
                                                                }));
                                                            }
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
                            <hr />
                            <List style={{ color: "blue" }}>
                                <ListSubheader component="div" style={{ color: "red" }} >
                                    <h3 style={{ color: "blue" }}>Topics and Criterias</h3>
                                </ListSubheader>
                                {this.state.topics.filter(topic => !topic.isCritical).map(topic => {
                                    return (
                                        <div key={topic.id}>
                                            <ListItem button>
                                                <ListItemText>{topic.name}</ListItemText>
                                                <ListItemSecondaryAction>
                                                    <div style={{ overflow: "hidden" }}>
                                                        <p style={{ float: "left" }}>{TopicScore(topic)} / {TopicPoints(topic)}</p>
                                                        <p style={{ float: "right", paddingLeft: 10 }}>{Math.trunc(TopicScore(topic) / TopicPoints(topic) * 100)}%</p>
                                                    </div>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <hr />
                                            <List style={{ color: "green" }}>
                                                {topic.criteria.map(crit => {
                                                    return (
                                                        <div>
                                                            <ListItem button key={crit.id} style={{ paddingLeft: 40 }} >
                                                                <ListItemText onClick={() => {
                                                                    let tempTopics = [...this.state.topics];
                                                                    let score = tempTopics.find(tempTopic => tempTopic.id === topic.id).criteria.find(tempCriteria => tempCriteria.id === crit.id).score;
                                                                    if (score === 0) {
                                                                        tempTopics.find(tempTopic => tempTopic.id === topic.id).criteria.find(tempCriteria => tempCriteria.id === crit.id).score = crit.points;
                                                                    }
                                                                    else {
                                                                        tempTopics.find(tempTopic => tempTopic.id === topic.id).criteria.find(tempCriteria => tempCriteria.id === crit.id).score = 0;
                                                                    }
                                                                    this.setState({
                                                                        topics: [...tempTopics]
                                                                    })
                                                                }}>{crit.name}</ListItemText>
                                                                <ListItemSecondaryAction>
                                                                    <IconButton disabled={this.state.breached} edge="end" aria-label="Perfect" style={{ backgroundColor: crit.score === crit.points ? "rgba(0,255,0, 0.2)" : null }}
                                                                        onClick={() => {
                                                                            let tempTopics = [...this.state.topics];
                                                                            tempTopics.find(tempTopic => tempTopic.id === topic.id).criteria.find(tempCriteria => tempCriteria.id === crit.id).score =
                                                                                tempTopics.find(tempTopic => tempTopic.id === topic.id).criteria.find(tempCriteria => tempCriteria.id === crit.id).points;
                                                                            this.setState({
                                                                                topics: [...tempTopics]
                                                                            })
                                                                        }}>
                                                                        <InsertEmoticonIcon />
                                                                    </IconButton>
                                                                    <IconButton disabled={this.state.breached} edge="end" aria-label="Partial" style={{ backgroundColor: crit.score === crit.points / 2 ? "rgba(255,255,0, 0.2)" : null }}
                                                                        onClick={() => {
                                                                            let tempTopics = [...this.state.topics];
                                                                            tempTopics.find(tempTopic => tempTopic.id === topic.id).criteria.find(tempCriteria => tempCriteria.id === crit.id).score =
                                                                                tempTopics.find(tempTopic => tempTopic.id === topic.id).criteria.find(tempCriteria => tempCriteria.id === crit.id).points / 2;
                                                                            this.setState({
                                                                                topics: [...tempTopics]
                                                                            })
                                                                        }}>
                                                                        <SentimentSatisfiedIcon />
                                                                    </IconButton>
                                                                    <IconButton disabled={this.state.breached} edge="end" aria-label="Failed" style={{ backgroundColor: crit.score === 0 ? "rgba(255,0,0, 0.2)" : null }}
                                                                        onClick={() => {
                                                                            let tempTopics = [...this.state.topics];
                                                                            tempTopics.find(tempTopic => tempTopic.id === topic.id).criteria.find(tempCriteria => tempCriteria.id === crit.id).score = 0;
                                                                            this.setState({
                                                                                topics: [...tempTopics]
                                                                            })
                                                                        }}>
                                                                        <SentimentVeryDissatisfiedIcon />
                                                                    </IconButton>
                                                                    <IconButton edge="end" aria-label="Add comment" onClick={() => {
                                                                        this.setState({ modalOpen: true, commentCriteriaId: crit.id, commentTopicId: topic.id })
                                                                    }}>
                                                                        <AddCommentIcon style={{ color: crit.comment === "" ? null : "green" }} />
                                                                    </IconButton>

                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                        </div>
                                                    );
                                                })}
                                            </List>
                                        </div>
                                    );
                                })}
                            </List>
                        </div>
                    </div>

                </div >
                <div style={{ textAlign: "center", marginTop: 50, marginBottom: 50 }}>
                    <Button disabled={this.state.caseName.length === 0} style={{ width: "20%", color: "white", backgroundColor: "#2fed95" }}
                        onClick={() => {
                            let data = {
                                name: this.state.caseName,
                                UserId: this.props.userId,
                                ProjectId: this.props.projectId,
                                EvaluatorId: window.localStorage.getItem("id"),
                                Topics: this.state.topics
                            };
                            this.props.createCase(data);
                            setTimeout(() => window.location.href = "/UserDetails/" + this.props.userId, 3000);

                        }} >Save</Button>
                </div>
            </div>
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

const TotalPoints = (topics) => {
    let sum = 0;
    topics.forEach(topic => topic.criteria.forEach(criteria => sum = sum + criteria.points));
    return sum;
}

const TotalScore = (topics) => {
    let sum = 0;
    topics.forEach(topic => topic.criteria.forEach(criteria => sum = sum + criteria.score));
    return sum;
}

export default CaseCreator;