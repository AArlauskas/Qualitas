import * as React from "react";
import DefaultButton from "../../DefaultButton";
import "./ButtonBlock.scss";

const ButtonBlock = (props) => {

    return (
        <div className="buttonBlock">
            <div className="innerButton">
                <DefaultButton
                    purpose="save"
                    label="Save"
                    type={props.saveType}
                    onClick={props.onSave}
                />
            </div>
        </div>

    );
}

export default ButtonBlock