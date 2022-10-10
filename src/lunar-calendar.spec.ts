import { sameDate, toPrecision } from './tool';
import { ChineseDate, countNewMoons, countDaysOnYear, isLeapMonth, isNewMoon } from './lunar-calendar';
import { calcDiffOfSunAndMoon } from './solar-terms';

describe('Lunar calendar', (): void => {
  describe('Chinese date', (): void => {
    test('2022-09-26', (): void => {
      const testDate = new ChineseDate(2022, 8, 26);

      expect(testDate.toISOString()).toBe('2022-09-25T16:00:00.000Z');
      expect(testDate.toChineseString()).toBe('2022/9/26 00:00:00');
    });

    test('2014-09-24', (): void => {
      const testDate = new ChineseDate(2014, 8, 24);

      expect(testDate.toISOString()).toBe('2014-09-23T16:00:00.000Z');
      expect(testDate.toChineseString()).toBe('2014/9/24 00:00:00');
    });
  });

  describe('Count days on year', (): void => {
    test('2000', (): void => {
      expect(countDaysOnYear(2000)).toBe(366);
    });

    test('2010', (): void => {
      expect(countDaysOnYear(2010)).toBe(365);
    });

    test('2020', (): void => {
      expect(countDaysOnYear(2020)).toBe(366);
    });
  });

  describe('New moon', (): void => {
    test('Test ecliptic longitude', (): void => {
      const testDate = new ChineseDate(1997, 11, 30);

      console.log(`>>>>>>>>>>> testDate: ${testDate.toLocaleString()}; isNewMoon: => ${isNewMoon(testDate)}`);

      /**
       * New moon
       */
      const startTime = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate() - 1);
      const endTime = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate() + 1, 23, 59, 59);
      const diffs: Array<string> = [];
      let result: number;
      let i: number = 0;

      do {
        if (i > 100) {
          console.warn(`Infinite loop!`);
          break;
        }
        result = toPrecision(calcDiffOfSunAndMoon(endTime), 3);
        diffs.push(`${endTime.toLocaleString()} => ${result}`);

        if (endTime.getHours() === 0 && endTime.getMinutes() !== 0) {
          endTime.setHours(endTime.getHours(), 0, 0);
        } else {
          endTime.setHours(endTime.getHours() - 1, 59, 59);
        }
        i++;
      } while (endTime.getTime() >= startTime.getTime());

      console.log(diffs);
      console.info(testDate.getLunarMonth());

      expect(isLeapMonth(testDate, true)).toBe(false);
    });

    test('Threshold dates', (): void => {
      expect(isNewMoon(new Date(1944, 0, 25))).toBe(true);
      expect(isNewMoon(new Date(1944, 0, 26))).toBe(false);

      expect(isNewMoon(new Date(1985, 1, 19))).toBe(false);
      expect(isNewMoon(new Date(1985, 1, 20))).toBe(true);
    });


    test('Celestial stem & branch of days', (): void => {
      expect(new ChineseDate(1949, 9, 1).getLunarDay().sexagesimal()).toBe('甲子');
    });

    test('Celestial stem & branch of years', (): void => {
      expect(new ChineseDate(1982, 2, 9).getLunarYear().sexagesimal()).toBe('壬戌');

      expect(new ChineseDate(1983, 7, 1).getLunarYear().sexagesimal()).toBe('癸亥');

      expect(new ChineseDate(1984, 1, 1).getLunarYear().sexagesimal()).toBe('癸亥');
      expect(new ChineseDate(1984, 1, 2).getLunarYear().sexagesimal()).toBe('甲子');
      expect(new ChineseDate(1984, 1, 3).getLunarYear().sexagesimal()).toBe('甲子');

      expect(new ChineseDate(1985, 1, 19).getLunarYear().sexagesimal()).toBe('甲子');
      expect(new ChineseDate(1985, 1, 20).getLunarYear().sexagesimal()).toBe('乙丑');
      expect(new ChineseDate(1985, 1, 21).getLunarYear().sexagesimal()).toBe('乙丑');
    });

    test('甲子年 1984-02-02 00:00:00 <-> 1985-02-19 23:59:59', (): void => {
      let testDate = new ChineseDate(1984, 1, 2);

      expect(testDate.getLunarYear().sexagesimal()).toBe('甲子');
      testDate = new ChineseDate(1984, 1, 1, 23, 59, 59);
      expect(testDate.getLunarYear().sexagesimal()).toBe('癸亥');
      testDate = new ChineseDate(1985, 1, 19, 23, 59, 59);
      expect(testDate.getLunarYear().sexagesimal()).toBe('甲子');
    });

    test('2022-09-26', (): void => {
      const testDate = new ChineseDate(2022, 8, 26);
      const newMoons = countNewMoons(testDate, testDate);

      expect(newMoons.length).toBe(1);
      expect(sameDate(newMoons[0], testDate)).toBe(true);
    });

    test('form 2013-11-01 to 2022-09-28', (): void => {
      const toDate = new ChineseDate(2022, 8, 28);
      const newMoons = countNewMoons(new ChineseDate(2013, 11, 1), toDate);

      expect(newMoons.length).toBeGreaterThan(1);
      expect(sameDate(newMoons[0], new ChineseDate(2013, 11, 3))).toBe(true);
    });

    test('Chinese day on 2013-12-07', (): void => {
      const testDate = new ChineseDate(2013, 11, 7);

      expect(testDate.getLunarMonth().sexagesimal()).toBe('甲子');
      expect(testDate.toLunarString()).toBe('农历癸巳年十一月丁未日');
    });

    test('Chinese day on 2022-09-28', (): void => {
      const lunarDate = new ChineseDate(2022, 8, 28);

      expect(lunarDate.getLunarMonth().sexagesimal()).toBe('己酉');
      expect(lunarDate.toLunarString()).toBe('农历壬寅年九月甲申日');
    });
  });
});
