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

export const FetchTemplatesList = async () => {
    return await Api.get("/EvaluationTemplates/")
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

export const DeleteTemplate = async (id) => {
    return await Api.delete("/EvaluationTemplates/" + id)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};