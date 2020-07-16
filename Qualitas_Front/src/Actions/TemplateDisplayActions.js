import { ActionType } from "../Constants/ActionType";
import templates from "../Constants/Templates";

export const fetchTemplates = () => (dispatch) => {
    dispatch({
        type: ActionType.LOAD_TEMPLATE_LIST,
        payload: templates
    });
};

export const deleteTemplate = (id) => (dispatch) => {
    dispatch({
        type: ActionType.DELETE_TEMPLATE,
        payload: id
    })
}