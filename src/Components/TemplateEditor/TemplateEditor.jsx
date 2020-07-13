import React, { Component } from 'react';
import { Button, List, ListItem, ListItemText, TextField, ListItemSecondaryAction, IconButton, ListSubheader, ListItemIcon, Collapse } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const calculateSum = (criteria) => {
    let sum = 0;
    criteria.forEach(temp => sum += parseInt(temp.points));
    return sum;
}

let index = 4;

class TemplateCreator extends Component {
    UNSAFE_componentWillMount() {
        this.setState({
            id: this.props.template.id,
            editing: false,
            templateName: this.props.template.name,
            topics: [],
            criteria: []
        });
        let criteria = [];
        let topics = [];
        this.props.template.topics.forEach(temp => {
            topics.push({
                id: temp.id,
                name: temp.name,
                critical: temp.critical,
                editing: false,
                open: true
            });
        });
        this.props.template.criteria.forEach(temp => {
            criteria.push({
                id: temp.id,
                name: temp.name,
                points: temp.points,
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
            <div style={{ marginLeft: 15, marginRight: 15 }}>
                <TextField style={{ paddingBottom: 15, width: 250 }} label="Template name" onChange={e => this.setState({ templateName: e.target.value })} />
                <div className="ButtonBlock" >
                    <Button color="secondary" variant="contained" onClick={() => {
                        let tempTopics = [...this.state.topics]
                        tempTopics.push({
                            id: index,
                            name: "Enter name",
                            critical: true,
                            editing: true,
                        });
                        index++;
                        this.setState({ topics: tempTopics, editing: true })
                    }}>
                        Add critical
                    </Button>
                    <Button color="primary" variant="contained" style={{ marginLeft: 5 }} onClick={() => {
                        let tempTopics = [...this.state.topics]
                        tempTopics.push({
                            id: index,
                            name: "Enter name",
                            critical: false,
                            editing: true,
                            open: true,
                        });
                        index++;
                        this.setState({ topics: tempTopics, editing: true })
                    }}>
                        Add topic
                    </Button>
                </div>
                <p><b>Overall Points: {calculateSum(this.state.criteria)}</b></p>
                <List style={{ color: "red" }}>
                    <ListSubheader component="div" style={{ color: "red" }} >
                        Criticals
                    </ListSubheader>
                    {this.state.topics.filter(topic => topic.critical).map(entry => {
                        if (entry.editing) {
                            return (
                                <div key={entry.id} onKeyPress={e => {
                                    if (e.key === "Enter") {
                                        let id = entry.id;
                                        let tempTopics = [...this.state.topics];
                                        tempTopics.find(critical => critical.id === id).editing = false;
                                        this.setState({
                                            editing: false,
                                            topics: tempTopics
                                        })
                                    }
                                }}>
                                    <ListItem button key={entry.id}>
                                        <TextField autoFocus style={{ width: 500 }} defaultValue={entry.name} onChange={e => {
                                            let tempTopics = [...this.state.topics];
                                            tempTopics.find(critical => critical.id === entry.id).name = e.target.value;
                                            this.setState({ topics: tempTopics })
                                        }} />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="Save" onClick={() => {
                                                let id = entry.id;
                                                let tempTopics = [...this.state.topics];
                                                tempTopics.find(critical => critical.id === id).editing = false;
                                                this.setState({
                                                    editing: false,
                                                    topics: tempTopics
                                                })
                                            }}>
                                                <DoneIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="Delete" onClick={() => {
                                                let id = entry.id;
                                                let tempTopics = [...this.state.topics];
                                                tempTopics.splice(tempTopics.indexOf(entry), 1);
                                                tempTopics.filter(critical => critical.id === id);
                                                this.setState({
                                                    topics: tempTopics,
                                                    editing: false
                                                })
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>

                                    </ListItem>

                                </div>
                            )
                        }
                        else {
                            return (
                                <ListItem button key={entry.id}>
                                    <ListItemText>{entry.name}</ListItemText>
                                    <ListItemSecondaryAction>
                                        <IconButton disabled={this.state.editing} edge="end" aria-label="Edit" onClick={() => {
                                            let id = entry.id;
                                            let tempTopics = [...this.state.topics];
                                            tempTopics.find(critical => critical.id === id).editing = true;
                                            this.setState({
                                                editing: true,
                                                topics: tempTopics
                                            })
                                        }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton disabled={this.state.editing} edge="end" aria-label="Delete" onClick={() => {
                                            let id = entry.id;
                                            let tempTopics = [...this.state.topics];
                                            tempTopics.splice(tempTopics.indexOf(entry), 1);
                                            tempTopics.filter(critical => critical.id === id);
                                            let tempCriteria = [...this.state.criteria];
                                            tempCriteria.filter(criteria => criteria.parentId !== id);
                                            this.setState({
                                                topics: tempTopics,
                                                criteria: tempCriteria,
                                                editing: false
                                            })
                                        }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        }
                    })}
                </List>
                <hr />
                <List style={{ color: "blue" }}>
                    <ListSubheader component="div" >
                        Topics and Criterias
                    </ListSubheader>
                    {this.state.topics.filter(topic => !topic.critical).map(entry => {
                        if (entry.editing) {
                            return (
                                <div key={entry.id} onKeyPress={e => {
                                    if (e.key === "Enter") {
                                        let id = entry.id;
                                        let tempTopics = [...this.state.topics];
                                        tempTopics.find(critical => critical.id === id).editing = false;
                                        this.setState({
                                            editing: false,
                                            topics: tempTopics
                                        })
                                    }
                                }}>
                                    <ListItem button >
                                        <TextField autoFocus style={{ width: 500 }} defaultValue={entry.name} onChange={e => {
                                            let tempTopics = [...this.state.topics];
                                            tempTopics.find(critical => critical.id === entry.id).name = e.target.value;
                                            this.setState({ topics: tempTopics })
                                        }} />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="Save" onClick={() => {
                                                let id = entry.id;
                                                let tempTopics = [...this.state.topics];
                                                tempTopics.find(critical => critical.id === id).editing = false;
                                                this.setState({
                                                    editing: false,
                                                    topics: tempTopics
                                                })
                                            }}>
                                                <DoneIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="Delete" onClick={() => {
                                                let id = entry.id;
                                                let tempTopics = [...this.state.topics];
                                                tempTopics.splice(tempTopics.indexOf(entry), 1);
                                                tempTopics.filter(critical => critical.id === id);
                                                let tempCriteria = [...this.state.criteria];
                                                tempCriteria = [...tempCriteria.filter(criteria => criteria.parentId !== id)];
                                                this.setState({
                                                    topics: tempTopics,
                                                    criteria: tempCriteria,
                                                    editing: false
                                                })
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div key={entry.id}>
                                    <React.Fragment>
                                        <ListItem button>
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
                                            <ListItemText style={{ textAlign: "right", paddingRight: 200 }}>{<p>Points: {calculateSum(this.state.criteria.filter(temp => temp.parentId === entry.id))}</p>}</ListItemText>
                                            <ListItemSecondaryAction>
                                                <IconButton disabled={this.state.editing} edge="end" aria-label="Add" onClick={() => {
                                                    let newCriteria = {
                                                        id: index,
                                                        name: "Enter criteria name",
                                                        points: 1,
                                                        editing: true,
                                                        parentId: entry.id
                                                    };
                                                    index++;
                                                    let oldCriteria = [...this.state.criteria];
                                                    oldCriteria.push(newCriteria);
                                                    this.setState({
                                                        criteria: oldCriteria
                                                    })
                                                }}>
                                                    <AddIcon />
                                                </IconButton>
                                                <IconButton disabled={this.state.editing} edge="end" aria-label="Edit" onClick={() => {
                                                    let id = entry.id;
                                                    let tempTopics = [...this.state.topics];
                                                    tempTopics.find(critical => critical.id === id).editing = true;
                                                    this.setState({
                                                        editing: true,
                                                        topics: tempTopics
                                                    })
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton disabled={this.state.editing} edge="end" aria-label="Delete" onClick={() => {
                                                    let id = entry.id;
                                                    let tempTopics = [...this.state.topics];
                                                    tempTopics.splice(tempTopics.indexOf(entry), 1);
                                                    tempTopics.filter(critical => critical.id === id);
                                                    let tempCriteria = [...this.state.criteria];
                                                    tempCriteria = [...tempCriteria.filter(criteria => criteria.parentId !== id)];
                                                    this.setState({
                                                        topics: tempTopics,
                                                        criteria: tempCriteria,
                                                        editing: false
                                                    })
                                                }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </React.Fragment>
                                    <List style={{ color: "green" }}>
                                        {this.state.criteria.filter(criteria => criteria.parentId === entry.id).map(criteria => {
                                            if (criteria.editing) {
                                                return (
                                                    <ListItem button key={criteria.id}>
                                                        <div style={{ marginLeft: 80 }} onKeyPress={e => {
                                                            if (e.key === "Enter") {
                                                                let id = criteria.id;
                                                                let tempCriteria = [...this.state.criteria];
                                                                tempCriteria.find(critical => critical.id === id).editing = false;
                                                                this.setState({
                                                                    editing: false,
                                                                    criteria: tempCriteria
                                                                })
                                                            }
                                                        }}>
                                                            <TextField autoFocus style={{ width: 500 }} defaultValue={criteria.name} onChange={e => {
                                                                let tempCriteria = [...this.state.criteria];
                                                                tempCriteria.find(critical => critical.id === criteria.id).name = e.target.value;
                                                                this.setState({ criteria: tempCriteria })
                                                            }} />
                                                        </div>
                                                        <div>
                                                            <TextField style={{ width: 40, paddingLeft: 1010 }} type="number" focused={true} defaultValue={criteria.points} onChange={(e) => {
                                                                let tempCriteria = [...this.state.criteria];
                                                                let points = e.target.value;
                                                                if (points === "") {
                                                                    points = 0;
                                                                }
                                                                tempCriteria.find(critical => critical.id === criteria.id).points = points;
                                                                this.setState({ criteria: tempCriteria })
                                                            }} />
                                                        </div>
                                                        <ListItemSecondaryAction>
                                                            <IconButton edge="end" aria-label="Save" onClick={() => {
                                                                let id = criteria.id;
                                                                let tempCriteria = [...this.state.criteria];
                                                                tempCriteria.find(critical => critical.id === id).editing = false;
                                                                this.setState({
                                                                    editing: false,
                                                                    criteria: tempCriteria
                                                                })
                                                            }}>
                                                                <DoneIcon />
                                                            </IconButton>
                                                            <IconButton edge="end" aria-label="Delete" onClick={() => {
                                                                let id = criteria.id;
                                                                let tempCriteria = [...this.state.criteria];
                                                                tempCriteria.splice(tempCriteria.indexOf(criteria), 1);
                                                                tempCriteria.filter(critical => critical.id === id);
                                                                this.setState({
                                                                    criteria: tempCriteria,
                                                                    editing: false
                                                                })
                                                            }}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                )
                                            }
                                            else {
                                                return (

                                                    <Collapse in={entry.open} key={criteria.id}>
                                                        <ListItem key={criteria.id} button style={{ marginLeft: 80 }}>
                                                            <ListItemText>{criteria.name}</ListItemText>
                                                            <ListItemText style={{ textAlign: "right", paddingRight: 310 }}>{criteria.points}</ListItemText>
                                                            <ListItemSecondaryAction>
                                                                <IconButton edge="end" aria-label="edit" onClick={() => {
                                                                    let id = criteria.id;
                                                                    let tempCriteria = [...this.state.criteria];
                                                                    tempCriteria.find(criteria => criteria.id === id).editing = true;
                                                                    this.setState({
                                                                        editing: true,
                                                                        criteria: tempCriteria
                                                                    })
                                                                }}>
                                                                    <EditIcon />
                                                                </IconButton>
                                                                <IconButton disabled={this.state.editing} edge="end" aria-label="Delete" onClick={() => {
                                                                    let id = criteria.id;
                                                                    let tempCriteria = [...this.state.criteria];
                                                                    tempCriteria.splice(tempCriteria.indexOf(criteria), 1);
                                                                    tempCriteria.filter(critical => critical.id === id);
                                                                    this.setState({
                                                                        criteria: tempCriteria,
                                                                        editing: false
                                                                    })
                                                                }}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem> </Collapse>)
                                            }
                                        })}
                                    </List>
                                </div>
                            )
                        }
                    })}
                </List>
                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <Button disabled={this.state.templateName === "" || this.state.editing} style={{ width: "20%", color: "white", backgroundColor: "#2fed95" }} onClick={() => {
                        let outputData = {
                            id: this.state.id,
                            TemplateName: this.state.templateName,
                            Topics: [],
                            Criteria: []
                        };
                        this.state.topics.forEach(topic => outputData.Topics.push({
                            id: topic.id,
                            name: topic.name,
                            critical: topic.critical
                        }));
                        this.state.criteria.forEach(criteria => outputData.Criteria.push({
                            id: criteria.id,
                            name: criteria.name,
                            parentId: criteria.parentId
                        }));
                        this.props.editTemplate(outputData);
                        window.location.href = "/templates"
                    }}>Save</Button>
                </div>
            </div>
        );
    }
}

export default TemplateCreator;