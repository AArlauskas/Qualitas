import { ActionType } from "../Constants/ActionType";
import { FetchUserToEdit, MarkEvaluationDeleted } from "../API/API";

export const fetchUsersEvaluations = (id) => async (dispatch) => {
    let response = await FetchUserToEdit(id);
    dispatch({
        type: ActionType.LOAD_USERS_EVALUATIONS,
        payload: response.Evaluations
    })
}

export const deleteEvaluation = (id) => async (dispatch) => {
    await MarkEvaluationDeleted(id);
    dispatch({
        type: ActionType.DELETE_EVALUATION,
        payload: id
    })
}