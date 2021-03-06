import { ActionType } from "../Constants/ActionType";
import templates from "../Constants/Templates";
import { FetchProjectsList, CreateProject, DeleteProject, UpadateProjectName, FetchProjectsListForReview, FetchClientProjectsList } from "../API/API";
require('react-virtualized-transfer/lib/css')

export const fetchProjects = (start, end) => async (dispatch) => {
    dispatch({
        type: ActionType.LOAD_PROJECTS,
        payload: await FetchProjectsList(start, end)
    });
};

export const fetchClientProjects = (id, start, end) => async (dispatch) => {
    dispatch({
        type: ActionType.LOAD_PROJECTS,
        payload: await FetchClientProjectsList(id, start, end)
    });
};

export const fetchProjectsReview = (id, start, end) => async (dispatch) => {
    dispatch({
        type: ActionType.LOAD_PROJECTS,
        payload: await FetchProjectsListForReview(id, start, end)
    });
};

export const fetchTemplateNames = () => (dispatch) => {
    dispatch({
        type: ActionType.LOAD_TEMPLATE_LIST,
        payload: templates
    })
};

export const addProject = (data) => async (dispatch) => {
    let createdProject = {
        name: data.name,
    }
    let id = await CreateProject(createdProject);
    let updatedData = data;
    updatedData.teams = [];
    updatedData.templates = [];
    updatedData.id = id;
    updatedData.caseCount = 0;
    dispatch({
        type: ActionType.CREATE_PROJECT,
        payload: updatedData
    })
}


export const changeProjectName = (data) => async (dispatch) => {
    let updatedProject = {
        id: data.id,
        name: data.name,
    }
    await UpadateProjectName(updatedProject.id, updatedProject);
    dispatch({
        type: ActionType.UPDATE_PROJECT,
        payload: data
    })
}

export const deleteProject = (data) => async (dispatch) => {
    await DeleteProject(data.id);
    dispatch({
        type: ActionType.DELETE_PROJECT,
        payload: data
    })
}