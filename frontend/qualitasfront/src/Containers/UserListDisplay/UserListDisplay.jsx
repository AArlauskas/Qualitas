import React, { Component } from 'react';
import users from '../../Constants/Users';
import { List, ListItem, Button } from '@material-ui/core';

class UserListDisplay extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
                <h3>Admins</h3>
                <List>
                {users.map(user => {
                    return (
                        <ListItem classes={{ gutters: "padding" }}>
                            <Button>
                                {user.user}
                            </Button>
                            </ListItem> 
                    );
                })}
                </List>
            </div>
         );
    }
}
 
export default UserListDisplay;