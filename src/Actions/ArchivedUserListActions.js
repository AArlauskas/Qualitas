import { ActionType } from "../Constants/ActionType";
import users from "../Constants/Users";

export const fetchArchivedUserData = () => (dispatch) => {
    dispatch({
        type: ActionType.LOAD_ARCHIVED_USERS,
        payload: users
    });
};

export const unarchiveUser = (oldData) => (dispatch) => {
    dispatch({
        type: ActionType.UNARCHIVE_USER,
        payload: oldData
    });
};

export const deleteUser = (oldData) => (dispatch) => {
    dispatch({
        type: ActionType.DELETE_USER,
        payload: oldData
    });
};