import { getPlanet } from 'ephemeris';

import { coerceInteger, toPrecision } from './tool';
import { CH_STANDARD_POSITION, SOLAR_TERMS_ZH } from './intl';
import { ChineseDate } from './lunar-calendar';

/**
 * @description GB/T 33661-2017 农历的编算和颁行
 * @link http://c.gb688.cn/bzgk/gb/showGb?type=online&hcno=E107EA4DE9725EDF819F33C60A44B296
 */
export class SolarTerm {
  date?: ChineseDate;

  constructor(public readonly order: number, public readonly longitude: number, public label: string) {
  }

  toString = (): string => {
    return `${this.label}` + (this.date ? ` ${this.date?.toChineseString()}` : ``);
  };

  static create(index: number, lang: Array<string> | ReadonlyArray<string> = SOLAR_TERMS_ZH): SolarTerm {
    index = coerceInteger(index);
    return new SolarTerm(index, (index - 1) * 15, lang[index - 1]);
  }
}

export function create24SolarTerms(lang: Array<string> | ReadonlyArray<string> = SOLAR_TERMS_ZH): Map<number, SolarTerm> {
  const terms = new Map<number, SolarTerm>();

  for (let i = 1; i <= 24; i++) {
    terms.set(i, SolarTerm.create(i, lang));
  }
  return terms;
}

export function calcMoonEclipticLongitude(targetDate: Date, coordinate: GeoJSON.Position = CH_STANDARD_POSITION): number {
  return getPlanet<'moon'>('moon', targetDate, coordinate[0], coordinate[1], 0).observed.moon.apparentLongitudeDd;
};

export function calcSunEclipticLongitude(targetDate: Date, coordinate: GeoJSON.Position = CH_STANDARD_POSITION): number {
  return getPlanet<'sun'>('sun', targetDate, coordinate[0], coordinate[1], 0).observed.sun.apparentLongitudeDd;
};

export function calcDiffOfSunAndMoon(time: Date): number {
  const sunResult: number = calcSunEclipticLongitude(time);
  const moonResult: number = calcMoonEclipticLongitude(time);

  return Math.min(
    Math.abs(sunResult - moonResult),
    Math.abs(sunResult - (moonResult - 360)),
    Math.abs((sunResult - 360) - moonResult),
    Math.abs((sunResult - 360) - (moonResult - 360))
  );
}

export function getTermOnDay(date: Date, coordinate: GeoJSON.Position = CH_STANDARD_POSITION): SolarTerm | null {
  const dateS = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dateE = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
  const eclipticLngS = toPrecision(calcSunEclipticLongitude(dateS, coordinate), 3);
  const eclipticLngE = toPrecision(calcSunEclipticLongitude(dateE, coordinate), 3);
  let result: SolarTerm | null = null;
  let x: number = Math.floor(eclipticLngE); // An integer

  do {
    if (x % 15 === 0 && eclipticLngS <= (x === 0 ? 360 : x) && eclipticLngE >= x) {
      const index = x / 15 + 1;

      if (index >= 1 && index <= 24) {
        result = SolarTerm.create(index);
        result.date = new ChineseDate(date);
        break;
      }
    }
    x = (x - 1 + 360) % 360;
  } while (x > eclipticLngS);

  return result;
}

export function countSolarTerms(fromDate: Date, toDate: Date): Array<SolarTerm> {
  const terms: Array<SolarTerm> = [];
  let startDate: Date;
  let endDate: Date;
  let target: SolarTerm | null;

  if (fromDate.getTime() <= toDate.getTime()) {
    startDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    endDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  } else {
    startDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
    endDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  }

  do {
    target = getTermOnDay(startDate);
    if (target) {
      terms.push(target);
      startDate.setDate(startDate.getDate() + 13);
    } else {
      startDate.setDate(startDate.getDate() + 1);
    }
  } while (startDate.getTime() <= endDate.getTime());

  return terms;
}

/**
 * This method will countSolarTerms with params that are the first date and the latest date of the year.
 */
export function getTermsOnYear(year: number, coordinate: GeoJSON.Position = CH_STANDARD_POSITION): Array<SolarTerm> {
  return countSolarTerms(new Date(year, 0, 1, 0, 0, 0, 0), new Date(year, 11, 31, 23, 59, 59, 999));
}
