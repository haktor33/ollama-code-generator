import { notificationType as type } from 'constants/alert.constants';

export function alert(state = {}, action) {
    switch (action.type) {
        case type.success:
            return {
                type: type.success,
                header: action.header,
                message: action.message,
                i18n: action.i18n,
            };
        case type.error:
            return {
                type: type.error,
                header: action.header,
                message: action.message,
                i18n: action.i18n,
            };
        case type.warning:
            return {
                type: type.warning,
                header: action.header,
                message: action.message,
                i18n: action.i18n,
            };
        case type.clear:
            return {};
        default:
            return state
    }
}