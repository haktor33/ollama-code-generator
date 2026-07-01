import { isExpired, decodeToken } from "react-jwt";
import { authConstants } from 'constants/auth.constants';
import { authService } from 'services/auth.services'
import { alertActions } from './alert.actions';
import { baseActions } from './base.actions';

const login = (username, password) => {
    return (dispatch) => {
        dispatch(request({ username }));
        const promise = authService.login(username, password);
        dispatch(baseActions.setLoading(true));
        promise.then(result => {
            dispatch(baseActions.setLoading(false));
            const token = result.token;
            const expired = isExpired(token);
            if (expired) {
                dispatch(logout());
                return;
            }
            const data = decodeToken(token);
            data.token = token;
            if (data.userData.Lang) {
                dispatch(baseActions.setLang(data.userData.Lang))
            }
            dispatch(success(data))
        }).catch(function (result) {
            dispatch(baseActions.setLoading(false));
            dispatch(failure(result.Errors, null));
            dispatch(alertActions.error(null, result.Errors, result.i18n));
        });
    }
    function request(user) {
        return { type: authConstants.LOGIN_REQUEST, user }
    }

    function success(user) {
        return { type: authConstants.LOGIN_SUCCESS, user }
    }
    function failure(error) {
        return { type: authConstants.LOGIN_FAILURE, error }
    }
    function logout() {
        return { type: authConstants.LOGOUT }
    }
}

function logout() {
    authService.logout();
    return { type: authConstants.LOGOUT };
}

const refresh = () => ({
    type: authConstants.REFRESH,
});

export const authActions = { login, logout, refresh };