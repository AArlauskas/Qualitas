import React, { Component } from "react";

import "./DefaultDraftApprovedButton.scss";
import { RadioGroup, FormControlLabel, Radio } from "@material-ui/core";

class DefaultDraftApprovedButton extends Component {
    state = {
        value: "draft"
    }
    render() {
        return (
            <div>
                <RadioGroup className="RadioContainer" defaultValue="draft" onChange={e => {
                    this.setState({ value: e.target.value });
                    if (this.props.onChange !== undefined) {
                        this.props.onChange(e.target.value);
                    }
                }}>
                    <FormControlLabel
                        value="draft"
                        label="Draft"
                        control={<Radio className="RedRadio" />} />
                    <FormControlLabel
                        value="approved"
                        label="Approved"
                        control={<Radio className="RedRadio" />} />
                </RadioGroup>
            </div>
        );
    }
}

export default DefaultDraftApprovedButton;
