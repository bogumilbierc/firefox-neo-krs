'use strict';

const {parse} = require("node-html-parser");
const axios = require("axios");

/**
 * @typedef {object} City
 * @property {string} url
 * @property {string} name
 */

class CitiesService {

  async getCitiesList(websiteBaseUrl) {
    const neoKrsWebsite = await axios.get(websiteBaseUrl);

    const root = parse(neoKrsWebsite.data)
    const possibleCitiesElements = root.querySelectorAll('a.submenu-item-link');
    return possibleCitiesElements.map((possibleCity) => {
      const cityHref = possibleCity.getAttribute('href');
      if (!cityHref || cityHref.indexOf('=') < 0) {
        return null;
      }
      const cityValue = cityHref.split('=')[1]
      return {
        url: `${websiteBaseUrl}?miasto=${encodeURIComponent(cityValue)}`,
        name: possibleCity.text
      }
    })
    .filter((city) => !!city)
  }

}

module.exports = CitiesService;
