import React, { useState } from 'react';
import { ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, List, ListSubheader, Tooltip, IconButton, FormControl } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp, DescriptionOutlined, CommentOutlined } from '@material-ui/icons';
import Fade from '@material-ui/core/Fade';
import { withStyles } from "@material-ui/styles";

const CustomTooltip = withStyles({
    tooltip: {
        color: "black",
        backgroundColor: "white",
        fontSize: 15
    }
})(Tooltip);

const getCriterias = (topic) => {
    let result = [];
    let group = topic.criterias.reduce((r, a) => {
        r[a.name] = [...r[a.name] || [], a];
        return r;
    }, {});
    Object.keys(group).forEach(key => {
        let score = 0;
        let points = 0;
        let comments = [];
        group[key].forEach(member => {
            score += member.score;
            points += member.points;
            member.comments.forEach(comment => comments.push(comment));
        });
        result.push({
            name: key,
            score: score,
            description: group[key][0].description === null ? "" : group[key][0].description,
            points: points,
            comments: comments
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

                {props.topic.description === "" || props.topic.description === undefined ? null :
                    <ListItemIcon>
                        <CustomTooltip arrow TransitionComponent={Fade} title={props.topic.description} interactive>
                            <DescriptionOutlined />
                        </CustomTooltip>  </ListItemIcon>}

                <ListItemText>{props.topic.name}</ListItemText>
                <ListItemSecondaryAction>
                    <ListItemText>Score: {isNaN(Math.round(props.topic.score / props.topic.points * 10000) / 100) ? "0%" : Math.round(props.topic.score / props.topic.points * 10000) / 100 + "%"}</ListItemText>
                </ListItemSecondaryAction>
            </ListItem>
            {open ?
                <List style={{ color: "green", paddingLeft: 50 }}>
                    <ListSubheader disableSticky style={{ color: "green" }}>Criteria</ListSubheader>
                    {getCriterias(props.topic).map(criteria => {
                        return (
                            <React.Fragment key={criteria.name}>
                                <ListItem>
                                    {criteria.description === "" || criteria.description === undefined ? null :
                                        <ListItemIcon>
                                            <CustomTooltip arrow TransitionComponent={Fade} title={criteria.description} interactive>
                                                <DescriptionOutlined />
                                            </CustomTooltip>  </ListItemIcon>}
                                    <ListItemText style={{ marginRight: 50 }}>{criteria.name}</ListItemText>
                                    <ListItemSecondaryAction>
                                        <FormControl style={{ marginTop: 5 }}>
                                            <ListItemText>{isNaN(Math.round(criteria.score / criteria.points * 10000) / 100) ? "0%" : Math.round(criteria.score / criteria.points * 10000) / 100 + "%"}</ListItemText>
                                        </FormControl>
                                        <FormControl>
                                            <ListItemIcon>
                                                {criteria.comments.length === 0 ? null :
                                                    <IconButton onClick={() => props.openDialog(criteria.comments)}>
                                                        <CommentOutlined />
                                                    </IconButton>
                                                }
                                            </ListItemIcon>
                                        </FormControl>
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