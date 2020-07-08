import React, { Component } from 'react';
import users from '../../Constants/Users';
import DefaultAutoComplete from "../../Components/DefaultComponents/DefaultAutoComplete"
import { List, ListItem, Button } from '@material-ui/core';

class UserListDisplay extends Component {
    state = { 
        type: "user"
     }
    render() { 
        return ( 
            <div>
                {console.log(this.state.type)}
                <div style={{marginBottom: 15, marginTop: 10}}>
                <DefaultAutoComplete 
                label="Groups:"
                options={[{name: "Users", type: "user"},
            {name: "Admins", type: "admin"},
        {name: "Clients", type: "client"}]}
                defaultValue={{name: "Users", type: "user"}}
                onSelect={e => this.setState({
                    type: e.target.value.type
                })}
                getOptionLabel={option => option.name}/>
                </div>
                <List>
                {users.filter(user => user.role === this.state.type).map(user => {
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