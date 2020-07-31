import { ActionType } from "../Constants/ActionType";
import { FetchUserList, ArchiveUser, CreateUser, UpdateUser, FetchTeamsList } from "../API/API";

export const fetchUserData = (start, end) => async (dispatch) => {
    let userList = await FetchUserList(start, end)
    dispatch({
        type: ActionType.LOAD_USERS,
        payload: userList
    });
};

export const fetchTeamNames = () => async (dispatch) => {
    let teamsList = await FetchTeamsList()
    dispatch({
        type: ActionType.LOAD_TEAM_LIST,
        payload: teamsList
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