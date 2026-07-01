import { authConstants } from '../../constants/auth.constants';
const userStorage = JSON.parse(localStorage.getItem('AuthStorage'));

const initialState = {
    loggedIn: false,
    user: {},
    menuItems: [],
};

export function authentication(state = userStorage || initialState, action) {
    switch (action.type) {
        case authConstants.LOGIN_REQUEST:
            state = { ...state, loggingIn: true, user: action.user };
            break;
        case authConstants.LOGIN_SUCCESS:
            state = { loggedIn: true, user: action.user };            
            break;
        case authConstants.CLEAR_METADATA:
            state = { loggedIn: true, user: action.user };
            break;
        case authConstants.LOGIN_FAILURE:
            state = { ...initialState };
            break;
        case authConstants.LOGOUT:
            state = { ...initialState };
            break;
        case authConstants.LOAD_MENU_ITEMS:
            state = { ...state, menuItems: action.menuItems };
            break;
        case authConstants.REFRESH:
            let { refresh } = state;
            if (!refresh) { refresh = 0 }
            refresh++;
            state = { ...state, refresh };
            break;
        default:
            return state;
    }
    localStorage.setItem('AuthStorage', JSON.stringify(state));
    return { ...state };
}