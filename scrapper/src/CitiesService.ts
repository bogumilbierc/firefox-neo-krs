'use strict';

import { City } from './model/city.model';

const {parse} = require('node-html-parser');
const axios = require('axios');

export class CitiesService {

  async getCitiesList(websiteBaseUrl: string): Promise<City[]> {
    const neoKrsWebsite = await axios.get(websiteBaseUrl);

    const root = parse(neoKrsWebsite.data)
    const possibleCitiesElements: HTMLAnchorElement[] = root.querySelectorAll('a.submenu-item-link');

    const nullableCities: (City | null)[] = possibleCitiesElements.map((possibleCity: HTMLAnchorElement) => {
      const cityHref = possibleCity.getAttribute('href');
      if (!cityHref || cityHref.indexOf('=') < 0) {
        return null;
      }
      const cityValue = cityHref.split('=')[1]
      return {
        url: `${websiteBaseUrl}?miasto=${encodeURIComponent(cityValue)}`,
        name: possibleCity.text
      } as City;
    })


    return nullableCities
    .filter(city => !!city) as City[];
  }

}
