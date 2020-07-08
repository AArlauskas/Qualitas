import React, { Component } from 'react';
import QLogo from "../../Images/QLogo.png";
import { TextField, Button } from '@material-ui/core';
import Users from "../../Constants/Users";

class LoginLayout extends Component {
    state = {
        username: "",
        password: "",
        showError: ""
    }
    render() {
        return (
            <div style={{ textAlign: "center" }}>
                <img src={QLogo} alt="Logo" style={{ width: 400, height: 400 }} />
                <div style={{ textAlign: "center" }}>
                    <form>
                        <div>
                            <TextField
                                style={{ width: 200 }}
                                label="username"
                                required
                                error={this.state.showError !== ""}
                                helperText={this.state.showError === "" ?
                                    null : this.state.showError === "wrong" ? "Field is wrong" : "Too short!"}
                                onChange={e => this.setState({ username: e.target.value })} />
                        </div>
                        <div>
                            <TextField
                                label="password"
                                required
                                password
                                error={this.state.showError !== ""}
                                helperText={this.state.showError === "" ?
                                    null : this.state.showError === "wrong" ? "Field is wrong" : "Too short!"}
                                onChange={e => this.setState({ password: e.target.value })}
                            />
                        </div>
                        <Button onClick={() => {
                            if (this.state.username.length <= 3 || this.state.password.length <= 3) {
                                this.setState({ showError: "tooShort" })
                                return;
                            }
                            else {
                                let doneUser = null;
                                Users.forEach(user => {
                                    if (user.user === this.state.username && user.pass === this.state.password) {
                                        doneUser = user;
                                    }
                                });
                                if (doneUser !== null) {
                                    window.localStorage.setItem("name", doneUser.user);
                                    window.localStorage.setItem("role", doneUser.role);
                                    window.location.reload(false);
                                }
                                else {
                                    this.setState({ showError: "wrong" });
                                }
                            }
                        }}>Sign in</Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginLayout;