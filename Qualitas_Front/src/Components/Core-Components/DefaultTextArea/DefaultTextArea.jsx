import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import "./DefaultTextArea.scss";

class DefaultTextArea extends Component {
  state = {
    value: undefined,
  };
  render() {
    const isRequiredErrorShown = () => {
      return this.props.isRequired && this.state.value === "";
    };
    return (
      <div>
        <TextField
          defaultValue={this.props.defaultValue}
          error={isRequiredErrorShown()}
          helperText={isRequiredErrorShown() ? "Required!" : null}
          className="TextArea"
          multiline
          rows="4"
          variant="outlined"
          name={this.props.name}
          label={
            this.props.isRequired ? "*" + this.props.label : this.props.label
          }
          onChange={(e) => {
            this.setState({ value: e.target.value });
            if (this.props.onChange !== undefined) {
              this.props.onChange(e);
            }
          }}
          onBlur={this.props.handleBur}
          value={this.state.value}
          inputProps={{ maxLength: this.props.maxLength }}
        />
      </div>
    );
  }
}

export default DefaultTextArea;
