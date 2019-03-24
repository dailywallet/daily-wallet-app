import i18n from 'i18n-js';

import en from './locales/en.json';
import es from './locales/es.json';
import ru from './locales/ru.json';

i18n.defaultLocale = 'en';
i18n.locale = 'ru';
i18n.fallbacks = true;
i18n.translations = { en, es, ru };

export default i18n;
