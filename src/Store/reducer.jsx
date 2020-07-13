import { ActionType } from "../Constants/ActionType";

const initialState = {
    Users: [],
    Templates: [],
    TemplateToEdit: null
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.LOAD_USERS: {
            return {
                ...state,
                Users: action.payload
            };
        }

        case ActionType.CREATE_USER: {
            return {
                ...state,
                Users: [...state.Users, action.payload]
            }
        }

        case ActionType.UPDATE_USER: {
            let updatedUser = action.payload;
            let index = state.Users.indexOf(state.Users.find(user => user.id === updatedUser.id));
            let tempUsers = [...state.Users];
            tempUsers[index] = updatedUser;
            return {
                ...state,
                Users: [...tempUsers]
            }
        }

        case ActionType.ARCHIVE_USER: {
            let oldUserId = action.payload.id;
            let index = state.Users.indexOf(state.Users.find(user => user.id === oldUserId));
            let tempUsers = [...state.Users];
            tempUsers[index].archived = true;
            return {
                ...state,
                Users: [...tempUsers]
            }
        }

        case ActionType.LOAD_ARCHIVED_USERS: {
            return {
                ...state,
                Users: action.payload
            };
        }

        case ActionType.DELETE_USER: {
            let oldUserId = action.payload.id;
            return {
                ...state,
                Users: state.Users.filter(user => user.id !== oldUserId)
            }
        }

        case ActionType.UNARCHIVE_USER: {
            let oldUserId = action.payload.id;
            let index = state.Users.indexOf(state.Users.find(user => user.id === oldUserId));
            let tempUsers = [...state.Users];
            tempUsers[index].archived = false;
            return {
                ...state,
                Users: [...tempUsers]
            }
        }

        case ActionType.LOAD_TEMPLATE_LIST: {
            let templates = action.payload;
            let templateNames = [];
            templates.forEach(template => {
                templateNames.push({
                    id: template.id,
                    name: template.name
                })
            });
            return {
                ...state,
                Templates: templateNames
            }
        }

        case ActionType.LOAD_TEMPLATE: {
            if (state.TemplateToEdit !== null) {
                state.TemplateToEdit = null;
            }
            let id = action.payload;
            let templateToEdit = state.Templates.find(template => template.id === id);
            return {
                ...state,
                TemplateToEdit: templateToEdit
            }
        }

        case ActionType.CREATE_TEMPLATE: {
            let template = action.payload;
            let tempTemplates = [...state.Templates];
            tempTemplates.push(template);
            console.log(tempTemplates);
            return {
                ...state,
                Templates: tempTemplates
            }
        }

        case ActionType.UPDATE_TEMPLATE: {
            let template = action.payload;
            let tempTemplates = [...state.Templates];
            let index = tempTemplates.indexOf(tempTemplates.find(temp => temp.id === template.id));
            tempTemplates[index] = template;
            console.log(tempTemplates);
            return {
                ...state,
                Templates: [...tempTemplates]
            }
        }

        case ActionType.DELETE_TEMPLATE: {
            let templateId = action.payload;
            return {
                ...state,
                Templates: state.Templates.filter(template => template.id !== templateId)
            }
        }

        default:
            return {
                ...state
            };
    }
};