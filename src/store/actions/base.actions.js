import { baseActionTypes as type } from '../actionTypes/base.action.types';
import i18n from 'i18n';

const setLoading = (loading) => ({
    type: type.setLoading,
    payload: { data: loading }
});

const setLang = (lang) => {
    sessionStorage.setItem('lang', lang);
    i18n.changeLanguage(lang);
    return {
        type: type.setLang,
        lang
    }
}

export const baseActions = { setLoading, setLang };
