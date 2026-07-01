import { baseActionTypes as type } from 'store/actionTypes/base.action.types';

const userStorage = JSON.parse(localStorage.getItem('AuthStorage'));

const initialData = {
    loading: false,
    lang: userStorage?.user?.userData?.Lang || "tr-TR"
};

const base = (state = initialData, action) => {
    switch (action.type) {
        case type.setLoading:
            var loading = action.payload.data;
            return { ...state, loading };
        case type.setLang:
            return { ...state, lang: action.lang }
        default:
            return state;
    }
};

export { base };