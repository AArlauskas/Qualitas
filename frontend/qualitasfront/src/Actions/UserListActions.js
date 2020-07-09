import { ActionType } from "../Constants/ActionType";
import users from "../Constants/Users";

export const fetchUserData = () => (dispatch) => {
    dispatch({
        type: ActionType.LOAD_USERS,
        payload: users
    });
};

export const addUser = (data) => (dispatch) => {
    dispatch({
        type: ActionType.CREATE_USER,
        payload: data
    });
};

export const updateUser = (data) => (dispatch) => {
    dispatch({
        type: ActionType.UPDATE_USER,
        payload: data
    });
};

export const archiveUser = (oldData) => (dispatch) => {
    dispatch({
        type: ActionType.ARCHIVE_USER,
        payload: oldData
    });
};