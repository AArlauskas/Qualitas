import React, { Component } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';

class LoadingScreen extends Component {
    state = {}
    render() {
        return (
            <div style={{ textAlign: "center" }}>
                <Backdrop open={true}>
                    <CircularProgress style={{ width: 150, height: 150 }} />
                </Backdrop>
            </div>
        );
    }
}

export default LoadingScreen;