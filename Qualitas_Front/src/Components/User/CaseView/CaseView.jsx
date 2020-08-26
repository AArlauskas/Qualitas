import React, { Component } from 'react';
import { List, ListSubheader, ListItem, ListItemText, ListItemSecondaryAction, Checkbox, IconButton, Tooltip, TextField, ListItemIcon } from '@material-ui/core';
import AddCommentIcon from '@material-ui/icons/AddComment';
import UnifiedModal from "../../Core-Components/UnifiedModal";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import Fade from '@material-ui/core/Fade';
import { withStyles } from "@material-ui/styles";
import { DescriptionOutlined } from '@material-ui/icons';

const CustomTooltip = withStyles({
    tooltip: {
        color: "black",
        backgroundColor: "white",
        fontSize: 15
    }
})(Tooltip);

class CaseView extends Component {
    state = {
        id: null,
        caseName: "",
        CategoryName: "",
        topics: [],
        overallComment: "",
        breached: false,
    }

    componentDidMount() {
        let topics = [];
        this.props.case.Topics.forEach(topic => {
            let tempTopic = {
                id: topic.id,
                name: topic.name,
                description: topic.description,
                isCritical: topic.isCritical,
                failed: topic.failed,
                criteria: []
            };
            if (topic.failed) {
                this.setState({ breached: true })
            }
            let criterias = [];
            topic.Criteria.forEach(criteria => {
                criterias.push({
                    id: criteria.id,
                    name: criteria.name,
                    description: criteria.description,
                    points: criteria.points,
                    score: criteria.score,
                    comment: criteria.comment
                });

            });
            tempTopic.criteria = criterias;
            topics.push(tempTopic);
        });
        this.setState({
            CategoryName: this.props.case.CategoryName,
            caseName: this.props.case.name,
            id: this.props.case.id,
            overallComment: this.props.case.comment,
            topics: topics
        });
    }

    render() {
        return (
            <div>
                {console.log(this.state)}
                <div style={{ marginLeft: "15%", marginRight: "15%", background: "rgba(200, 200, 200, 0.5)" }}>
                    <UnifiedModal open={this.state.modalOpen} title="Comment">
                        <p>{this.state.modalOpen ? this.state.topics.find(topic => topic.id === this.state.commentTopicId)
                            .criteria.find(criteria => criteria.id === this.state.commentCriteriaId).comment : ""}</p>
                    </UnifiedModal>
                    <div style={{ textAlign: "center" }}>
                        <h2>Case name: {this.state.caseName}</h2>
                        {this.state.CategoryName === "" ? null : <h2>Category: {this.state.CategoryName}</h2>}
                        <div>
                            <h3>Points: {TotalScore(this.state.topics)} / {TotalPoints(this.state.topics)}</h3>
                            <h3>Percent: {isNaN(Math.round(TotalScore(this.state.topics) / TotalPoints(this.state.topics) * 10000) / 100) ? "0" : Math.round(TotalScore(this.state.topics) / TotalPoints(this.state.topics) * 10000) / 100}%</h3>
                        </div>
                        <div>
                            <div>
                                <List style={{ color: "red" }}>
                                    <div>
                                        <ListSubheader disableSticky component="div" style={{ color: "red" }} >
                                            <h3 style={{ color: "red" }}>Criticals</h3>
                                        </ListSubheader>
                                    </div>
                                    {this.state.topics.filter(topic => topic.isCritical).map(topic => {
                                        return (
                                            <ListItem key={topic.id}>
                                                {topic.description === "" || topic.description === null ? null :
                                                    <ListItemIcon>
                                                        <CustomTooltip arrow TransitionComponent={Fade} title={topic.description} interactive>
                                                            <DescriptionOutlined />
                                                        </CustomTooltip> </ListItemIcon>}
                                                <ListItemText>{topic.name}</ListItemText>
                                                <ListItemSecondaryAction>
                                                    <Checkbox
                                                        checked={this.state.topics.find(critical => critical.id === topic.id).failed}
                                                        disabled={true} />
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </div>
                            <hr />
                            <List style={{ color: "blue" }}>
                                <ListSubheader disableSticky component="div" style={{ color: "red" }} >
                                    <h3 style={{ color: "blue" }}>Topics and Criterias</h3>
                                </ListSubheader>
                                {this.state.topics.filter(topic => !topic.isCritical).map(topic => {
                                    return (
                                        <div key={topic.id}>
                                            <ListItem >
                                                {topic.description === "" || topic.description === null ? null :
                                                    <ListItemIcon>
                                                        <CustomTooltip arrow TransitionComponent={Fade} title={topic.description} interactive>
                                                            <DescriptionOutlined />
                                                        </CustomTooltip> </ListItemIcon>}
                                                <ListItemText>{topic.name}</ListItemText>
                                                <ListItemSecondaryAction>
                                                    <div style={{ overflow: "hidden" }}>
                                                        <p style={{ float: "left" }}>{TopicScore(topic)} / {TopicPoints(topic)}</p>
                                                        <p style={{ float: "right", paddingLeft: 10 }}>{isNaN(Math.round(TopicScore(topic) / TopicPoints(topic) * 10000) / 100) ? 0 : Math.round(TopicScore(topic) / TopicPoints(topic) * 10000) / 100}%</p>
                                                    </div>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <hr />
                                            <List style={{ color: "green" }}>
                                                {topic.criteria.map(crit => {
                                                    return (
                                                        <div key={crit.id}>
                                                            <ListItem key={crit.id} style={{ paddingLeft: 40 }} >
                                                                {crit.description === "" || crit.description === null ? null :
                                                                    <ListItemIcon>
                                                                        <CustomTooltip arrow TransitionComponent={Fade} title={crit.description} interactive>
                                                                            <DescriptionOutlined />
                                                                        </CustomTooltip> </ListItemIcon>}
                                                                <ListItemText>{crit.name}</ListItemText>
                                                                <ListItemSecondaryAction>
                                                                    <IconButton disabled={true} edge="end" aria-label="Perfect" style={{ backgroundColor: crit.score === crit.points ? "rgba(0,255,0, 0.2)" : null }}>
                                                                        <InsertEmoticonIcon />
                                                                    </IconButton>
                                                                    <IconButton disabled={true} edge="end" aria-label="Partial" style={{ backgroundColor: crit.score === crit.points / 2 ? "rgba(255,255,0, 0.2)" : null }}>
                                                                        <SentimentSatisfiedIcon />
                                                                    </IconButton>
                                                                    <IconButton disabled={true} edge="end" aria-label="Failed" style={{ backgroundColor: crit.score === 0 ? "rgba(255,0,0, 0.2)" : null }}>
                                                                        <SentimentVeryDissatisfiedIcon />
                                                                    </IconButton>
                                                                    <CustomTooltip arrow TransitionComponent={Fade} title={crit.comment} interactive>
                                                                        <IconButton aria-describedby={crit.id} edge="end" aria-label="Add comment" >
                                                                            <AddCommentIcon style={{ color: crit.comment === "" ? null : "green" }} />
                                                                        </IconButton>
                                                                    </CustomTooltip>
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
                {this.state.overallComment === null ? null :
                    <div style={{ textAlign: "center", marginTop: 10, marginLeft: "15%", marginRight: "15%" }}>
                        <TextField
                            disabled={true}
                            rows={6}
                            fullWidth
                            variant="outlined"
                            multiline
                            value={this.state.overallComment}
                            label="Comment..." />
                    </div>}
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

export default CaseView;