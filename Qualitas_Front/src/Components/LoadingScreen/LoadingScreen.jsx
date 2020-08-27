import React, { Component } from 'react';
import { Backdrop } from '@material-ui/core';
import PacmanLoader from "react-spinners/PacmanLoader";
class LoadingScreen extends Component {
    state = {}
    render() {
        return (
            <div style={{ textAlign: "center" }}>
                <Backdrop open={true}>
                    <PacmanLoader size={125} color={"#DAA1A0"} />
                </Backdrop>
            </div>
        );
    }
}

export default LoadingScreen;