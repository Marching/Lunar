## Lunar (Chinese calendar)

<br />

> The standard mentioned below which means [GB/T 33661-2017 - Calculation and promulgation of the Chinese calendar](http://c.gb688.cn/bzgk/gb/showGb?type=online&hcno=E107EA4DE9725EDF819F33C60A44B296).

<br />

All algorithms in the package are according to the standard to be implemented. And used [ephemeris](https://www.npmjs.com/package/ephemeris) to calculate sun ecliptic longitude and moon ecliptic longitude.

Including:
1. Calculate the solar term of a day, solar terms of year, 24 solar terms;
2. Calculate month and day of Chinese calendar, and leap months;
3. Calculate sexagesimal(celestial stem with terrestrial branch) of day, month and year;
4. Calculate zodiac of year.

<br />

<br />

### API

#### class ChineseDate(inherit native Date)

#### __calcSunEclipticLongitude(time: Date): number__
Calculate sun ecliptic longitude at the time.

---

#### __calcMoonEclipticLongitude(time: Date): number__
Calculate moon ecliptic longitude at the time.

---

#### __calcDiffOfSunAndMoon(time: Date): number__
Calculate different value between sun ecliptic longitude at the time and moon ecliptic longitude at the time.

<br />

### References

1. [GB/T 33661-2017 - Calculation and promulgation of the Chinese calendar](http://c.gb688.cn/bzgk/gb/showGb?type=online&hcno=E107EA4DE9725EDF819F33C60A44B296)

2. [Leap months](https://www-ws.gov.taipei/Download.ashx?u=LzAwMS9VcGxvYWQvNDM5L3JlbGZpbGUvNDc1NTcvNzk3MDY5OS9jMGZiN2JhMC1iNTU1LTQyNjctYWUwMi0zNzIyNTU3ZDhjMTgucGRm&n=6ZaP5pyI56%2BA5rCj6KGoLnBkZg%3D%3D&icon=..pdf)

3. [计算二十四节气](https://zhuanlan.zhihu.com/p/514651439)

