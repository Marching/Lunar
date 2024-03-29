import { SolarTerm } from "./solar-terms";

/**
 * @description China standard position, 120 E.
 */
export const CH_STANDARD_POSITION: GeoJSON.Position = [120, 0];

export function setIntl(source: Map<number, SolarTerm>, lang: Array<string>): void {
  source.forEach((value, key) => {
    if (lang[key - 1]) {
      value.label = lang[key - 1];
    }
  });
}

export const SOLAR_TERMS_ZH: ReadonlyArray<string> = [
  '春分',
  '清明',
  '谷雨',
  '立夏',
  '小满',
  '芒种',
  '夏至',
  '小暑',
  '大暑',
  '立秋',
  '处暑',
  '白露',
  '秋分',
  '寒露',
  '霜降',
  '立冬',
  '小雪',
  '大雪',
  '冬至',
  '小寒',
  '大寒',
  '立春',
  '雨水',
  '惊蛰'
];

export const SOLAR_TERMS_EN: ReadonlyArray<string> = [
  'Spring equinox',
  'Fresh green',
  'Grain rain',
  'Beginning of summer',
  'Lesser fullness',
  'Grain in ear',
  'Summer solstice',
  'Lesser heat',
  'Greater heat',
  'Beginning of autumn',
  'End of heat',
  'White dew',
  'Autumnal equinox',
  'Cold dew',
  'First frost',
  'Beginning of winter',
  'Light snow',
  'Heavy snow',
  'Winter solstice',
  'Lesser cold',
  'Greater cold',
  'Beginning of spring',
  'Rain water',
  'Awakening from hibernation'
];
