import React, { Component } from 'react';
import { Button, List, ListItem, ListItemText, TextField, ListItemSecondaryAction, IconButton, ListSubheader } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';

class TemplateCreator extends Component {
    state = {
        editing: false,
        topics: [
            {
                id: 0,
                name: "Confidentiality",
                critical: true,
                editing: false
            },
            {
                id: 1,
                name: "Swearing",
                critical: true,
                editing: false
            },
            {
                id: 2,
                name: "Communication",
                critical: false,
                editing: false
            },
            {
                id: 3,
                name: "Data Entries",
                critical: false,
                editing: false
            }
        ],
        criteria: []
    }
    render() {
        return (
            <div>
                <div className="ButtonBlock" >
                    <Button variant="contained" style={{ marginRight: 5 }} onClick={() => {
                        let tempTopics = [...this.state.topics]
                        tempTopics.push({
                            id: this.state.topics.length,
                            name: "Enter name",
                            critical: false,
                            editing: true,
                        });
                        this.setState({ topics: tempTopics, editing: true })
                    }}>
                        Add topic
                    </Button>
                    <Button color="primary" variant="contained" style={{ marginRight: 5 }}>
                        Add criteria
                    </Button>
                    <Button color="secondary" variant="contained" onClick={() => {
                        let tempTopics = [...this.state.topics]
                        tempTopics.push({
                            id: this.state.topics.length,
                            name: "Enter name",
                            critical: true,
                            editing: true,
                        });
                        this.setState({ topics: tempTopics, editing: true })
                    }}>
                        Add critical
                    </Button>
                </div>
                <List style={{ color: "red" }}>
                    <ListSubheader component="div" style={{ color: "red" }} >
                        Criticals
                    </ListSubheader>
                    {this.state.topics.filter(topic => topic.critical).map(entry => {
                        if (entry.editing) {
                            return (
                                <ListItem button key={entry.id}>
                                    <TextField focused={true} style={{ width: 500 }} defaultValue={entry.name} onChange={e => {
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
                                                topics: tempTopics
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
                                            this.setState({
                                                topics: tempTopics
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
                <List>
                    <ListSubheader component="div" >
                        Topics and Criterias
                    </ListSubheader>
                    {this.state.topics.filter(topic => !topic.critical).map(entry => {
                        if (entry.editing) {
                            return (
                                <ListItem button key={entry.id}>
                                    <TextField focused={true} style={{ width: 500 }} defaultValue={entry.name} onChange={e => {
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
                                                topics: tempTopics
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
                                <div>
                                    <ListItem button key={entry.id}>
                                        <ListItemText>{entry.name}</ListItemText>
                                        <ListItemSecondaryAction>
                                            <IconButton disabled={this.state.editing} edge="end" aria-label="Add" onClick={() => {
                                                let newCriteria = {
                                                    id: this.state.criteria.length,
                                                    name: "Enter criteria name",
                                                    points: 1,
                                                    editing: true,
                                                    parentId: entry.id
                                                };
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
                                                this.setState({
                                                    topics: tempTopics
                                                })
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <List>
                                        {this.state.criteria.filter(criteria => criteria.parentId === entry.id).map(criteria => {
                                            if (criteria.editing) {
                                                return (
                                                    <ListItem button key={criteria.id}>
                                                        <TextField focused={true} style={{ width: 500 }} defaultValue={criteria.name} onChange={e => {
                                                            let tempCriteria = [...this.state.criteria];
                                                            tempCriteria.find(critical => critical.id === criteria.id).name = e.target.value;
                                                            this.setState({ criteria: tempCriteria })
                                                        }} />
                                                        <TextField style={{ marginLeft: 1000, width: 100 }} type="number" focused={true} defaultValue={criteria.points} onChange={(e) => {
                                                            let tempCriteria = [...this.state.criteria];
                                                            tempCriteria.find(critical => critical.id === criteria.id).points = e.target.value;
                                                            this.setState({ criteria: tempCriteria })
                                                        }} />
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
                                                                    criteria: tempCriteria
                                                                })
                                                            }}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                )
                                            }
                                            else {
                                                return (<ListItem button style={{ marginLeft: 30 }}>
                                                    <ListItemText>{criteria.name}</ListItemText>
                                                    <ListItemText>Points: {criteria.points}</ListItemText>
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
                                                                criteria: tempCriteria
                                                            })
                                                        }}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>)
                                            }
                                        })}
                                    </List>
                                </div>
                            )
                        }
                    })}
                </List>
            </div>
        );
    }
}

export default TemplateCreator;