import React, { Component } from 'react';
import { Button } from '@material-ui/core';

class TemplatesDisplay extends Component {
    state = {}
    render() {
        return (
            <div>
                <Button color="primary" href="/newTemplate">Create new template</Button>
            </div>
        );
    }
}

export default TemplatesDisplay;