import { getPlanet } from 'ephemeris';
import { SOLAR_TERMS } from '../terms';
import { getTermOnDay, getTermsOnYear, sameDate } from '../solar-terms-calculator';

/**
 * @description GB/T 33661-2017 农历的编算和颁行
 * @link http://c.gb688.cn/bzgk/gb/showGb?type=online&hcno=E107EA4DE9725EDF819F33C60A44B296
 */
describe('Lunar', (): void => {
  const localeCoordinate: GeoJSON.Position = [120, 35.8617]; // 120 E

  describe('Ecliptic', (): void => {
    it('Spring equinox', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 2, 20), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd) % 360).toBe(SOLAR_TERMS.get(1)!.longitude);
    });

    it('Fresh green', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 3, 5), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(2)!.longitude);
    });

    it('Grain rain', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 3, 20), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(3)!.longitude);
    });

    it('Beginning of summer', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 4, 5), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(4)!.longitude);
    });

    it('Lesser fullness', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 4, 21), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(5)!.longitude);
    });

    it('Grain in ear', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 5, 5), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(6)!.longitude);
    });

    it('Summer solstice', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 5, 21), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(7)!.longitude);
    });

    it('Lesser heat', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 6, 7), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(8)!.longitude);
    });

    it('Greater heat', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 6, 23), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(9)!.longitude);
    });

    it('Beginning of autumn', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 7, 7), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(10)!.longitude);
    });

    it('End of heat', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 7, 23), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(11)!.longitude);
    });

    it('White dew', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 8, 7), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(12)!.longitude);
    });

    it('Autumnal equinox', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 8, 23), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(13)!.longitude);
    });

    it('Cold dew', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 9, 8), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(14)!.longitude);
    });

    it('First frost', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 9, 23), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(15)!.longitude);
    });

    it('Beginning of winter', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 10, 7), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(16)!.longitude);
    });

    it('Light snow', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 10, 22), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(17)!.longitude);
    });

    it('Heavy snow', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 11, 7), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(18)!.longitude);
    });

    it('Winter solstice', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 11, 22), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(19)!.longitude);
    });

    it('Lesser cold', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 0, 5), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(20)!.longitude);
    });

    it('Greater cold', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 0, 20), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(21)!.longitude);
    });

    it('Beginning of spring', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 1, 4), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(22)!.longitude);
    });

    it('Rain water', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 1, 18), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(23)!.longitude);
    });

    it('Awakening from hibernation', (): void => {
      const result = getPlanet<'sun'>('sun', new Date(2005, 2, 5), 0, 0, 0);

      expect(Math.ceil(result.observed.sun.apparentLongitudeDd)).toBe(SOLAR_TERMS.get(24)!.longitude);
    });
  });

  describe('Solar terms', (): void => {
    it('The terms on 2005', (): void => {
      const terms = getTermsOnYear(2005, localeCoordinate);

      expect(terms.length).toBe(24);

      expect(sameDate(terms[0].date!, new Date(2005, 0, 5))).toBe(true);
      expect(sameDate(terms[1].date!, new Date(2005, 0, 20))).toBe(true);
      expect(sameDate(terms[2].date!, new Date(2005, 1, 4))).toBe(true);
      expect(sameDate(terms[3].date!, new Date(2005, 1, 18))).toBe(true);
      expect(sameDate(terms[4].date!, new Date(2005, 2, 5))).toBe(true);
      expect(sameDate(terms[5].date!, new Date(2005, 2, 20))).toBe(true);
      expect(sameDate(terms[6].date!, new Date(2005, 3, 5))).toBe(true);
      expect(sameDate(terms[7].date!, new Date(2005, 3, 20))).toBe(true);
      expect(sameDate(terms[8].date!, new Date(2005, 4, 5))).toBe(true);
      expect(sameDate(terms[9].date!, new Date(2005, 4, 21))).toBe(true);
      expect(sameDate(terms[10].date!, new Date(2005, 5, 5))).toBe(true);
      expect(sameDate(terms[11].date!, new Date(2005, 5, 21))).toBe(true);
      expect(sameDate(terms[12].date!, new Date(2005, 6, 7))).toBe(true);
      expect(sameDate(terms[13].date!, new Date(2005, 6, 23))).toBe(true);
      expect(sameDate(terms[14].date!, new Date(2005, 7, 7))).toBe(true);
      expect(sameDate(terms[15].date!, new Date(2005, 7, 23))).toBe(true);
      expect(sameDate(terms[16].date!, new Date(2005, 8, 7))).toBe(true);
      expect(sameDate(terms[17].date!, new Date(2005, 8, 23))).toBe(true);
      expect(sameDate(terms[18].date!, new Date(2005, 9, 8))).toBe(true);
      expect(sameDate(terms[19].date!, new Date(2005, 9, 23))).toBe(true);
      expect(sameDate(terms[20].date!, new Date(2005, 10, 7))).toBe(true);
      expect(sameDate(terms[21].date!, new Date(2005, 10, 22))).toBe(true);
      expect(sameDate(terms[22].date!, new Date(2005, 11, 7))).toBe(true);
      expect(sameDate(terms[23].date!, new Date(2005, 11, 22))).toBe(true);
    });
  
    it('The terms on 2022', (): void => {
      const terms = getTermsOnYear(2022, localeCoordinate);

      expect(terms.length).toBe(24);

      expect(sameDate(terms[0].date!, new Date(2022, 0, 5))).toBe(true);
      expect(sameDate(terms[1].date!, new Date(2022, 0, 20))).toBe(true);
      expect(sameDate(terms[2].date!, new Date(2022, 1, 4))).toBe(true);
      expect(sameDate(terms[3].date!, new Date(2022, 1, 19))).toBe(true);
      expect(sameDate(terms[4].date!, new Date(2022, 2, 5))).toBe(true);
      expect(sameDate(terms[5].date!, new Date(2022, 2, 20))).toBe(true);
      expect(sameDate(terms[6].date!, new Date(2022, 3, 5))).toBe(true);
      expect(sameDate(terms[7].date!, new Date(2022, 3, 20))).toBe(true);
      expect(sameDate(terms[8].date!, new Date(2022, 4, 5))).toBe(true);
      expect(sameDate(terms[9].date!, new Date(2022, 4, 21))).toBe(true);
      expect(sameDate(terms[10].date!, new Date(2022, 5, 6))).toBe(true);
      expect(sameDate(terms[11].date!, new Date(2022, 5, 21))).toBe(true);
      expect(sameDate(terms[12].date!, new Date(2022, 6, 7))).toBe(true);
      expect(sameDate(terms[13].date!, new Date(2022, 6, 23))).toBe(true);
      expect(sameDate(terms[14].date!, new Date(2022, 7, 7))).toBe(true);
      expect(sameDate(terms[15].date!, new Date(2022, 7, 23))).toBe(true);
      expect(sameDate(terms[16].date!, new Date(2022, 8, 7))).toBe(true);
      expect(sameDate(terms[17].date!, new Date(2022, 8, 23))).toBe(true);
      expect(sameDate(terms[18].date!, new Date(2022, 9, 8))).toBe(true);
      expect(sameDate(terms[19].date!, new Date(2022, 9, 23))).toBe(true);
      expect(sameDate(terms[20].date!, new Date(2022, 10, 7))).toBe(true);
      expect(sameDate(terms[21].date!, new Date(2022, 10, 22))).toBe(true);
      expect(sameDate(terms[22].date!, new Date(2022, 11, 7))).toBe(true);
      expect(sameDate(terms[23].date!, new Date(2022, 11, 22))).toBe(true);
    });

    it('The term on 2020-01-06', (): void => {
      expect(getTermOnDay(new Date(2020, 0, 6), localeCoordinate)?.[0]).toBe(20);
    });

    it('The term on 2020-02-19', (): void => {
      expect(getTermOnDay(new Date(2020, 1, 19), localeCoordinate)?.[0]).toBe(23);
    });

    it('The term on 2022-09-08', (): void => {
      expect(getTermOnDay(new Date(2022, 8, 8), localeCoordinate)).toBeNull();
    });

    it('The term on 2022-09-22', (): void => {
      expect(getTermOnDay(new Date(2022, 8, 22), localeCoordinate)).toBeNull();
    });
  });
});
