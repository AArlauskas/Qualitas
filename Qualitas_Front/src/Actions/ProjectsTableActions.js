import { ActionType } from "../Constants/ActionType";
import templates from "../Constants/Templates";
import { FetchProjectsList, CreateProject, DeleteProject, UpadateProjectName } from "../API/API";
require('react-virtualized-transfer/lib/css')

export const fetchProjects = () => async (dispatch) => {
    dispatch({
        type: ActionType.LOAD_PROJECTS,
        payload: await FetchProjectsList()
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
    await CreateProject(createdProject);
    dispatch({
        type: ActionType.CREATE_PROJECT,
        payload: createdProject
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
        payload: updatedProject
    })
}

export const deleteProject = (data) => async (dispatch) => {
    await DeleteProject(data.id);
    dispatch({
        type: ActionType.DELETE_PROJECT,
        payload: data
    })
}