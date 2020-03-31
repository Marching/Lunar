import { SolarTermCalculator } from '../index';

test('Solar Term Calculator ', () => {
  const terms = SolarTermCalculator.getTerms(2005);

  if (terms[0].date) {
    expect(terms[0].date.getFullYear()).toBe(2005);
    expect(terms[0].date.getMonth() + 1).toBe(1);
    expect(terms[0].date.getDate()).toBe(5);
  }
});
