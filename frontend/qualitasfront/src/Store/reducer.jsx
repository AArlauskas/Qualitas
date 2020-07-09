import { ActionType } from "../Constants/ActionType";

const initialState = {
    Users: []
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

        default:
            return {
                ...state
            };
    }
};