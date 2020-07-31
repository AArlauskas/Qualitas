import { ActionType } from "../Constants/ActionType";
import { UnarchiveUser, MarkUserDeleted, FetchArchivedUserList } from "../API/API";

export const fetchArchivedUserData = () => async (dispatch) => {
    let userList = await FetchArchivedUserList()
    dispatch({
        type: ActionType.LOAD_ARCHIVED_USERS,
        payload: userList
    });
};

export const unarchiveUser = (oldData) => async (dispatch) => {
    await UnarchiveUser(oldData.id);
    dispatch({
        type: ActionType.UNARCHIVE_USER,
        payload: oldData
    });
};

export const deleteUser = (oldData) => async (dispatch) => {
    await MarkUserDeleted(oldData.id);
    dispatch({
        type: ActionType.DELETE_USER,
        payload: oldData
    });
};