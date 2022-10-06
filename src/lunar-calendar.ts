import { calcMoonEclipticLongitude, calcSunEclipticLongitude, countSolarTerms, getTermOnDay, getTermsOnYear, SolarTerm } from './solar-terms';
import { coerceInteger, isNumberValue, toPrecision } from './tool';

export const TIME_ZONE_OFFSET = new Date().getTimezoneOffset();
export const CHINESE_OFFSET = -480;

const ZODIACS: Array<string> = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const CELESTIAL_STEMS: Array<string> = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const TERRESTRIAL_BRANCHES: Array<string> = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const CAPITALIZE_NUMBER: Array<string> = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const CAPITALIZE_TEN_NUMBER: Array<string> = ['初', '十', '廿', '卅'];


const DAY_TIME = 24 * 60 * 60 * 1000;
const SUN_DAY_LONGITUDE_DIFF = 360 / 355;
const MOON_DAY_LONGITUDE_DIFF = 360 / 29 / 2;
const YEAR_ORIGIN = new Date(1984, 1, 2);
const MONTH_ORIGIN = new Date(2013, 11, 7);
const DAY_ORIGIN = new Date(1949, 9, 1, 0);



export function getDaysOnYear(year: number): number {
  return Math.ceil((Date.UTC(year, 11, 31, 23, 59, 59, 999) - Date.UTC(year, 0, 1)) / DAY_TIME);
}

export function isNewMoon(date: Date): boolean {
  const startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10);
  const time = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 14, 59, 59);
  let sunResult: number;
  let moonResult: number;
  let result = false;

  do {
    sunResult = calcSunEclipticLongitude(time);
    moonResult = calcMoonEclipticLongitude(time);
    if (sunResult + MOON_DAY_LONGITUDE_DIFF >= 360) {
      sunResult = sunResult - 360;
    }
    if (moonResult + MOON_DAY_LONGITUDE_DIFF >= 360) {
      moonResult = moonResult - 360;
    }
    if (Math.abs(sunResult - moonResult) < MOON_DAY_LONGITUDE_DIFF) {
      result = true;
      break;
    }
    time.setHours(time.getHours() - 1);
  } while (time.getTime() >= startTime.getTime());

  return result;
}

export function countNewMoonDays(fromDate: Date, toDate: Date): Array<Date> {
  const moonDays: Array<Date> = [];
  let startDate: Date;
  let endDate: Date;

  if (fromDate.getTime() <= toDate.getTime()) {
    startDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    endDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  } else {
    startDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
    endDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  }

  do {
    if (isNewMoon(startDate)) {
      moonDays.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 27);
    }
    startDate.setDate(startDate.getDate() + 1);
  } while (startDate.getTime() <= endDate.getTime());

  return moonDays;
}

export function isLeapMonth(date: Date): boolean {
  const year = date.getFullYear();
  const guessWinterSolstice = new Date(year - 1, 11, 1);
  const guessRainWater = new Date(year + 1, 1, 31);
  const moonDays = countNewMoonDays(guessWinterSolstice, guessRainWater);
  const length = moonDays.filter((moonDay) => moonDay.getTime() <= date.getTime()).length;
  const currentMoonDay = moonDays[length - 1];
  const nextMoonDayTime = moonDays[length].getTime();
  let isLeap = true;
  let term: SolarTerm | null;

  do {
    term = getTermOnDay(currentMoonDay);
    if (term && term.longitude % 30 === 0) {
      isLeap = false;
      break;
    }
    currentMoonDay.setDate(currentMoonDay.getDate() + 1);
  } while (currentMoonDay.getTime() < nextMoonDayTime);

  return isLeap;
}

abstract class LunarDateProperty extends Number {
  public readonly nativeDate: Date;
  protected offset: number;

  constructor(value: number, nativeDate: Date) {
    super(Math.floor(value));
    this.nativeDate = nativeDate;
    this.offset = this.calcDiff(value);
  }

  sexagesimal(): string {
    const indexStem = this.calcCelestialStem();
    const indexBranch = this.calcBranch();

    return `${CELESTIAL_STEMS[indexStem]}${TERRESTRIAL_BRANCHES[indexBranch]}`;
  }

  protected abstract calcDiff(value?: number): number;

  protected calcCelestialStem(): number {
    return (this.offset + 10) % 10;
  }

  protected calcBranch(): number {
    return (this.offset + 12) % 12;
  }
}

class LunarYear extends LunarDateProperty {
  zodiac(): string {
    const indexBranch = this.calcBranch();

    return `${ZODIACS[indexBranch]}`;
  }

  toString(): string {
    return `${this.sexagesimal()}年 ${this.zodiac()}年`;
  }

