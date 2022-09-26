import { SolarTerm } from "./terms";

export function setIntl(source: Map<number, SolarTerm>, lang: Array<string>): void {
  source.forEach((value, key) => {
    if (lang[key -1]) {
      value.description = lang[key -1];
    }
  });
}

export const SOLAR_TERMS_EN: ReadonlyArray<string> = [
  'Spring equinox',
  'Fresh green',
  'Grain rain',
  'Beginning of summer',
  'Lesser fullness',
  'Grain in ear',
  'Summer solstice',
  'Lesser heat',
  'Greater heat',
  'Beginning of autumn',
  'End of heat',
  'White dew',
  'Autumnal equinox',
  'Cold dew',
  'First frost',
  'Beginning of winter',
  'Light snow',
  'Heavy snow',
  'Winter solstice',
  'Lesser cold',
  'Greater cold',
  'Beginning of spring',
  'Rain water',
  'Awakening from hibernation'
];
