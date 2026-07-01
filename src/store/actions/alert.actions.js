import { notificationType as type } from 'constants/alert.constants';

export const alertActions = {
    success,
    error,
    warning,
    clear
};

export function showAlert(type, header, message, i18n) {
    return (dispatch) => {
        dispatch(alertActions[type](header, message, i18n));
    }
}

function success(header, message, i18n) {
    return { type: type.success, header, message, i18n };
}

function error(header, message, i18n) {
    return { type: type.error, header, message, i18n };
}
function warning(header, message, i18n) {
    return { type: type.warning, header, message, i18n };
}

function clear() {
    return { type: type.clear };
}