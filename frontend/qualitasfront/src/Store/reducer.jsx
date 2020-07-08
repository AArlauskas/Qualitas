import { ActionType } from "../Constants/ActionType";

const initialState = {
    Users: []
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.LOAD_USERS: {
            console.log("got called");
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
            // state.Users[index] = updatedUser;
            let tempUsers = [...state.Users];
            tempUsers[index] = updatedUser;
            return {
                ...state,
                Users: [...tempUsers]
            }
        }

        case ActionType.DELETE_USER: {
            let oldUserId = action.payload.id;
            return {
                ...state,
                Users: state.Users.filter(user => user.id !== oldUserId)
            }
        }

        default:
            return {
                ...state
            };
    }
};