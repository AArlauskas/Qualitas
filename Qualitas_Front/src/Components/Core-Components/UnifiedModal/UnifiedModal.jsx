import * as React from "react";
import Modal from "@material-ui/core/Modal";

import "./UnifiedModal.scss";

const UnifiedModal = (props) => {

  return (
    <div>
      <Modal
        open={props.open}
        className={`unifiedModal ${props.className}`}
      >
        <div className="paper">
          <div className="title">
            <h1>{props.title}</h1>
          </div>
          {props.children}
        </div>
      </Modal>
    </div>
  );
}

export default UnifiedModal

