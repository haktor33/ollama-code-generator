import { callApi } from "./base.services";

async function login(username, password) {
    var serviceName = "auth/signin";
    try {
        let response = await callApi(serviceName, { method: "POST", data: JSON.stringify({ username, password }) });
        return response;
    } catch (err) {
        return Promise.reject(err);
    }
}

async function logout() {
    var serviceName = "auth/signout";
    try {
        let response = await callApi(serviceName, { method: "POST", data: null });
        sessionStorage.clear();
        localStorage.removeItem("token");
        return response;
    } catch (err) {
        return Promise.reject(err);
    }
}

async function register({ username, password, email }) {
    var serviceName = "auth/signin";
    try {
        let response = await callApi(serviceName, { method: "POST", data: JSON.stringify({ username, password, email }) });
        return response;
    } catch (err) {
        return Promise.reject(err);
    }
}

export const authService = { login, logout, register };