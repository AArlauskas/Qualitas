import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';

const CriticalListItem = (props) => {
    return (
        <div key={props.critical.name}>
            <ListItem>
                <ListItemText>{props.critical.name}</ListItemText>
                <ListItemSecondaryAction>
                    <ListItemText>Breached: {props.critical.breachedCount}</ListItemText>
                </ListItemSecondaryAction>
            </ListItem>
            <hr style={{ borderTop: "1px solid red" }} />
        </div>
    );
}

export default CriticalListItem;