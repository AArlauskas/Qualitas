import { ActionType } from "../Constants/ActionType";
import { FetchTeamsList, CreateTeam, UpdateTeam, DeleteTeam } from "../API/API";

export const fetchTeamsList = (start, end) => async (dispatch) => {
    let teamList = await FetchTeamsList(start, end);
    dispatch({
        type: ActionType.LOAD_TEAM_LIST,
        payload: teamList
    })
};


export const createTeam = (data) => async (dispatch) => {
    let id = await CreateTeam(data);
    let createdTeam = data;
    createdTeam.projects = [];
    createdTeam.average = 0;
    createdTeam.id = id;
    createdTeam.userCount = 0;
    dispatch({
        type: ActionType.CREATE_TEAM,
        payload: createdTeam
    })
};

export const updateTeam = (data) => async (dispatch) => {
    await UpdateTeam(data);
    dispatch({
        type: ActionType.UPDATE_TEAM,
        payload: data
    })
};

export const deleteTeam = (id) => async (dispatch) => {
    await DeleteTeam(id);
    dispatch({
        type: ActionType.DELETE_TEAM,
        payload: id
    })
};