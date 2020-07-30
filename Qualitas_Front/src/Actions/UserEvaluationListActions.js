import { ActionType } from "../Constants/ActionType";
import { MarkEvaluationDeleted, FetchUserToReview } from "../API/API";

export const fetchUsersEvaluations = (id) => async (dispatch) => {
    let response = await FetchUserToReview(id);
    dispatch({
        type: ActionType.LOAD_USERS_EVALUATIONS,
        payload: response
    })
}

export const deleteEvaluation = (id) => async (dispatch) => {
    await MarkEvaluationDeleted(id);
    dispatch({
        type: ActionType.DELETE_EVALUATION,
        payload: id
    })
}