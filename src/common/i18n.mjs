import { createI18n } from 'vue-i18n';
//eslint-disable-next-line @dword-design/import-alias/prefer-alias
import languages from '../assets/i18n/index.mjs';

const LANGUAGE_KEY = 'lang';

export const locales = [
  { code: 'en-US', flag: '🇺🇸', name: 'English (US)' },
  { code: 'zh-CN', flag: '🇨🇳', name: '中文(简体)' },
];

export const regionalLocales = {
  US: [
    locales.find(l => l.code === 'en-US'),
  ],
  AP: [
    locales.find(l => l.code === 'zh-CN'),
  ],
};

export const defaultLocale = locales.find(l => l.code === 'en-US');

const datetimeFormats = {
  dateTimeShort: { month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' },
  dateTimeShortWeekday: { month: 'numeric', weekday: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' },
  time: { hour: 'numeric', minute: '2-digit' },
};

let i18n = null;

export function initializeI18n() {
  if (!i18n) {
    i18n = createI18n({
      legacy: false,
      locale: currentLocale().code,
      fallbackLocale: 'en-US',
      messages: { ...languages },
      datetimeFormats: locales.reduce((result, locale) => ({ ...result, [locale.code]: datetimeFormats }), {}),
      pluralRules: {
        'ru-RU': ruPluralization,
      },
    });

    // Listen for local storage changes
    window.addEventListener('storage', reload);
    reload();
  }

  return i18n;
}

// Adapted from: https://vue-i18n.intlify.dev/guide/essentials/pluralization.html#custom-pluralization
function ruPluralization(choice, choicesLength, orgRule) {
  if (choice === 0) {
    return 0;
  }

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;
  if (!teen && endsWithOne) {
    return 1;
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }

  return choicesLength < 4 ? 2 : 3;
}

function reload() {
  i18n.global.locale = currentLocale().code;
  loadLocale();

  switch (currentLocale().code) {
    case 'zh-CN':
      document.documentElement.style.setProperty('--font-family-s1', 'splatoon1, splatoon1chzh, sans-serif');
      document.documentElement.style.setProperty('--font-family-s2', 'splatoon2, splatoon2chzh, sans-serif');
      break;

    case 'zh-TW':
      document.documentElement.style.setProperty('--font-family-s1', 'splatoon1, splatoon1twzh, sans-serif');
      document.documentElement.style.setProperty('--font-family-s2', 'splatoon2, splatoon2twzh, sans-serif');
      break;

    default:
      document.documentElement.style.setProperty('--font-family-s1', 'splatoon1, splatoon1jpja, sans-serif');
      document.documentElement.style.setProperty('--font-family-s2', 'splatoon2, splatoon2jpja, sans-serif');
      break;
  }
}

async function loadLocale() {
  let locale = currentLocale().code;

  i18n.global.setLocaleMessage(locale, {
    ...i18n.global.getLocaleMessage(locale),
  });
}

function currentLocale() {
  return preferredLocale() || detectLocale();
}

function preferredLocale() {
  let code = localStorage && localStorage.getItem(LANGUAGE_KEY);

  return locales.find(l => l.code === code);
}

export function setPreferredLocale(value) {
  localStorage.setItem(LANGUAGE_KEY, value);
  reload();
}

function detectLocale() {
  let languages = window.navigator.languages || [window.navigator.language];

  // Try to find a matching language
  for (let language of languages) {
    let locale = locales.find(l => l.code.startsWith(language))
       || locales.find(l => l.code.startsWith(language.substring(0, 2)));

    if (locale) {
      return locale;
    }
  }

  // Fall back to en-US
  return defaultLocale;
}
