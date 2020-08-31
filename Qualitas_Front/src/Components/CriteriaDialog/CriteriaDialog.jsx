import React from 'react';
// import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, ListItemText, List, ListItem } from "@material-ui/core";

export default function CriteriaDialog(props) {
    return (
        <div>
            {props.open ? <Dialog open={props.open} onClose={props.closeDialog}>
                <DialogTitle>Comments</DialogTitle>
                <List style={{ height: 600 }}>
                    {props.data.map(comment => {
                        return (
                            <React.Fragment key={comment.comment}>
                                <ListItem>
                                    <ListItemText style={{ marginRight: 100 }}>
                                        {comment.name + ":"}
                                    </ListItemText>
                                    <ListItemText>
                                        {comment.comment}
                                    </ListItemText>

                                </ListItem>
                                <hr />
                            </React.Fragment>
                        )
                    })}
                </List>
            </Dialog> : null}
        </div>
    )
}