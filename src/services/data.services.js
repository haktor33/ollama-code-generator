import { callApi } from "./base.services";

export const getCodeDataList = async () => {
    var serviceName = `getCodeDataList`;
    try {
        let response = await callApi(serviceName, {});
        return response;
    } catch (err) {
        return Promise.reject(err);
    }
}

export const predict = async (description, params) => {
    var serviceName = `predict`;
    try {
        const postData = { description, params }
        let response = await callApi(serviceName, { method: "POST", data: JSON.stringify(postData) });
        return response;
    } catch (err) {
        return Promise.reject(err);
    }
}

export const getByIndex = async (index, params) => {
    var serviceName = `getByIndex`;
    try {
        const postData = { index, params }
        let response = await callApi(serviceName, { method: "POST", data: JSON.stringify(postData) });
        return response;
    } catch (err) {
        return Promise.reject(err);
    }
}

export const reloadCodes = async () => {
    var serviceName = `reload`;
    try {
        let response = await callApi(serviceName, {});
        return response;
    } catch (err) {
        return Promise.reject(err);
    }
}