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
    return await Api.get("/Users/login", data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return "notFound";
        });
};

export const FetchUserList = async () => {
    return await Api.get("/Users")
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

export const FetchTeamsList = async () => {
    return await Api.get("/Teams/list")
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

export const DeleteTeam = async (id) => {
    return await Api.delete("/Teams/" + id)
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
    return await Api.get("/EvaluationTemplates/")
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

export const DeleteTemplate = async (id) => {
    return await Api.post("/EvaluationTemplates/markdeleted/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const FetchProjectsList = async () => {
    return await Api.get("/Projects/list")
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

export const FetchProjectToEdit = async (id) => {
    return await Api.get("/Projects/" + id)
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