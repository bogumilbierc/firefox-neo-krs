'use strict';

import { City } from './model/city.model';
import { Globals } from './Globals';

const {parse} = require('node-html-parser');
const axios = require('axios');

export class CitiesService {

  async getCitiesList(): Promise<City[]> {
    const neoKrsWebsite = await axios.get(Globals.KOD_WEBSITE_URL);

    const root = parse(neoKrsWebsite.data)
    const possibleCitiesElements: HTMLAnchorElement[] = root.querySelectorAll('a.submenu-item-link');

    const nullableCities: (City | null)[] = possibleCitiesElements.map((possibleCity: HTMLAnchorElement) => {
      const cityHref = possibleCity.getAttribute('href');
      if (!cityHref || cityHref.indexOf('=') < 0) {
        return null;
      }
      const cityValue = cityHref.split('=')[1]
      return {
        url: `${Globals.KOD_WEBSITE_URL}?miasto=${encodeURIComponent(cityValue)}`,
        name: possibleCity.text
      } as City;
    })


    return nullableCities
    .filter(city => !!city) as City[];
  }

}
