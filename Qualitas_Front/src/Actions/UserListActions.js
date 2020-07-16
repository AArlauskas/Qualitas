import { ActionType } from "../Constants/ActionType";
import teams from "../Constants/Teams";
import { FetchUserList, ArchiveUser, CreateUser, UpdateUser } from "../API/API";

export const fetchUserData = () => async (dispatch) => {
    let userList = await FetchUserList()
    dispatch({
        type: ActionType.LOAD_USERS,
        payload: userList
    });
};

export const fetchTeamNames = () => (dispatch) => {
    dispatch({
        type: ActionType.LOAD_TEAM_LIST,
        payload: teams
    });
};

export const addUser = (data) => async (dispatch) => {
    await CreateUser(data);
    dispatch({
        type: ActionType.CREATE_USER,
        payload: data
    });
};

export const updateUser = (data) => async (dispatch) => {
    await UpdateUser(data);
    dispatch({
        type: ActionType.UPDATE_USER,
        payload: data
    });
};

export const archiveUser = (oldData) => async (dispatch) => {
    await ArchiveUser(oldData.id);
    dispatch({
        type: ActionType.ARCHIVE_USER,
        payload: oldData
    });
};