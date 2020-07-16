import { ActionType } from "../Constants/ActionType";
import { FetchTemplatesList, DeleteTemplate } from "../API/API";

export const fetchTemplates = () => async (dispatch) => {
    let templates = await FetchTemplatesList();
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