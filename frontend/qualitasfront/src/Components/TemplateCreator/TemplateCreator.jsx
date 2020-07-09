import React, { Component } from 'react';
import { Button } from '@material-ui/core';

class TemplateCreator extends Component {
    state = {}
    render() {
        return (
            <div>
                <div className="ButtonBlock" >
                    <Button variant="contained" style={{ marginRight: 5 }}>
                        Add topic
                    </Button>
                    <Button color="primary" variant="contained" style={{ marginRight: 5 }}>
                        Add criteria
                    </Button>
                    <Button color="secondary" variant="contained">
                        Add critical
                    </Button>
                </div>
            </div>
        );
    }
}

export default TemplateCreator;