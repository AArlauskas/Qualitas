import React, { Component } from 'react';
import { List, ListItem, ListItemText, TextField, IconButton, ListSubheader, ListItemIcon, Collapse, Chip } from '@material-ui/core';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import DescriptionIcon from '@material-ui/icons/Description';
import UnifiedModal from '../../Core-Components/UnifiedModal';
import DefaultTextArea from '../../Core-Components/DefaultTextArea/DefaultTextArea';
import ButtonBlock from '../../Core-Components/UnifiedModal/ButtonBlock/ButtonBlock';

const calculateSum = (criteria) => {
    let sum = 0;
    criteria.forEach(temp => sum += parseInt(temp.points));
    return sum;
}

class TemplateViewer extends Component {
    UNSAFE_componentWillMount() {
        this.setState({
            modalOpen: false,
            criteriaModalOpen: false,
            commentTopicId: null,
            criteriaId: null,
            id: this.props.template.id,
            templateName: this.props.template.TemplateName,
            topics: [],
            criteria: [],
            categories: this.props.template.Categories
        });
        let criteria = [];
        let topics = [];
        this.props.template.Topics.forEach(temp => {
            topics.push({
                id: temp.id,
                name: temp.name,
                critical: temp.critical,
                description: temp.description,
                editing: false,
                open: true
            });
        });
        this.props.template.Criteria.forEach(temp => {
            criteria.push({
                id: temp.id,
                name: temp.name,
                points: temp.points,
                description: temp.description,
                parentId: temp.parentId,
                editing: false,
            });
        });
        this.setState({
            topics: [...topics],
            criteria: [...criteria]
        })
    }
    state = {}

    render() {
        return (
            <div style={{ marginBottom: 30 }}>
                <UnifiedModal open={this.state.modalOpen} title="Description">
                    <DefaultTextArea disabled={true} defaultValue={this.state.modalOpen ? this.state.topics.find(topic => topic.id === this.state.commentTopicId).description : ""} label="Add description..." maxLength={600} onChange={e => {
                        let TempTopics = [...this.state.topics];
                        TempTopics.find(topic => topic.id === this.state.commentTopicId).description = e.target.value;
                        this.setState({
                            topics: [...TempTopics]
                        })
                    }} />
                    <ButtonBlock label="Exit" onSave={() => this.setState({ modalOpen: false, commentTopicId: null })} />
                </UnifiedModal>
                <UnifiedModal open={this.state.criteriaModalOpen} title="Description">
                    <DefaultTextArea defaultValue={this.state.criteriaModalOpen ? this.state.criteria.find(topic => topic.id === this.state.criteriaId).description : ""} label="Add description..." maxLength={600} onChange={e => {
                        let TempCriteria = [...this.state.criteria];
                        TempCriteria.find(topic => topic.id === this.state.criteriaId).description = e.target.value;
                        this.setState({
                            criteria: [...TempCriteria]
                        })
                    }} />
                    <ButtonBlock onSave={() => this.setState({ criteriaModalOpen: false, criteriaId: null })} />
                </UnifiedModal>
                <div style={{ marginLeft: "15%", marginRight: "15%", marginTop: 25, background: "rgba(200, 200, 200, 0.5)", textAlign: "center" }}>
                    <TextField inputProps={{ style: { textAlign: 'center' } }} disabled={true} style={{ paddingBottom: 15, width: 250 }} defaultValue={this.state.templateName} label="Template name" onChange={e => this.setState({ templateName: e.target.value })} />
                    <div className="ButtonBlock" >
                        <div style={{ marginLeft: "15%", marginRight: "15%", marginTop: 15, marginBottom: 15 }}>
                            {this.state.categories.map(category => {
                                return (
                                    <Chip label={category} />
                                );
                            })}
                        </div>
                    </div>
                    <p style={{ marginTop: 10 }}><b>Overall Points: {calculateSum(this.state.criteria)}</b></p>
                    <List style={{ color: "red" }}>
                        <ListSubheader disableSticky component="div" style={{ color: "red" }} >
                            Criticals
                    </ListSubheader>
                        {this.state.topics.filter(topic => topic.critical).map(entry => {
                            return (
                                <ListItem button key={entry.id} onClick={e => {
                                    let id = entry.id;
                                    let tempTopics = [...this.state.topics];
                                    tempTopics.find(critical => critical.id === id).editing = true;
                                    this.setState({
                                        editing: true,
                                        topics: tempTopics
                                    });
                                }}>
                                    <ListItemIcon>
                                        <IconButton onClick={() => this.setState({ modalOpen: true, commentTopicId: entry.id })}>
                                            <DescriptionIcon style={{ color: entry.description === "" ? null : "green" }} />
                                        </IconButton>
                                    </ListItemIcon>
                                    <ListItemText>{entry.name}</ListItemText>
                                </ListItem>);
                        })}
                    </List>
                    <hr />
                    <List style={{ color: "blue" }}>
                        <ListSubheader disableSticky component="div" >
                            Topics and Criterias
                    </ListSubheader>
                        {this.state.topics.filter(topic => !topic.critical).map(entry => {
                            return (
                                <div key={entry.id}>
                                    <React.Fragment>
                                        <ListItem button>
                                            <ListItemIcon>
                                                <IconButton onClick={() => this.setState({ modalOpen: true, commentTopicId: entry.id })}>
                                                    <DescriptionIcon style={{ color: entry.description === "" ? null : "green" }} />
                                                </IconButton>
                                            </ListItemIcon>
                                            <ListItemIcon>
                                                <IconButton onClick={() => {
                                                    let tempTopics = [...this.state.topics];
                                                    tempTopics.find(temp => temp.id === entry.id).open = !entry.open;
                                                    this.setState({
                                                        topics: tempTopics
                                                    });
                                                }}> {entry.open ? <ExpandLess /> : <ExpandMore />}</IconButton>
                                            </ListItemIcon>
                                            <ListItemText>{entry.name}</ListItemText>
                                            <ListItemText style={{ textAlign: "right", marginRight: 80 }}>{<p>Points: {calculateSum(this.state.criteria.filter(temp => temp.parentId === entry.id))}</p>}</ListItemText>
                                        </ListItem>
                                    </React.Fragment>
                                    <List style={{ color: "green" }}>
                                        {this.state.criteria.filter(criteria => criteria.parentId === entry.id).map(criteria => {
                                            return (
                                                <Collapse in={entry.open} key={criteria.id}>
                                                    <ListItem key={criteria.id} button style={{ paddingLeft: 150 }} onClick={() => {
                                                        let id = criteria.id;
                                                        let tempCriteria = [...this.state.criteria];
                                                        tempCriteria.find(criteria => criteria.id === id).editing = true;
                                                        this.setState({
                                                            editing: true,
                                                            criteria: tempCriteria
                                                        })
                                                    }}>
                                                        <ListItemIcon>
                                                            <IconButton onClick={() => this.setState({ criteriaModalOpen: true, criteriaId: criteria.id })}>
                                                                <DescriptionIcon style={{ color: criteria.description === "" ? null : "green" }} />
                                                            </IconButton>
                                                        </ListItemIcon>
                                                        <ListItemText>{criteria.name}</ListItemText>
                                                        <ListItemText style={{ textAlign: "right", paddingRight: 80 }}>{criteria.points}</ListItemText>
                                                    </ListItem>
                                                </Collapse>)
                                        })}
                                    </List>
                                </div>
                            )
                        })}
                    </List>

                </div>
            </div>
        );
    }
}

export default TemplateViewer;