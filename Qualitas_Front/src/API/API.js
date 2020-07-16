import axios from "axios";

let baseUri = "https://localhost:44326/api"
let Api = axios.create({
    baseURL: baseUri,
    headers: {
        "Content-Type": "application/json"
    }
});


//does not work YET
export const Login = async () => {
    return await Api.get("/Users/0")
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
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