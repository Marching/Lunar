import { getPlanet } from 'ephemeris';

import { sameDate } from '../tool';
import { CH_STANDARD_POSITION } from '../intl';
import { ChineseDate } from '../lunar-calendar';
import { calcEclipticLongitude, create24SolarTerms, getTermOnDay, getTermsOnYear } from '../solar-terms';

/**
 * @description GB/T 33661-2017 农历的编算和颁行
 * @link http://c.gb688.cn/bzgk/gb/showGb?type=online&hcno=E107EA4DE9725EDF819F33C60A44B296
 */
describe('Lunar', (): void => {
  const chStdPosition: GeoJSON.Position = CH_STANDARD_POSITION;
  const solarTerms = create24SolarTerms();

  describe('Ecliptic', (): void => {
    it('Spring equinox', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 2, 20), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd) % 360).toBe(solarTerms.get(1)!.longitude);
    });

    it('Fresh green', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 3, 5), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(2)!.longitude);
    });

    it('Grain rain', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 3, 20), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(3)!.longitude);
    });

    it('Beginning of summer', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 4, 5), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(4)!.longitude);
    });

    it('Lesser fullness', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 4, 21), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(5)!.longitude);
    });

    it('Grain in ear', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 5, 5), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(6)!.longitude);
    });

    it('Summer solstice', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 5, 21), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(7)!.longitude);
    });

    it('Lesser heat', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 6, 7), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(8)!.longitude);
    });

    it('Greater heat', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 6, 23), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(9)!.longitude);
    });

    it('Beginning of autumn', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 7, 7), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(10)!.longitude);
    });

    it('End of heat', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 7, 23), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(11)!.longitude);
    });

    it('White dew', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 8, 7), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(12)!.longitude);
    });

    it('Autumnal equinox', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 8, 23), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(13)!.longitude);
    });

    it('Cold dew', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 9, 8), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(14)!.longitude);
    });

    it('First frost', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 9, 23), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(15)!.longitude);
    });

    it('Beginning of winter', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 10, 7), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(16)!.longitude);
    });

    it('Light snow', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 10, 22), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(17)!.longitude);
    });

    it('Heavy snow', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 11, 7), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(18)!.longitude);
    });

    it('Winter solstice', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 11, 22), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(19)!.longitude);
    });

    it('Lesser cold', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 0, 5), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(20)!.longitude);
    });

    it('Greater cold', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 0, 20), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(21)!.longitude);
    });

    it('Beginning of spring', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 1, 4), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(22)!.longitude);
    });

    it('Rain water', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 1, 18), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(23)!.longitude);
    });

    it('Awakening from hibernation', (): void => {
      const result = getPlanet<'sun'>('sun', new ChineseDate(2005, 2, 5), chStdPosition[0], chStdPosition[1], 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(solarTerms.get(24)!.longitude);
    });

    it('Log ecliptic longitudes', (): void => {
      const testDate = new ChineseDate(2021, 11, 21);
      const term = getTermOnDay(testDate, chStdPosition);

      console.log(`${testDate.toChineseString()} => ${calcEclipticLongitude(testDate, 3) % 360}`);
      testDate.setHours(23, 59, 59, 0);
      console.log(`${testDate.toChineseString()} => ${calcEclipticLongitude(testDate, 3) % 360}`);
      testDate.setHours(23, 59, 59, 999);
      console.log(`${testDate.toChineseString()} => ${calcEclipticLongitude(testDate, 3) % 360}`);
      console.log(term);
      expect(term).not.toBeNull();
    });
  });

  describe('Solar terms', (): void => {
    it('The 24 terms', (): void => {
      const terms = create24SolarTerms();

      expect(terms.size).toBe(24);
    });

    it('The terms on 2005', (): void => {
      const terms = getTermsOnYear(2005, chStdPosition);

      expect(terms.length).toBe(24);

      expect(sameDate(terms[0].date!, new ChineseDate(2005, 0, 5))).toBe(true);
      expect(sameDate(terms[1].date!, new ChineseDate(2005, 0, 20))).toBe(true);
      expect(sameDate(terms[2].date!, new ChineseDate(2005, 1, 4))).toBe(true);
      expect(sameDate(terms[3].date!, new ChineseDate(2005, 1, 18))).toBe(true);
      expect(sameDate(terms[4].date!, new ChineseDate(2005, 2, 5))).toBe(true);
      expect(sameDate(terms[5].date!, new ChineseDate(2005, 2, 20))).toBe(true);
      expect(sameDate(terms[6].date!, new ChineseDate(2005, 3, 5))).toBe(true);
      expect(sameDate(terms[7].date!, new ChineseDate(2005, 3, 20))).toBe(true);
      expect(sameDate(terms[8].date!, new ChineseDate(2005, 4, 5))).toBe(true);
      expect(sameDate(terms[9].date!, new ChineseDate(2005, 4, 21))).toBe(true);
      expect(sameDate(terms[10].date!, new ChineseDate(2005, 5, 5))).toBe(true);
      expect(sameDate(terms[11].date!, new ChineseDate(2005, 5, 21))).toBe(true);
      expect(sameDate(terms[12].date!, new ChineseDate(2005, 6, 7))).toBe(true);
      expect(sameDate(terms[13].date!, new ChineseDate(2005, 6, 23))).toBe(true);
      expect(sameDate(terms[14].date!, new ChineseDate(2005, 7, 7))).toBe(true);
      expect(sameDate(terms[15].date!, new ChineseDate(2005, 7, 23))).toBe(true);
      expect(sameDate(terms[16].date!, new ChineseDate(2005, 8, 7))).toBe(true);
      expect(sameDate(terms[17].date!, new ChineseDate(2005, 8, 23))).toBe(true);
      expect(sameDate(terms[18].date!, new ChineseDate(2005, 9, 8))).toBe(true);
      expect(sameDate(terms[19].date!, new ChineseDate(2005, 9, 23))).toBe(true);
      expect(sameDate(terms[20].date!, new ChineseDate(2005, 10, 7))).toBe(true);
      expect(sameDate(terms[21].date!, new ChineseDate(2005, 10, 22))).toBe(true);
      expect(sameDate(terms[22].date!, new ChineseDate(2005, 11, 7))).toBe(true);
      expect(sameDate(terms[23].date!, new ChineseDate(2005, 11, 22))).toBe(true);
    });
  
    it('The terms on 2022', (): void => {
      const terms = getTermsOnYear(2022, chStdPosition);

      expect(terms.length).toBe(24);

      expect(sameDate(terms[0].date!, new ChineseDate(2022, 0, 5))).toBe(true);
      expect(sameDate(terms[1].date!, new ChineseDate(2022, 0, 20))).toBe(true);
      expect(sameDate(terms[2].date!, new ChineseDate(2022, 1, 4))).toBe(true);
      expect(sameDate(terms[3].date!, new ChineseDate(2022, 1, 19))).toBe(true);
      expect(sameDate(terms[4].date!, new ChineseDate(2022, 2, 5))).toBe(true);
      expect(sameDate(terms[5].date!, new ChineseDate(2022, 2, 20))).toBe(true);
      expect(sameDate(terms[6].date!, new ChineseDate(2022, 3, 5))).toBe(true);
      expect(sameDate(terms[7].date!, new ChineseDate(2022, 3, 20))).toBe(true);
      expect(sameDate(terms[8].date!, new ChineseDate(2022, 4, 5))).toBe(true);
      expect(sameDate(terms[9].date!, new ChineseDate(2022, 4, 21))).toBe(true);
      expect(sameDate(terms[10].date!, new ChineseDate(2022, 5, 6))).toBe(true);
      expect(sameDate(terms[11].date!, new ChineseDate(2022, 5, 21))).toBe(true);
      expect(sameDate(terms[12].date!, new ChineseDate(2022, 6, 7))).toBe(true);
      expect(sameDate(terms[13].date!, new ChineseDate(2022, 6, 23))).toBe(true);
      expect(sameDate(terms[14].date!, new ChineseDate(2022, 7, 7))).toBe(true);
      expect(sameDate(terms[15].date!, new ChineseDate(2022, 7, 23))).toBe(true);
      expect(sameDate(terms[16].date!, new ChineseDate(2022, 8, 7))).toBe(true);
      expect(sameDate(terms[17].date!, new ChineseDate(2022, 8, 23))).toBe(true);
      expect(sameDate(terms[18].date!, new ChineseDate(2022, 9, 8))).toBe(true);
      expect(sameDate(terms[19].date!, new ChineseDate(2022, 9, 23))).toBe(true);
      expect(sameDate(terms[20].date!, new ChineseDate(2022, 10, 7))).toBe(true);
      expect(sameDate(terms[21].date!, new ChineseDate(2022, 10, 22))).toBe(true);
      expect(sameDate(terms[22].date!, new ChineseDate(2022, 11, 7))).toBe(true);
      expect(sameDate(terms[23].date!, new ChineseDate(2022, 11, 22))).toBe(true);
    });

    it('The term on 2018-03-21', (): void => {
      expect(getTermOnDay(new ChineseDate(2018, 2, 21), chStdPosition)?.order).toBe(1);
    });

    it('The term on 2020-01-06', (): void => {
      expect(getTermOnDay(new ChineseDate(2020, 0, 6), chStdPosition)?.order).toBe(20);
    });

    it('The term on 2020-02-19', (): void => {
      expect(getTermOnDay(new ChineseDate(2020, 1, 19), chStdPosition)?.order).toBe(23);
    });

    it('The term on 2021-12-21', (): void => {
      expect(getTermOnDay(new ChineseDate(2021, 11, 21), chStdPosition)).not.toBeNull();
    });

    it('The term on 2022-06-05', (): void => {
      expect(getTermOnDay(new ChineseDate(2022, 5, 5), chStdPosition)).toBeNull();
    });

    it('The term on 2022-06-06', (): void => {
      expect(getTermOnDay(new ChineseDate(2022, 5, 6), chStdPosition)).not.toBeNull();
    });

    it('The term on 2022-09-07', (): void => {
      expect(getTermOnDay(new ChineseDate(2022, 8, 7), chStdPosition)).not.toBeNull();
    });

    it('The term on 2022-09-08', (): void => {
      expect(getTermOnDay(new ChineseDate(2022, 8, 8), chStdPosition)).toBeNull();
    });

    it('The term on 2022-09-22', (): void => {
      expect(getTermOnDay(new ChineseDate(2022, 8, 22), chStdPosition)).toBeNull();
    });
  });
});
