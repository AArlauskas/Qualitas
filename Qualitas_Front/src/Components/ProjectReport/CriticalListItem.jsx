import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';

const CriticalListItem = (props) => {
    return (
        <React.Fragment>
            <ListItem key={props.critical.name}>
                <ListItemText>{props.critical.name}</ListItemText>
                <ListItemSecondaryAction>
                    <ListItemText>Breached: {props.categories.length === 0 ? props.critical.breachedCount :
                        calculateCriticals(props.critical.criticalCategories.filter(category => props.categories.includes(category.name)))}</ListItemText>
                </ListItemSecondaryAction>
            </ListItem>
            <hr />
        </React.Fragment>
    );
}

const calculateCriticals = (data) => {
    let sum = 0;
    data.forEach(e => sum += e.breachedCount);
    return sum;
}

export default CriticalListItem;