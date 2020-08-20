import React, { Component } from 'react';
import { Backdrop } from '@material-ui/core';
import RingLoader from "react-spinners/RingLoader";
class LoadingScreen extends Component {
    state = {}
    render() {
        return (
            <div style={{ textAlign: "center" }}>
                <Backdrop open={true}>
                    <RingLoader size={150} color={"#ce2b27"} />
                </Backdrop>
            </div>
        );
    }
}

export default LoadingScreen;