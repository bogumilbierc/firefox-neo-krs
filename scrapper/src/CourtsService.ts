'use strict';

import { City } from './model/city.model';
import { Court } from './model/court.model';
import { Globals } from './Globals';

const axios = require('axios');
const {parse} = require('node-html-parser');

export class CourtsService {

  async getCourtsForCity(city: City): Promise<Court[]> {
    console.debug('Trying to get courts for city: ' + city.name)
    const websiteContent = await axios.request({
      url: city.url,
      timeout: 5000
    });
    const root = parse(websiteContent.data);

    const possibleCourtsElements: HTMLTableRowElement[] = root.querySelectorAll(
      '[title="Zobacz listę neo-sędziów w tym sądzie"]')

    const courts = possibleCourtsElements.map((possibleCourt) => {
      const url = this._getUrl(possibleCourt, Globals.KOD_WEBSITE_URL);
      return {
        name: possibleCourt.querySelector('td')?.textContent,
        url
      } as Court
    })
    console.log(`Got ${courts.length} courts for city: ${city.name}`)
    return courts;
  }

  private _getUrl(courtElement: HTMLTableRowElement, websiteBaseUrl: string) {
    const onclick = courtElement.getAttribute('onclick')
    if (!onclick || onclick.indexOf('location=') < 0) {
      return null;
    }
    const courtName = onclick.replace('location=\'?sad=', '')
    .replace('\'', '');

    return `${websiteBaseUrl}?sad=${encodeURIComponent(courtName)}`
  }

}
