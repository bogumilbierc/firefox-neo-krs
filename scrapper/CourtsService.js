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
   * @param {string} websiteBaseUrl base url for kod website
   * @returns {Promise<Court[]>}
   */
  async getCourtsForCity(city, websiteBaseUrl) {
    console.debug('Trying to get courts for city: ' + city.name)
    const websiteContent = await axios.request({
      url: city.url,
      timeout: 5000
    });
    const root = parse(websiteContent.data);

    const possibleCourtsElements = root.querySelectorAll(
        '[title="Zobacz listę neo-sędziów w tym sądzie"]')

    const courts = possibleCourtsElements.map((possibleCourt) => {
      const url = this._getUrl(possibleCourt, websiteBaseUrl)
      return {
        name: possibleCourt.querySelector('td').text,
        url
      }
    })
    console.log(`Got ${courts.length} courts for city: ${city.name}`)
    return courts;
  }

  /**
   * Gets URL from court element
   * @param {HTMLElement} courtElement
   * @param {string} websiteBaseUrl base url for kod website
   * @private
   */
  _getUrl(courtElement, websiteBaseUrl) {
    const onclick = courtElement.getAttribute('onclick')
    if (!onclick || !onclick.indexOf('location=') < 0) {
      return null;
    }
    const courtName = onclick.replace('location=\'?sad=', '')
    .replace('\'', '');

    return `${websiteBaseUrl}?sad=${encodeURIComponent(courtName)}`
  }

}

module.exports = CourtsService;
