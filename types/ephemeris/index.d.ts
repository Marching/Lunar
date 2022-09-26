declare module 'ephemeris' {
  export type Planet = 'earth' | 'sun' | 'mercury' | 'venus' | 'moon' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto' | 'chiron' | 'sirius';

  export interface Result<P extends Planet> {
    date: {
      gregorianTerrestrial: string;
      gregorianTerrestrialRaw: {
        day: number;
        month: number;
        year: number;
        hours: number;
        minutes: number;
        seconds: number;
        delta: number;
        b1950: number;
        j1900: number;
        j2000: number;
        julian: number;
        julianDate: number;
        julianTime: number;
        universal: number;
        universalDate: [];
        universalDateString: string;
        terrestrial: number;
      },
      gregorianUniversal: string;
      gregorianDelta: string;
      julianTerrestrial: number;
      julianUniversal: number;
      julianDelta: number;
    },
    observer: {
      name: 'earth';
      heightGeodetic: number;
      heightGeodecentric: number;
      longitudeGeodetic: number;
      longitudeGeodecentric: number;
      latitudeGeodetic: number;
      latitudeGeodecentric: number;
    },
    observed: Record<P, {
      name: P;
      raw: [];
      apparentLongitudeDms30: string;
      apparentLongitudeDms360: string;
      apparentLongitudeDd: number;
      geocentricDistanceKm: number;
    }>;
  }

  export function getPlanet<P extends Planet>(planetName: P, date: Date, longitude: number, latitude: number, height: number): Result<P>;

  export function getAllPlanets(date: Date, longitude: number, latitude: number, height: number): Result<Planet>;
}
