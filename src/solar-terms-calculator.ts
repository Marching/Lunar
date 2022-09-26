import { getPlanet, Result } from 'ephemeris';

import { SolarTerm, SOLAR_TERMS } from './terms';

function calcEclipticLongitude(time: Date, coordinate: GeoJSON.Position): number {
  const result: Result<'sun'> = getPlanet<'sun'>('sun', time, coordinate[0], coordinate[1], 0);

  return Math.ceil(result.observed.sun.apparentLongitudeDd) % 360;
};

/**
 * Compares two dates.
 * @param first The first date to compare.
 * @param second The second date to compare.
 * @returns 0 if the dates are equal, a number less than 0 if the first date is earlier,
 *     a number greater than 0 if the first date is later.
 */
function compareDate(first: Date, second: Date): number {
  return (
    first.getFullYear() - second.getFullYear() ||
    first.getMonth() - second.getMonth() ||
    first.getDate() - second.getDate()
  );
}

/**
 * Checks if two dates are equal.
 * @param first The first date to check.
 * @param second The second date to check.
 * @returns Whether the two dates are equal.
 *     Null dates are considered equal to other null dates.
 */
export function sameDate(first: Date | null, second: Date | null): boolean {
  if (first && second) {
    return !compareDate(first, second);
  }
  return first == second;
}

/**
 *
 */
export function getTermsOnYear(year: number, coordinate: GeoJSON.Position): Array<SolarTerm> {
  const terms: Array<SolarTerm> = [];
  let time = new Date(year, 0, 1, 0, 0, 0, 0);
  let target: [number, SolarTerm] | null;

  while (time.getFullYear() <= year) {
    target = getTermOnDay(time, coordinate);
    if (target) {
      terms[target[0] - 1] = {
        ...target[1],
        date: new Date(time)
      };
    }
    time = new Date(time);
    time.setDate(time.getDate() + 1);
  }

  return terms.sort((a, b) => {
    return a.date!.getTime() - b.date!.getTime();
  });
}

export function getTermOnDay(time: Date, coordinate: GeoJSON.Position): [number, SolarTerm] | null {
  const eclipticLng = calcEclipticLongitude(time, coordinate);

  if (eclipticLng % 15 === 0) {
    const index = eclipticLng / 15 + 1;

    return SOLAR_TERMS.has(index) ? [index, SOLAR_TERMS.get(index)!] : null;
  }
  return null;
}
