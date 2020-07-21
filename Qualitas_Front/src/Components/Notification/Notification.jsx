import React, { Component } from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
// import Slide from "@material-ui/core/Slide";

class Notification extends Component {
    state = {
        open: this.props.open,
    };
    render() {
        const handleClose = (event, reason) => {
            if (reason === "clickaway") {
                return;
            }
            this.props.onClose();
        };
        function Alert(props) {
            return <MuiAlert elevation={6} variant="filled" {...props} />;
        }
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                open={this.props.open}
                onClose={handleClose}
                autoHideDuration={5000}
            // TransitionComponent={<Slide direction="up" />}
            >
                <Alert
                    severity={
                        this.props.severity === ""
                            ? "success"
                            : this.props.severity
                    }
                >
                    {this.props.message}
                </Alert>
            </Snackbar>
        );
    }
}

export default Notification;
