import axios from "axios";

let baseUri = "https://localhost:44326/api"
let Api = axios.create({
    baseURL: baseUri,
    responseType: "blob"
});

export const DownloadProjectReport = async (id, start, end) => {
    return await Api.get("/Projects/report/download/" + id, {
        params: {
            start: start,
            end: end
        }
    })
        .then((response) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');

            link.href = downloadUrl;

            link.setAttribute('download', "report.xls"); //any other extension

            document.body.appendChild(link);

            link.click();

            link.remove();
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const DownloadUserReport = async (id, start, end) => {
    return await Api.get("/Users/report/download/" + id, {
        params: {
            start: start,
            end: end
        }
    })
        .then((response) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');

            link.href = downloadUrl;

            link.setAttribute('download', "report.xls"); //any other extension

            document.body.appendChild(link);

            link.click();

            link.remove();
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const DownloadClientUserReport = async (id, clientId, start, end) => {
    return await Api.get("/Users/Client/report/download/" + id, {
        params: {
            clientId: clientId,
            start: start,
            end: end
        }
    })
        .then((response) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');

            link.href = downloadUrl;

            link.setAttribute('download', "report.xls"); //any other extension

            document.body.appendChild(link);

            link.click();

            link.remove();
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};

export const DownloadAllUsers = async (start, end) => {
    return await Api.get("/Users/All/download/", {
        params: {
            start: start,
            end: end
        }
    })
        .then((response) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');

            link.href = downloadUrl;

            link.setAttribute('download', "report.xls"); //any other extension

            document.body.appendChild(link);

            link.click();

            link.remove();
        })
        .catch((error) => {
            throw Error("An error has occurred calling the api: " + error);
        });
};