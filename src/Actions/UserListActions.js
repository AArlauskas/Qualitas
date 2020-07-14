import { ActionType } from "../Constants/ActionType";
import users from "../Constants/Users";
import teams from "../Constants/Teams";

export const fetchUserData = () => (dispatch) => {
    dispatch({
        type: ActionType.LOAD_USERS,
        payload: users
    });
};

export const fetchTeamNames = () => (dispatch) => {
    dispatch({
        type: ActionType.LOAD_TEAM_LIST,
        payload: teams
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