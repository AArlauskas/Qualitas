import { ActionType } from "../Constants/ActionType";
import templates from "../Constants/Templates";

export const fetchTemplateToEdit = (id) => (dispatch) => {
    dispatch({
        type: ActionType.LOAD_TEMPLATE,
        payload: templates.find(template => template.id === id)
    });
};

export const createTemplate = (data) => (dispatch) => {
    dispatch({
        type: ActionType.CREATE_TEMPLATE,
        payload: data
    })
}

export const editTemplate = (data) => (dispatch) => {
    dispatch({
        type: ActionType.UPDATE_TEMPLATE,
        payload: data
    })
}