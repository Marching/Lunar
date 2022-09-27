import { getPlanet, Result } from 'ephemeris';

import { CH_STANDARD_POSITION } from './intl';
import { getTermsOnYear, SolarTerm } from './solar-terms';
import { coerceInteger, isNumberValue } from './tool';

const ZODIACS: Array<string> = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const CELESTIAL_STEMS: Array<string> = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const TERRESTRIAL_BRANCHES: Array<string> = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const CAPITALIZE_NUMBER: Array<string> = ['日', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const CAPITALIZE_TEN_NUMBER: Array<string> = ['初', '十', '廿', '卅', '　'];
const DAY_TIME = 24 * 60 * 60 * 1000;



export function getDaysOnYear(year: number): number {
  return Math.ceil(
    (new ChineseDate(year, 11, 31, 23, 59, 59, 999).getTime() - new ChineseDate(year, 0, 1).getTime()) / DAY_TIME
  );
}

export function countNewMoonFrom(fromDate: ChineseDate, toDate: ChineseDate): Array<ChineseDate> {
  const avgDeg = 360 / 29; // 29 is the average days of a lunar month
  const moonDays: Array<{ date: ChineseDate; diffS: number; diffE: number }> = [];
  const lunarDate = new ChineseDate(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 12, 0, 0, 0);
  let sunResultS: Result<'sun'>, sunResultE: Result<'sun'>;
  let moonResultS: Result<'moon'>, moonResultE: Result<'moon'>;
  let diffS: number, diffE: number;

  fromDate = new ChineseDate(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0, 0);
  toDate = new ChineseDate(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 23, 59, 59, 999);

  do {
    sunResultS = getPlanet<'sun'>('sun', lunarDate, CH_STANDARD_POSITION[0], CH_STANDARD_POSITION[1], 0);
    sunResultE = getPlanet<'sun'>(
      'sun',
      new ChineseDate(lunarDate.getFullYear(), lunarDate.getMonth(), lunarDate.getDate(), 23, 59, 59, 999),
      CH_STANDARD_POSITION[0],
      CH_STANDARD_POSITION[1],
      0
    );
    moonResultS = getPlanet<'moon'>('moon', lunarDate, CH_STANDARD_POSITION[0], CH_STANDARD_POSITION[1], 0);
    moonResultE = getPlanet<'moon'>(
      'moon',
      new ChineseDate(lunarDate.getFullYear(), lunarDate.getMonth(), lunarDate.getDate(), 23, 59, 59, 999),
      CH_STANDARD_POSITION[0],
      CH_STANDARD_POSITION[1],
      0
    );
    diffS = Math.abs(sunResultS.observed.sun.apparentLongitudeDd - moonResultS.observed.moon.apparentLongitudeDd);
    diffE = Math.abs(sunResultE.observed.sun.apparentLongitudeDd - moonResultE.observed.moon.apparentLongitudeDd);

    if (diffS < avgDeg / 2) {
      moonDays.push({
        date: new ChineseDate(lunarDate.getFullYear(), lunarDate.getMonth(), lunarDate.getDate()),
        diffS: diffS,
        diffE: diffE
      });
      lunarDate.setDate(lunarDate.getDate() + 27);
    }
    lunarDate.setDate(lunarDate.getDate() + 1);
  } while (lunarDate.getTime() < toDate.getTime());

  console.log(
    moonDays
      .map((item) => {
        return `${item.date.toLocaleString()} => ${item.diffS} <-> ${item.diffE}`;
      })
      .join('\n')
  );
  console.log(`avgDeg: ${avgDeg}; moonDayCount: ${moonDays.length}`);
  console.log(`fromDate: ${fromDate.toLocaleString()}; toDate: ${toDate.toLocaleString()}`);

  return moonDays.map((item) => item.date);
}

export abstract class LunarDateProperty extends Number {
  public readonly nativeDate: ChineseDate;
  protected readonly origin: ChineseDate;
  protected offset: number;

  constructor(value: number, nativeDate: ChineseDate, origin: ChineseDate) {
    super(Math.floor(value));
    this.origin = origin;
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
    let stem = this.offset % 10;

    return (stem += stem < 0 ? 10 : 0);
  }

  protected calcBranch(): number {
    let branch = this.offset % 12;

    return (branch += branch < 0 ? 12 : 0);
  }
}

export class LunarYear extends LunarDateProperty {
  constructor(nativeDate: ChineseDate) {
    super(nativeDate.getFullYear(), nativeDate, new ChineseDate(1985, 1, 2));
  }

  zodiac(): string {
    this.offset = this.calcDiff();
    const indexBranch = this.calcBranch();

    return `${ZODIACS[indexBranch]}`;
  }

  toString(): string {
    this.offset = this.calcDiff();
    return `${this.sexagesimal()}年 ${this.zodiac()}年`;
  }

  protected calcDiff(): number {
    return this.nativeDate.getFullYear() - this.origin.getFullYear();
  }
}

export class LunarMonth extends LunarDateProperty {
  constructor(value: number, nativeDate: ChineseDate) {
    super(value, nativeDate, new ChineseDate(2013, 11, 7));
  }

  capital(): string {
    const value = this.valueOf();

    return value > 10 ? `${CAPITALIZE_NUMBER[10]}${CAPITALIZE_NUMBER[value - 10]}` : `${CAPITALIZE_NUMBER[value]}`;
  }

  isLeap(): boolean {
    return false;
  }

  toString(): string {
    return `${this.sexagesimal()}月 ${this.capital()}月`;
  }

  protected calcDiff(value: number): number {
    const fromDate = this.origin;
    const toDate = this.nativeDate;
    const startYear = fromDate.getFullYear();
    const endYear = toDate.getFullYear();
    const moonDays: Array<ChineseDate> = countNewMoonFrom(fromDate, toDate);
    let countLeap: Array<ChineseDate> = [];
    let terms: Array<SolarTerm> = [];
    let midTerms: Array<SolarTerm>;
    let offset: number = 0;

    for (let i = startYear; i <= endYear; i++) {
      if (i === startYear || i === endYear) {
        terms = terms.concat(getTermsOnYear(i, CH_STANDARD_POSITION).filter((item) => {
          return item.date!.getTime() >= fromDate.getTime() && item.date!.getTime() <= toDate.getTime();
        }));
      } else {
        terms = terms.concat(getTermsOnYear(i, CH_STANDARD_POSITION));
      }
    }
    midTerms = terms.filter((item) => {
      return item.longitude % 30 === 0;
    });
    countLeap = moonDays.filter((moonDay, i) => {
      if (moonDays[i + 1] && !midTerms.some((item) => {
        return item.date!.getTime() >= moonDay.getTime() && item.date!.getTime() < moonDays[i + 1].getTime();
      })) {
        return true;
      }
      return false;
    });

    console.log(terms.join('\n'));
    console.log(moonDays.map((item) => item.toChineseString()).join('\n'));
    console.log(countLeap.map((item) => item.toChineseString()).join('\n'));
    offset = terms.length - midTerms.length + 1;
    console.log(`offset: ${offset}; terms.length: ${terms.length}; midTerms.length: ${midTerms.length}; countLeap: ${countLeap.length};`);

    return offset;
  }
}

export class LunarDay extends LunarDateProperty {
  constructor(value: number, nativeDate: ChineseDate) {
    super(value, nativeDate, new ChineseDate(1949, 9, 1));
  }

  capital(): string {
    const value = this.valueOf();

    switch (value) {
      case 10:
        return '初十';
      case 20:
        return '二十';
      case 30:
        return '三十';
      default:
        return `${CAPITALIZE_TEN_NUMBER[Math.floor(value / 10)]}${CAPITALIZE_NUMBER[value % 10]}`;
    }
  }

  toString(): string {
    return `${this.sexagesimal()}日 ${this.capital()}`;
  }

  protected calcDiff(value: number): number {
    return Math.round((this.nativeDate.getTime() - this.origin.getTime()) / DAY_TIME);
  }
}

/**
 * @description 8h = 28800000ms, minus 8 hours to get china time zone date.
 */
export class ChineseDate extends Date {
  public lunarYear!: LunarYear;
  public lunarMonth!: LunarMonth;
  public lunarDay!: LunarDay;

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
    if (isNumberValue(year)) {
      super(Date.UTC(coerceInteger(year), coerceInteger(month), coerceInteger(date), coerceInteger(hours), coerceInteger(minutes), coerceInteger(seconds), coerceInteger(ms)) - 28800000);
    } else {
      super(year as unknown as (string | Date));
    }
    this.lunarYear = new LunarYear(this);
  }

  toChineseString(): string {
    return super.toLocaleString('zh-CN', { timeZone: 'PRC' });
  }

  toLunarString(): string {
    if (!this.lunarMonth || !this.lunarDay) {
      this.calcLunarDate();
    }
    return `农历${this.lunarYear.sexagesimal()}年${this.lunarMonth.capital()}月${this.lunarDay.sexagesimal()}日`;
  }

  calcLunarDate(): void {
    const year = this.getFullYear();
    let lunarMonth: number = 0;
    let lunarDay: number = 0;
  
    let winterSolstice = new ChineseDate(year - 1, 11, 20, 12);
    const relativeSunResult = getPlanet<'sun'>(
      'sun',
      winterSolstice,
      CH_STANDARD_POSITION[0],
      CH_STANDARD_POSITION[1],
      0
    );
    // 270 winter solstice ecliptic longitude
    const diffDays = (270 - relativeSunResult.observed.sun.apparentLongitudeDd) / 15;
    winterSolstice = new ChineseDate(
      winterSolstice.getFullYear(),
      winterSolstice.getMonth(),
      winterSolstice.getDate() + diffDays * 14
    );
    const moonDays = countNewMoonFrom(winterSolstice, this);
    const count = moonDays.length;
  
    lunarMonth = count - 1;
    if (count) {
      lunarDay = Math.ceil((this.getTime() - moonDays[count - 1].getTime()) / DAY_TIME) + 1;
    }
    console.log(`lunarMonth: ${lunarMonth} | lunarDay: ${lunarDay}`);
    console.log(`diffDays: ${diffDays}; winterSolstice: ${winterSolstice.toLocaleString()}`);

    this.lunarMonth = new LunarMonth(lunarMonth, this);
    this.lunarDay = new LunarDay(lunarDay, this);
  }
}
