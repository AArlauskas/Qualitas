import React, { Component } from "react";
import "./DefaultMultiSelect.scss";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

class DefaultMultiSelect extends Component {
  state = {
    tagName: [],
  };
  render() {
    const handleChange = (event, value, type) => {
      if (type === "clear") {
        this.setState({ tagName: [] });
      }

      if (value.length > this.props.selectionsCount) return;
      this.setState({ tagName: value });

      if (this.props.onChange !== undefined) {
        this.props.onChange(value, type);
      }
    };

    return (
      <div>
        <Autocomplete
          id={this.props.id}
          defaultValue={this.props.defaultValue}
          multiple
          limitTags={3}
          className="MultiSelect"
          options={this.props.options}
          onChange={handleChange}
          getOptionLabel={this.props.getOptionLabel === undefined ? (option) => option : this.props.getOptionLabel}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={this.props.label}
            />
          )}
        />
      </div>
    );
  }
}

export default DefaultMultiSelect;
