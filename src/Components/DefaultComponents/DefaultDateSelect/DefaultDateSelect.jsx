import React, { Component } from "react";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import "./DefaultDateSelect.scss";

class DefaultDateSelect extends Component {
  state = {
    value: this.props.value,
  };
  render() {
    return (
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            id={this.props.id}
            defaultValue={this.props.defaultValue}
            name={this.props.name}
            error={this.state.value === undefined}
            helperText={this.state.value === undefined ? "Required!" : null}
            className="DatePicker"
            format={"yyyy/MM/dd"}
            animateYearScrolling
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            value={this.state.value}
            label={this.props.label}
            onChange={(e) => {
              this.setState({ value: e });
              if (this.props.onChange !== undefined) {
                this.props.onChange(e);
              }
            }}
          />
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default DefaultDateSelect;
