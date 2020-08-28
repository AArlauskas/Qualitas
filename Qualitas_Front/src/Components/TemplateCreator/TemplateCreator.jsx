import React, { Component } from 'react';
import { Button, List, ListItem, ListItemText, TextField, ListItemSecondaryAction, IconButton, ListSubheader, ListItemIcon, Collapse, Chip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import DescriptionIcon from '@material-ui/icons/Description';
import UnifiedModal from '../Core-Components/UnifiedModal';
import DefaultTextArea from '../Core-Components/DefaultTextArea/DefaultTextArea';
import ButtonBlock from '../Core-Components/UnifiedModal/ButtonBlock/ButtonBlock';

const calculateSum = (criteria) => {
    let sum = 0;
    criteria.forEach(temp => sum += parseInt(temp.points));
    return sum;
}

let index = 4;

class TemplateCreator extends Component {
    state = {
        modalOpen: false,
        criteriaModalOpen: false,
        commentTopicId: null,
        criteriaId: null,
        editing: false,
        templateName: "",
        topics: [
            {
                id: 0,
                name: "Confidentiality",
                critical: true,
                description: "",
                editing: false,
                open: true,
            },
            {
                id: 1,
                name: "Swearing",
                critical: true,
                description: "",
                editing: false,
                open: true,
            },
            {
                id: 2,
                name: "Communication",
                critical: false,
                description: "",
                editing: false,
                open: true,
            },
            {
                id: 3,
                name: "Data Entries",
                critical: false,
                description: "",
                editing: false,
                open: true,
            }
        ],
        criteria: [],
        categories: ["inbound", "outbound"],
        currentCategory: ""
    }

    render() {
        return (
            <div>
                <UnifiedModal open={this.state.modalOpen} title="Description">
                    <DefaultTextArea defaultValue={this.state.modalOpen ? this.state.topics.find(topic => topic.id === this.state.commentTopicId).description : ""} label="Add description..." maxLength={600} onChange={e => {
                        let TempTopics = [...this.state.topics];
                        TempTopics.find(topic => topic.id === this.state.commentTopicId).description = e.target.value;
                        this.setState({
                            topics: [...TempTopics]
                        })
                    }} />
                    <ButtonBlock onSave={() => this.setState({ modalOpen: false, commentTopicId: null })} />
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
                <div style={{ marginLeft: "15%", marginRight: "15%", marginTop: 25, background: "rgba(242, 245, 249, 0.6)", borderRadius: 10, textAlign: "center" }}>
                    <TextField error={this.props.templateNames.some(temp => temp === this.state.templateName)} inputProps={{ style: { textAlign: 'center' } }} style={{ paddingBottom: 15, width: 250 }} defaultValue="" label="Template name" onChange={e => this.setState({ templateName: e.target.value })} />
                    {this.props.templateNames.some(temp => temp === this.state.templateName) ? <p style={{ color: "red" }}>Template name already exists!</p> : null}
                    <div className="ButtonBlock" >
                        <Button color="secondary" variant="contained" onClick={() => {
                            let tempTopics = [...this.state.topics]
                            tempTopics.push({
                                id: index,
                                name: "Enter name",
                                description: "",
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
                                description: "",
                                critical: false,
                                editing: true,
                                open: true,
                            });
                            index++;
                            this.setState({ topics: tempTopics, editing: true })
                        }}>
                            Add topic
                    </Button>
                        <div style={{ marginLeft: "15%", marginRight: "15%", marginTop: 15, marginBottom: 15 }}>
                            <TextField inputProps={{ style: { textAlign: 'center' } }} onKeyPress={e => {
                                if (e.key === "Enter") {
                                    if (this.state.currentCategory !== "" && !this.state.categories.includes(this.state.currentCategory)) {
                                        let tempCategories = [...this.state.categories];
                                        tempCategories.push(this.state.currentCategory);
                                        this.setState({
                                            currentCategory: "",
                                            categories: tempCategories
                                        })
                                    }
                                }
                            }} value={this.state.currentCategory} label="Add category" onChange={e => this.setState({ currentCategory: e.target.value })} />
                            <IconButton style={{ marginTop: 5 }} onClick={() => {
                                if (this.state.currentCategory !== "" && !this.state.categories.includes(this.state.currentCategory)) {
                                    let tempCategories = [...this.state.categories];
                                    tempCategories.push(this.state.currentCategory);
                                    this.setState({
                                        currentCategory: "",
                                        categories: tempCategories
                                    })
                                }
                            }}>
                                <AddIcon />
                            </IconButton>
                            <div>
                                {this.state.categories.map(category => {
                                    return (
                                        <Chip style={{ margin: 2, backgroundColor: "rgba(218, 161, 160, 0.5)" }} key={category} label={category} onDelete={() => {
                                            let tempCategories = [...this.state.categories];
                                            this.setState({
                                                categories: tempCategories.filter(temp => temp !== category)
                                            })
                                        }} />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <p style={{ paddingTop: 10 }}><b>Overall Points: {calculateSum(this.state.criteria)}</b></p>
                    <List style={{ color: "red" }}>
                        <ListSubheader disableSticky component="div" style={{ color: "red" }} >
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
                                                    if (this.state.topics.filter(topic => topic.name === this.state.topics.find(critical => critical.id === id).name).length === 1) {

                                                        let tempTopics = [...this.state.topics];
                                                        tempTopics.find(critical => critical.id === id).editing = false;
                                                        this.setState({
                                                            editing: false,
                                                            topics: tempTopics
                                                        })
                                                    }
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
                                    <ListItem button>
                                        <ListItemIcon>
                                            <IconButton onClick={() => this.setState({ modalOpen: true, commentTopicId: entry.id })}>
                                                <DescriptionIcon style={{ color: entry.description === "" ? null : "green" }} />
                                            </IconButton>
                                        </ListItemIcon>
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
                        <ListSubheader disableSticky style={{ color: "blue" }} component="div" >
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
                                                    if (this.state.topics.filter(topic => topic.name === this.state.topics.find(critical => critical.id === id).name).length === 1) {
                                                        let tempTopics = [...this.state.topics];
                                                        tempTopics.find(critical => critical.id === id).editing = false;
                                                        this.setState({
                                                            editing: false,
                                                            topics: tempTopics
                                                        })
                                                    }
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
                                                <ListItemText style={{ textAlign: "right", marginRight: 80 }}>{<p style={{ paddingTop: 15 }}>Points: {calculateSum(this.state.criteria.filter(temp => temp.parentId === entry.id))}</p>}</ListItemText>
                                                <ListItemSecondaryAction>
                                                    <IconButton disabled={this.state.editing} edge="end" aria-label="Add" onClick={() => {
                                                        let newCriteria = {
                                                            id: index,
                                                            name: "Enter criteria name",
                                                            description: "",
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
                                                            <div style={{ paddingLeft: 80 }} >
                                                                <TextField onKeyPress={e => {
                                                                    if (e.key === "Enter") {
                                                                        let id = criteria.id;
                                                                        let tempCriteria = [...this.state.criteria];
                                                                        tempCriteria.find(critical => critical.id === id).editing = false;
                                                                        this.setState({
                                                                            editing: false,
                                                                            criteria: tempCriteria
                                                                        })
                                                                    }
                                                                }} autoFocus style={{ width: "80%" }} defaultValue={criteria.name} onChange={e => {
                                                                    let tempCriteria = [...this.state.criteria];
                                                                    tempCriteria.find(critical => critical.id === criteria.id).name = e.target.value;
                                                                    this.setState({ criteria: tempCriteria })
                                                                }} />
                                                            </div>
                                                            <div>
                                                                <TextField onKeyPress={e => {
                                                                    if (e.key === "Enter") {
                                                                        let id = criteria.id;
                                                                        let tempCriteria = [...this.state.criteria];
                                                                        tempCriteria.find(critical => critical.id === id).editing = false;
                                                                        this.setState({
                                                                            editing: false,
                                                                            criteria: tempCriteria
                                                                        })
                                                                    }
                                                                }} style={{ width: 40, marginLeft: 60 }} type="number" focused={true} defaultValue={criteria.points} onChange={(e) => {
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
                                                                    if (this.state.criteria.filter(temp => temp.name === this.state.criteria.find(critical => critical.id === id).name).length === 1) {
                                                                        let tempCriteria = [...this.state.criteria];
                                                                        tempCriteria.find(critical => critical.id === id).editing = false;
                                                                        this.setState({
                                                                            editing: false,
                                                                            criteria: tempCriteria
                                                                        })
                                                                    }
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
                                                            <ListItem style={{ paddingLeft: 40 }}>
                                                                <ListItemIcon>
                                                                    <IconButton onClick={() => this.setState({ criteriaModalOpen: true, criteriaId: criteria.id })}>
                                                                        <DescriptionIcon style={{ color: criteria.description === "" ? null : "green" }} />
                                                                    </IconButton>
                                                                </ListItemIcon>
                                                                <ListItemText>{criteria.name}</ListItemText>
                                                                <ListItemText style={{ textAlign: "right", marginRight: 80, marginLeft: 30 }}>{criteria.points}</ListItemText>
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
                </div>
                <div style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>
                    <Button disabled={this.state.templateName === "" || this.state.editing || this.props.templateNames.some(temp => temp === this.state.templateName)} style={{ width: "20%", color: "white", backgroundColor: "#DAA1A0" }} onClick={() => {
                        let outputData = {
                            TemplateName: this.state.templateName,
                            Topics: [],
                            Criteria: [],
                            Categories: this.state.categories
                        };
                        this.state.topics.forEach(topic => outputData.Topics.push({
                            id: topic.id,
                            name: topic.name,
                            description: topic.description,
                            critical: topic.critical
                        }));
                        this.state.criteria.forEach(criteria => outputData.Criteria.push({
                            id: criteria.id,
                            name: criteria.name,
                            description: criteria.description,
                            points: criteria.points,
                            parentId: criteria.parentId
                        }));
                        console.log(outputData);
                        this.props.createTemplate(outputData);
                        setTimeout(() => window.location.href = "/templates", 3000);
                    }}>Save</Button>
                </div>
            </div>
        );
    }
}

export default TemplateCreator;