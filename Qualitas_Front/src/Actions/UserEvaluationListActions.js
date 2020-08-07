import { ActionType } from "../Constants/ActionType";
import { MarkEvaluationDeleted, FetchUserToReview, FetchProjectUserToReview } from "../API/API";

export const fetchUsersEvaluations = (id, min, max) => async (dispatch) => {
    let response = await FetchUserToReview(id, min, max);
    dispatch({
        type: ActionType.LOAD_USERS_EVALUATIONS,
        payload: response
    })
}

export const fetchProjectUsersEvaluations = (userId, projectId, min, max) => async (dispatch) => {
    let response = await FetchProjectUserToReview(userId, projectId, min, max);
    dispatch({
        type: ActionType.LOAD_USERS_EVALUATIONS,
        payload: response
    })
}

export const fetchClientUsersEvaluations = (id, projectId) => async (dispatch) => {
    let response = await FetchUserToReview(id);
    console.log(response);
    dispatch({
        type: ActionType.LOAD_USERS_EVALUATIONS,
        payload: response.Evaluations.filter(temp => temp.projectId === projectId)
    })
}

export const deleteEvaluation = (id) => async (dispatch) => {
    await MarkEvaluationDeleted(id);
    dispatch({
        type: ActionType.DELETE_EVALUATION,
        payload: id
    })
}