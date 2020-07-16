import { ActionType } from "../Constants/ActionType";

export const createTemplate = (data) => (dispatch) => {
    dispatch({
        type: ActionType.CREATE_TEMPLATE,
        payload: data
    })
}