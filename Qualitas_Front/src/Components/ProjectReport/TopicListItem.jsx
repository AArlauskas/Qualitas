import React, { useState } from 'react';
import { ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, List, ListSubheader } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';

const getCriterias = (topic) => {
    let result = [];
    let group = topic.criterias.reduce((r, a) => {
        r[a.name] = [...r[a.name] || [], a];
        return r;
    }, {});
    Object.keys(group).forEach(key => {
        let score = 0;
        let points = 0;
        group[key].forEach(member => {
            score += member.score;
            points += member.points;
        });
        result.push({
            name: key,
            score: score,
            points: points
        })
    });
    return result;

}
const TopicListItem = (props) => {
    const [open, setOpen] = useState(false);
    return (
        <React.Fragment key={props.topic.name}>
            <ListItem onClick={() => setOpen(!open)} button >
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
                    <ListSubheader disableSticky style={{ color: "green" }}>Criteria</ListSubheader>
                    {getCriterias(props.topic).map(criteria => {
                        return (
                            <React.Fragment key={criteria.name}>
                                <ListItem>
                                    <ListItemText>{criteria.name}</ListItemText>
                                    <ListItemSecondaryAction>
                                        <ListItemText>{isNaN(Math.trunc(criteria.score / criteria.points * 100)) ? "0%" : Math.trunc(criteria.score / criteria.points * 100) + "%"}</ListItemText>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <hr style={{ borderTop: "1px solid green" }} />
                            </React.Fragment>
                        );
                    })}
                </List>
                : null}
            <hr style={{ borderTop: "1px solid blue" }} />
        </React.Fragment>
    );
}

export default TopicListItem;