  protected calcDiff(): number {
    const year = this.nativeDate.getFullYear();
    const lastTerms = getTermsOnYear(year - 1);
    const winterSolstice = lastTerms.find((item) => item.longitude === 270)!.date!;
    const moonDays = countNewMoonDays(winterSolstice, this.nativeDate).filter((item) => !isLeapMonth(item));
    const firstMoonDay = moonDays[1 + (isNewMoon(winterSolstice) ? 1 : 0)];
    let offset = year - YEAR_ORIGIN.getFullYear();

    if (!firstMoonDay) {
      offset -= 1;
    }

    return offset;
  }
}

export class LunarMonth extends LunarDateProperty {
  isLeap(): boolean {
    return isLeapMonth(this.nativeDate);
  }

  capital(): string {
    const value = this.valueOf();

    return value > 10 ? `${CAPITALIZE_TEN_NUMBER[Math.floor(value / 10)]}${CAPITALIZE_NUMBER[value % 10 - 1]}` : `${CAPITALIZE_NUMBER[value - 1]}`;
  }

  toString(): string {
    return `${this.sexagesimal()}月 ${this.capital()}月`;
  }

  protected calcDiff(value: number): number {
    const isLater = MONTH_ORIGIN.getTime() < this.nativeDate.getTime();
    const terms: Array<SolarTerm> = countSolarTerms(MONTH_ORIGIN, this.nativeDate);
    const nonMidTerms: Array<SolarTerm> = terms.filter((item) => {
      return item.longitude % 30 !== 0;
    });
    const offset: number = nonMidTerms.length - 1;
    console.log(`${this.nativeDate.toISOString()} <-> ${MONTH_ORIGIN.toISOString()}: offset: ${offset}; terms: ${terms.length}; nonMidTerms: ${nonMidTerms.length};`);

    return offset;
  }
}

class LunarDay extends LunarDateProperty {
  capital(): string {
    const value = this.valueOf();
    const unit = value % 10;

    return `${CAPITALIZE_TEN_NUMBER[Math.floor(value / 10)]}${unit === 0 ? CAPITALIZE_NUMBER[9] : CAPITALIZE_NUMBER[unit - 1]}`;
  }

  toString(): string {
    return `${this.sexagesimal()}日 ${this.capital()}`;
  }

  protected calcDiff(value: number): number {
    return Math.round((this.nativeDate.getTime() - DAY_ORIGIN.getTime()) / DAY_TIME);
  }
}

/**
 * @description 8h = 28800000ms, minus 8 hours to get china time zone date.
 */
export class ChineseDate extends Date {

  constructor();
  constructor(value: Date | number | string);
  constructor(
    year: number,
    month?: number,
    date?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    ms?: number,
  );
  constructor(
    year?: Date | number | string,
    month?: number,
    date?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    ms?: number
  ) {
    if (isNumberValue(year) && isNumberValue(month)) {
      super(Date.UTC(coerceInteger(year), coerceInteger(month), coerceInteger(date), coerceInteger(hours), coerceInteger(minutes), coerceInteger(seconds), coerceInteger(ms)) - 28800000);
    } else if (typeof year !== 'undefined') {
      super(year);
    } else {
      super();
    }
  }

  /**
   * 
   * @returns new instance of LunarYear.
   */
  getLunarYear(): LunarYear {
    return new LunarYear(this.getFullYear(), this);
  }

  /**
   * 
   * @returns new instance of LunarMonth.
   */
  getLunarMonth(): LunarMonth {
    const year = this.getFullYear();
    const lastTerms = getTermsOnYear(year - 1);
    const winterSolstice = lastTerms.find((item) => item.longitude === 270)!.date!;
    const moonDays = countNewMoonDays(winterSolstice, this).filter((item) => !isLeapMonth(item));
    const month = moonDays.length - (1 + (isNewMoon(winterSolstice) ? 1 : 0));

    return new LunarMonth(month <= 0 ? month + 12 : month, this);
  }

  /**
   * 
   * @returns new instance of LunarDay.
   */
  getLunarDay(): LunarDay {
    let testDate: Date = new Date(this);
    let i: number = 0;

    do {
      i++;
      i >= 30 && console.log(`${i} ${testDate.toISOString()}`);
      testDate = new Date(this.getFullYear(), this.getMonth(), this.getDate(), -i);
    } while (!isNewMoon(testDate) && i <= 30);

    return new LunarDay(Math.ceil((this.getTime() - testDate.getTime()) / DAY_TIME) + 1, this);
  }

  toChineseString(): string {
    return super.toLocaleString('zh-CN', { timeZone: 'PRC' });
  }

  toLunarString(): string {
    return `农历${this.getLunarYear().sexagesimal()}年${this.getLunarMonth().capital()}月${this.getLunarDay().sexagesimal()}日`;
  }
}
