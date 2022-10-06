import { sameDate } from '../tool';
import { ChineseDate, countNewMoonDays, getDaysOnYear, isLeapMonth, isNewMoon, LunarMonth } from '../lunar-calendar';
import { calcMoonEclipticLongitude, calcSunEclipticLongitude, getTermsOnYear } from '../solar-terms';

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
      const testDate = new Date(1944, 0, 26);
      const startTime = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate());
      const time = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate(), 23, 59, 59);
      const diffs: Array<string> = [];

      do {
        diffs.push(`${time.toLocaleString()} => ${Math.abs(calcSunEclipticLongitude(time) - calcMoonEclipticLongitude(time))}`);
        time.setHours(time.getHours() - 1);
      } while (time.getTime() >= startTime.getTime());

      console.log(`testDate: ${testDate.toLocaleString()}; avgDeg: ${360 / 29 / 2}; => ${isNewMoon(testDate)}`);
      console.log(diffs.join('\n'));
    });

    it('Threshold dates', (): void => {
      expect(isNewMoon(new Date(1944, 0, 25))).toBe(true);
      expect(isNewMoon(new Date(1944, 0, 26))).toBe(false);
    });

    it('Leap lunar months', (): void => {
      const testResult = new ChineseDate(1984, 10, 23).getLunarMonth();

      expect(new ChineseDate(1984, 9, 24).getLunarMonth().capital()).toBe('十');
      expect(testResult.isLeap()).toBe(true);
      expect(testResult.capital()).toBe('十');
      expect(new ChineseDate(1984, 11, 22).getLunarMonth().capital()).toBe('十一');

      const rows: Array<[[number, number, number], [number, number, number], string]> = [
        [[1900, 9, 24], [1900, 10, 22], '八'],
        [[1903, 6, 25], [1903, 7, 23], '五'],
        [[1906, 5, 23], [1906, 6, 21], '四'],
        [[1909, 3, 22], [1909, 4, 19], '二'],
        [[1911, 7, 26], [1911, 8, 23], '六'],
        [[1914, 6, 23], [1914, 7, 22], '五'],
        [[1917, 3, 23], [1917, 4, 20], '二'],
        [[1919, 8, 25], [1919, 9, 23], '七'],
        [[1922, 6, 25], [1922, 7, 23], '五'],
        [[1925, 5, 22], [1925, 6, 20], '四'],
        [[1928, 3, 22], [1928, 4, 19], '二'],
        [[1930, 7, 26], [1930, 8, 23], '六'],
        [[1933, 6, 23], [1933, 7, 22], '五'],
        [[1936, 4, 21], [1936, 5, 20], '三'],

        [[1938, 8, 25], [1938, 9, 23], '七'],
        [[1941, 7, 24], [1941, 8, 22], '六'],
        [[1944, 5, 22], [1944, 6, 20], '四'],
        [[1947, 3, 23], [1947, 4, 20], '二'],
        [[1949, 8, 24], [1949, 9, 21], '七'],
        [[1952, 6, 22], [1952, 7, 21], '五'],
        [[1955, 4, 22], [1955, 5, 21], '三'],
        [[1957, 9, 24], [1957, 10, 22], '八'],
        [[1960, 7, 24], [1960, 8, 21], '六'],
        [[1963, 5, 23], [1963, 6, 20], '四'],
        [[1966, 4, 21], [1966, 5, 19], '三'],
        [[1968, 8, 24], [1968, 9, 21], '七'],
        [[1971, 6, 23], [1971, 7, 21], '五'],
        [[1974, 5, 22], [1974, 6, 19], '四'],

        [[1976, 9, 24], [1976, 10, 22], '八'],
        [[1979, 7, 24], [1979, 8, 22], '六'],
        [[1982, 5, 23], [1982, 6, 20], '四'],
        [[1984, 11, 23], [1984, 12, 21], '十'],
        [[1987, 7, 26], [1987, 8, 23], '六'],
        [[1990, 6, 23], [1990, 7, 21], '五'],
        [[1993, 4, 22], [1993, 5, 20], '三'],
        [[1995, 9, 25], [1995, 10, 23], '八'],
        [[1998, 6, 24], [1998, 7, 22], '五'],
        [[2001, 5, 23], [2001, 6, 20], '四'],
        [[2004, 3, 21], [2004, 4, 18], '二'],
        [[2006, 8, 24], [2006, 9, 21], '七'],
        [[2009, 6, 23], [2009, 7, 21], '五'],
        [[2012, 5, 21], [2012, 6, 18], '四'],

        [[2014, 10, 24], [2014, 11, 21], '九'],
        [[2017, 7, 23], [2017, 8, 21], '六'],
        [[2020, 5, 23], [2020, 6, 20], '四'],
        [[2023, 3, 22], [2023, 4, 19], '二'],
        [[2025, 7, 25], [2025, 8, 22], '六'],
        [[2028, 6, 23], [2028, 7, 21], '五'],
        [[2031, 4, 22], [2031, 5, 20], '三'],
        [[2033, 12, 22], [2034, 1, 19], '十一'],
        [[2036, 7, 23], [2036, 8, 21], '六'],
        [[2039, 6, 22], [2039, 7, 20], '五'],
        [[2042, 3, 22], [2042, 4, 19], '二'],
        [[2044, 8, 23], [2044, 9, 20], '七'],
        [[2047, 6, 23], [2047, 7, 22], '五']
      ];
      const total = rows.length - 1;
      let month: LunarMonth;
      let i: number = 0;
      let index: number;
      let row: [[number, number, number], [number, number, number], string];

      do {
        index = Math.round(Math.random() * total);
        row = rows[index];
        try {
          month = new ChineseDate(row[0][0], row[0][1] - 1, row[0][2]).getLunarMonth();
          expect(month.capital()).toBe(row[2]);
        } catch (error) {
          console.log(`----------> Leap lunar month -> error -> ${row[0]}`);
          const date = new ChineseDate(row[0][0], row[0][1] - 1, row[0][2]);
          const year = date.getFullYear();
          const lastTerms = getTermsOnYear(year - 1);
          const winterSolstice = lastTerms.find((item) => item.longitude === 270)!.date!;
          const moonDays = countNewMoonDays(winterSolstice, date).filter((item) => !isLeapMonth(item));
          const month = moonDays.length - (1 + (isNewMoon(winterSolstice) ? 1 : 0));

          console.log(`month: ${month}; ${date.toChineseString()}; winterSolstice: ${winterSolstice.toChineseString()}; ${isNewMoon(winterSolstice)}`);
          console.log(moonDays);

          throw error;
        }
        i++;
      } while (i < 5);
    });

    it('Celestial stem & branch of days', (): void => {
      expect(new ChineseDate(1949, 9, 1).getLunarDay().sexagesimal()).toBe('甲子');
    });

    it('Celestial stem & branch of years', (): void => {
      expect(new ChineseDate(1982, 2, 9).getLunarYear().sexagesimal()).toBe('壬戌');

      expect(new ChineseDate(1983, 7, 1).getLunarYear().sexagesimal()).toBe('癸亥');

      expect(new ChineseDate(1984, 1, 1).getLunarYear().sexagesimal()).toBe('癸亥');
      expect(new ChineseDate(1984, 1, 2).getLunarYear().sexagesimal()).toBe('甲子');
      expect(new ChineseDate(1984, 1, 3).getLunarYear().sexagesimal()).toBe('甲子');

      expect(new ChineseDate(1985, 1, 19).getLunarYear().sexagesimal()).toBe('甲子');
      expect(new ChineseDate(1985, 1, 20).getLunarYear().sexagesimal()).toBe('乙丑');
      expect(new ChineseDate(1985, 1, 21).getLunarYear().sexagesimal()).toBe('乙丑');
    });

    it('甲子年 1984-02-02 00:00:00 <-> 1985-02-19 23:59:59', (): void => {
      let testDate = new ChineseDate(1984, 1, 2);

      expect(testDate.getLunarYear().sexagesimal()).toBe('甲子');
      testDate = new ChineseDate(1984, 1, 1, 23, 59, 59);
      expect(testDate.getLunarYear().sexagesimal()).toBe('癸亥');
      testDate = new ChineseDate(1985, 1, 19, 23, 59, 59);
      expect(testDate.getLunarYear().sexagesimal()).toBe('甲子');
    });

    it('2022-09-26', (): void => {
      const testDate = new ChineseDate(2022, 8, 26);
      const moonDays = countNewMoonDays(testDate, testDate);

      expect(moonDays.length).toBe(1);
      expect(sameDate(moonDays[0], testDate)).toBe(true);
    });

    it('form 2013-11-01 to 2022-09-28', (): void => {
      const toDate = new ChineseDate(2022, 8, 28);
      const moonDays = countNewMoonDays(new ChineseDate(2013, 11, 1), toDate);

      expect(moonDays.length).toBeGreaterThan(1);
      expect(sameDate(moonDays[0], new ChineseDate(2013, 11, 3))).toBe(true);
    });

    it('Chinese day on 2013-12-07', (): void => {
      const testDate = new ChineseDate(2013, 11, 7);

      console.log(testDate.getLunarMonth());
      expect(testDate.getLunarMonth().sexagesimal()).toBe('甲子');
      expect(testDate.toLunarString()).toBe('农历癸巳年十一月丁未日');
    });

    it('Chinese day on 2022-09-28', (): void => {
      const lunarDate = new ChineseDate(2022, 8, 28);

      console.log(lunarDate.toString());

      expect(lunarDate.getLunarMonth().sexagesimal()).toBe('己酉');
      expect(lunarDate.toLunarString()).toBe('农历壬寅年九月甲申日');
    });
  });
});
