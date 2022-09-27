import { getPlanet } from 'ephemeris';

import { CH_STANDARD_POSITION } from '../intl';
import { sameDate } from '../tool';
import { ChineseDate, countNewMoonFrom, getDaysOnYear } from '../lunar-calendar';

describe('Lunar calendar', (): void => {
  describe('Chinese date', (): void => {
    it('2022-09-26', (): void => {
      const testDate = new ChineseDate(2022, 8, 26);

      expect(testDate.toISOString()).toBe('2022-09-25T16:00:00.000Z');
      expect(testDate.toChineseString()).toBe('2022/9/26 00:00:00');
    });

    it('2014-09-24', (): void => {
      const testDate = new ChineseDate(2014, 8, 24);

      expect(testDate.toISOString()).toBe('2014-09-23T16:00:00.000Z');
      expect(testDate.toChineseString()).toBe('2014/9/24 00:00:00');
    });
  });

  describe('Count days on year', (): void => {
    it('2000', (): void => {
      expect(getDaysOnYear(2000)).toBe(366);
    });

    it('2010', (): void => {
      expect(getDaysOnYear(2010)).toBe(365);
    });

    it('2020', (): void => {
      expect(getDaysOnYear(2020)).toBe(366);
    });
  });

  describe('New moon', (): void => {
    it('Test ecliptic longitude', (): void => {
      const testDate = new ChineseDate(2022, 7, 26, 12);
      const avgDeg = 360 / 29; // 29 is the average days of a lunar month

      const sunResultS = getPlanet<'sun'>('sun', testDate, CH_STANDARD_POSITION[0], CH_STANDARD_POSITION[1], 0);
      const sunResultE = getPlanet<'sun'>(
        'sun',
        new ChineseDate(testDate.getFullYear(), testDate.getMonth(), testDate.getDate(), 23, 59, 59, 999),
        CH_STANDARD_POSITION[0],
        CH_STANDARD_POSITION[1],
        0
      );
      const moonResultS = getPlanet<'moon'>('moon', testDate, CH_STANDARD_POSITION[0], CH_STANDARD_POSITION[1], 0);
      const moonResultE = getPlanet<'moon'>(
        'moon',
        new ChineseDate(testDate.getFullYear(), testDate.getMonth(), testDate.getDate(), 23, 59, 59, 999),
        CH_STANDARD_POSITION[0],
        CH_STANDARD_POSITION[1],
        0
      );
      const diffS = Math.abs(sunResultS.observed.sun.apparentLongitudeDd - moonResultS.observed.moon.apparentLongitudeDd);
      const diffE = Math.abs(sunResultE.observed.sun.apparentLongitudeDd - moonResultE.observed.moon.apparentLongitudeDd);

      console.log(`testDate: ${testDate.toChineseString()}; avgDeg: ${avgDeg}; diffS: ${diffS}; diffE: ${diffE}`);
    });

    it('2022-09-26', (): void => {
      const testDate = new ChineseDate(2022, 8, 26);
      const moonDays = countNewMoonFrom(testDate, testDate);

      expect(moonDays.length).toBe(1);
      expect(sameDate(moonDays[0], testDate)).toBe(true);
    });

    it('form 2013-11-01 to 2022-09-28', (): void => {
      const toDate = new ChineseDate(2022, 8, 28);
      const moonDays = countNewMoonFrom(new ChineseDate(2013, 11, 1), toDate);

      toDate.calcLunarDate();
      expect(moonDays.length).toBeGreaterThan(1);
      expect(sameDate(moonDays[0], new ChineseDate(2013, 11, 3))).toBe(true);
    });

    it('Chinese day on 2022-09-28', (): void => {
      const lunarDate = new ChineseDate(2022, 8, 28);

      lunarDate.calcLunarDate();
      console.log(lunarDate.toString());

      expect(lunarDate.lunarMonth.sexagesimal()).toBe('己酉');
      expect(lunarDate.lunarDay.sexagesimal()).toBe('甲申');
      expect(lunarDate.toLunarString()).toBe('农历辛丑年九月甲申日');
    });
  });
});
