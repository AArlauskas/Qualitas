import { ActionType } from "../Constants/ActionType";
import { FetchTemplatesList, DeleteTemplate, FetchClientTemplatesList } from "../API/API";

export const fetchTemplates = () => async (dispatch) => {
    let templates = await FetchTemplatesList();
    dispatch({
        type: ActionType.LOAD_TEMPLATE_LIST,
        payload: templates
    });
};

export const fetchClientTemplates = (id) => async (dispatch) => {
    let templates = await FetchClientTemplatesList(id);
    dispatch({
        type: ActionType.LOAD_TEMPLATE_LIST,
        payload: templates
    });
};

export const deleteTemplate = (id) => async (dispatch) => {
    await DeleteTemplate(id);
    dispatch({
        type: ActionType.DELETE_TEMPLATE,
        payload: id
    })
}