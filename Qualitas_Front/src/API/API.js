import axios from "axios";

let baseUri = "https://localhost:44326/api"
let Api = axios.create({
    baseURL: baseUri,
    headers: {
        "Content-Type": "application/json"
    }
});


//does not work YET
export const Login = async (data) => {
    return await Api.post("/Users/login", data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return "notFound";
        });
};

export const FetchUserList = async (start, end) => {
    return await Api.get("/Users", {
        params: {
            start: start,
            end: end
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchArchivedUserList = async () => {
    return await Api.get("/Users/Archived")
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchUserListSimple = async () => {
    return await Api.get("/Users/simple")
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchUserProjectsTemplates = async (id) => {
    return await Api.get("/Users/Projects/Templates/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchUsersForTeamSimple = async (id) => {
    return await Api.get("/Users/Teams/simple/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchUserToEdit = async (id) => {
    return await Api.get("/Users/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchUserCredentials = async (id) => {
    return await Api.get("/Users/credentials/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const UpdateUserCredentials = async (id, data) => {
    return await Api.put("/Users/credentials/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchUserToReview = async (id, start, end) => {
    return await Api.get("/Users/review/" + id, {
        params: {
            start: start,
            end: end
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};


export const AddToProjectUser = async (id, data) => {
    return await Api.put("/Projects/adduser/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const RemoveFromProjectUser = async (id, data) => {
    return await Api.put("/Projects/removeuser/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const AddToProjectTeam = async (id, data) => {
    return await Api.put("/Projects/addTeam/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const RemoveFromProjectTeam = async (id, data) => {
    return await Api.put("/Projects/removeTeam/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const AddToProjectTemplate = async (id, data) => {
    return await Api.put("/Projects/addTemplate/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const RemoveFromProjectTemplate = async (id, data) => {
    return await Api.put("/Projects/removeTemplate/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const ArchiveUser = async (id) => {
    return await Api.post("/Users/archive/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const UnarchiveUser = async (id) => {
    return await Api.post("/Users/unarchive/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const CreateUser = async (data) => {
    return await Api.post("/Users/", data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const UpdateUser = async (data) => {
    return await Api.put("/Users/" + data.id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const AddProjectToUser = async (id, data) => {
    return await Api.put("/Users/addProject/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const RemoveProjectFromUser = async (id, data) => {
    return await Api.put("/Users/removeProject/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const FetchUserForProjects = async (id) => {
    return await Api.get("/Users/projects/" + id,)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const MarkUserDeleted = async (id) => {
    return await Api.post("/Users/markdeleted/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(id);
        });
};

export const FetchTeamsList = async (start, end) => {
    return await Api.get("/Teams/list", {
        params: {
            start: start,
            end: end
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};


export const FetchTeamsSimple = async () => {
    return await Api.get("/Teams/simple")
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchTeamToReview = async (id, start, end) => {
    return await Api.get("/Teams/review/" + id, {
        params: {
            start: start,
            end: end
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchTeam = async (id) => {
    return await Api.get("/Teams/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const CreateTeam = async (data) => {
    return await Api.post("/Teams/", data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const UpdateTeam = async (data) => {
    return await Api.put("/Teams/" + data.id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};


export const GetTeam = async (id) => {
    return await Api.get("/Teams/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchTeamsProjects = async (id) => {
    return await Api.get("/Teams/Projects/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchTeamsUsers = async (id) => {
    return await Api.get("/Teams/users/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};


export const AddToTeam = async (id, data) => {
    return await Api.put("/Teams/add/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const RemoveFromTeam = async (id, data) => {
    return await Api.put("/Teams/remove/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const AddToTeamProjects = async (id, data) => {
    return await Api.put("/Teams/addProject/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const RemoveFromTeamProjects = async (id, data) => {
    return await Api.put("/Teams/removeProject/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const FetchTemplatesList = async () => {
    return await Api.get("/EvaluationTemplates/list")
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchClientTemplatesList = async (id) => {
    return await Api.get("/EvaluationTemplates/Client/list/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchTemplateProjects = async (id) => {
    return await Api.get("/EvaluationTemplates/projects/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const AddToTemplateProject = async (id, data) => {
    return await Api.put("/EvaluationTemplates/addProject/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const RemoveFromTemplateProject = async (id, data) => {
    return await Api.put("/EvaluationTemplates/removeProject/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
}

export const FetchTemplateToEdit = async (id) => {
    return await Api.get("/EvaluationTemplates/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchTemplateForCase = async (id) => {
    return await Api.get("/EvaluationTemplates/case/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const CreateTemplate = async (data) => {
    return await Api.post("/EvaluationTemplates/full", data).then(response => {
        return response.data;
    })
        .catch((error) => {
            throw Error("An error has occured calling the api: " + error);
        });
}

export const EditTemplate = async (id, data) => {
    return await Api.put("/EvaluationTemplates/full/" + id, data).then(response => {
        return response.data;
    })
        .catch((error) => {
            throw Error("An error has occured calling the api: " + error);
        });
}

export const CopyTemplate = async (id) => {
    return await Api.post("/EvaluationTemplates/copy/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const DeleteTemplate = async (id) => {
    return await Api.put("/EvaluationTemplates/markdeleted/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchProjectsList = async (start, end) => {
    return await Api.get("/Projects/list", {
        params: {
            start: start,
            end: end
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchClientProjectsList = async (id, start, end) => {
    return await Api.get("/Users/Client/Projects/list/" + id, {
        params: {
            start: start,
            end: end
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchProjectUserToReview = async (userId, projectId, start, end) => {
    return await Api.get("/Users/Project/review/", {
        params: {
            start: start,
            end: end,
            userId: userId,
            projectId: projectId
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchProjectsListForReview = async (id, start, end) => {
    return await Api.get("Users/Projects/review/" + id, {
        params: {
            start: start,
            end: end
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchProjectsSimple = async () => {
    return await Api.get("/Projects/simple")
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const CreateProject = async (data) => {
    return await Api.post("/Projects/", data).then(response => {
        return response.data;
    })
        .catch((error) => {
            throw Error("An error has occured calling the api: " + error);
        });
}

export const UpadateProjectName = async (id, data) => {
    return await Api.post("/Projects/name/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const DeleteProject = async (id) => {
    return await Api.post("/Projects/markdeleted/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const DeleteTeam = async (id) => {
    return await Api.post("/Teams/markdeleted/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchProjectTemplates = async (id) => {
    return await Api.get("/Projects/Templates/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchProjectToEdit = async (id) => {
    return await Api.get("/Projects/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchProjectToReview = async (id, min, max) => {
    console.log(min);
    return await Api.get("/Projects/review/" + id, {
        params: {
            start: min,
            end: max
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchProjectUsers = async (id) => {
    return await Api.get("/Projects/Users/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchProjectTeams = async (id) => {
    return await Api.get("/Projects/Teams/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchCaseToEdit = async (id) => {
    return await Api.get("/Evaluations/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const CreateCase = async (data) => {
    return await Api.post("/Evaluations/", data).then(response => {
        return response.data;
    })
        .catch((error) => {
            throw Error("An error has occured calling the api: " + error);
        });
}

export const MarkEvaluationDeleted = async (id) => {
    return await Api.post("/Evaluations/markdeleted/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(id);
        });
};

export const UpdateCase = async (id, data) => {
    return await Api.put("/Evaluations/" + id, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchProjectReport = async (id, min, max) => {
    return await Api.get("/Projects/report/" + id, {
        params: {
            start: min,
            end: max
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchUserReport = async (id, min, max) => {
    return await Api.get("/Users/report/" + id, {
        params: {
            start: min,
            end: max
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchTeamReport = async (id, min, max) => {
    return await Api.get("/Teams/report/" + id, {
        params: {
            start: min,
            end: max
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchClientUserReport = async (id, clientId, min, max) => {
    return await Api.get("/Users/Client/report/" + id, {
        params: {
            clientId: clientId,
            start: min,
            end: max
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchClientProjectsSimple = async (id) => {
    return await Api.get("/Users/Client/Projects/simple/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchClientProjectsUsersSimple = async (id) => {
    return await Api.get("/Users/Client/Users/simple/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};
