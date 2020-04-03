import { SolarTerm, SOLAR_TERMS } from './terms';

/**
 *
 */
const DT_DELTAT_TABLE = [
  [-4000, 108371.7, -13036.8, 392.0, 0.0],
  [-500, 17201.0, -627.82, 16.17, -0.3413],
  [-150, 12200.6, -346.41, 5.403, -0.1593],
  [150, 9113.8, -328.13, -1.647, 0.0377],
  [500, 5707.5, -391.41, 0.915, 0.3145],
  [900, 2203.4, -283.45, 13.034, -0.1778],
  [1300, 490.1, -57.35, 2.085, -0.0072],
  [1600, 120.0, -9.81, -1.532, 0.1403],
  [1700, 10.2, -0.91, 0.51, -0.037],
  [1800, 13.4, -0.72, 0.202, -0.0193],
  [1830, 7.8, -1.81, 0.416, -0.0247],
  [1860, 8.3, -0.13, -0.406, 0.0292],
  [1880, -5.4, 0.32, -0.183, 0.0173],
  [1900, -2.3, 2.06, 0.169, -0.0135],
  [1920, 21.2, 1.69, -0.304, 0.0167],
  [1940, 24.2, 1.22, -0.064, 0.0031],
  [1960, 33.2, 0.51, 0.231, -0.0109],
  [1980, 51.0, 1.29, -0.026, 0.0032],
  [2000, 63.87, 0.1, 0, 0],
  [2005, 64.7, 0.4, 0, 0],
  [2015, 69, 0.4, 0, 0]
];

/**
 *
 */
export enum ACCURACY {
  LOW,
  MIDDLE,
  HIGH,
}

/**
 *
 */
export class SolarTermCalculator {
  static J2000 = 2451545;

  static getTerms(year: number): SolarTerm[] {
    const timeOffset = new Date().getTimezoneOffset() / 60;
    return SOLAR_TERMS.map((item, index) => {
      return {
        date: SolarTermCalculator.calcTerm(year, index + 1, timeOffset),
        lunar: '',
        description: item.description,
      };
    });
  }

  static calcTerm(year: number, termNO: number, timeOffset: number): Date {
    const solarLng = ((termNO - 5 + (year - 1999) * 24) * 15 * Math.PI) / 180;
    let t = 0;
    t = t + (solarLng - SolarTermCalculator.getLng(t, ACCURACY.LOW)) / SolarTermCalculator.getSolarLngAvgSpeed();
    t = t + (solarLng - SolarTermCalculator.getLng(t, ACCURACY.MIDDLE)) / this.getSolarLngInsSpeed(t);
    t = t + (solarLng - SolarTermCalculator.getLng(t, ACCURACY.HIGH)) / this.getSolarLngInsSpeed(t);
    const julianDay = SolarTermCalculator.J2000 + t * 36525 - SolarTermCalculator.calcDTDeltat(year, t) / 86400 - timeOffset / 24;

    const avgYearLong = 365.25;
    const constNOx = 30.6001;
    const Z = Math.floor(julianDay + 0.5);
    const F = julianDay + 0.5 - Z;
    const a0 = Math.floor((Z - 1867216.25) / 36524.25);
    let A: number;
    let B: number;
    let C: number;
    let d: number;
    let E: number;

    let yearCd: number;
    let monthCd: number;
    let dayCd: number;
    let hourCd: number;
    let minuteCd: number;
    let secondCd: number;

    if (Z < 2299161) {
      A = Z;
    } else {
      A = Z + 1 + a0 - Math.floor(a0 / 4);
    }
    B = A + 1524;
    C = Math.floor((B - 122.1) / avgYearLong);
    d = Math.floor(avgYearLong * C);
    E = Math.floor((B - d) / constNOx);

    dayCd = B - d - Math.floor(constNOx * E) + F;

    if (E < 14) {
      monthCd = E - 1;
    } else {
      monthCd = E - 13;
    }

    if (monthCd > 2) {
      yearCd = C - 4716;
    } else {
      yearCd = C - 4715;
    }

    const dayC = Math.floor((dayCd - Math.floor(dayCd)) * 86400);
    hourCd = Math.floor(dayC / 3600);
    minuteCd = Math.round((dayC - hourCd * 3600) / 60);
    secondCd = dayC - hourCd * 3600 - minuteCd * 60;

    return new Date(yearCd, monthCd, dayCd, hourCd, secondCd);
  }

