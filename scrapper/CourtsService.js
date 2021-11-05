'use strict';

const axios = require("axios");
const {parse} = require("node-html-parser");

/**
 * @typedef {object} Court
 * @property {string} name
 * @property {string} url
 */

class CourtsService {

  /**
   * Gets list of courts for a city
   * @param {City} city
   * @returns {Promise<Court[]>}
   */
  async getCourtsForCity(city) {
    console.debug('Trying to get courts for city: ' + city.name)
    const websiteContent = await axios.request({
      url: city.url,
      timeout: 5000
    });
    const root = parse(websiteContent.data);
    const possibleCourtsElements = root.querySelectorAll(
        'tr')
    .filter((tr) => tr.getAttribute('title')
        === 'Zobacz listę neo-sędziów w tym sądzie')
    const courts = possibleCourtsElements.map((possibleCourt) => {
      return {
        name: possibleCourt.querySelector('td').text,
        url: possibleCourt.getAttribute('onclick')
      }
    })
    console.log(`Got ${courts.length} courts for city: ${city.name}`)
    return courts;
  }

}

module.exports = CourtsService;
