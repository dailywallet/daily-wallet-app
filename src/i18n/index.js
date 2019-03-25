import i18n from 'i18n-js';
import * as RNLocalize from "react-native-localize";

import en from './locales/en.json';
import es from './locales/es.json';
import ru from './locales/ru.json';




console.log("LOCALIZTION")
const phoneLocales = RNLocalize.getLocales();
console.log({phoneLocales, lang: phoneLocales[0].languageCode })

RNLocalize.addEventListener("change", () => {
    // do localization related stuff…
    const phoneLocales = RNLocalize.getLocales();
    console.log({phoneLocales, lang: phoneLocales[0].languageCode })
    i18n.locale = phoneLocales.languageCode || 'en';
});


i18n.defaultLocale = 'en';
i18n.locale = phoneLocales[0].languageCode || 'en';
i18n.fallbacks = true;
i18n.translations = { en, es, ru };


export default i18n;
