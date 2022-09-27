import { getPlanet } from 'ephemeris';

import { coerceInteger } from './tool';
import { CH_STANDARD_POSITION, SOLAR_TERMS_ZH } from './intl';
import { ChineseDate } from './lunar-calendar';

/**
 *
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
    terms.set(i, SolarTerm.create(i));
  }
  return terms;
}

export function calcEclipticLongitude(time: Date, precision?: number, coordinate: GeoJSON.Position = CH_STANDARD_POSITION): number {
  const result: number = getPlanet<'sun'>('sun', time, coordinate[0], coordinate[1], 0).observed.sun.apparentLongitudeDd;

  return typeof precision === 'number' ? (Math.round(result * Math.pow(10, precision)) / Math.pow(10, precision)) : result;
};

/**
 *
 */
export function getTermsOnYear(year: number, coordinate: GeoJSON.Position = CH_STANDARD_POSITION): Array<SolarTerm> {
  const terms: Array<SolarTerm> = [];
  const startDate = new ChineseDate(year, 0, 1, 0, 0, 0, 0);
  let target: SolarTerm | null;

  while (startDate.getFullYear() <= year) {
    target = getTermOnDay(startDate, coordinate);
    if (target) {
      target.date = new ChineseDate(startDate);
      terms.push(target);
      startDate.setDate(startDate.getDate() + 13);
    }
    startDate.setDate(startDate.getDate() + 1);
  }

  return terms.sort((a, b) => {
    return a.date!.getTime() - b.date!.getTime();
  });
}

export function getTermOnDay(date: ChineseDate, coordinate: GeoJSON.Position = CH_STANDARD_POSITION): SolarTerm | null {
  const eclipticLngS = calcEclipticLongitude(new ChineseDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0), 3, coordinate) % 360;
  const eclipticLngE = calcEclipticLongitude(new ChineseDate(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999), 3, coordinate) % 360;
  const x = Math.floor(eclipticLngE) % 360;

  // console.log(`${date.toChineseString()} => ${eclipticLngS} <-> ${eclipticLngE} -> |${x}| -> ${eclipticLngE - eclipticLngS}`);
  if (x % 15 === 0 && eclipticLngS <= (x === 0 ? 360 : x) && eclipticLngE >= x) {
    // console.log('**************************************');
    const index = x / 15 + 1;

    return index >= 1 && index <= 24 ? SolarTerm.create(index) : null;
  }
  return null;
}
