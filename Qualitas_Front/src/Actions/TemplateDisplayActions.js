import { ActionType } from "../Constants/ActionType";
import { FetchTemplatesList, DeleteTemplate, FetchClientTemplatesList, CopyTemplate } from "../API/API";

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

export const copyTemplate = (ids, name) => async (dispatch) => {
    let newData = await CopyTemplate(ids);
    let data = {
        id: newData.id,
        name: newData.name,
        Projects: [],
    }
    dispatch({
        type: ActionType.COPY_TEMPLATE,
        payload: data
    })
}

export const deleteTemplate = (id) => async (dispatch) => {
    await DeleteTemplate(id);
    dispatch({
        type: ActionType.DELETE_TEMPLATE,
        payload: id
    })
}