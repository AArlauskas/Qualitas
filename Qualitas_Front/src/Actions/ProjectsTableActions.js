import { ActionType } from "../Constants/ActionType";
import projects from "../Constants/Projects";
import templates from "../Constants/Templates";
require('react-virtualized-transfer/lib/css')

export const fetchProjects = () => (dispatch) => {
    let CompleteProjects = [];
    projects.forEach(temp => {
        CompleteProjects.push({
            id: temp.id,
            name: temp.name,
            templateId: temp.templateId,
            templateName: templates.find(template => template.id === temp.templateId).name
        });
    });

    dispatch({
        type: ActionType.LOAD_PROJECTS,
        payload: CompleteProjects
    });
};

export const fetchTemplateNames = () => (dispatch) => {
    dispatch({
        type: ActionType.LOAD_TEMPLATE_LIST,
        payload: templates
    })
};

export const addProject = (data) => (dispatch) => {
    let createdProject = {
        id: projects.length,
        name: data.name,
        templateId: data.templateId,
    }
    createdProject.templateName = templates.find(template => template.id === parseInt(createdProject.templateId)).name
    dispatch({
        type: ActionType.CREATE_PROJECT,
        payload: createdProject
    })
}


export const updateProject = (data) => (dispatch) => {
    let updatedProject = {
        id: data.id,
        name: data.name,
        templateId: data.templateId,
    }
    updatedProject.templateName = templates.find(template => template.id === parseInt(updatedProject.templateId)).name
    dispatch({
        type: ActionType.UPDATE_PROJECT,
        payload: updatedProject
    })
}

export const deleteProject = (data) => (dispatch) => {
    dispatch({
        type: ActionType.DELETE_PROJECT,
        payload: data
    })
}