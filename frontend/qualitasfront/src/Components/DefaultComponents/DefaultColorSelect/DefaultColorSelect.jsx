import React, { Component } from "react";
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from "@material-ui/icons/Create";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import ColorPicker from "material-ui-color-picker";
import { MenuItem, TextField } from "@material-ui/core";
import "./DefaultColorSelect.scss";

class DefaultColorSelect extends Component {
	state = {
		value: this.props.defaultValue === undefined ? "" : this.props.defaultValue,
		isCustomColorGiven: this.props.isCustomColor,
		customColor: false
	};
	render() {
		return (
			<div>
				{this.state.customColor ? (
					<div className="CustomColorPickerBlock">
						<ColorPicker
							name={this.props.name}
							className="ColorPicker"
							value={this.state.value}
							defaultValue={this.props.label === undefined ? "Custom color" : this.props.label}
							disabled={true}
							onBlur={this.props.handleBlur}
							onChange={(e) => {
								if (e === undefined) {
									return;
								}
								this.setState({ value: e });
								if (this.props.onChange !== undefined) {
									this.props.onChange(e);
								}
							}}
						/>
						<CloseIcon
							className="CloseIcon"
							onClick={() => this.setState({ customColor: false, value: "" })}
						/>
					</div>
				) : (
					<div>
						<TextField
							name={this.props.name}
							label={this.props.label}
							variant="outlined"
							select
							className="Select"
							onChange={(e) => {
								this.setState({ value: e.target.value });
								if (this.props.onChange !== undefined) {
									this.props.onChange(e.target.value);
								}
							}}
							onBlur={this.props.handleBlur}
							value={this.props.value === undefined ? this.state.value : this.props.value}
						>
							{this.props.options === undefined ? (
								<MenuItem value={"novalue"}>No values!</MenuItem>
							) : (
								this.props.options.map((color) => {
									return (
										<MenuItem value={color.Value} key={color.Value}>
											<StopRoundedIcon
												viewBox="0 -3 24 24"
												fontSize="small"
												style={{ color: color.Value }}
											/>
											{color.Name}
										</MenuItem>
									);
								})
							)}
							{this.state.isCustomColorGiven ? (
								<MenuItem value={this.props.defaultValue}>
									<StopRoundedIcon
										viewBox="0 -3 24 24"
										fontSize="small"
										style={{ color: this.props.defaultValue }}
									/>
									Custom
								</MenuItem>
							) : null}
							)}
						</TextField>
						<CreateIcon className="CreateIcon" onClick={() => this.setState({ customColor: true })} />
					</div>
				)}
			</div>
		);
	}
}

export default DefaultColorSelect;
