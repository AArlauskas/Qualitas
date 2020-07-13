import { ActionType } from "../Constants/ActionType";

export const editTemplate = (data) => (dispatch) => {
    dispatch({
        type: ActionType.UPDATE_TEMPLATE,
        payload: data
    })
}