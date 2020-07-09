import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import "./DefaultTextField.scss";

class DefaultTextField extends Component {
    state = {
        value: null,
    };
    render() {
        const isRequiredErrorShown = () => {
            return this.props.isRequired ? this.state.value === "" : false;
        };

        const onValueChange = (event) => {
            this.setState({ value: event.target.value });
            if (this.props.onChange !== undefined) {
                this.props.onChange(event);
            }
        };
        return (
            <div className="TextFieldBlock">
                <TextField
                    style={this.props.style}
                    id={this.props.id}
                    defaultValue={this.props.defaultValue}
                    error={isRequiredErrorShown()}
                    name={this.props.name}
                    className="TextField"
                    label={
                        this.props.isRequired === undefined ||
                            this.props.isRequired === false
                            ? this.props.label
                            : "*" + this.props.label
                    }
                    onChange={onValueChange}
                    onBlur={this.props.onBlur}
                    value={this.props.value}
                    inputProps={{ maxLength: this.props.maxLength }}
                    helperText={isRequiredErrorShown() ? null : null}
                />
            </div>
        );
    }
}

export default DefaultTextField;
