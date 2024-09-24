import "i18next";

import en from '../locales/en.json';
import bari from '../locales/bari.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'en';
    resources: {
      en: typeof en;
      bari: typeof bari;
    };
  }
}