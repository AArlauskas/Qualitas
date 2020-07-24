import { ActionType } from "../Constants/ActionType";

const initialState = {
    Users: [],
    Templates: [],
    Projects: [],
    Teams: [],
    Evaluations: []
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
            tempUsers[index].isArchived = true;
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
            tempUsers[index].isArchived = false;
            return {
                ...state,
                Users: [...tempUsers]
            }
        }

        case ActionType.LOAD_TEMPLATE_LIST: {
            let templates = action.payload;
            // console.log(templates);
            // let templateNames = [];
            // templates.forEach(template => {
            //     templateNames.push({
            //         id: template.id,
            //         name: template.name
            //     });
            //     let projects = [];
            //     template.Projects.forEach(project => {
            //         projects.push({
            //             id: project.id,
            //             name: project.name
            //         });
            //     });
            //     templateNames.Projects = projects;
            // });
            return {
                ...state,
                Templates: templates
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

        case ActionType.LOAD_PROJECTS: {
            return {
                ...state,
                Projects: action.payload
            }
        }

        case ActionType.CREATE_PROJECT: {
            let createdProject = action.payload;
            return {
                ...state,
                Projects: [...state.Projects, createdProject]
            }
        }

        case ActionType.UPDATE_PROJECT: {
            let updatedProject = action.payload;
            let TempProjects = [...state.Projects];
            let index = TempProjects.indexOf(TempProjects.find(temp => temp.id === updatedProject.id));
            TempProjects[index] = updatedProject;
            return {
                ...state,
                Projects: [...TempProjects]
            }
        }

        case ActionType.DELETE_PROJECT: {
            let id = action.payload.id;
            return {
                ...state,
                Projects: [...state.Projects.filter(project => project.id !== id)]
            }
        }

        case ActionType.LOAD_TEAM_LIST: {
            return {
                ...state,
                Teams: action.payload
            }
        }

        case ActionType.CREATE_TEAM: {
            return {
                ...state,
                Teams: [...state.Teams, action.payload]
            }
        }

        case ActionType.UPDATE_TEAM: {
            let tempTeams = [...state.Teams];
            let updatedTeam = action.payload;
            let index = tempTeams.indexOf(tempTeams.find(team => team.id === updatedTeam.id));
            tempTeams[index] = updatedTeam;
            return {
                ...state,
                Teams: [...tempTeams]
            }

        }

        case ActionType.DELETE_TEAM: {
            let teamId = action.payload;
            return {
                ...state,
                Teams: state.Teams.filter(team => team.id !== teamId)
            }
        }

        case ActionType.LOAD_USERS_EVALUATIONS: {
            let evaluations = action.payload;
            return {
                ...state,
                Evaluations: evaluations.filter(evaluation => !evaluation.isDeleted)
            }
        }

        case ActionType.DELETE_EVALUATION: {
            let id = action.payload;
            return {
                ...state,
                Teams: state.Evaluations.filter(temp => temp.id !== id)
            }
        }

        default:
            return {
                ...state
            };
    }
};