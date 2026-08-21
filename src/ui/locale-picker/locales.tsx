/**
 * Файл: `src/ui/locale-picker/locales.tsx`
 * Содержит перечень языков iso-639-1 и сборку опций LocalePicker.
 *
 * Основные задачи:
 * 1. Хранить соответствие языка стране в `LANGUAGE_TO_COUNTRY`
 * 2. Предоставить функцию `getLocaleOptions`
 *
 * Потребители:
 *  - `src/ui/locale-picker/index.tsx` — подставляет дефолтный перечень в LocalePicker
 *    и реэкспортирует `getLocaleOptions`
 */

import ISO6391Import, { type LanguageCode } from 'iso-639-1';

/**
 * ISO6391 — формирует адаптер default-экспорта пакета `iso-639-1`.
 * Пакет отдаёт `default` без `esModuleInterop`. Без адаптера вызовы методов пропадают.
 */
const ISO6391 =
  typeof ISO6391Import.getAllCodes === 'function'
    ? ISO6391Import
    : (ISO6391Import as unknown as { default: typeof ISO6391Import }).default;

import { type ListboxOption } from '@ui/listbox';

import { LocaleFlag } from './flags';

/**
 * LANGUAGE_TO_COUNTRY — связывает код языка с кодом страны флага.
 * Ключ — код языка из iso-639-1, значение — код страны флага.
 * Соответствие приватно для модуля, доступ к флагу — только через `getLocaleOptions`.
 */
const LANGUAGE_TO_COUNTRY: Partial<Record<LanguageCode, string>> = {
  aa: 'ER',
  ab: 'GE',
  af: 'ZA',
  ak: 'GH',
  am: 'ET',
  an: 'ES',
  ar: 'SA',
  as: 'IN',
  av: 'RU',
  ay: 'BO',
  az: 'AZ',
  ba: 'RU',
  be: 'BY',
  bg: 'BG',
  bi: 'VU',
  bm: 'ML',
  bn: 'BD',
  bo: 'CN',
  br: 'FR',
  bs: 'BA',
  ca: 'ES',
  ce: 'RU',
  ch: 'GU',
  co: 'FR',
  cr: 'CA',
  cs: 'CZ',
  cv: 'RU',
  cy: 'GB',
  da: 'DK',
  de: 'DE',
  dv: 'MV',
  dz: 'BT',
  ee: 'GH',
  el: 'GR',
  en: 'US',
  es: 'ES',
  et: 'EE',
  eu: 'ES',
  fa: 'IR',
  ff: 'SN',
  fi: 'FI',
  fj: 'FJ',
  fo: 'FO',
  fr: 'FR',
  fy: 'NL',
  ga: 'IE',
  gd: 'GB',
  gl: 'ES',
  gn: 'PY',
  gu: 'IN',
  gv: 'GB',
  ha: 'NG',
  he: 'IL',
  hi: 'IN',
  ho: 'PG',
  hr: 'HR',
  ht: 'HT',
  hu: 'HU',
  hy: 'AM',
  hz: 'NA',
  id: 'ID',
  ig: 'NG',
  ii: 'CN',
  ik: 'US',
  is: 'IS',
  it: 'IT',
  iu: 'CA',
  ja: 'JP',
  jv: 'ID',
  ka: 'GE',
  kg: 'CG',
  ki: 'KE',
  kj: 'AO',
  kk: 'KZ',
  kl: 'GL',
  km: 'KH',
  kn: 'IN',
  ko: 'KR',
  kr: 'NG',
  ks: 'IN',
  ku: 'IQ',
  kv: 'RU',
  kw: 'GB',
  ky: 'KG',
  la: 'VA',
  lb: 'LU',
  lg: 'UG',
  li: 'NL',
  ln: 'CD',
  lo: 'LA',
  lt: 'LT',
  lu: 'CD',
  lv: 'LV',
  mg: 'MG',
  mh: 'MH',
  mi: 'NZ',
  mk: 'MK',
  ml: 'IN',
  mn: 'MN',
  mr: 'IN',
  ms: 'MY',
  mt: 'MT',
  my: 'MM',
  na: 'NR',
  nb: 'NO',
  nd: 'ZW',
  ne: 'NP',
  ng: 'NA',
  nl: 'NL',
  nn: 'NO',
  no: 'NO',
  nr: 'ZA',
  nv: 'US',
  ny: 'MW',
  oc: 'FR',
  oj: 'CA',
  om: 'ET',
  or: 'IN',
  os: 'RU',
  pa: 'IN',
  pi: 'IN',
  pl: 'PL',
  ps: 'AF',
  pt: 'PT',
  qu: 'PE',
  rm: 'CH',
  rn: 'BI',
  ro: 'RO',
  ru: 'RU',
  rw: 'RW',
  sa: 'IN',
  sc: 'IT',
  sd: 'PK',
  se: 'NO',
  sg: 'CF',
  si: 'LK',
  sk: 'SK',
  sl: 'SI',
  sm: 'WS',
  sn: 'ZW',
  so: 'SO',
  sq: 'AL',
  sr: 'RS',
  ss: 'SZ',
  st: 'LS',
  su: 'ID',
  sv: 'SE',
  sw: 'KE',
  ta: 'IN',
  te: 'IN',
  tg: 'TJ',
  th: 'TH',
  ti: 'ER',
  tk: 'TM',
  tl: 'PH',
  tn: 'BW',
  to: 'TO',
  tr: 'TR',
  ts: 'ZA',
  tt: 'RU',
  tw: 'GH',
  ty: 'PF',
  ug: 'CN',
  uk: 'UA',
  ur: 'PK',
  uz: 'UZ',
  ve: 'ZA',
  vi: 'VN',
  wa: 'BE',
  wo: 'SN',
  xh: 'ZA',
  yi: 'IL',
  yo: 'NG',
  za: 'CN',
  zh: 'CN',
  zu: 'ZA',
};

/**
 * getLocaleOptions — принимает коды языков и возвращает опции Listbox с флагом,
 * родным именем и текстом поиска.
 *
 * @param codes коды языков. Без аргумента — полный перечень iso-639-1
 * @returns перечень опций Listbox
 */
export function getLocaleOptions(
  codes: readonly string[] = ISO6391.getAllCodes()
): readonly ListboxOption[] {
  return Object.freeze(
    codes
      .filter((code) => ISO6391.validate(code))
      .map((code) => {
        const englishName = ISO6391.getName(code);
        const nativeName = ISO6391.getNativeName(code);
        const country = LANGUAGE_TO_COUNTRY[code];

        return {
          icon: <LocaleFlag country={country} />,
          label: nativeName,
          searchText: `${nativeName} ${englishName} ${code}`,
          value: code,
        };
      })
  );
}