  static calcDTDeltat(year: number, dynamicalTime: number): number {
    let value: number = 0;

    if (
      !DT_DELTAT_TABLE.some((data, index) => {
        const nextData = DT_DELTAT_TABLE[index + 1];

        if (nextData && year >= data[0] && year < nextData[0]) {
          value = data[1] + data[2] * Math.pow(dynamicalTime, 1) + data[2] * Math.pow(dynamicalTime, 2) + data[3] * Math.pow(dynamicalTime, 3);
          return true;
        } else {
          return false;
        }
      })
    ) {
      if (year >= 2005 && year < 2014) {
        value = 64.7 + (year - 2005) * 0.4;
      } else if (year >= 2014 && year < 2114) {
        value = ((year - 2114) * (SolarTermCalculator.calcDTDeltat(2114, dynamicalTime) - SolarTermCalculator.calcDTDeltat(2014, dynamicalTime))) / 100;
      } else {
        value = -20 + 31 * Math.pow((year - 1820) / 100, 2);
      }
    }

    return value;
  }

  static getLng(dynamicalTime: number, accuracy?: ACCURACY): number {
    const A = 48950621.66;
    const B = 6283319653.318;
    const R = 10000000;
    let value: number;

    switch (accuracy) {
      case ACCURACY.LOW:
        value = A + B * dynamicalTime;
        break;
      case ACCURACY.MIDDLE:
        value = A + B * dynamicalTime + 53 * Math.pow(dynamicalTime, 2) + 334116 * Math.cos(4.67 + 628.307585 * dynamicalTime) + 2061 * Math.cos(2.678 + 628.3076 * dynamicalTime) * dynamicalTime;
        break;
      default:
        // ACCURACY.HIGH
        value =
          A +
          B * dynamicalTime +
          52.9674 * Math.pow(dynamicalTime, 2) +
          0.00432 * Math.pow(dynamicalTime, 3) -
          0.001124 * Math.pow(dynamicalTime, 4) +
          334166 * Math.cos(4.669257 + 628.307585 * dynamicalTime) +
          3489 * Math.cos(4.6261 + 1256.61517 * dynamicalTime) +
          350 * Math.cos(2.744 + 575.3385 * dynamicalTime) +
          342 * Math.cos(2.829 + 0.3523 * dynamicalTime) +
          314 * Math.cos(3.628 + 7771.3771 * dynamicalTime) +
          268 * Math.cos(4.418 + 786.0419 * dynamicalTime) +
          234 * Math.cos(6.135 + 393.021 * dynamicalTime) +
          132 * Math.cos(0.742 + 1150.677 * dynamicalTime) +
          127 * Math.cos(2.037 + 52.9691 * dynamicalTime) +
          120 * Math.cos(1.11 + 157.7344 * dynamicalTime) +
          99 * Math.cos(5.23 + 588.493 * dynamicalTime) +
          90 * Math.cos(2.05 + 2.63 * dynamicalTime) +
          86 * Math.cos(3.51 + 39.815 * dynamicalTime) +
          78 * Math.cos(1.18 + 522.369 * dynamicalTime) +
          75 * Math.cos(2.53 + 550.755 * dynamicalTime) +
          51 * Math.cos(4.58 + 1884.923 * dynamicalTime) +
          49 * Math.cos(4.21 + 77.552 * dynamicalTime) +
          36 * Math.cos(2.92 + 0.07 * dynamicalTime) +
          32 * Math.cos(5.85 + 1179.063 * dynamicalTime) +
          28 * Math.cos(1.9 + 79.63 * dynamicalTime) +
          27 * Math.cos(0.31 + 1097.71 * dynamicalTime) +
          2060.6 * Math.cos(2.67823 + 628.307585 * dynamicalTime) * dynamicalTime +
          43.0 * Math.cos(2.635 + 1256.6152 * dynamicalTime) * dynamicalTime +
          8.72 * Math.cos(1.072 + 628.3076 * dynamicalTime) * Math.pow(dynamicalTime, 2) -
          994 -
          834 * Math.sin(2.1824 - 33.75705 * dynamicalTime) -
          64 * Math.sin(3.5069 + 1256.66393 * dynamicalTime);
    }

    return value / R;
  }

  static getSolarLngAvgSpeed(): number {
    // Solar longitude
    return 628.3319653318;
  }

  static getSolarLngInsSpeed(dynamicalTime: number): number {
    // Calculate instantaneous speed
    const solarLng = Math.round(this.getSolarLngAvgSpeed() * 10000) / 10000;

    return solarLng + 21 * Math.sin(1.527 + 628.307585 * dynamicalTime);
  }
}
