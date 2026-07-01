import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
//import Backend from 'i18next-http-backend';
import { Languages } from './constants/system.constants'
import { LanguagePacks } from "./locales/";

const userStorage = JSON.parse(localStorage.getItem('AuthStorage'));

i18n
    .use(initReactI18next)
    .init({
        react: {
            useSuspense: false
        },
        keySeparator: ".",
        interpolation: {
            // React already does escaping
            escapeValue: false,
        },
        lng: userStorage ? userStorage.user.userData.Lang : Languages.Turkish,
        fallbackLng: Languages.Turkish,
        resources: {
            [Languages.English]: {
                translation: LanguagePacks[Languages.English]
            },
            [Languages.Turkish]: {
                translation: LanguagePacks[Languages.Turkish]
            },
            [Languages.Russian]: {
                translation: LanguagePacks[Languages.Russian]
            },
        },
    })

export default i18n