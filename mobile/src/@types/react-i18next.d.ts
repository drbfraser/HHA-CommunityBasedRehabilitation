import "i18next";

import Resources from '../../../common/src/@types/resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'en';
    resources: Resources;
  }
}