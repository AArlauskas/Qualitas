import React, { Component } from 'react';
import { Button } from '@material-ui/core';

class UserReviewDisplay extends Component {
    state = {
        id: parseInt(window.location.href.split("/userDetails/")[1])
    }
    render() {
        return (
            <div>
                <Button color="primary" variant="outlined" href={"/newCase/" + this.state.id} style={{ marginBottom: 10 }}>Evaluate case</Button>
                User Review Display
            </div>
        );
    }
}

export default UserReviewDisplay;