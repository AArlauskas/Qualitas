import React, { useState } from 'react';
import { ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, List, ListSubheader } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';


const TopicListItem = (props) => {
    const [open, setOpen] = useState(false);
    return (
        <React.Fragment>
            <ListItem onClick={() => setOpen(!open)} button key={props.topic.name}>
                <ListItemIcon>
                    {open ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
                </ListItemIcon>
                <ListItemText>{props.topic.name}</ListItemText>
                <ListItemSecondaryAction>
                    <ListItemText>Score: {isNaN(Math.trunc(props.topic.score / props.topic.points * 100)) ? "0%" : Math.trunc(props.topic.score / props.topic.points * 100) + "%"}</ListItemText>
                </ListItemSecondaryAction>
            </ListItem>
            {open ?
                <List style={{ color: "green", paddingLeft: 50 }}>
                    <ListSubheader style={{ color: "green" }}>Criteria</ListSubheader>
                    {props.topic.criterias.map(criteria => {
                        return (
                            <React.Fragment>
                                <ListItem>
                                    <ListItemText>{criteria.name}</ListItemText>
                                    <ListItemSecondaryAction>
                                        <ListItemText>{isNaN(Math.trunc(criteria.score / criteria.points * 100)) ? "0%" : Math.trunc(criteria.score / criteria.points * 100) + "%"}</ListItemText>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <hr />
                            </React.Fragment>
                        );
                    })}
                </List>
                : null}
            <hr />
        </React.Fragment>
    );
}

export default TopicListItem;