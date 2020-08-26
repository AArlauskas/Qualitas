import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon, Fade, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { DescriptionOutlined } from '@material-ui/icons';

const CustomTooltip = withStyles({
    tooltip: {
        color: "black",
        backgroundColor: "white",
        fontSize: 15
    }
})(Tooltip);

const CriticalListItem = (props) => {
    return (
        <div key={props.critical.name}>
            <ListItem>
                {props.critical.description === "" || props.critical.description === undefined ? null :
                    <ListItemIcon>
                        <CustomTooltip arrow TransitionComponent={Fade} title={props.critical.description} interactive>
                            <DescriptionOutlined />
                        </CustomTooltip>  </ListItemIcon>}
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