import React, { Component } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import "./DefaultAutoComplete.scss";

class DefaultAutoComplete extends Component {
  state = {
    value: "",
  };
  render() {
    return (
      <div>
        <Autocomplete
          id={this.props.id}
          defaultValue={this.props.defaultValue}
          name={this.props.name}
          className="AutoComplete"
          options={this.props.options}
          getOptionLabel={this.props.getOptionLabel === undefined ?(option) => option : this.props.getOptionLabel}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={
                this.props.isRequired
                  ? "*" + this.props.label
                  : this.props.label
              }
              onSelect={(e) => {
                this.setState({ value: e.target.value });
                if (this.props.onSelect !== undefined) {
                  this.props.onSelect(e);
                }
              }}
            />
          )}
        />
      </div>
    );
  }
}

export default DefaultAutoComplete;
